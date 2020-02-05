import { Router } from "express";
import User from "./app/models/User";
import UserController from "./app/controllers/UserController";
import SessionController from "./app/controllers/SessionController";

import authMiddlware from "../src/app/middlewares/auth";

const routes = new Router();

routes.post("/users", UserController.store);
routes.post("/sessions", SessionController.store);
routes.put("/update", authMiddlware, UserController.update);

export default routes;
