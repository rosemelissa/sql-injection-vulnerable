import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Client } from "pg";
const client = new Client({
  database: "injectiondb",
});

const app = express();

/** Parses JSON data in a request automatically */
app.use(express.json());
/** To allow 'Cross-Origin Resource Sharing': https://en.wikipedia.org/wiki/Cross-origin_resource_sharing */
app.use(cors());

// read in contents of any environment variables in the .env file
dotenv.config();

// use the environment variable PORT, or 4000 as a fallback
const PORT_NUMBER = process.env.PORT ?? 4000;

client.connect();

app.get("/", (req, res) => {
  res.sendFile(
    "/home/2206-005-mr/Developer/academy/training/sql-injection-vulnerable/public/index.html"
  );
});

app.get("/connect/", async (req, res) => {
  try {
    const customerOrders = await client.query(`SELECT * FROM orders`);
    res.json(customerOrders.rows);
  } catch (error) {
    console.error(error);
  }
});

app.get("/orders/:username/", async (req, res) => {
  const username = req.params.username;
  try {
    const customerOrders = await client.query(
      `SELECT orders.orderId, orders.item, users.username FROM orders JOIN users ON orders.userId = users.userId WHERE users.username='${username}'`
    );
    res.json(customerOrders.rows);
  } catch (error) {
    console.error(error);
  }
});

/*
// API info page
app.get("/", (req, res) => {
  const pathToFile = filePath("../public/index.html");
  res.sendFile(pathToFile);
});

// GET /items
app.get("/items", (req, res) => {
  const allSignatures = getAllDbItems();
  res.status(200).json(allSignatures);
});

// POST /items
app.post<{}, {}, DbItem>("/items", (req, res) => {
  // to be rigorous, ought to handle non-conforming request bodies
  // ... but omitting this as a simplification
  const postData = req.body;
  const createdSignature = addDbItem(postData);
  res.status(201).json(createdSignature);
});

// GET /items/:id
app.get<{ id: string }>("/items/:id", (req, res) => {
  const matchingSignature = getDbItemById(parseInt(req.params.id));
  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(200).json(matchingSignature);
  }
});

// DELETE /items/:id
app.delete<{ id: string }>("/items/:id", (req, res) => {
  const matchingSignature = getDbItemById(parseInt(req.params.id));
  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(200).json(matchingSignature);
  }
});

// PATCH /items/:id
app.patch<{ id: string }, {}, Partial<DbItem>>("/items/:id", (req, res) => {
  const matchingSignature = updateDbItemById(parseInt(req.params.id), req.body);
  if (matchingSignature === "not found") {
    res.status(404).json(matchingSignature);
  } else {
    res.status(200).json(matchingSignature);
  }
});
*/

app.listen(PORT_NUMBER, () => {
  console.log(`Server is listening on port ${PORT_NUMBER}!`);
});
