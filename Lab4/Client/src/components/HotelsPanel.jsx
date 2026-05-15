export function HotelsPanel({ hotels, selectedHotelId, onSelect }) {
  return (
    <div className="panel">
      <div className="panel-title">
        <h2>Готелі</h2>
      </div>
      <div className="hotel-list">
        <button
          type="button"
          className={!selectedHotelId ? "ghost full-width selected-card" : "ghost full-width"}
          onClick={() => onSelect(null)}
        >
          Усі готелі
        </button>
        {!hotels.length && <p className="empty">Готелі ще не додані.</p>}
        {hotels.map((hotel) => (
          <article
            key={hotel.id}
            className={String(hotel.id) === String(selectedHotelId) ? "selected-card" : ""}
            onClick={() => onSelect(hotel)}
          >
            <div>
              <strong>{hotel.name}</strong>
              <span>
                {hotel.city} · {hotel.rating} · {hotel.Rooms?.length || 0} кімн.
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
