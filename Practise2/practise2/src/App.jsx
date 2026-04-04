import { useState } from "react";
import "./App.css";

import WeatherCard from "./components/WeatherCard";
import JsonGenerator from "./components/JsonGenerator";
import MovieTracker from "./components/MovieTracker";
import MoviesTable from "./components/MoviesTable";
import MoviesCharts from "./components/MoviesCharts";

function App() {
  const [movies, setMovies] = useState([]);

  return (
    <div className="app">
      <h1 className="title">Practise 2</h1>

      <div className="grid">
        <WeatherCard />
        <JsonGenerator />
        <MovieTracker movies={movies} setMovies={setMovies} />
        <MoviesTable movies={movies} />
        <MoviesCharts movies={movies} />
      </div>
    </div>
  );
}

export default App;