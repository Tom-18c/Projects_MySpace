(function () {
  async function parseUrl(inputElement, warning) {
    const videoUrl = inputElement.value.trim();
    if (!videoUrl.startsWith("https://")) {
      warning("输入错误，请重新输入正确网址");
      return;
    }

    try {
      const response = await fetch("parser.json");
      if (!response.ok) {
        throw new Error("解析器配置加载失败");
      }
      const parserConfig = await response.json();
      const parserUrl = parserConfig.P1?.ParserUrl;
      if (!parserUrl) {
        throw new Error("解析器配置无效");
      }
      window.open(
        `${parserUrl}${encodeURIComponent(videoUrl)}`,
        "_blank",
        "noopener,noreferrer",
      );
      warning("解析成功，已打开视频");
    } catch {
      warning("解析器配置加载失败，请稍后重试");
    }
  }

  function init(elements) {
    window.toolMediaPublic.bindCardEvents({ ...elements, parseUrl });
  }

  window.toolMediaCard1 = { init };
})();
