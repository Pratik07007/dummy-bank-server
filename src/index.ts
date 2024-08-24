import express from "express";
import { authRouter } from "./routes/authRouter";
const PORT = process.env.PORT || 3007;

const app = express();

app.use(express.json());
app.use("/api/auth/", authRouter);

app.listen(PORT, () => console.log(`Bank Server Running on port:${PORT}`));
