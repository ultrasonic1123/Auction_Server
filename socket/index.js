const handleOnBid = (socket, rooms, data) => {
  console.log(data, Object.keys(rooms));
  const bidHistory = [
    { user: "", price: 0 },
    { user: "", price: 0 },
    { user: "", price: 0 },
    { user: "", price: 0 },
  ];
  if (!Object.keys(rooms).includes(`Room${data.room}`)) {
    let key = "Room" + data.room;

    bidHistory[0] =
      !data.price == 0
        ? { user: data.user, price: data.value }
        : { user: "", price: 0 };
    rooms = { ...rooms, [key]: { highest: +data.value, bidHistory } };
    socket.emit("bid", {
      message: "bid successful",
      success: true,
      bidHistory: rooms[`Room${data.room}`].bidHistory,
    });
    // rooms[`Room${data.room}`].highest = +data.value;
  } else {
    if (rooms[`Room${data.room}`].highest < +data.value) {
      rooms[`Room${data.room}`].highest = +data.value;
      rooms[`Room${data.room}`].bidHistory.pop();
      rooms[`Room${data.room}`].bidHistory.unshift({
        user: data.user,
        price: data.value,
      });
      socket.emit("bid", {
        message: "bid successful",
        success: true,
        bidHistory: rooms[`Room${data.room}`].bidHistory,
      });
    } else {
      socket.emit("bid", {
        message: "bid unsuccessful",
        success: false,
        bidHistory: rooms[`Room${data.room}`].bidHistory,
      });
    }
  }
  console.log({ rooms }, rooms[`Room${data.room}`]);
  return rooms;
};

module.exports = { handleOnBid };
