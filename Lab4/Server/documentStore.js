const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "data");
const filePath = path.join(dataDir, "hotel-notes.json");

function ensureStore() {
  fs.mkdirSync(dataDir, { recursive: true });

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        [
          {
            id: 1,
            hotelName: "Central Plaza Hotel",
            author: "Manager",
            text: "Popular for short business trips and conference guests.",
            tags: ["business", "city-center"],
            createdAt: new Date().toISOString()
          }
        ],
        null,
        2
      )
    );
  }
}

function readNotes() {
  ensureStore();
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeNotes(notes) {
  ensureStore();
  fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
}

function getHotelNotes() {
  return readNotes().sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
}

function addHotelNote(payload) {
  const notes = readNotes();
  const note = {
    id: notes.length ? Math.max(...notes.map((item) => item.id)) + 1 : 1,
    hotelName: String(payload.hotelName || "").trim(),
    author: String(payload.author || "").trim() || "Reception",
    text: String(payload.text || "").trim(),
    tags: Array.isArray(payload.tags) ? payload.tags.map(String) : [],
    createdAt: new Date().toISOString()
  };

  if (!note.hotelName || !note.text) {
    const error = new Error("Hotel name and note text are required");
    error.status = 400;
    throw error;
  }

  notes.push(note);
  writeNotes(notes);
  return note;
}

function deleteHotelNote(id) {
  const noteId = Number(id);
  const notes = readNotes();
  const nextNotes = notes.filter((note) => note.id !== noteId);

  if (nextNotes.length === notes.length) {
    const error = new Error("Document not found");
    error.status = 404;
    throw error;
  }

  writeNotes(nextNotes);
  return { ok: true };
}

module.exports = {
  getHotelNotes,
  addHotelNote,
  deleteHotelNote
};
