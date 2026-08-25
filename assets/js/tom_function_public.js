function FP_GetCurrentTime() {
  const currentTime = new Date();
  const pad = (value) => String(value).padStart(2, "0");

  return `${currentTime.getFullYear()}-${pad(currentTime.getMonth() + 1)}-${pad(
    currentTime.getDate(),
  )} ${pad(currentTime.getHours())}:${pad(currentTime.getMinutes())}:${pad(
    currentTime.getSeconds(),
  )}`;
} //获取当前时间，格式为YYYY-MM-DD HH:MM:SS
