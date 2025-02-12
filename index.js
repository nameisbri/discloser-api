import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import recordRoutes from "./routes/records.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
};
app.use(express.json());

app.use(cors(corsOptions));

app.use("/records", recordRoutes);

app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to discloser");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
