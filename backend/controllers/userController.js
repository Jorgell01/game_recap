const getProfile = (req, res) => {
  res.json({
    message: "Perfil del usuario",
    user: req.user
  });
};

module.exports = { getProfile };

