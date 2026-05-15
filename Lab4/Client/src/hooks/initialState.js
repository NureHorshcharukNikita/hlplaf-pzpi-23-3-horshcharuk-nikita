export const initialSearch = {
  city: "",
  checkIn: "2026-05-24",
  checkOut: "2026-05-27",
  guests: 2
};

export const initialBooking = {
  roomId: "",
  fullName: "",
  email: "",
  phone: "",
  serviceIds: []
};

export const initialNote = {
  hotelName: "",
  author: "",
  text: "",
  tags: ""
};

export const initialHotelForm = {
  name: "",
  city: "",
  address: "",
  rating: "4.5"
};

export const initialRoomForm = {
  hotelId: "",
  number: "",
  type: "standard",
  capacity: "2",
  pricePerNight: "1800",
  status: "active"
};

export const initialAuthForm = {
  name: "",
  email: "",
  password: ""
};

export function bookingForUser(user, roomId = "") {
  return {
    ...initialBooking,
    roomId,
    fullName: user?.name || "",
    email: user?.email || ""
  };
}
