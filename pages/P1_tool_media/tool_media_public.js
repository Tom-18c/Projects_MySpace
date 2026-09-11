(function () {
  function createWarningFunction(warningElement) {
    return (message) => {
      if (warningElement) {
        warningElement.textContent = message;
      }
    };
  }

  function bindCardEvents({
    inputElement,
    warningElement,
    parseClipboardButton,
    parseUrlButton,
    clearButton,
    parseUrl,
  }) {
    if (!inputElement || !warningElement || typeof parseUrl !== "function") {
      return;
    }

    const warning = createWarningFunction(warningElement);

    parseClipboardButton?.addEventListener("click", async (event) => {
      event.stopPropagation();
      try {
        const text = (await navigator.clipboard.readText()).trim();
        if (!text) {
          throw new Error("剪切板内容为空");
        }
        inputElement.value = text;
        await parseUrl(inputElement, warning);
      } catch {
        warning("剪切板内容读取失败，请重新输入正确内容");
      }
    });

    parseUrlButton?.addEventListener("click", () => {
      void parseUrl(inputElement, warning);
    });

    clearButton?.addEventListener("click", () => {
      inputElement.value = "";
      warning("将想要处理的视频网址粘贴到输入框中，再单击解析网址按钮");
    });
  }

  function openVideoSite(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  window.toolMediaPublic = {
    bindCardEvents,
    openVideoSite,
  };
})();
