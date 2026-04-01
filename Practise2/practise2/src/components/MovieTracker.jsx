import { useState } from "react";

export default function MovieTracker({ movies, setMovies }) {
  const [movieName, setMovieName] = useState("");
  const [movieReview, setMovieReview] = useState("");

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
  );
}