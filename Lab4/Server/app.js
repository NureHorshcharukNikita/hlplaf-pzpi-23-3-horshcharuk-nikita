const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { sequelize } = require("./database");
const seedDatabase = require("./seed");
const {
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
} = require("./hotelService");
const { getHotelNotes, addHotelNote, deleteHotelNote } = require("./documentStore");
const { registerUser, loginUser, publicUser } = require("./authService");
const { requireAuth, requireAdmin } = require("./authMiddleware");

const app = express();
const port = 4004;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/register", async (req, res, next) => {
  try {
    res.status(201).json(await registerUser(req.body));
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (req, res, next) => {
  try {
    res.json(await loginUser(req.body));
  } catch (error) {
    next(error);
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.get("/api/hotels", requireAuth, async (req, res, next) => {
  try {
    res.json(await getHotels());
  } catch (error) {
    next(error);
  }
});

app.post("/api/hotels", requireAdmin, async (req, res, next) => {
  try {
    res.status(201).json(await createHotel(req.body));
  } catch (error) {
    next(error);
  }
});

app.put("/api/hotels/:id", requireAdmin, async (req, res, next) => {
  try {
    res.json(await updateHotel(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/hotels/:id", requireAdmin, async (req, res, next) => {
  try {
    res.json(await deleteHotel(req.params.id));
  } catch (error) {
    next(error);
  }
});

app.post("/api/rooms", requireAdmin, async (req, res, next) => {
  try {
    res.status(201).json(await createRoom(req.body));
  } catch (error) {
    next(error);
  }
});

app.put("/api/rooms/:id", requireAdmin, async (req, res, next) => {
  try {
    res.json(await updateRoom(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/rooms/:id", requireAdmin, async (req, res, next) => {
  try {
    res.json(await deleteRoom(req.params.id));
  } catch (error) {
    next(error);
  }
});

app.get("/api/services", requireAuth, async (req, res, next) => {
  try {
    res.json(await getServices());
  } catch (error) {
    next(error);
  }
});

app.get("/api/rooms/available", requireAuth, async (req, res, next) => {
  try {
    res.json(await getAvailableRooms(req.query));
  } catch (error) {
    next(error);
  }
});

app.get("/api/bookings", requireAuth, async (req, res, next) => {
  try {
    res.json(await getBookings(req.user));
  } catch (error) {
    next(error);
  }
});

app.get("/api/notes", requireAuth, (req, res, next) => {
  try {
    res.json(getHotelNotes());
  } catch (error) {
    next(error);
  }
});

app.post("/api/notes", requireAdmin, (req, res, next) => {
  try {
    res.status(201).json(addHotelNote(req.body));
  } catch (error) {
    next(error);
  }
});

app.delete("/api/notes/:id", requireAdmin, (req, res, next) => {
  try {
    res.json(deleteHotelNote(req.params.id));
  } catch (error) {
    next(error);
  }
});

app.post("/api/bookings", requireAuth, async (req, res, next) => {
  try {
    const booking = await createBooking(req.body, req.user);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/bookings/:id", requireAdmin, async (req, res, next) => {
  try {
    res.json(await deleteBooking(req.params.id));
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  if (error.name === "SequelizeUniqueConstraintError") {
    res.status(409).json({
      message: "Такий запис уже існує. Перевірте унікальні поля."
    });
    return;
  }

  if (error.name === "SequelizeForeignKeyConstraintError") {
    res.status(409).json({
      message: "Неможливо виконати дію, бо запис використовується в інших даних."
    });
    return;
  }

  res.status(error.status || 500).json({
    message: error.message || "Server error"
  });
});

async function start() {
  fs.mkdirSync(path.join(__dirname, "data"), { recursive: true });
  await sequelize.sync();
  await seedDatabase();

  app.listen(port, "0.0.0.0", () => {
    console.log(`Lab4 hotel booking server: http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
