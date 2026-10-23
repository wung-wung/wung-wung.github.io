(function () {
  "use strict";

  const SPEED_SCALE = 0.5;
  const TUNING = {
    fadeInDuration: 480,
    fadeOutDuration: 220,
    typeJitter: 0.32,
    eraseJitter: 0.24,
    pauseBeforeErase: 1300,
    cursorDuration: 1.1,
  };

  const style = document.createElement("style");
  style.textContent = `
    .smooth-typewriter__character {
      display: inline-block;
      white-space: pre;
      animation: smooth-typewriter-in ${TUNING.fadeInDuration}ms cubic-bezier(.2,.7,.2,1) both;
      will-change: opacity, transform, filter;
    }
    .smooth-typewriter__character--leaving {
      animation: smooth-typewriter-out ${TUNING.fadeOutDuration}ms ease-in both;
    }
    .smooth-typewriter__cursor {
      display: inline-block;
      margin-left: .08em;
      animation: smooth-typewriter-breathe ${TUNING.cursorDuration}s ease-in-out infinite;
    }
    @keyframes smooth-typewriter-in {
      from { opacity: 0; filter: blur(3px); transform: translateY(.16em); }
      to { opacity: 1; filter: blur(0); transform: translateY(0); }
    }
    @keyframes smooth-typewriter-out {
      from { opacity: 1; filter: blur(0); transform: translateY(0); }
      to { opacity: 0; filter: blur(2px); transform: translateY(-.12em); }
    }
    @keyframes smooth-typewriter-breathe {
      0%, 100% { opacity: .35; }
      50% { opacity: 1; }
    }
    @media (prefers-reduced-motion: reduce) {
      .smooth-typewriter__character,
      .smooth-typewriter__character--leaving,
      .smooth-typewriter__cursor {
        animation-duration: .01ms;
      }
    }
  `;
  document.head.appendChild(style);

  function randomDelay(base, jitter) {
    const variation = 1 + (Math.random() * 2 - 1) * jitter;
    return Math.max(8, base * SPEED_SCALE * variation);
  }

  function Typed(selector, options) {
    const target =
      typeof selector === "string" ? document.querySelector(selector) : selector;
    if (!(target instanceof Element)) return;

    if (target.smoothTypedInstance) target.smoothTypedInstance.destroy();

    this.element = target;
    this.options = options || {};
    this.strings = Array.isArray(this.options.strings)
      ? this.options.strings.map(String)
      : [];
    this.characters = [];
    this.timers = new Map();
    this.destroyed = false;
    this.loop = Boolean(this.options.loop);

    this.cursor = document.createElement("span");
    this.cursor.className = "smooth-typewriter__cursor";
    this.cursor.setAttribute("aria-hidden", "true");
    this.cursor.textContent = "|";
    target.replaceChildren(this.cursor);
    target.smoothTypedInstance = this;

    this.wait = (duration) =>
      new Promise((resolve) => {
        const timer = window.setTimeout(() => {
          this.timers.delete(timer);
          resolve(!this.destroyed);
        }, duration);
        this.timers.set(timer, resolve);
      });

    this.clearCharacters = () => {
      this.characters.forEach((character) => character.remove());
      this.characters = [];
    };

    this.typeString = async (text) => {
      this.clearCharacters();
      for (const value of Array.from(text)) {
        if (this.destroyed) return false;
        const character = document.createElement("span");
        character.className = "smooth-typewriter__character";
        character.textContent = value;
        this.element.insertBefore(character, this.cursor);
        this.characters.push(character);
        const delay = randomDelay(
          Number(this.options.typeSpeed) || 100,
          TUNING.typeJitter
        );
        if (!(await this.wait(delay))) return false;
      }
      return !this.destroyed;
    };

    this.eraseString = async () => {
      for (let index = this.characters.length - 1; index >= 0; index -= 1) {
        if (this.destroyed) return false;
        this.characters[index].classList.add(
          "smooth-typewriter__character--leaving"
        );
        const delay = randomDelay(
          Number(this.options.backSpeed) || 50,
          TUNING.eraseJitter
        );
        if (!(await this.wait(delay))) return false;
      }
      if (!(await this.wait(TUNING.fadeOutDuration))) return false;
      this.clearCharacters();
      return true;
    };

    this.run = async () => {
      if (!(await this.wait(Number(this.options.startDelay) || 0))) return;
      if (!this.strings.length) return;

      do {
        for (let index = 0; index < this.strings.length; index += 1) {
          if (!(await this.typeString(this.strings[index]))) return;
          const isLast = index === this.strings.length - 1;
          if (isLast && !this.loop) return;
          if (!(await this.wait(TUNING.pauseBeforeErase))) return;
          if (!(await this.eraseString())) return;
        }
      } while (this.loop && !this.destroyed);
    };

    this.destroy = () => {
      this.destroyed = true;
      this.timers.forEach((resolve, timer) => {
        window.clearTimeout(timer);
        resolve(false);
      });
      this.timers.clear();
      this.clearCharacters();
      if (this.cursor.parentNode === this.element) this.cursor.remove();
      if (this.element.smoothTypedInstance === this) {
        delete this.element.smoothTypedInstance;
      }
    };

    this.run();
  }

  window.Typed = Typed;
})();
