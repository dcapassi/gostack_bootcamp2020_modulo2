import File from "../models/File";
import User from "../models/User";

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const userId = req.userId;
    const file = await File.create({
      name,
      path
    });

    const { id } = file;
    const user = await User.findByPk(userId);
    const userUpdate = await user.update({ avatar_id: id });

    return res.json(file);
  }
}

export default new FileController();
