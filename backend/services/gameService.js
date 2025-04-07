const axios = require("axios");

const getGameDataById = async (id) => {
  try {
    // Llamamos a la Steam API con el ID del juego
    const response = await axios.get(`https://store.steampowered.com/appreviews/${id}?json=1`);

    // Sacamos los datos útiles
    const data = response.data.query_summary;

    return {
      gameId: id,
      steam_rating: data.review_score_desc, // ej: "Very Positive"
      total_reviews: data.total_reviews,
      total_positive: data.total_positive,
      total_negative: data.total_negative
    };
  } catch (error) {
    console.error("Error al obtener datos de Steam:", error.message);
    return { error: "No se pudo obtener información de Steam para ese juego." };
  }
};

module.exports = { getGameDataById };
