import { Router } from "express";
import User from "./app/models/User";

const routes = new Router();

routes.get("/", async (req, res) => {
  const user = await User.create({
    name: "Diego Capassi",
    email: "diego.capassi.moreira@gmail.com",
    password_hash: "secret",
    provider: true
  });

  return res.json(user);
});

export default routes;
