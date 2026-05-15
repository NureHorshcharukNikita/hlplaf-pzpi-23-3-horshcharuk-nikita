export async function request(path, options) {
  const token = localStorage.getItem("lab4_token");
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers || {})
    }
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Request failed");
  }

  return response.json();
}

export const hotelApi = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  me: () => request("/auth/me"),
  getHotels: () => request("/hotels"),
  getServices: () => request("/services"),
  getBookings: () => request("/bookings"),
  getNotes: () => request("/notes"),
  getAvailableRooms: (search) => request(`/rooms/available?${new URLSearchParams(search).toString()}`),
  createBooking: (payload) =>
    request("/bookings", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  deleteBooking: (id) =>
    request(`/bookings/${id}`, {
      method: "DELETE"
    }),
  createHotel: (payload) =>
    request("/hotels", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateHotel: (id, payload) =>
    request(`/hotels/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  deleteHotel: (id) =>
    request(`/hotels/${id}`, {
      method: "DELETE"
    }),
  createRoom: (payload) =>
    request("/rooms", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateRoom: (id, payload) =>
    request(`/rooms/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  deleteRoom: (id) =>
    request(`/rooms/${id}`, {
      method: "DELETE"
    }),
  createNote: (payload) =>
    request("/notes", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  deleteNote: (id) =>
    request(`/notes/${id}`, {
      method: "DELETE"
    })
};
