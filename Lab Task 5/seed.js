const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/beZooDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const sampleProducts = [
  { name: "Lion Ticket", price: 500, category: "Animal", description: "See lions" },
  { name: "Elephant Ticket", price: 700, category: "Animal", description: "See elephants" },
  { name: "Bird Show Ticket", price: 300, category: "Show", description: "Bird show" },
  { name: "Safari Ticket", price: 1200, category: "Adventure", description: "Safari tour" },
  { name: "Aquarium Ticket", price: 400, category: "Aquatic", description: "Visit Aquarium" }
];

async function seedDB() {
  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);
  console.log("Products Inserted");
  mongoose.connection.close();
}

seedDB();
