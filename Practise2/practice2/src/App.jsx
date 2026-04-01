import { useEffect, useState } from "react";
import "./App.css";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const [temp, setTemp] = useState("");
  const [desc, setDesc] = useState("");

  const [movies, setMovies] = useState([]);
  const [movieName, setMovieName] = useState("");
  const [movieReview, setMovieReview] = useState("");

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

  const generateJSON = () => {
    const data = {
      name: "Ivan",
      age: 20,
      hobbies: ["coding", "football", "music"],
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();

    URL.revokeObjectURL(url);
  };

  const addMovie = () => {
    if (!movieName.trim() || !movieReview.trim()) return;

    const newMovie = {
      name: movieName,
      review: movieReview,
    };

    setMovies([...movies, newMovie]);
    setMovieName("");
    setMovieReview("");
  };

  // BAR CHART
  const chartData = {
    labels: movies.map((movie) => movie.name),
    datasets: [
      {
        label: "Review length",
        data: movies.map((movie) => movie.review.length),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Movie reviews chart",
      },
    },
  };

  // PIE CHART
  const pieData = {
    labels: movies.map((movie) => movie.name),
    datasets: [
      {
        label: "Review size",
        data: movies.map((movie) => movie.review.length),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
        ],
      },
    ],
  };

  // LINE CHART
  const lineData = {
    labels: movies.map((movie) => movie.name),
    datasets: [
      {
        label: "Review length trend",
        data: movies.map((movie) => movie.review.length),
        borderColor: "#36a2eb",
        backgroundColor: "#36a2eb",
      },
    ],
  };

  return (
    <div className="app">
      <h1 className="title">Practice 2</h1>

      <div className="grid">
        <section className="card">
          <h2>Level 1 — Weather</h2>
          <p className="text">Temperature: {temp} °C</p>
          <p className="text">Description: {desc}</p>
        </section>

        <section className="card">
          <h2>Level 2 — JSON Generator</h2>
          <p className="text">Create and download JSON file</p>
          <button className="button" onClick={generateJSON}>
            Create JSON
          </button>
        </section>

        <section className="card">
          <h2>Level 3 — Movie Tracker</h2>

          <div className="form">
            <input
              className="input"
              type="text"
              placeholder="Movie name"
              value={movieName}
              onChange={(e) => setMovieName(e.target.value)}
            />

            <input
              className="input"
              type="text"
              placeholder="Review"
              value={movieReview}
              onChange={(e) => setMovieReview(e.target.value)}
            />

            <button className="button" onClick={addMovie}>
              Add movie
            </button>
          </div>

          <ul className="movieList">
            {movies.map((movie, index) => (
              <li className="movieItem" key={index}>
                <strong>{movie.name}</strong> — {movie.review}
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Level 4 — Table Visualization</h2>

          <table className="table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {movies.map((movie, index) => (
                <tr key={index}>
                  <td>{movie.name}</td>
                  <td>{movie.review}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="card">
          <h2>Level 4 — Bar Chart</h2>

          {movies.length > 0 ? (
            <div className="chartContainer">
              <Bar data={chartData} options={chartOptions} />
            </div>
          ) : (
            <p className="text">Add movies to see chart</p>
          )}
        </section>

        <section className="card">
          <h2>Level 4 — Pie Chart</h2>

          {movies.length > 0 ? (
            <div className="pieContainer">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          ) : (
            <p className="text">Add movies to see chart</p>
          )}
        </section>

        <section className="card">
          <h2>Level 4 — Line Chart</h2>

          {movies.length > 0 ? (
            <div className="chartContainer">
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          ) : (
            <p className="text">Add movies to see chart</p>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;