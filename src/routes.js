import { Router } from "express";
import User from "./app/models/User";
import UserController from "./app/controllers/UserController";
import ProviderController from "./app/controllers/ProviderController";
import SessionController from "./app/controllers/SessionController";
import AppointmentController from "./app/controllers/AppointmentController";
import FileController from "./app/controllers/FileController";
import ScheduleController from "./app/controllers/ScheduleController";
import NotificationController from "./app/controllers/NotificationController";

import multer from "multer";
import multerConfig from "./configs/multer";

import authMiddlware from "../src/app/middlewares/auth";

const routes = new Router();
const upload = multer(multerConfig);

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);
routes.put("/update", authMiddlware, UserController.update);
routes.post(
  "/files",
  upload.single("file"),
  authMiddlware,
  FileController.store
);
routes.post("/appointments", authMiddlware, AppointmentController.store);
routes.get("/appointments", authMiddlware, AppointmentController.index);
routes.get("/schedule", authMiddlware, ScheduleController.index);
routes.get("/providers", authMiddlware, ProviderController.index);
routes.get("/notifications", authMiddlware, NotificationController.index);
export default routes;
