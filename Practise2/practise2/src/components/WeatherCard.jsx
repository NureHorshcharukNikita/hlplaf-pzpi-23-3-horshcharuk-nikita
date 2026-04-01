import { useEffect, useState } from "react";

export default function WeatherCard() {
  const [temp, setTemp] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    const apiKey = "a35d46c6b46b782284752d669c1404ac";
    const city = "Kyiv";
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
  }, []);

  return (
    <section className="card">
      <h2>Level 1 — Weather</h2>
      <p className="text">Temperature: {temp} °C</p>
      <p className="text">Description: {desc}</p>
    </section>
  );
}