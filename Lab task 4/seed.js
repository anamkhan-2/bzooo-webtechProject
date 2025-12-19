const mongoose = require("mongoose");
const Ticket = require("./models/Ticket");

mongoose.connect("mongodb://127.0.0.1:27017/beZooDB")
  .then(async () => {
    console.log("MongoDB Connected");

    await Ticket.deleteMany({});

    await Ticket.insertMany([
      {
        name: "Adult Ticket",
        price: 500,
        description: "Full day access for adults"
      },
      {
        name: "Child Ticket",
        price: 300,
        description: "Children under 12 years"
      },
      {
        name: "Family Ticket",
        price: 1200,
        description: "2 Adults + 2 Children"
      },
      {
        name: "VIP Ticket",
        price: 2000,
        description: "VIP access with guide"
      }
    ]);

    console.log("Tickets Inserted");
    process.exit();
  })
  .catch(err => console.log(err));
