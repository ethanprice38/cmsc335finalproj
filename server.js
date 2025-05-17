const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "templates"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

(async () => {
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.by0io7v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  const databaseName = process.env.MONGO_DB_NAME;
  const collectionName = process.env.MONGO_COLLECTION;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db(databaseName);
    const collection = database.collection(collectionName);
    app.locals.collection = collection;

    const router = require("./routes/index");

    app.use("/", router);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return;
  }
})();
