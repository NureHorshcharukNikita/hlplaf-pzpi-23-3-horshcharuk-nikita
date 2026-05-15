export function BookingForm({
  booking,
  search,
  rooms,
  services,
  user,
  selectedRoom,
  message,
  onBack,
  onSubmit,
  onChange,
  onToggleService
}) {
  const selectedServices = services.filter((service) => booking.serviceIds.includes(service.id));
  const nights = Math.max(
    0,
    Math.ceil((new Date(search.checkOut) - new Date(search.checkIn)) / (24 * 60 * 60 * 1000))
  );
  const roomTotal = selectedRoom ? selectedRoom.pricePerNight * nights : 0;
  const servicesTotal = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const total = roomTotal + servicesTotal;

  return (
    <form className="panel" onSubmit={onSubmit}>
      <div className="panel-title">
        <div>
          <button type="button" className="ghost compact back-button" onClick={onBack}>
            ← Назад
          </button>
          <h2>Нове бронювання</h2>
        </div>
      </div>
      {selectedRoom && (
        <div className="selected-room-summary">
          <div>
            <span>Обрана кімната</span>
            <strong>
              {selectedRoom.Hotel.name}, кімната {selectedRoom.number}
            </strong>
            <p>
              {selectedRoom.Hotel.city} · {selectedRoom.type} · {selectedRoom.capacity} місць
            </p>
          </div>
          <strong>${selectedRoom.pricePerNight}</strong>
        </div>
      )}
      <label>
        ПІБ клієнта
        <input value={booking.fullName} onChange={(event) => onChange("fullName", event.target.value)} required />
      </label>
      <label>
        Email
        <input
          type="email"
          value={user?.email || booking.email}
          onChange={(event) => onChange("email", event.target.value)}
          readOnly={Boolean(user)}
          required
        />
      </label>
      <label>
        Телефон
        <input value={booking.phone} onChange={(event) => onChange("phone", event.target.value)} required />
      </label>
      <div className="service-list">
        {services.map((service) => (
          <label key={service.id} className="check-row">
            <input
              type="checkbox"
              checked={booking.serviceIds.includes(service.id)}
              onChange={() => onToggleService(service.id)}
            />
            {service.name} · ${service.price}
          </label>
        ))}
      </div>
      <div className="booking-total">
        <div>
          <span>Проживання</span>
          <strong>{selectedRoom ? `${nights} ночі × $${selectedRoom.pricePerNight}` : "Оберіть кімнату"}</strong>
        </div>
        <div>
          <span>Послуги</span>
          <strong>${servicesTotal}</strong>
        </div>
        <div className="total-line">
          <span>Разом до сплати</span>
          <strong>${total}</strong>
        </div>
      </div>
      <button type="submit" disabled={!selectedRoom}>
        Додати бронювання
      </button>
      {message && <div className="inline-message">{message}</div>}
    </form>
  );
}
