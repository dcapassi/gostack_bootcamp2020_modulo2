import { Sequelize } from "sequelize";
import User from "../app/models/User";
import File from "../app/models/File";
import databaseConfig from "../configs/database";
import Appointment from "../app/models/Apointment";
import mongoose from "mongoose";

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }
  init() {
    this.connection = new Sequelize(databaseConfig);
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
  mongo() {
    this.mongoConnection = mongoose.connect(
      "mongodb://192.168.56.1:27017/gobarber",
      { useNewUrlParser: true, useFindAndModify: true }
    );
  }
}

export default new Database();
