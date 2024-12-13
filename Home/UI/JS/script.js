function updateMoscowTime() {
    const now = new Date();
    const moscowTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
    const formattedTime = moscowTime.toLocaleTimeString('en-US', { hour12: true });
    const code = 'UTC +3'
    document.getElementById('current_time').textContent = formattedTime;
    document.getElementById('text_utc').textContent = code;
  }

  updateMoscowTime();
  setInterval(updateMoscowTime, 1000);

  function updateDate() {
  const now = new Date();
  const options = { day: 'numeric', month: 'long' };
  const formattedDate = now.toLocaleDateString('en-US', options);
  const year = now.getFullYear();

  document.getElementById('current_date').textContent = formattedDate;
  document.getElementById('text_date').textContent = year;
}

updateDate();

const cityId = '463343'; 
const apiKey = '58b6621bb195443d09b4ae5ad7b282f1';

function updateWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric&lang=en`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при запросе данных: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      if (data && data.weather && data.weather[0]) {
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp.toFixed(1);

        document.getElementById('current_weather').textContent = weatherDescription;
        document.getElementById('text_deheree').textContent = `${temperature}°C`;
      } else {
        throw new Error('ERROR');
      }
    })
    .catch(error => {
      console.error('Ошибка получения погоды:', error);
      document.getElementById('current_weather').textContent = 'error loading';
      document.getElementById('text_deheree').textContent = '---';
    });
}

updateWeather();
setInterval(updateWeather, 60000);