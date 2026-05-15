import { useEffect, useState } from "react";
import { AdminPanel } from "../components/AdminPanel.jsx";
import { AuthPage } from "../components/AuthPage.jsx";
import { BookingForm } from "../components/BookingForm.jsx";
import { BookingsPanel } from "../components/BookingsPanel.jsx";
import { Hero } from "../components/Hero.jsx";
import { HotelsPanel } from "../components/HotelsPanel.jsx";
import { NotesPanel } from "../components/NotesPanel.jsx";
import { RoomsPanel } from "../components/RoomsPanel.jsx";
import { SearchForm } from "../components/SearchForm.jsx";
import { TabNavigation } from "../components/TabNavigation.jsx";
import { useHotelBooking } from "../hooks/useHotelBooking.js";

export function DashboardPage() {
  const state = useHotelBooking();
  const [activeTab, setActiveTab] = useState("booking");

  useEffect(() => {
    if (!state.isAdmin && (activeTab === "documents" || activeTab === "admin")) {
      setActiveTab("booking");
    }
  }, [activeTab, state.isAdmin]);

  function changeTab(tabId) {
    if (tabId === "booking") {
      state.actions.backToRoomSearch();
    }

    setActiveTab(tabId);
  }

  if (!state.user) {
    return (
      <AuthPage
        mode={state.authMode}
        form={state.authForm}
        message={state.messageFor("auth")}
        onModeChange={state.actions.setAuthMode}
        onChange={state.actions.updateAuthForm}
        onSubmit={state.actions.submitAuth}
      />
    );
  }

  return (
    <main className="app-shell">
      <Hero loading={state.loading} user={state.user} onLogout={state.actions.logout} />

      <TabNavigation activeTab={activeTab} onChange={changeTab} isAdmin={state.isAdmin} />

      {activeTab === "booking" && (
        <>
          {state.bookingStep === "search" && (
            <section className="booking-flow">
              <SearchForm
                search={state.search}
                message={state.messageFor("search")}
                onSearch={state.actions.findAvailableRooms}
                onChange={state.actions.updateSearch}
              />
              <RoomsPanel
                rooms={state.rooms}
                onSelect={state.actions.selectRoomForBooking}
              />
            </section>
          )}

          {state.bookingStep === "details" && (
            <section className="booking-details">
            <BookingForm
              booking={state.booking}
              search={state.search}
              rooms={state.rooms}
              services={state.services}
              user={state.user}
              selectedRoom={state.selectedRoom}
              message={state.messageFor("booking-form")}
              onBack={state.actions.backToRoomSearch}
              onSubmit={state.actions.createBooking}
              onChange={state.actions.updateBooking}
              onToggleService={state.actions.toggleService}
            />
            </section>
          )}
        </>
      )}

      {activeTab === "hotels" && (
        <section className="content-grid">
          <HotelsPanel
            hotels={state.hotels}
            selectedHotelId={state.selectedHotelId}
            onSelect={state.actions.selectHotel}
          />
          <RoomsPanel
            rooms={state.hotelRooms}
            title={state.selectedHotel ? "Кімнати готелю" : "Усі кімнати"}
            emptyText="Для цього готелю кімнати ще не додані."
          />
        </section>
      )}

      {activeTab === "bookings" && (
        <BookingsPanel
          bookings={state.bookings}
          isAdmin={state.isAdmin}
          messageFor={state.messageFor}
          onRemove={state.actions.removeBooking}
        />
      )}

      {activeTab === "documents" && state.isAdmin && (
        <NotesPanel
          notes={state.notes}
          note={state.note}
          messageFor={state.messageFor}
          onSubmit={state.actions.createNote}
          onChange={state.actions.updateNote}
          onRemove={state.actions.removeNote}
        />
      )}

      {activeTab === "admin" && (
        <AdminPanel
          isAdmin={state.isAdmin}
          hotels={state.hotels}
          hotelForm={state.hotelForm}
          roomForm={state.roomForm}
          selectedHotel={state.selectedHotel}
          selectedAdminRoom={state.selectedAdminRoom}
          adminRooms={state.adminRooms}
          messageFor={state.messageFor}
          onHotelChange={state.actions.updateHotelForm}
          onSaveHotel={state.actions.saveHotel}
          onResetHotel={state.actions.selectHotel}
          onRemoveHotel={state.actions.removeHotel}
          onRoomChange={state.actions.updateRoomForm}
          onSaveRoom={state.actions.saveRoom}
          onSelectRoom={state.actions.selectAdminRoom}
          onRemoveRoom={state.actions.removeRoom}
        />
      )}
    </main>
  );
}
