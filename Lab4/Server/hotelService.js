const { Op } = require("sequelize");
const { getCache, setCache, clearCache } = require("./cache");
const { sequelize, Hotel, Room, Client, Booking, Service } = require("./database");

const DAY_MS = 24 * 60 * 60 * 1000;

function httpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function normalizeDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString().slice(0, 10);
}

function nightsBetween(checkIn, checkOut) {
  return Math.ceil((new Date(checkOut) - new Date(checkIn)) / DAY_MS);
}

async function getHotels() {
  const cached = getCache("hotels:list");

  if (cached) {
    return cached;
  }

  const hotels = await Hotel.findAll({
    include: [{ model: Room, attributes: ["id", "number", "type", "capacity", "pricePerNight", "status"] }],
    order: [["rating", "DESC"]]
  });

  setCache("hotels:list", hotels, 120_000);
  return hotels;
}

async function getServices() {
  const cached = getCache("services:list");

  if (cached) {
    return cached;
  }

  const services = await Service.findAll({ order: [["price", "ASC"]] });
  setCache("services:list", services, 120_000);
  return services;
}

async function getAvailableRooms({ city, hotelId, checkIn, checkOut, guests }) {
  const safeCheckIn = normalizeDate(checkIn);
  const safeCheckOut = normalizeDate(checkOut);
  const safeGuests = Number(guests || 1);
  const safeHotelId = Number(hotelId || 0);

  if (!safeCheckIn || !safeCheckOut || safeCheckIn >= safeCheckOut || safeGuests < 1) {
    throw httpError("Invalid search dates or guests count", 400);
  }

  const cacheKey = `available:${city || "all"}:${safeHotelId || "all"}:${safeCheckIn}:${safeCheckOut}:${safeGuests}`;
  const cached = getCache(cacheKey);

  if (cached) {
    return cached;
  }

  const bookedRooms = await Booking.findAll({
    attributes: ["RoomId"],
    where: {
      status: { [Op.ne]: "cancelled" },
      checkIn: { [Op.lt]: safeCheckOut },
      checkOut: { [Op.gt]: safeCheckIn }
    }
  });
  const bookedRoomIds = bookedRooms.map((booking) => booking.RoomId);

  const rooms = await Room.findAll({
    where: {
      status: "active",
      capacity: { [Op.gte]: safeGuests },
      ...(bookedRoomIds.length ? { id: { [Op.notIn]: bookedRoomIds } } : {})
    },
    include: [
      {
        model: Hotel,
        where: {
          ...(city ? { city: { [Op.like]: `%${city}%` } } : {}),
          ...(safeHotelId ? { id: safeHotelId } : {})
        }
      }
    ],
    order: [["pricePerNight", "ASC"]]
  });

  setCache(cacheKey, rooms, 45_000);
  return rooms;
}

async function createHotel(payload) {
  const hotel = await Hotel.create({
    name: String(payload.name || "").trim(),
    city: String(payload.city || "").trim(),
    address: String(payload.address || "").trim(),
    rating: Number(payload.rating)
  });

  clearCache("hotels:");
  clearCache("available:");
  return hotel;
}

async function updateHotel(id, payload) {
  const hotel = await Hotel.findByPk(Number(id));

  if (!hotel) {
    throw httpError("Hotel not found", 404);
  }

  await hotel.update({
    name: String(payload.name || "").trim(),
    city: String(payload.city || "").trim(),
    address: String(payload.address || "").trim(),
    rating: Number(payload.rating)
  });

  clearCache("hotels:");
  clearCache("available:");
  return hotel;
}

async function deleteHotel(id) {
  const hotelId = Number(id);
  const hotel = await Hotel.findByPk(hotelId);

  if (!hotel) {
    throw httpError("Hotel not found", 404);
  }

  const roomsCount = await Room.count({ where: { HotelId: hotelId } });

  if (roomsCount > 0) {
    throw httpError("Неможливо видалити готель, поки в ньому є кімнати. Спочатку видаліть або перенесіть кімнати.", 409);
  }

  await hotel.destroy();

  clearCache("hotels:");
  clearCache("available:");
  return { ok: true };
}

function roomPayload(payload) {
  return {
    HotelId: Number(payload.hotelId),
    number: String(payload.number || "").trim(),
    type: String(payload.type || "").trim(),
    capacity: Number(payload.capacity),
    pricePerNight: Number(payload.pricePerNight),
    status: String(payload.status || "active").trim()
  };
}

