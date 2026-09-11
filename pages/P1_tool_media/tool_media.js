document.addEventListener("DOMContentLoaded", () => {
  // ========== 卡片配置 ==========
  const cardConfigs = [
    {
      id: 1,
      inputId: "TM_Input_VideoUrl_1",
      warningId: "TM_Text_Warning_1",
      parseClipboardId: "TM_Button_ParseClipboard_1",
      parseUrlId: "TM_Button_ParseUrl_1",
      clearId: "TM_Button_Clear_1",

      // ⭐ 卡片1：正常视频解析功能
      parseUrlFunction: async function (inputElement, warningFn) {
        const videoUrl = inputElement?.value.trim() || "";

        if (videoUrl.startsWith("https://")) {
          try {
            // 从parser.json加载配置
            const response = await fetch("parser.json");
            if (!response.ok) {
              throw new Error("解析器配置加载失败");
            }
            const parserConfig = await response.json();

            // 使用P1配置
            if (!parserConfig.P1 || !parserConfig.P1.ParserUrl) {
              throw new Error("解析器配置无效");
            }

            const parserUrl = parserConfig.P1.ParserUrl;
            window.open(
              parserUrl + encodeURIComponent(videoUrl),
              "_blank",
              "noopener",
            );
            warningFn("解析成功，已播放视频");
          } catch {
            warningFn("解析器配置加载失败，请稍后重试");
          }
          return;
        }
        warningFn("输入错误，请重新输入正确网址");
      },
    },
    {
      id: 2,
      inputId: "TM_Input_VideoUrl_2",
      warningId: "TM_Text_Warning_2",
      parseClipboardId: "TM_Button_ParseClipboard_2",
      parseUrlId: "TM_Button_ParseUrl_2",
      clearId: "TM_Button_Clear_2",

      // ⭐ 卡片2：打开百度网页（完全不同的功能）
      parseUrlFunction: async function (inputElement, warningFn) {
        // 基于输入框内容打开百度搜索，可以这样：
        const searchText = inputElement?.value.trim() || "";
        if (searchText) {
          window.open(
            `https://www.baidu.com/s?wd=${encodeURIComponent(searchText)}`,
            "_blank",
            "noopener",
          );
          warningFn(`正在搜索：${searchText}`);
        } else {
          window.open("https://www.baidu.com/", "_blank", "noopener");
          warningFn("已打开百度首页");
        }
      },
    },
    {
      id: 3,
      inputId: "TM_Input_VideoUrl_3",
      warningId: "TM_Text_Warning_3",
      parseClipboardId: "TM_Button_ParseClipboard_3",
      parseUrlId: "TM_Button_ParseUrl_3",
      clearId: "TM_Button_Clear_3",

      // ⭐ 卡片3：功能留空（待实现）
      parseUrlFunction: async function (inputElement, warningFn) {
        // TODO: 待实现功能
        warningFn("该功能正在开发中，敬请期待...");

        // 或者可以暂时显示提示信息
        alert("功能开发中，请稍后再试");
      },
    },
  ];

  // ========== 通用功能函数 ==========

  /**
   * 创建警告文本显示函数
   */
  function createWarningFunction(warningElement) {
    return function (message) {
      if (warningElement) {
        warningElement.textContent = message;
      }
    };
  }

  /**
   * 创建清空文本按钮函数
   */
  function createClearFunction(inputElement, warningFn) {
    return function () {
      if (inputElement) {
        inputElement.value = "";
      }
      warningFn("将想要观看的视频网址粘贴到输入框中，再单击解析网址按钮");
    };
  }

  /**
   * 创建解析剪切板按钮函数
   */
  function createParseClipboardFunction(inputElement, parseUrlFn, warningFn) {
    return async function (event) {
      event.stopPropagation();

      try {
        const clipboardText = (await navigator.clipboard.readText()).trim();
        if (!clipboardText) {
          throw new Error("剪切板内容不是纯文本网址");
        }

        inputElement.value = clipboardText;
        // 调用当前卡片专用的解析URL函数
        await parseUrlFn();
      } catch {
        warningFn("剪切板内容格式错误，请重新输入正确网址");
      }
    };
  }

  // ========== 初始化所有卡片 ==========
  cardConfigs.forEach((config) => {
    // 获取DOM元素
    const inputElement = document.getElementById(config.inputId);
    const warningElement = document.getElementById(config.warningId);

    // 验证元素是否存在
    if (!inputElement || !warningElement) {
      console.warn(`卡片 ${config.id} 的元素未找到，跳过初始化`);
      return;
    }

    // 创建通用功能函数
    const warningFn = createWarningFunction(warningElement);
    const clearFn = createClearFunction(inputElement, warningFn);

    // ⭐ 使用配置中定义的解析网址函数（每个卡片不同）
    const parseUrlFn = async () => {
      await config.parseUrlFunction(inputElement, warningFn);
    };

    // 创建解析剪切板函数（使用当前卡片的parseUrlFn）
    const parseClipboardFn = createParseClipboardFunction(
      inputElement,
      parseUrlFn,
      warningFn,
    );

    // 绑定事件监听器
    const parseClipboardBtn = document.getElementById(config.parseClipboardId);
    const parseUrlBtn = document.getElementById(config.parseUrlId);
    const clearBtn = document.getElementById(config.clearId);

    if (parseClipboardBtn) {
      parseClipboardBtn.removeEventListener("click", parseClipboardFn);
      parseClipboardBtn.addEventListener("click", parseClipboardFn);
    } else {
      console.warn(`按钮 ${config.parseClipboardId} 未找到`);
    }

    if (parseUrlBtn) {
      parseUrlBtn.removeEventListener("click", parseUrlFn);
      parseUrlBtn.addEventListener("click", parseUrlFn);
    } else {
      console.warn(`按钮 ${config.parseUrlId} 未找到`);
    }

    if (clearBtn) {
      clearBtn.removeEventListener("click", clearFn);
      clearBtn.addEventListener("click", clearFn);
    } else {
      console.warn(`按钮 ${config.clearId} 未找到`);
    }
  });
});
