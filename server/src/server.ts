import cors from "cors";
import express from "express";
import routes from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${PORT}`);
});

