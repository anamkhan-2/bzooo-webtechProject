const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Ticket = require("./models/Ticket");

const app = express();

/* =====================
   MongoDB Connection
===================== */
mongoose.connect("mongodb://127.0.0.1:27017/beZooDB")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* =====================
   App Config
===================== */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

/* =====================
   Routes
===================== */
app.get("/", (req, res) => {
  res.render("home", { title: "Be Zoo - Home" });
});

app.get("/zoo", (req, res) => {
  res.render("zoo", { title: "The Zoo - Be Zoo" });
});

app.get("/gallery", (req, res) => {
  res.render("gallery", { title: "Animals Gallery - Be Zoo" });
});

app.get("/tickets", (req, res) => {
  res.render("tickets", { title: "Buy Tickets - Be Zoo" });
});

/* =====================
   BOUGHT TICKETS PAGE
===================== */
app.get("/bought-tickets", async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 5;
    let skip = (page - 1) * limit;

    let filter = {};

    // Price filter
    if (req.query.minPrice && req.query.maxPrice) {
      filter.price = {
        $gte: Number(req.query.minPrice),
        $lte: Number(req.query.maxPrice)
      };
    }

    const totalTickets = await Ticket.countDocuments(filter);
    const tickets = await Ticket.find(filter)
      .skip(skip)
      .limit(limit);

    res.render("boughtTickets", {
      title: "Bought Tickets - Be Zoo",
      tickets,
      currentPage: page,
      totalPages: Math.ceil(totalTickets / limit),
      minPrice: req.query.minPrice || "",
      maxPrice: req.query.maxPrice || ""
    });

  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Us - Be Zoo" });
});

app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
