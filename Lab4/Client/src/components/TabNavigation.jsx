const publicTabs = [
  { id: "booking", label: "Пошук" },
  { id: "hotels", label: "Готелі" },
  { id: "bookings", label: "Бронювання" }
];

const adminTabs = [
  { id: "documents", label: "Нотатки" },
  { id: "admin", label: "Адмін" }
];

export function TabNavigation({ activeTab, onChange, isAdmin }) {
  const tabs = isAdmin ? [...publicTabs, ...adminTabs] : publicTabs;

  return (
    <nav className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={activeTab === tab.id ? "tab active-tab" : "tab"}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
