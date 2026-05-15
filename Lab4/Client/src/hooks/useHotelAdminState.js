import { useMemo, useState } from "react";
import { hotelApi } from "../api/hotelApi.js";
import { initialHotelForm, initialRoomForm } from "./initialState.js";

export function useHotelAdminState({ hotels, setHotels, setRooms, search, runTask, setMessage }) {
  const [selectedHotelId, setSelectedHotelId] = useState("");
  const [hotelForm, setHotelForm] = useState(initialHotelForm);
  const [selectedAdminRoomId, setSelectedAdminRoomId] = useState("");
  const [roomForm, setRoomForm] = useState(initialRoomForm);

  const selectedHotel = useMemo(
    () => hotels.find((hotel) => String(hotel.id) === String(selectedHotelId)),
    [hotels, selectedHotelId]
  );

  const adminRooms = useMemo(
    () =>
      hotels.flatMap((hotel) =>
        (hotel.Rooms || []).map((room) => ({
          ...room,
          hotelName: hotel.name,
          hotelId: hotel.id
        }))
      ),
    [hotels]
  );

  const selectedAdminRoom = useMemo(
    () => adminRooms.find((room) => String(room.id) === String(selectedAdminRoomId)),
    [adminRooms, selectedAdminRoomId]
  );

  function resetAdminState() {
    setSelectedHotelId("");
    setHotelForm(initialHotelForm);
    setSelectedAdminRoomId("");
    setRoomForm(initialRoomForm);
  }

  async function refreshHotelData(nextHotelId = selectedHotelId, nextCity = search.city) {
    const [hotelsData, roomsData] = await Promise.all([
      hotelApi.getHotels(),
      hotelApi.getAvailableRooms({
        ...search
      })
    ]);

    setHotels(hotelsData);
    setRooms(roomsData);
  }

  async function saveHotel(event) {
    event.preventDefault();

    await runTask(async () => {
      const payload = {
        ...hotelForm,
        rating: Number(hotelForm.rating)
      };

      if (selectedHotelId) {
        await hotelApi.updateHotel(selectedHotelId, payload);
        setMessage("Готель оновлено", "hotel-form");
      } else {
        await hotelApi.createHotel(payload);
        setMessage("Готель додано", "hotel-form");
      }

      setHotelForm(initialHotelForm);
      setSelectedHotelId("");
      await refreshHotelData("", "");
    }, "hotel-form");
  }

  async function removeHotel(id) {
    await runTask(async () => {
      await hotelApi.deleteHotel(id);
      setMessage("Готель видалено", `hotel-delete:${id}`);
      setSelectedHotelId("");
      setHotelForm(initialHotelForm);
      await refreshHotelData("", "");
    }, `hotel-delete:${id}`);
  }

  async function selectHotel(hotel) {
    const nextHotelId = hotel ? String(hotel.id) : "";
    setSelectedHotelId(nextHotelId);

    if (hotel) {
      setHotelForm({
        name: hotel.name,
        city: hotel.city,
        address: hotel.address,
        rating: String(hotel.rating)
      });
      setRoomForm((current) => ({ ...current, hotelId: String(hotel.id) }));
    } else {
      setHotelForm(initialHotelForm);
      setRoomForm(initialRoomForm);
    }
  }

  async function saveRoom(event) {
    event.preventDefault();

    await runTask(async () => {
      const payload = {
        ...roomForm,
        hotelId: Number(roomForm.hotelId),
        capacity: Number(roomForm.capacity),
        pricePerNight: Number(roomForm.pricePerNight)
      };

      if (selectedAdminRoomId) {
        await hotelApi.updateRoom(selectedAdminRoomId, payload);
        setMessage("Кімнату оновлено", "room-form");
      } else {
        await hotelApi.createRoom(payload);
        setMessage("Кімнату додано", "room-form");
      }

      setSelectedAdminRoomId("");
      setRoomForm({ ...initialRoomForm, hotelId: selectedHotelId || "" });
      await refreshHotelData();
    }, "room-form");
  }

  async function removeRoom(id) {
    await runTask(async () => {
      await hotelApi.deleteRoom(id);
      setMessage("Кімнату видалено", `room-delete:${id}`);
      setSelectedAdminRoomId("");
      setRoomForm({ ...initialRoomForm, hotelId: selectedHotelId || "" });
      await refreshHotelData();
    }, `room-delete:${id}`);
  }

  function selectAdminRoom(room) {
    if (!room) {
      setSelectedAdminRoomId("");
      setRoomForm({ ...initialRoomForm, hotelId: selectedHotelId || "" });
      return;
    }

    setSelectedAdminRoomId(String(room.id));
    setRoomForm({
      hotelId: String(room.hotelId || room.HotelId || ""),
      number: room.number,
      type: room.type,
      capacity: String(room.capacity),
      pricePerNight: String(room.pricePerNight),
      status: room.status
    });
  }

  function updateHotelForm(field, value) {
    setHotelForm((current) => ({ ...current, [field]: value }));
  }

  function updateRoomForm(field, value) {
    setRoomForm((current) => ({ ...current, [field]: value }));
  }

  return {
    selectedHotelId,
    selectedHotel,
    hotelForm,
    roomForm,
    adminRooms,
    selectedAdminRoom,
    resetAdminState,
    refreshHotelData,
    saveHotel,
    removeHotel,
    saveRoom,
    removeRoom,
    selectHotel,
    selectAdminRoom,
    updateHotelForm,
    updateRoomForm
  };
}
