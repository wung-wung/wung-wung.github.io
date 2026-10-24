(function () {
  "use strict";

  document.addEventListener(
    "keydown",
    function (event) {
      const key = event.key.toLowerCase();
      const blocked =
        event.key === "F12" ||
        (event.ctrlKey &&
          event.shiftKey &&
          ["i", "j", "c"].includes(key)) ||
        (event.ctrlKey && key === "u");

      if (!blocked) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      window.anzhiyu.snackbarShow("你真坏，不能打开控制台喔！");
    },
    true
  );
})();
