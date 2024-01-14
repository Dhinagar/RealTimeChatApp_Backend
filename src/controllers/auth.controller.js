const { registerUser, loginUser,logoutUser } = require("../services/user/user.service");

const registerUserController = async (req, res) => {
  const { username, name, password, email, age } = req.body;

  const userDetails = {
    userName:username,
    name,
    password,
    email,
    age,
    created_at: new Date(),
    updated_at: new Date(),
    last_loggedIn: null,
    status:'offline'
  };
  const result = await registerUser(userDetails);
  res.status(result.code).json(result.data);
};
const loginUserController = async (req, res) => {
  const { username, password } = req.body;
  const result = await loginUser(username, password);
  res.status(result.code).json(result.data);
};
const logoutUserController = async (req, res) => {
  const username = req.params.username;
  const result = await logoutUser(username);
  res.status(result.code).json(result.data);
};
module.exports = {
  registerUserController,
  loginUserController,
  logoutUserController
};
