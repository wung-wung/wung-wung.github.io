(() => {
  const colors = ["#39c5bb", "#f14747", "#f1a247", "#f1ee47", "#b347f1", "#1edbff", "#ed709b", "#5636ed"];
  const selectors = [
    ["#site-name", "0 0 15px"],
    ["#site-title", "0 0 15px"],
    ["#site-subtitle", "0 0 10px"],
    ["#post-info", "0 0 5px"],
    [".author-info__name", "0 0 12px"],
    [".author-info__description", "0 0 12px"]
  ];
  let colorIndex = 0;

  function updateTextShadows() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    selectors.forEach(([selector, shadow]) => {
      document.querySelectorAll(selector).forEach(element => {
        element.style.textShadow = isDark
          ? `${colors[colorIndex]} ${shadow}`
          : "";
      });
    });

    if (isDark) {
      colorIndex = (colorIndex + 1) % colors.length;
    }
  }

  updateTextShadows();
  window.setInterval(updateTextShadows, 1200);
})();
