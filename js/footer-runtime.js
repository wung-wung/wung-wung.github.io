(() => {
  const launchTime = new Date("2025-10-20T00:00:00");

  function updateRuntime() {
    const workboard = document.getElementById("workboard");
    if (!workboard) return;

    const elapsedSeconds = Math.max(0, Math.floor((Date.now() - launchTime.getTime()) / 1000));
    const days = Math.floor(elapsedSeconds / 86400);
    const hours = Math.floor((elapsedSeconds % 86400) / 3600);
    const minutes = Math.floor((elapsedSeconds % 3600) / 60);
    const seconds = elapsedSeconds % 60;

    workboard.innerHTML =
      `<span>本站已运行 ${days} 天 ` +
      `<span id="runtime">${String(hours).padStart(2, "0")} 小时 ${String(minutes).padStart(2, "0")} 分 ${String(seconds).padStart(2, "0")} 秒</span>` +
      `<i class="anzhiyufont anzhiyu-icon-heartbeat" style="color:red"></i></span>`;
  }

  updateRuntime();
  window.setInterval(updateRuntime, 1000);
})();
