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
        description: "Full day access to all zoo areas, animal exhibits, and wildlife shows for one adult visitor"
      },
      {
        name: "Child Ticket",
        price: 300,
        description: "Special rates for children aged 5-12 years with educational activities and interactive experiences"
      },
      {
        name: "Family Package",
        price: 1200,
        description: "Perfect for families - includes 2 adults and 2 children with guided tour and lunch vouchers"
      },
      {
        name: "VIP Ticket",
        price: 2000,
        description: "Premium experience with personal guide, priority access, private viewing areas, and all-day dining"
      },
      {
        name: "Senior Citizen",
        price: 250,
        description: "Discounted rates for seniors (60+) with complimentary wheelchair assistance and rest areas"
      },
      {
        name: "Student Ticket",
        price: 350,
        description: "Valid student ID required. Special rates for college and school students with educational materials"
      },
      {
        name: "Group Package (10+)",
        price: 400,
        description: "Special group discounts for 10 or more visitors with dedicated group area and group activities"
      },
      {
        name: "Annual Pass",
        price: 5000,
        description: "Unlimited visits for 12 months with exclusive member events and priority reservations"
      },
      {
        name: "Weekend Special",
        price: 600,
        description: "Valid on weekends and holidays with extended hours access and special entertainment shows"
      },
      {
        name: "Night Safari",
        price: 1500,
        description: "Exclusive evening experience with nocturnal animals, special lighting, and dinner included"
      }
    ]);

    console.log("Tickets Inserted");
    process.exit();
  })
  .catch(err => console.log(err));
