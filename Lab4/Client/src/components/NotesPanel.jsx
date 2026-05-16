export function NotesPanel({ notes, note, messageFor, onSubmit, onChange, onRemove }) {
  return (
    <section className="content-grid bottom-grid">
      <form className="panel" onSubmit={onSubmit}>
        <div className="panel-title">
          <h2>Нотатка готелю</h2>
        </div>
        <label>
          Готель
          <input
            value={note.hotelName}
            onChange={(event) => onChange("hotelName", event.target.value)}
            placeholder="Central Plaza Hotel"
            required
          />
        </label>
        <label>
          Автор
          <input value={note.author} onChange={(event) => onChange("author", event.target.value)} placeholder="Reception" />
        </label>
        <label>
          Текст нотатки
          <input
            value={note.text}
            onChange={(event) => onChange("text", event.target.value)}
            placeholder="Guest prefers quiet rooms"
            required
          />
        </label>
        <label>
          Теги через кому
          <input value={note.tags} onChange={(event) => onChange("tags", event.target.value)} placeholder="vip, quiet, family" />
        </label>
        <button type="submit">Додати нотатку</button>
        {messageFor?.("note-form") && <div className="inline-message">{messageFor("note-form")}</div>}
      </form>

      <div className="panel">
        <div className="panel-title">
          <h2>Нотатки</h2>
          <span>{notes.length} записів</span>
        </div>
          <div className="note-list">
            {notes.map((item) => (
              <article key={item.id} className="note-card">
                <div>
                  <strong>{item.hotelName}</strong>
                  <p>{item.text}</p>
                  <div className="tags">
                    {(item.tags || []).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="card-actions">
                  <button type="button" className="ghost compact" onClick={() => onRemove(item.id)}>
                    Видалити
                  </button>
                  {messageFor?.(`note-delete:${item.id}`) && (
                    <div className="inline-message compact-message">{messageFor(`note-delete:${item.id}`)}</div>
                  )}
                </div>
              </article>
            ))}
            {!notes.length && <p className="empty">Нотатки ще не додані.</p>}
          </div>
      </div>
    </section>
  );
}
