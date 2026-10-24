(function () {
  "use strict";

  if (window.matchMedia("(pointer: coarse)").matches) return;

  const cursor = document.createElement("div");
  cursor.id = "cursor";
  cursor.className = "hidden";
  document.body.appendChild(cursor);

  const interactiveSelector =
    "a, button, input, select, textarea, label, [role='button'], [onclick]";
  let current = null;
  let previous = null;
  let target = null;
  let frame = 0;

  function render() {
    frame = 0;
    if (!target) return;

    if (!current) {
      current = { x: target.x, y: target.y };
      previous = { x: target.x, y: target.y };
    } else {
      previous.x += (target.x - previous.x) * 0.15;
      previous.y += (target.y - previous.y) * 0.15;
      current.x = previous.x;
      current.y = previous.y;
    }

    cursor.style.left = `${current.x - 8}px`;
    cursor.style.top = `${current.y - 8}px`;

    if (
      Math.abs(target.x - current.x) > 0.1 ||
      Math.abs(target.y - current.y) > 0.1
    ) {
      frame = window.requestAnimationFrame(render);
    }
  }

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse") return;

    target = { x: event.clientX, y: event.clientY };
    cursor.classList.remove("hidden");
    if (!frame) frame = window.requestAnimationFrame(render);
  });

  document.addEventListener("pointerover", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    if (event.target.closest(interactiveSelector)) {
      cursor.classList.add("hover");
    }
  });

  document.addEventListener("pointerout", (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    if (
      event.target.closest(interactiveSelector) &&
      !event.relatedTarget?.closest?.(interactiveSelector)
    ) {
      cursor.classList.remove("hover");
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") cursor.classList.add("active");
  });

  document.addEventListener("pointerup", (event) => {
    if (event.pointerType === "mouse") cursor.classList.remove("active");
  });

  document.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse") cursor.classList.add("hidden");
  });

  document.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") cursor.classList.remove("hidden");
  });
})();
