const { authService } = require("../services/authServices");


const authController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await authService(email, password);

    if (user.erro) {
      return res.status(400).json({ message: user.erro })
    }

    return res.status(200).json({ user })

  } catch (error) {
    next(error)
  }
}

module.exports = { authController };