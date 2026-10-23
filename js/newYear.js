(() => {
  let timer = null;
  let firecrackerTimer = null;
  const lunarDateFormatter = new Intl.DateTimeFormat("en-u-ca-chinese", {
    month: "numeric",
    day: "numeric",
  });

  function findNextLunarNewYear(now) {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const candidate = new Date(today.getFullYear(), 0, 20);
    const end = new Date(today.getFullYear() + 2, 2, 1);

    for (; candidate < end; candidate.setDate(candidate.getDate() + 1)) {
      const parts = lunarDateFormatter.formatToParts(candidate);
      const month = parts.find((part) => part.type === "month")?.value;
      const day = parts.find((part) => part.type === "day")?.value;

      if (month === "1" && day === "1" && candidate >= today) {
        return new Date(candidate);
      }
    }

    throw new Error("Unable to find the next Lunar New Year.");
  }

  function startNewYear() {
    window.clearTimeout(timer);
    window.clearInterval(firecrackerTimer);
    const card = document.querySelector("#newYear");
    if (!card) return;

    const mainElement = card.querySelector("#newYear-main");
    const todayElement = card.querySelector(".today");
    const titleElement = card.querySelector(".title");
    const timeElement = card.querySelector(".newYear-time");
    const progressBars = card.querySelectorAll(".newYear-progress-bar");

    if (!mainElement || !todayElement || !titleElement || !timeElement || progressBars.length !== 3) {
      throw new Error("The New Year sidebar widget is missing required elements.");
    }

    const targetDate = findNextLunarNewYear(new Date());

    function update() {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const daysUntilNewYear = Math.max(
        0,
        Math.ceil((targetDate.getTime() - today.getTime()) / 86400000),
      );

      titleElement.textContent = "距离春节";
      timeElement.textContent = String(daysUntilNewYear);
      todayElement.textContent = targetDate.toLocaleDateString("sv-SE");

      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));
      const periods = [
        [new Date(now.getFullYear(), 0, 1), new Date(now.getFullYear() + 1, 0, 1)],
        [new Date(now.getFullYear(), now.getMonth(), 1), new Date(now.getFullYear(), now.getMonth() + 1, 1)],
        [weekStart, new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate() + 7)],
      ];

      periods.forEach(([start, end], index) => {
        const elapsed = Math.min(Math.max(now.getTime() - start.getTime(), 0), end - start);
        const progress = (elapsed / (end - start)) * 100;
        const remainingDays = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 86400000));
        const bar = progressBars[index];
        const value = bar.querySelector(".newYear-progress-value");
        const remaining = bar.querySelector(".newYear-progress-remaining");

        if (!value || !remaining) {
          throw new Error("A New Year progress bar is missing its labels.");
        }

        bar.style.setProperty("--progress", `${progress}%`);
        value.textContent = `${progress.toFixed(2)}%`;
        remaining.textContent = `余${remainingDays}天`;
      });

      timer = window.setTimeout(update, 60000);
    }

    function addFirecracker() {
      if (!mainElement.isConnected) {
        window.clearInterval(firecrackerTimer);
        return;
      }
      if (mainElement.querySelectorAll(".newYear-firecracker").length >= 5) {
        return;
      }

      const firecracker = document.createElement("span");
      firecracker.className = "newYear-firecracker";
      firecracker.setAttribute("aria-hidden", "true");
      firecracker.textContent = "🧨";
      firecracker.style.left = `${Math.random() * 96}%`;
      firecracker.addEventListener("animationend", () => firecracker.remove(), { once: true });
      mainElement.appendChild(firecracker);
    }

    update();
    addFirecracker();
    firecrackerTimer = window.setInterval(addFirecracker, 900);
  }

  document.addEventListener("pjax:complete", startNewYear);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startNewYear, { once: true });
  } else {
    startNewYear();
  }
})();
