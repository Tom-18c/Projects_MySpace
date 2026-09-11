document.addEventListener("DOMContentLoaded", () => {
  const cards = [
    { id: 1, module: window.toolMediaCard1 },
    { id: 2, module: window.toolMediaCard2 },
    { id: 3, module: window.toolMediaCard3 },
    { id: 4, module: window.toolMediaCard4 },
  ];

  cards.forEach(({ id, module }) => {
    module?.init({
      inputElement: document.getElementById(`TM_Input_VideoUrl_${id}`),
      warningElement: document.getElementById(`TM_Text_Warning_${id}`),
      parseClipboardButton: document.getElementById(
        `TM_Button_ParseClipboard_${id}`,
      ),
      parseUrlButton: document.getElementById(`TM_Button_ParseUrl_${id}`),
      clearButton: document.getElementById(`TM_Button_Clear_${id}`),
    });
  });
});
