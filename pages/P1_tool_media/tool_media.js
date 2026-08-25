document.addEventListener("DOMContentLoaded", () => {
  const videoUrlInput = document.getElementById("TM_Input_VideoUrl_1");
  const videoStatus = document.getElementById("TM_Text_Warning_1");
  const parserUrlPromise = fetch("parser.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("解析器配置加载失败");
      }
      return response.json();
    })
    .then((config) => {
      if (
        !config.P1 ||
        typeof config.P1.ParserUrl !== "string" ||
        !config.P1.ParserUrl
      ) {
        throw new Error("解析器配置无效");
      }
      return config.P1.ParserUrl;
    }); // 功能实现：解析器配置加载

  function TMF_Text_Warning_1(message) {
    if (videoStatus) {
      videoStatus.textContent = message;
    }
  } // 功能实现：调整警告文本显示内容

  async function TMF_Button_ParseUrl_1() {
    const videoUrl = videoUrlInput?.value.trim() || "";

    if (videoUrl.startsWith("https://")) {
      try {
        const parserUrl = await parserUrlPromise;
        window.open(
          parserUrl + encodeURIComponent(videoUrl),
          "_blank",
          "noopener",
        );
        TMF_Text_Warning_1("解析成功，已播放视频");
      } catch {
        TMF_Text_Warning_1("解析器配置加载失败，请稍后重试");
      }
      return;
    } // 功能实现：解析网址按钮

    TMF_Text_Warning_1("输入错误，请重新输入正确网址");
  }

  function TMF_Button_Clear_1() {
    if (videoUrlInput) {
      videoUrlInput.value = "";
    }
    TMF_Text_Warning_1(
      "将想要观看的视频网址粘贴到输入框中，再单击解析网址按钮",
    );
  } // 功能实现：清空文本按钮

  async function TMF_Button_ParseClipboard_1() {
    try {
      const clipboardText = (await navigator.clipboard.readText()).trim();
      if (!clipboardText) {
        throw new Error("剪切板内容不是纯文本网址");
      }
      videoUrlInput.value = clipboardText;
      TMF_Button_ParseUrl_1();
    } catch {
      TMF_Text_Warning_1("剪切板内容格式错误，请重新输入正确网址");
    }
  } // 功能实现：解析剪切板内容按钮

  document
    .getElementById("TM_Button_ParseClipboard_1")
    ?.addEventListener("click", TMF_Button_ParseClipboard_1); // 绑定解析剪切板点击事件

  document
    .getElementById("TM_Button_ParseUrl_1")
    ?.addEventListener("click", TMF_Button_ParseUrl_1); // 绑定解析按钮点击事件
  document
    .getElementById("TM_Button_Clear_1")
    ?.addEventListener("click", TMF_Button_Clear_1); // 绑定清空按钮点击事件
});
