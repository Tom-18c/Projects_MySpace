const http = require("node:http");
const { spawn, spawnSync } = require("node:child_process");
const { Readable } = require("node:stream");

const port = Number(process.env.PORT) || 8787;
const host = process.env.HOST || "0.0.0.0";
const ffmpegPath = process.env.FFMPEG_PATH || "ffmpeg";
const bilibiliHeaders = {
  Accept: "application/json",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
  Referer: "https://www.bilibili.com/",
};
const bilibiliCookie = process.env.BILIBILI_COOKIE || "";

function setCorsHeaders(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader(
    "Access-Control-Expose-Headers",
    "Content-Disposition, Content-Length, Content-Type",
  );
}

function sendJson(response, statusCode, data) {
  setCorsHeaders(response);
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(data));
}

function getSafeFileName(title, bvid) {
  const safeTitle = String(title || "")
    .replace(/[\\/:*?"<>|]/g, "-")
    .trim();
  return `${safeTitle || bvid}.mp4`;
}

async function requestBilibiliJson(url) {
  const headers = { ...bilibiliHeaders };
  if (bilibiliCookie) {
    headers.Cookie = bilibiliCookie;
  }
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`Bilibili API 请求失败: ${response.status}`);
  }

  const result = await response.json();
  if (result.code !== 0 || !result.data) {
    throw new Error(result.message || "Bilibili API 返回错误");
  }
  return result.data;
}

async function getVideoInfo(bvid) {
  const info = await requestBilibiliJson(
    `https://api.bilibili.com/x/web-interface/view?bvid=${encodeURIComponent(bvid)}`,
  );
  const cid = info.pages?.[0]?.cid || info.cid;
  if (!cid) {
    throw new Error("未找到视频分 P 信息");
  }

  const playUrl = await requestBilibiliJson(
    `https://api.bilibili.com/x/player/playurl?bvid=${encodeURIComponent(
      bvid,
    )}&cid=${encodeURIComponent(cid)}&qn=127&fnval=4048`,
  );
  const bestVideo = [...(playUrl.dash?.video || [])].sort(
    (left, right) =>
      right.height - left.height ||
      right.width - left.width ||
      right.bandwidth - left.bandwidth,
  )[0];
  const bestAudio = [...(playUrl.dash?.audio || [])].sort(
    (left, right) => right.bandwidth - left.bandwidth,
  )[0];
  const fallbackVideo =
    playUrl.durl?.[0]?.url || playUrl.durl?.[0]?.backup_url?.[0];
  const videoUrl = bestVideo?.baseUrl || bestVideo?.base_url || fallbackVideo;
  if (!videoUrl) {
    throw new Error("未找到可下载的视频地址");
  }

  return {
    title: info.title,
    videoUrl,
    singleVideoUrl: fallbackVideo,
    audioUrl: bestAudio?.baseUrl || bestAudio?.base_url,
    quality: bestVideo
      ? `${bestVideo.width}x${bestVideo.height}`
      : "single-stream",
  };
}

function hasFfmpeg() {
  return spawnSync(ffmpegPath, ["-version"], { stdio: "ignore" }).status === 0;
}

function getUpstreamHeaders(bvid) {
  const headers = `User-Agent: ${bilibiliHeaders["User-Agent"]}\r\nReferer: https://www.bilibili.com/video/${bvid}/\r\n`;
  return bilibiliCookie ? `${headers}Cookie: ${bilibiliCookie}\r\n` : headers;
}

function pipeDashVideo(response, bvid, videoUrl, audioUrl) {
  const ffmpeg = spawn(ffmpegPath, [
    "-hide_banner",
    "-loglevel",
    "error",
    "-headers",
    getUpstreamHeaders(bvid),
    "-i",
    videoUrl,
    "-headers",
    getUpstreamHeaders(bvid),
    "-i",
    audioUrl,
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-c",
    "copy",
    "-movflags",
    "frag_keyframe+empty_moov",
    "-f",
    "mp4",
    "pipe:1",
  ]);

  ffmpeg.stdout.pipe(response);
  ffmpeg.stderr.on("data", (chunk) => process.stderr.write(`ffmpeg: ${chunk}`));
  response.on("close", () => {
    if (!ffmpeg.killed) {
      ffmpeg.kill();
    }
  });
}

async function proxyDownload(response, url) {
  const bvid = url.searchParams.get("bvid")?.match(/^BV[a-zA-Z0-9]+$/)?.[0];
  if (!bvid) {
    sendJson(response, 400, { error: "请输入有效的 BV 号" });
    return;
  }

  try {
    const { title, videoUrl, singleVideoUrl, audioUrl, quality } =
      await getVideoInfo(bvid);
    const fileName = getSafeFileName(title, bvid);
    const useDash = Boolean(audioUrl && hasFfmpeg());

    if (audioUrl && !useDash && !singleVideoUrl) {
      throw new Error(
        "该视频使用独立音视频轨道，请安装 FFmpeg 后再下载，避免生成无声视频",
      );
    }

    if (useDash) {
      setCorsHeaders(response);
      response.setHeader(
        "Content-Disposition",
        `attachment; filename="${bvid}.mp4"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      );
      response.setHeader("Content-Type", "video/mp4");
      response.setHeader("X-Video-Quality", quality);
      response.writeHead(200);
      pipeDashVideo(response, bvid, videoUrl, audioUrl);
      return;
    }

    const upstream = await fetch(singleVideoUrl || videoUrl, {
      headers: {
        "User-Agent": bilibiliHeaders["User-Agent"],
        Referer: `https://www.bilibili.com/video/${bvid}/`,
      },
    });
    if (!upstream.ok || !upstream.body) {
      throw new Error(`视频流请求失败: ${upstream.status}`);
    }

    setCorsHeaders(response);
    response.setHeader(
      "Content-Disposition",
      `attachment; filename="${bvid}.mp4"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    );
    response.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") || "video/mp4",
    );
    response.setHeader("X-Video-Quality", quality);
    const contentLength = upstream.headers.get("content-length");
    if (contentLength) {
      response.setHeader("Content-Length", contentLength);
    }
    response.writeHead(200);
    Readable.fromWeb(upstream.body).pipe(response);
  } catch (error) {
    if (!response.headersSent) {
      sendJson(response, 502, {
        error: error instanceof Error ? error.message : "视频代理请求失败",
      });
    } else {
      response.destroy(error);
    }
  }
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);

  if (request.method === "OPTIONS") {
    setCorsHeaders(response);
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === "GET" && url.pathname === "/health") {
    sendJson(response, 200, { status: "ok" });
    return;
  }

  if (request.method === "GET" && url.pathname === "/api/bilibili/download") {
    void proxyDownload(response, url);
    return;
  }

  sendJson(response, 404, { error: "接口不存在" });
});

server.listen(port, host, () => {
  console.log(`媒体下载代理已启动: http://${host}:${port}`);
});
