export function Hero({ loading, user, onLogout }) {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Лабораторна робота 4</p>
        <h1>Hotel Booking</h1>
      </div>
      <div className="user-card">
        <div>
          <span>{loading ? "Завантаження" : user.role === "admin" ? "Адміністратор" : "Користувач"}</span>
          <strong>{user.name}</strong>
        </div>
        <button type="button" className="logout-button" onClick={onLogout}>
          Вийти
        </button>
      </div>
    </section>
  );
}
