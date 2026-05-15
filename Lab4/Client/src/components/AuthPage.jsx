export function AuthPage({ mode, form, message, onModeChange, onChange, onSubmit }) {
  const isRegister = mode === "register";

  return (
    <main className="auth-shell">
      <form className="panel auth-card" onSubmit={onSubmit}>
        <p className="eyebrow">Hotel Booking</p>
        <h1>{isRegister ? "Реєстрація" : "Вхід"}</h1>
        <p className="muted-text">
          {isRegister
            ? "Створіть акаунт користувача для перегляду готелів та бронювання кімнат."
            : "Увійдіть, щоб завантажити дані системи бронювання."}
        </p>
        {isRegister && (
          <label>
            Ім'я
            <input value={form.name} onChange={(event) => onChange("name", event.target.value)} required />
          </label>
        )}
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => onChange("email", event.target.value)} required />
        </label>
        <label>
          Пароль
          <input
            type="password"
            value={form.password}
            onChange={(event) => onChange("password", event.target.value)}
            minLength={4}
            required
          />
        </label>
        <button type="submit">{isRegister ? "Зареєструватися" : "Увійти"}</button>
        {message && <div className="inline-message auth-message">{message}</div>}
        <button type="button" className="ghost" onClick={() => onModeChange(isRegister ? "login" : "register")}>
          {isRegister ? "У мене вже є акаунт" : "Створити акаунт"}
        </button>
      </form>
    </main>
  );
}
