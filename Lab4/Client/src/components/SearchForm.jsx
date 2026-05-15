export function SearchForm({ search, message, onSearch, onChange }) {
  return (
    <form className="panel" onSubmit={onSearch}>
      <div className="panel-title">
        <h2>Пошук кімнат</h2>
      </div>
      <label>
        Місто
        <input value={search.city} onChange={(event) => onChange("city", event.target.value)} placeholder="Kyiv" />
      </label>
      <div className="two-columns">
        <label>
          Заїзд
          <input type="date" value={search.checkIn} onChange={(event) => onChange("checkIn", event.target.value)} />
        </label>
        <label>
          Виїзд
          <input type="date" value={search.checkOut} onChange={(event) => onChange("checkOut", event.target.value)} />
        </label>
      </div>
      <label>
        Гості
        <input type="number" min="1" value={search.guests} onChange={(event) => onChange("guests", event.target.value)} />
      </label>
      <button type="submit">Переглянути доступні кімнати</button>
      {message && <div className="inline-message">{message}</div>}
    </form>
  );
}
