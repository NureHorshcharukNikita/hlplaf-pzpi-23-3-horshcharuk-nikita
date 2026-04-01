import { useEffect, useState } from "react";

export default function WeatherCard() {
  const [city, setCity] = useState("Kyiv");
  const [cityInput, setCityInput] = useState("Kyiv");
  const [temp, setTemp] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const apiKey = "a35d46c6b46b782284752d669c1404ac";
    const weatherUrlAPI = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(weatherUrlAPI)
      .then((response) => response.json())
      .then((data) => {
        setTemp(data.main.temp);
        setDesc(data.weather[0].description);
      })
      .catch(() => {
        setTemp("Error");
        setDesc("Failed to load weather");
      });
  }, [city]);

  const handleSearch = () => {
    if (!cityInput.trim()) return;
    setCity(cityInput);
  };

  return (
    <section className="card">
      <h2>Level 1 — Weather</h2>

      <input
        className="input"
        type="text"
        placeholder="Enter city..."
        value={cityInput}
        onChange={(e) => setCityInput(e.target.value)}
      />

      <button className="button" onClick={handleSearch}>
        Get weather
      </button>

      <p className="text">City: {city}</p>
      <p className="text">Temperature: {temp} °C</p>
      <p className="text">Description: {desc}</p>
    </section>
  );
}