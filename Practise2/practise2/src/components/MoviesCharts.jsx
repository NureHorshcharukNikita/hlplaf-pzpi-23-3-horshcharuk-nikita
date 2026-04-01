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

export default function MoviesCharts({ movies }) {
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
    <>
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
              options={{ responsive: true, maintainAspectRatio: false }}
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
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        ) : (
          <p className="text">Add movies to see chart</p>
        )}
      </section>
    </>
  );
}