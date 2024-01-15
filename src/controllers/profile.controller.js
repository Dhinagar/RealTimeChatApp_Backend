const { getProfileData ,updateProfileData, deactivateProfile,getAllProfileData} = require("../services/profile/profile.service");

const getprofileController = async (req, res) => {
  const { username } = req.query;
  const result = await getProfileData(username);
  res.status(result.code).json(result.data);
};
const getAllprofileController = async (req, res) => {
  const username = req.params.username;
  const result = await getAllProfileData(username);
  res.status(result.code).json(result.data);
};
const updateProfileController = async (req, res) => {
  const username = req.params.username;
  const updatedDetails = req.body;
  const result = await updateProfileData(username, updatedDetails);
  res.status(result.code).json(result.data);
};
const deactivateProfileController = async (req,res)=>{
  const username = req.params.username;
  const requestingUsername = req.user.username; 
  const result = await deactivateProfile(username, requestingUsername);
  res.status(result.code).json(result.data);
}
module.exports = { getprofileController, updateProfileController,deactivateProfileController, getAllprofileController };
