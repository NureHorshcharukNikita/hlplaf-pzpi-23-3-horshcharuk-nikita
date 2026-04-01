import { useEffect, useState } from "react";
import "./App.css";

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
      </div>
    </div>
  );
}

export default App;