const express = require("express");
const mongoose = require("mongoose");
const Count = require("./model/count");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const pid = process.pid;

const closeDBConnection = () => {
  console.log(`Closing db connection with pid : ${process.pid}`);
  mongoose.connection.close();
  process.exit();
};

process.on("SIGINT", closeDBConnection);

app.post("/create", async (req, res) => {
  await Count.deleteMany({ name: req.query.name }); // Cleaning up db documents
  const count = new Count({ name: req.query.name });
  await count.save();
  res.json({ doc: count });
});

app.get("/get", async (req, res) => {
  try {
    const count = await Count.findOne({ name: req.query.name });
    res.json({ doc: count });
  } catch (e) {
    console.log({ e: e?.message });
    res.json({ error: e?.message });
  }
});

app.get("/concurrency", async (req, res) => {
  try {
    const count = await Count.findOneAndUpdate(
      { name: req.query.name },
      { $inc: { count: 1 } },
      { new: true }
    );
    res.json({ count });
  } catch (e) {
    console.log({ e: e?.message });
    res.json({ error: e?.message });
  }
});

app.get("/noob", async (req, res) => {
  try {
    const count = await Count.findOne({ name: req.query.name });
    count.count++;
    await count.save();
    res.json({ count });
  } catch (e) {
    console.log({ e: e?.message });
    res.json({ error: e?.message });
  }
});

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then((_) => {
    app.listen(PORT, () => {
      console.log(`Server running with pid : ${pid} on port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.log({ err });
  });
