const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "data", "hotel-booking.sqlite"),
  logging: false
});

const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "user",
    validate: { isIn: [["user", "admin"]] }
  }
});

const Hotel = sequelize.define("Hotel", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: { min: 1, max: 5 }
  }
});

const Room = sequelize.define("Room", {
  number: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isIn: [["standard", "comfort", "suite", "family"]] }
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  pricePerNight: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "active",
    validate: { isIn: [["active", "maintenance"]] }
  }
});

const Client = sequelize.define("Client", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true }
  }
});

const Booking = sequelize.define("Booking", {
  checkIn: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  checkOut: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "confirmed",
    validate: { isIn: [["confirmed", "cancelled", "completed"]] }
  },
  totalPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  }
});

const Service = sequelize.define("Service", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { notEmpty: true }
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  }
});

const BookingService = sequelize.define("BookingService", {
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: { min: 1 }
  }
});

Hotel.hasMany(Room, { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
Room.belongsTo(Hotel);

Client.hasMany(Booking, { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
Booking.belongsTo(Client);

Room.hasMany(Booking, { foreignKey: { allowNull: false }, onDelete: "CASCADE" });
Booking.belongsTo(Room);

Booking.belongsToMany(Service, { through: BookingService });
Service.belongsToMany(Booking, { through: BookingService });

module.exports = {
  sequelize,
  User,
  Hotel,
  Room,
  Client,
  Booking,
  Service,
  BookingService
};
