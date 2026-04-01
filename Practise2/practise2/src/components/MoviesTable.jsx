export default function MoviesTable({ movies }) {
  return (
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
  );
}