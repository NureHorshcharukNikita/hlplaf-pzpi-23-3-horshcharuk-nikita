import { formatDate } from "../utils/formatDate.js";

export function BookingsPanel({ bookings, isAdmin, messageFor, onRemove }) {
  return (
    <section className="panel">
      <div className="panel-title">
        <h2>Бронювання</h2>
      </div>
      <div className="booking-list">
        {bookings.map((item) => (
          <article key={item.id} className="booking-card">
            <div>
              <h3>
                #{item.id} · {item.Client.fullName}
              </h3>
              <p>
                {item.Room.Hotel.name}, кімната {item.Room.number} · {formatDate(item.checkIn)} -{" "}
                {formatDate(item.checkOut)}
              </p>
              <span>{item.Services.map((service) => service.name).join(", ") || "Без додаткових послуг"}</span>
            </div>
            <div className="booking-actions">
              <strong>${item.totalPrice}</strong>
              {isAdmin && (
                <>
                  <button type="button" className="ghost" onClick={() => onRemove(item.id)}>
                    Видалити
                  </button>
                  {messageFor?.(`booking-delete:${item.id}`) && (
                    <div className="inline-message compact-message">{messageFor(`booking-delete:${item.id}`)}</div>
                  )}
                </>
              )}
            </div>
          </article>
        ))}
        {!bookings.length && (
          <p className="empty">{isAdmin ? "Бронювання ще не створені." : "У вас ще немає бронювань."}</p>
        )}
      </div>
    </section>
  );
}
