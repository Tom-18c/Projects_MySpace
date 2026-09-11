const axios = require("axios");
const fs = require("fs");

// 从网页链接中提取 BV 号
function extractBvid(url) {
  const match = url.match(/BV[a-zA-Z0-9]+/);
  if (!match) {
    throw new Error("未找到有效的 BV 号，请检查链接是否正确");
  }
  return match[0];
}

async function downloadBilibiliVideo(input) {
  // 判断输入是链接还是 BV 号
  const bvid = input.includes("bilibili.com") ? extractBvid(input) : input;

  console.log(`正在解析视频: ${bvid}`);

  // 1. 获取 cid
  const infoRes = await axios.get(
    "https://api.bilibili.com/x/web-interface/view",
    {
      params: { bvid },
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Referer: "https://www.bilibili.com/",
      },
    }
  );

  if (!infoRes.data.data) {
    throw new Error("获取视频信息失败，请检查 BV 号是否正确");
  }

  const { cid, title } = infoRes.data.data;

  // 2. 获取视频地址
  const urlRes = await axios.get("https://api.bilibili.com/x/player/playurl", {
    params: { bvid, cid, qn: 80 },
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Referer: "https://www.bilibili.com/",
    },
  });

  const videoUrl = urlRes.data.data.durl[0].url;

  // 3. 下载
  const response = await axios.get(videoUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      Referer: `https://www.bilibili.com/video/${bvid}/`,
    },
    responseType: "stream",
  });

  const fileName = `${title.replace(/[\\/:*?"<>|]/g, "-")}.mp4`; // 移除非法字符
  const writer = fs.createWriteStream(fileName);
  response.data.pipe(writer);

  console.log(`正在下载: ${title}`);
  console.log(`保存为: ${fileName}`);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => {
      console.log("✅ 下载完成！");
      resolve();
    });
    writer.on("error", reject);
  });
}

// ========== 使用方式 ==========

// 方式1：直接传入完整的网页链接
downloadBilibiliVideo("https://www.bilibili.com/video/BV1wr8S6WEX7/?spm_id_from=333.1007.tianma.5-2-16.click");

// 方式2：也可以只传入 BV 号（兼容旧用法）
// downloadBilibiliVideo("BV1AMt36yECH");