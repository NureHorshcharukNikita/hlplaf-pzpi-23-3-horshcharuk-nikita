const bcrypt = require("bcryptjs");
const { User, Hotel, Room, Client, Booking, Service } = require("./database");

async function seedDatabase() {
  const admin = await User.findOne({ where: { role: "admin" } });

  if (!admin) {
    await User.create({
      name: "Administrator",
      email: "admin@gmail.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin"
    });
  }

  const hotelsCount = await Hotel.count();

  if (hotelsCount > 0) {
    return;
  }

  const [central, riverside, skyline] = await Promise.all([
    Hotel.create({
      name: "Central Plaza Hotel",
      city: "Kharkiv",
      address: "Nauky Avenue, 14",
      rating: 4.7
    }),
    Hotel.create({
      name: "Riverside Boutique",
      city: "Kyiv",
      address: "Naberezhna Street, 8",
      rating: 4.5
    }),
    Hotel.create({
      name: "Skyline Resort",
      city: "Lviv",
      address: "Market Square, 3",
      rating: 4.9
    })
  ]);

  await Room.bulkCreate([
    { HotelId: central.id, number: "101", type: "standard", capacity: 2, pricePerNight: 1800 },
    { HotelId: central.id, number: "204", type: "comfort", capacity: 3, pricePerNight: 2600 },
    { HotelId: central.id, number: "305", type: "suite", capacity: 4, pricePerNight: 4200 },
    { HotelId: riverside.id, number: "12A", type: "standard", capacity: 2, pricePerNight: 2100 },
    { HotelId: riverside.id, number: "18B", type: "family", capacity: 5, pricePerNight: 3900 },
    { HotelId: skyline.id, number: "701", type: "comfort", capacity: 2, pricePerNight: 3100 },
    { HotelId: skyline.id, number: "901", type: "suite", capacity: 4, pricePerNight: 5600 }
  ]);

  await Service.bulkCreate([
    { name: "Breakfast", price: 350 },
    { name: "Airport transfer", price: 900 },
    { name: "Spa access", price: 1200 },
    { name: "Late checkout", price: 700 }
  ]);

  const client = await Client.create({
    fullName: "Nikita Horshcharuk",
    email: "nikita.horshcharuk@nure.ua",
    phone: "+380501234567"
  });

  const room = await Room.findOne({ where: { number: "204" } });
  await Booking.create({
    ClientId: client.id,
    RoomId: room.id,
    checkIn: "2026-05-20",
    checkOut: "2026-05-23",
    guests: 2,
    totalPrice: 7800
  });
}

module.exports = seedDatabase;
