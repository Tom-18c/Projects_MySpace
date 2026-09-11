(function () {
  const downloadProxyUrl =
    window.TOOL_MEDIA_PROXY_URL ||
    "http://127.0.0.1:8787/api/bilibili/download";

  function extractBvid(input) {
    const match = input.match(/BV[a-zA-Z0-9]+/);
    if (!match) {
      throw new Error("未找到有效的 BV 号");
    }
    return match[0];
  }

  function downloadVideo(inputElement, warning) {
    const input = inputElement.value.trim();
    const bvid = input.match(/BV[a-zA-Z0-9]+/)?.[0];
    if (!bvid) {
      warning("请输入有效的 Bilibili 视频网址或 BV 号");
      return;
    }

    const downloadUrl = `${downloadProxyUrl}?bvid=${encodeURIComponent(bvid)}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${bvid}.mp4`;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
    warning(`已开始下载 ${bvid}，可继续启动其他下载任务`);
  }

  function init(elements) {
    window.toolMediaPublic.bindCardEvents({
      ...elements,
      parseUrl: downloadVideo,
    });
  }

  window.toolMediaCard2 = { init };
})();
