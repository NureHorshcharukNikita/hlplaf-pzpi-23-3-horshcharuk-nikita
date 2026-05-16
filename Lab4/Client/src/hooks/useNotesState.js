import { useState } from "react";
import { hotelApi } from "../api/hotelApi.js";
import { initialNote } from "./initialState.js";

export function useNotesState(runTask, setMessage) {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState(initialNote);

  async function createNote(event) {
    event.preventDefault();

    await runTask(async () => {
      await hotelApi.createNote({
        hotelName: note.hotelName,
        author: note.author,
        text: note.text,
        tags: note.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean)
      });
      setMessage("Нотатку додано", "note-form");
      setNote(initialNote);
      setNotes(await hotelApi.getNotes());
    }, "note-form");
  }

  async function removeNote(id) {
    await runTask(async () => {
      await hotelApi.deleteNote(id);
      setMessage("Нотатку видалено", `note-delete:${id}`);
      setNotes(await hotelApi.getNotes());
    }, `note-delete:${id}`);
  }

  function updateNote(field, value) {
    setNote((current) => ({ ...current, [field]: value }));
  }

  function resetNotes() {
    setNotes([]);
    setNote(initialNote);
  }

  return {
    notes,
    note,
    setNotes,
    setNote,
    createNote,
    removeNote,
    updateNote,
    resetNotes
  };
}
