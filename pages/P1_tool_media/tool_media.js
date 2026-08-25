document.addEventListener("DOMContentLoaded", () => {
  const videoUrlInput = document.getElementById("TM_Input_VideoUrl_1");
  const videoStatus = document.getElementById("TM_Text_Warning_1");
  const parserFailureKeywords = [
    "未找到资源",
    "解析失败",
    "视频资源不存在",
    "资源不存在",
  ];
  const parserConfigPromise = fetch("parser.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("解析器配置加载失败");
      }
      return response.json();
    })
    .then((config) => {
      const parsers = Object.entries(config)
        .filter(
          ([, parser]) =>
            parser.ParserStatus === "active" &&
            typeof parser.ParserUrl === "string" &&
            parser.ParserUrl,
        )
        .sort(
          ([, firstParser], [, secondParser]) =>
            new Date(secondParser.ParserLastUpdate) -
            new Date(firstParser.ParserLastUpdate),
        );

      if (!parsers.length) {
        throw new Error("解析器配置无效");
      }
<<<<<<< HEAD
      return config.P1.ParserUrl;
    }); // 功能实现：解析器配置加载
=======
      return parsers;
    });
>>>>>>> 76972d2a5d8cb23ecd9eb1296ab1d9453775cd98

  function TMF_Text_Warning_1(message) {
    if (videoStatus) {
      videoStatus.textContent = message;
    }
  } // 功能实现：调整警告文本显示内容

  function TMF_IsWrappedParser_1(responseText, parserOrigins) {
    const responseDocument = new DOMParser().parseFromString(
      responseText,
      "text/html",
    );

    return [...responseDocument.querySelectorAll("iframe[src]")].some(
      (iframe) => {
        try {
          return parserOrigins.has(new URL(iframe.src).origin);
        } catch {
          return false;
        }
      },
    );
  }

  async function TMF_Button_ParseUrl_1() {
    const videoUrl = videoUrlInput?.value.trim() || "";

    if (!videoUrl.startsWith("https://")) {
      TMF_Text_Warning_1("输入错误，请重新输入正确网址");
      return;
    }

    try {
      const parsers = await parserConfigPromise;
      const parserOrigins = new Set(
        parsers.map(([, parser]) => new URL(parser.ParserUrl).origin),
      );

      for (const [parserKey, parser] of parsers) {
        TMF_Text_Warning_1(`正在使用${parserKey}解析网址，请稍后...`);

        try {
          const parserUrl = parser.ParserUrl + encodeURIComponent(videoUrl);
          const response = await fetch(parserUrl, { redirect: "follow" });

          if (!response.ok) {
            continue;
          }

          const responseText = await response.text();
          const responseDocument = new DOMParser().parseFromString(
            responseText,
            "text/html",
          );
          const errorText =
            responseDocument.querySelector("div#error h1")?.textContent || "";
          const visibleText = responseDocument.body?.textContent || "";
          const parserFailed =
            parserFailureKeywords.some((keyword) =>
              errorText.includes(keyword),
            ) ||
            parserFailureKeywords.some((keyword) =>
              visibleText.includes(keyword),
            ) ||
            TMF_IsWrappedParser_1(responseText, parserOrigins);

          if (parserFailed) {
            continue;
          }

          window.open(parserUrl, "_blank", "noopener");
          TMF_Text_Warning_1("解析成功，已播放视频");
          return;
        } catch {
          // 当前解析器不可用，继续尝试下一个解析器。
        }
      }

      TMF_Text_Warning_1("解析失败，暂未找到视频资源，请换其他视频解析");
    } catch {
      TMF_Text_Warning_1("解析失败，暂未找到视频资源，请换其他视频解析");
    }
  } // 功能实现：解析网址按钮

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
