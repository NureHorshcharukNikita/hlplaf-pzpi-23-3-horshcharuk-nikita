import { useEffect, useMemo, useState } from "react";
import { hotelApi } from "../api/hotelApi.js";
import { bookingForUser, initialBooking, initialSearch } from "./initialState.js";
import { useAuthState } from "./useAuthState.js";
import { useHotelAdminState } from "./useHotelAdminState.js";
import { useNotesState } from "./useNotesState.js";
import { useTaskRunner } from "./useTaskRunner.js";

export function useHotelBooking() {
  const { message, messageFor, loading, setMessage, runTask } = useTaskRunner();
  const auth = useAuthState(runTask, setMessage);
  const notesState = useNotesState(runTask, setMessage);
  const [hotels, setHotels] = useState([]);
  const [services, setServices] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [booking, setBooking] = useState(initialBooking);
  const [bookingStep, setBookingStep] = useState("search");

  const { authMode, authForm, user } = auth;
  const { notes, note, setNotes } = notesState;
  const isAdmin = user?.role === "admin";
  const admin = useHotelAdminState({
    hotels,
    setHotels,
    setRooms,
    search,
    runTask,
    setMessage
  });

  const selectedRoom = useMemo(
    () => rooms.find((room) => String(room.id) === String(booking.roomId)),
    [booking.roomId, rooms]
  );

  const hotelRooms = useMemo(() => {
    const sourceHotels = admin.selectedHotel ? [admin.selectedHotel] : hotels;

    return sourceHotels.flatMap((hotel) =>
      (hotel.Rooms || []).map((room) => ({
        ...room,
        Hotel: {
          id: hotel.id,
          name: hotel.name,
          city: hotel.city
        }
      }))
    );
  }, [admin.selectedHotel, hotels]);

  useEffect(() => {
    if (user) {
      setSearch(initialSearch);
      setBooking(bookingForUser(user));
      setBookingStep("search");
      notesState.resetNotes();
      admin.resetAdminState();
      loadInitialData();
      findAvailableRooms(null, initialSearch, "");
    }
  }, [user]);

  async function loadInitialData() {
    await runTask(async () => {
      const [hotelsData, servicesData, bookingsData, notesData] = await Promise.all([
        hotelApi.getHotels(),
        hotelApi.getServices(),
        hotelApi.getBookings(),
        hotelApi.getNotes()
      ]);

      setHotels(hotelsData);
      setServices(servicesData);
      setBookings(bookingsData);
      setNotes(notesData);
    });
  }

  function logout() {
    auth.logoutAuth();
    setHotels([]);
    setServices([]);
    setRooms([]);
    setBookings([]);
    notesState.resetNotes();
    setSearch(initialSearch);
    setBooking(initialBooking);
    setBookingStep("search");
    admin.resetAdminState();
    setMessage("");
  }

  async function findAvailableRooms(event, nextSearch = search, nextHotelId = "") {
    event?.preventDefault?.();

    await runTask(async () => {
      const roomsData = await hotelApi.getAvailableRooms({
        ...nextSearch,
        hotelId: nextHotelId
      });
      setRooms(roomsData);
      setBooking((current) => ({ ...current, roomId: "" }));
      setBookingStep("search");
    }, "search");
  }

  async function createBooking(event) {
    event.preventDefault();

    await runTask(async () => {
      await hotelApi.createBooking({
        ...booking,
        ...search,
        email: user.email,
        roomId: Number(booking.roomId),
        guests: Number(search.guests)
      });
      setMessage("Бронювання створено", "booking-form");
      setBooking(bookingForUser(user));
      setBookingStep("search");
      await refreshBookingData();
    }, "booking-form");
  }

  function selectRoomForBooking(roomId) {
    setBooking((current) => ({ ...current, roomId }));
    setBookingStep("details");
  }

  function backToRoomSearch() {
    setBookingStep("search");
  }

  async function removeBooking(id) {
    await runTask(async () => {
      await hotelApi.deleteBooking(id);
      setMessage("Бронювання видалено", `booking-delete:${id}`);
      await refreshBookingData();
    }, `booking-delete:${id}`);
  }

  function updateSearch(field, value) {
    setSearch((current) => ({ ...current, [field]: value }));
  }

  function updateBooking(field, value) {
    setBooking((current) => ({ ...current, [field]: value }));
  }

  function toggleService(id) {
    setBooking((current) => ({
      ...current,
      serviceIds: current.serviceIds.includes(id)
        ? current.serviceIds.filter((serviceId) => serviceId !== id)
        : [...current.serviceIds, id]
    }));
  }

  async function refreshBookingData() {
    const [bookingsData, roomsData] = await Promise.all([
      hotelApi.getBookings(),
      hotelApi.getAvailableRooms({
        ...search
      })
    ]);

    setBookings(bookingsData);
    setRooms(roomsData);
  }

  return {
    hotels,
    services,
    rooms,
    hotelRooms,
    bookings,
    notes,
    search,
    booking,
    bookingStep,
    note,
    authMode,
    authForm,
    user,
    isAdmin,
    selectedHotelId: admin.selectedHotelId,
    selectedHotel: admin.selectedHotel,
    hotelForm: admin.hotelForm,
    roomForm: admin.roomForm,
    message,
    messageFor,
    loading,
    selectedRoom,
    adminRooms: admin.adminRooms,
    selectedAdminRoom: admin.selectedAdminRoom,
    actions: {
      findAvailableRooms,
      selectRoomForBooking,
      backToRoomSearch,
      createBooking,
      submitAuth: auth.submitAuth,
      logout,
      removeBooking,
      createNote: notesState.createNote,
      removeNote: notesState.removeNote,
      saveHotel: admin.saveHotel,
      removeHotel: admin.removeHotel,
      saveRoom: admin.saveRoom,
      removeRoom: admin.removeRoom,
      selectHotel: admin.selectHotel,
      selectAdminRoom: admin.selectAdminRoom,
      setAuthMode: auth.setAuthMode,
      updateAuthForm: auth.updateAuthForm,
      updateSearch,
      updateBooking,
      updateNote: notesState.updateNote,
      updateHotelForm: admin.updateHotelForm,
      updateRoomForm: admin.updateRoomForm,
      toggleService
    }
  };
}
