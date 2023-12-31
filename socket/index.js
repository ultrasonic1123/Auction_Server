const handleOnBid = (socket, rooms, data, io) => {
  const bidHistory = [
    { user: "", price: 0, phoneNumber: "" },
    { user: "", price: 0, phoneNumber: "" },
    { user: "", price: 0, phoneNumber: "" },
    { user: "", price: 0, phoneNumber: "" },
  ];
  if (!Object.keys(rooms).includes(`Room${data.room}`)) {
    let key = "Room" + data.room;
    bidHistory[0] =
      !data.price == 0
        ? { user: data.user, price: data.value, phoneNumber: data.phone }
        : { user: "", price: 0, phoneNumber: "" };
    rooms = {
      ...rooms,
      [key]: { highest: +data.value, bidHistory },
    };
    io.emit("bid", {
      message: "bid successful",
      success: true,
      bidHistory: rooms[`Room${data.room}`].bidHistory,
      id: data.room,
    });
    // console.log("rooms", rooms);
  } else {
    if (rooms[`Room${data.room}`].highest < +data.value) {
      rooms[`Room${data.room}`].highest = +data.value;
      rooms[`Room${data.room}`].bidHistory.unshift({
        user: data.user,
        price: data.value,
        phoneNumber: data.phone,
      });
      io.emit("bid", {
        message: "bid successful",
        success: true,
        bidHistory: rooms[`Room${data.room}`].bidHistory,
        id: data.room,
      });
    } else {
      socket.emit("bid", {
        message: "bid unsuccessful",
        success: false,
        bidHistory: rooms[`Room${data.room}`].bidHistory,
        id: data.room,
      });
    }
  }
  console.log(data.room, rooms[`Room${data.room}`]);

  return rooms;
};

module.exports = { handleOnBid };
