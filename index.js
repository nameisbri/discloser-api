import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js";
import recordRoutes from "./routes/records.js";
import resultRoutes from "./routes/results.js";
import shareRoutes from "./routes/share.js";
import reminderRoutes from "./routes/reminders.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: process.env.CORS_ORIGIN,
};
app.use(express.json());

app.use(cors(corsOptions));

app.use("/users", userRoutes);
app.use("/records", recordRoutes);
app.use("/results", resultRoutes);
app.use("/share", shareRoutes);
app.use("/reminders", reminderRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to discloser");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
