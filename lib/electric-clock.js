(function () {
  const clock = document.getElementById("hexo_electric_clock");
  if (!clock) return;

  clock.innerHTML = `
    <div class="clock-row">
      <span id="card-clock-clockdate" class="card-clock-clockdate"></span>
      <span class="card-clock-weather" id="card-clock-weather">天气加载中</span>
      <span class="card-clock-humidity"></span>
    </div>
    <div class="clock-row">
      <span id="card-clock-time" class="card-clock-time"></span>
    </div>
    <div class="clock-row">
      <span class="card-clock-windDir" id="card-clock-wind"></span>
      <span class="card-clock-location" id="card-clock-location">本地时间</span>
      <span id="card-clock-dackorlight" class="card-clock-dackorlight"></span>
    </div>
  `;

  const pad = value => String(value).padStart(2, "0");
  const week = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  function updateTime() {
    if (!clock.isConnected) {
      window.clearInterval(clockTimer);
      return;
    }

    const now = new Date();
    const time = clock.querySelector("#card-clock-time");
    const date = clock.querySelector("#card-clock-clockdate");
    const dayPeriod = clock.querySelector("#card-clock-dackorlight");
    if (!time || !date || !dayPeriod) return;

    time.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    date.textContent = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${week[now.getDay()]}`;
    dayPeriod.textContent = now.getHours() >= 12 ? " P M" : " A M";
  }

  updateTime();
  const clockTimer = window.setInterval(updateTime, 1000);

  async function loadWeather() {
    const weather = document.getElementById("card-clock-weather");
    const humidity = clock.querySelector(".card-clock-humidity");
    const wind = document.getElementById("card-clock-wind");
    const cityLabel = document.getElementById("card-clock-location");
    const host = window.qweather_api_host || "nj6r6pm8pt.re.qweatherapi.com";
    const key = window.qweather_key;
    const rectangle = window.clock_rectangle || "113.34532,23.15624";
    let location = rectangle;
    let city = "默认位置";

    try {
      if (window.clock_default_rectangle_enable !== "true") {
        const ipKey = window.ip_api_key || "Kq1pRjB3WyDja7rhKcWV9f5QU8";
        const ipResponse = await fetch(`https://api.nsmao.net/api/ipip/query?key=${encodeURIComponent(ipKey)}`);
        if (ipResponse.ok) {
          const ipData = await ipResponse.json();
          if (ipData.code === 200 && ipData.data) {
            city = ipData.data.city || city;
            if (ipData.data.lng && ipData.data.lat) {
              location = `${ipData.data.lng},${ipData.data.lat}`;
            }
          }
        }
      } else {
        city = "固定位置";
      }

      if (!key) throw new Error("未配置和风天气 API Key");

      const response = await fetch(
        `https://${host}/v7/weather/now?location=${encodeURIComponent(location)}&key=${encodeURIComponent(key)}`
      );
      if (!response.ok) throw new Error(`天气请求失败：HTTP ${response.status}`);

      const data = await response.json();
      if (data.code !== "200" || !data.now) {
        throw new Error(`天气服务返回错误：${data.code || "未知错误"}`);
      }

      const icon = document.createElement("i");
      icon.className = `qi-${data.now.icon}-fill`;
      icon.style.color = "#fdcc45";
      weather.replaceChildren(
        icon,
        document.createTextNode(` ${data.now.text} ${data.now.temp} ℃`)
      );
      humidity.textContent = `💧 ${data.now.humidity}%`;
      wind.innerHTML = `<i class="qi-gale"></i> `;
      wind.append(document.createTextNode(data.now.windDir || ""));
      cityLabel.textContent = city;
    } catch (error) {
      console.error("[electric_clock] 天气数据获取失败:", error);
      weather.textContent = "天气暂不可用";
      cityLabel.textContent = city;
    }
  }

  loadWeather();
})();