async function createRoom(payload) {
  const data = roomPayload(payload);
  const hotel = await Hotel.findByPk(data.HotelId);

  if (!hotel) {
    throw httpError("Hotel not found", 404);
  }

  const room = await Room.create(data);
  clearCache("hotels:");
  clearCache("available:");
  return room;
}

async function updateRoom(id, payload) {
  const room = await Room.findByPk(Number(id));

  if (!room) {
    throw httpError("Room not found", 404);
  }

  const data = roomPayload(payload);
  const hotel = await Hotel.findByPk(data.HotelId);

  if (!hotel) {
    throw httpError("Hotel not found", 404);
  }

  const hasBookings = await Booking.count({ where: { RoomId: room.id } });

  if (hasBookings > 0 && Number(room.HotelId) !== data.HotelId) {
    throw httpError("Неможливо перенести кімнату в інший готель, поки для неї існують бронювання.", 409);
  }

  await room.update(data);
  clearCache("hotels:");
  clearCache("available:");
  return room;
}

async function deleteRoom(id) {
  const roomId = Number(id);
  const room = await Room.findByPk(roomId);

  if (!room) {
    throw httpError("Room not found", 404);
  }

  const bookingsCount = await Booking.count({ where: { RoomId: roomId } });

  if (bookingsCount > 0) {
    throw httpError("Неможливо видалити кімнату, поки для неї існують бронювання. Спочатку скасуйте або видаліть бронювання.", 409);
  }

  await room.destroy();

  clearCache("hotels:");
  clearCache("available:");
  return { ok: true };
}

async function getBookings(user) {
  return Booking.findAll({
    include: [
      {
        model: Client,
        ...(user?.role === "admin" ? {} : { where: { email: user.email } })
      },
      { model: Room, include: [Hotel] },
      { model: Service }
    ],
    order: [["createdAt", "DESC"]]
  });
}

async function createBooking(payload, user) {
  const checkIn = normalizeDate(payload.checkIn);
  const checkOut = normalizeDate(payload.checkOut);
  const roomId = Number(payload.roomId);
  const guests = Number(payload.guests);
  const clientEmail = user?.role === "admin" ? payload.email : user?.email;
  const clientName = user?.role === "admin" ? payload.fullName : payload.fullName || user?.name;

  if (!checkIn || !checkOut || checkIn >= checkOut || !roomId || guests < 1 || !clientEmail || !clientName) {
    throw httpError("Invalid booking data", 400);
  }

  return sequelize.transaction(async (transaction) => {
    const room = await Room.findByPk(roomId, { transaction });

    if (!room || room.status !== "active" || room.capacity < guests) {
      throw httpError("Selected room is not available", 400);
    }

    const overlapping = await Booking.findOne({
      where: {
        RoomId: room.id,
        status: { [Op.ne]: "cancelled" },
        checkIn: { [Op.lt]: checkOut },
        checkOut: { [Op.gt]: checkIn }
      },
      transaction
    });

    if (overlapping) {
      throw httpError("Room is already booked for selected dates", 409);
    }

    const [client] = await Client.findOrCreate({
      where: { email: clientEmail },
      defaults: {
        fullName: clientName,
        phone: payload.phone
      },
      transaction
    });

    let services = [];

    if (Array.isArray(payload.serviceIds) && payload.serviceIds.length) {
      services = await Service.findAll({
        where: { id: { [Op.in]: payload.serviceIds.map(Number).filter(Boolean) } },
        transaction
      });
    }

    const servicesTotal = services.reduce((sum, service) => sum + service.price, 0);
    const totalPrice = room.pricePerNight * nightsBetween(checkIn, checkOut) + servicesTotal;
    const booking = await Booking.create(
      {
        ClientId: client.id,
        RoomId: room.id,
        checkIn,
        checkOut,
        guests,
        totalPrice
      },
      { transaction }
    );

    if (services.length) {
      await booking.addServices(services, { transaction });
    }

    clearCache("available:");
    return Booking.findByPk(booking.id, {
      include: [{ model: Client }, { model: Room, include: [Hotel] }, { model: Service }],
      transaction
    });
  });
}

async function deleteBooking(id) {
  const deleted = await Booking.destroy({ where: { id: Number(id) } });

  if (!deleted) {
    throw httpError("Booking not found", 404);
  }

  clearCache("available:");
  return { ok: true };
}

module.exports = {
  getHotels,
  getServices,
  getAvailableRooms,
  getBookings,
  createBooking,
  deleteBooking,
  createHotel,
  updateHotel,
  deleteHotel,
  createRoom,
  updateRoom,
  deleteRoom
};
