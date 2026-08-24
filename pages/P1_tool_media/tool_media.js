document.addEventListener("DOMContentLoaded", () => {
  const videoUrlInput = document.getElementById("tmVideoUrl");
  const videoStatus = document.getElementById("tmStatus");

  function setVideoStatus(message) {
    if (videoStatus) {
      videoStatus.textContent = message;
    }
  }

  function TM_ParseVideo() {
    const videoUrl = videoUrlInput?.value.trim() || "";

    if (videoUrl.startsWith("https://")) {
      window.open("https://www.baidu.com", "_blank", "noopener");
      setVideoStatus("解析成功，已播放视频");
      return;
    }

    setVideoStatus("输入错误，请重新输入正确网址");
  }

  function TM_Clear1() {
    if (videoUrlInput) {
      videoUrlInput.value = "";
    }
    setVideoStatus("");
  }

  document.getElementById("tmClipboardButton")?.addEventListener("click", async () => {
    try {
      const clipboardText = (await navigator.clipboard.readText()).trim();
      if (!clipboardText) {
        throw new Error("剪切板内容不是纯文本网址");
      }
      videoUrlInput.value = clipboardText;
      TM_ParseVideo();
    } catch {
      setVideoStatus("输入错误，请重新输入正确网址");
    }
  });

  document.getElementById("tmParseButton")?.addEventListener("click", TM_ParseVideo);
  document.getElementById("tmClearButton")?.addEventListener("click", TM_Clear1);
});
