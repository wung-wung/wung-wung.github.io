if (window.localStorage.getItem("fpson") === null || window.localStorage.getItem("fpson") === "1") {
  const fpsElement = document.getElementById("fps");
  if (fpsElement) {
    const requestFrame = callback => {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(callback);
      } else if (window.webkitRequestAnimationFrame) {
        window.webkitRequestAnimationFrame(callback);
      } else {
        window.setTimeout(callback, 1000 / 60);
      }
    };
    let frame = 0;
    let lastTime = Date.now();

    function loop() {
      const now = Date.now();
      frame++;

      if (now - lastTime >= 1000) {
        const fps = Math.round((frame * 1000) / (now - lastTime));
        let status;

        if (fps <= 5) {
          status = '<span style="color:#bd0000">卡成ppt🤢</span>';
        } else if (fps <= 15) {
          status = '<span style="color:red">电竞级帧率😖</span>';
        } else if (fps <= 25) {
          status = '<span style="color:orange">有点难受😨</span>';
        } else if (fps < 35) {
          status = '<span style="color:#9338e6">不太流畅🙄</span>';
        } else if (fps <= 45) {
          status = '<span style="color:#08b7e4">还不错哦😁</span>';
        } else {
          status = '<span style="color:#39c5bb">十分流畅🤣</span>';
        }

        fpsElement.innerHTML = `FPS:${fps} ${status}`;
        frame = 0;
        lastTime = now;
      }

      requestFrame(loop);
    }

    loop();
  }
} else {
  const fpsElement = document.getElementById("fps");
  if (fpsElement) fpsElement.style.display = "none";
}
