import express from "express";
import routes from "./routes/index.js";
import authRoutes from "./routes/auth.routes.js";
import pelangganRoutes from "./routes/pelanggan.routes.js";
import kendaraanRoutes from "./routes/kendaraan.routes.js";
import mekanikRoutes from "./routes/mekanik.routes.js";
import kategoriSparepartRoutes from "./routes/kategoriSparepart.routes.js";
import sparepartRoutes from "./routes/sparepart.routes.js";
import servisRoutes from "./routes/servis.routes.js";
import detailServisRoutes from "./routes/detailServis.routes.js";
import detailSparepartRoutes from "./routes/detailSparepart.routes.js";
import pembayaranRoutes from "./routes/pembayaran.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { errorHandler } from "./middleware/error.middleware.js";


const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("dev"));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json());

app.use(routes);

app.use("/api/auth", authRoutes);

app.use("/api/pelanggan", pelangganRoutes);

app.use("/api/kendaraan", kendaraanRoutes);

app.use("/api/mekanik", mekanikRoutes);

app.use("/api/kategoriSparepart", kategoriSparepartRoutes);

app.use("/api/sparepart", sparepartRoutes);

app.use("/api/servis", servisRoutes);

app.use("/api/detailServis", detailServisRoutes);

app.use("/api/detailSparepart", detailSparepartRoutes);

app.use("/api/pembayaran", pembayaranRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint tidak ditemukan",
  });
});

app.use(errorHandler);
export default app;