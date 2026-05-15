export function AdminPanel({
  hotels,
  hotelForm,
  roomForm,
  selectedHotel,
  selectedAdminRoom,
  adminRooms,
  onHotelChange,
  onSaveHotel,
  onResetHotel,
  onRemoveHotel,
  onRoomChange,
  onSaveRoom,
  onSelectRoom,
  onRemoveRoom,
  messageFor
}) {
  const visibleRooms = selectedHotel
    ? adminRooms.filter((room) => String(room.hotelId) === String(selectedHotel.id))
    : adminRooms;

  return (
    <section className="admin-grid">
      <form className="panel" onSubmit={onSaveHotel}>
        <div className="panel-title">
          <h2>{selectedHotel ? "Редагування готелю" : "Новий готель"}</h2>
          {selectedHotel && (
            <button type="button" className="ghost compact" onClick={() => onResetHotel(null)}>
              Новий готель
            </button>
          )}
        </div>
        <div className="two-columns">
          <label>
            Назва
            <input value={hotelForm.name} onChange={(event) => onHotelChange("name", event.target.value)} required />
          </label>
          <label>
            Місто
            <input value={hotelForm.city} onChange={(event) => onHotelChange("city", event.target.value)} required />
          </label>
        </div>
        <label>
          Адреса
          <input value={hotelForm.address} onChange={(event) => onHotelChange("address", event.target.value)} required />
        </label>
        <label>
          Рейтинг
          <input
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={hotelForm.rating}
            onChange={(event) => onHotelChange("rating", event.target.value)}
            required
          />
        </label>
        <div className="action-row">
          <button type="submit">{selectedHotel ? "Зберегти зміни" : "Додати готель"}</button>
          <button type="button" className="ghost" onClick={() => onResetHotel(null)}>
            {selectedHotel ? "Скасувати редагування" : "Очистити форму"}
          </button>
        </div>
        {messageFor?.("hotel-form") && <div className="inline-message">{messageFor("hotel-form")}</div>}
      </form>

      <div className="panel">
        <div className="panel-title">
          <h2>Готелі</h2>
          <span>{hotels.length} записів</span>
        </div>
        <div className="hotel-list">
          {hotels.map((hotel) => (
            <article
              key={hotel.id}
              className={selectedHotel?.id === hotel.id ? "selected-card" : ""}
              onClick={() => onResetHotel(hotel)}
            >
              <div>
                <strong>{hotel.name}</strong>
                <span>
                  {hotel.city} · {hotel.rating} · {hotel.Rooms?.length || 0} кімн.
                </span>
              </div>
              <div className="card-actions">
                <button
                  type="button"
                  className="ghost compact"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemoveHotel(hotel.id);
                  }}
                >
                  Видалити
                </button>
                {messageFor?.(`hotel-delete:${hotel.id}`) && (
                  <div className="inline-message compact-message">{messageFor(`hotel-delete:${hotel.id}`)}</div>
                )}
              </div>
            </article>
          ))}
          {!hotels.length && <p className="empty">Готелі ще не додані.</p>}
        </div>
      </div>

      <form className="panel" onSubmit={onSaveRoom}>
        <div className="panel-title">
          <h2>{selectedAdminRoom ? "Редагування кімнати" : "Нова кімната"}</h2>
          {selectedAdminRoom && (
            <button type="button" className="ghost compact" onClick={() => onSelectRoom(null)}>
              Нова кімната
            </button>
          )}
        </div>
        <div className="two-columns">
          <label>
            Готель
            <select value={roomForm.hotelId} onChange={(event) => onRoomChange("hotelId", event.target.value)} required>
              <option value="">Оберіть готель</option>
              {hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Номер
            <input value={roomForm.number} onChange={(event) => onRoomChange("number", event.target.value)} required />
          </label>
        </div>
        <div className="two-columns">
          <label>
            Тип
            <select value={roomForm.type} onChange={(event) => onRoomChange("type", event.target.value)}>
              <option value="standard">standard</option>
              <option value="comfort">comfort</option>
              <option value="suite">suite</option>
              <option value="family">family</option>
            </select>
          </label>
          <label>
            Статус
            <select value={roomForm.status} onChange={(event) => onRoomChange("status", event.target.value)}>
              <option value="active">active</option>
              <option value="maintenance">maintenance</option>
            </select>
          </label>
        </div>
        <div className="two-columns">
          <label>
            Місць
            <input
              type="number"
              min="1"
              value={roomForm.capacity}
              onChange={(event) => onRoomChange("capacity", event.target.value)}
              required
            />
          </label>
          <label>
            Ціна за ніч
            <input
              type="number"
              min="1"
              value={roomForm.pricePerNight}
              onChange={(event) => onRoomChange("pricePerNight", event.target.value)}
              required
            />
          </label>
        </div>
        <div className="action-row">
          <button type="submit">{selectedAdminRoom ? "Зберегти кімнату" : "Додати кімнату"}</button>
          <button type="button" className="ghost" onClick={() => onSelectRoom(null)}>
            {selectedAdminRoom ? "Скасувати редагування" : "Очистити форму"}
          </button>
        </div>
        {messageFor?.("room-form") && <div className="inline-message">{messageFor("room-form")}</div>}
      </form>

      <div className="panel">
        <div className="panel-title">
          <h2>Кімнати</h2>
          <span>{visibleRooms.length} записів</span>
        </div>
        <div className="hotel-list">
          {visibleRooms.map((room) => (
            <article
              key={room.id}
              className={selectedAdminRoom?.id === room.id ? "selected-card" : ""}
              onClick={() => onSelectRoom(room)}
            >
              <div>
                <strong>
                  {room.hotelName}, кімната {room.number}
                </strong>
                <span>
                  {room.type} · {room.capacity} місць · ${room.pricePerNight} · {room.status}
                </span>
              </div>
              <div className="card-actions">
                <button
                  type="button"
                  className="ghost compact"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemoveRoom(room.id);
                  }}
                >
                  Видалити
                </button>
                {messageFor?.(`room-delete:${room.id}`) && (
                  <div className="inline-message compact-message">{messageFor(`room-delete:${room.id}`)}</div>
                )}
              </div>
            </article>
          ))}
          {!visibleRooms.length && (
            <p className="empty">
              {selectedHotel ? "Для цього готелю кімнати ще не додані." : "Кімнати ще не додані."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
