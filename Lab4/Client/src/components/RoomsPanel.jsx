export function RoomsPanel({
  rooms,
  title = "Доступні кімнати",
  emptyText = "Немає доступних кімнат для обраних умов.",
  onSelect
}) {
  return (
    <div className="panel wide">
      <div className="panel-title">
        <h2>{title}</h2>
        <span>{rooms.length} знайдено</span>
      </div>
      <div className="cards">
        {rooms.map((room) => (
          <article
            key={room.id}
            className={onSelect ? "room-card clickable-card" : "room-card"}
            onClick={() => onSelect?.(room.id)}
          >
            <div>
              <h3>{room.Hotel.name}</h3>
              <p>
                {room.Hotel.city} · кімната {room.number} · {room.type}
              </p>
            </div>
            <div className="room-actions">
              <strong>${room.pricePerNight}</strong>
            </div>
          </article>
        ))}
        {!rooms.length && <p className="empty">{emptyText}</p>}
      </div>
    </div>
  );
}
