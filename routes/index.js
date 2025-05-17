const express = require("express");
const fetch = require("node-fetch");

const router = express.Router();

router.get("/", async (req, res) => {
  const response = await fetch("https://meowfacts.herokuapp.com/");
  const data = await response.json();
  const fact = data.data[0];

  const collection = req.app.locals.collection;
  const savedFacts = await collection.find({ fact: { $exists: true } }).sort({ time: -1 }).toArray();

  res.render("index", { fact, savedFacts });
});

router.post("/submit", async (req, res) => {
  const { name, fact, saveFact } = req.body;
  const collection = req.app.locals.collection;

  const entry = { name, time: new Date() };
  if (saveFact === "yes" && fact) {
    entry.fact = fact;
  }

  await collection.insertOne(entry);
  res.redirect("/");
});

module.exports = router;
