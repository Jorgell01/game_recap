const axios = require("axios");
require("dotenv").config();

const getGameDataById = async (id) => {
  try {
    // 1. Obtener datos de Steam
    const steamResponse = await axios.get(`https://store.steampowered.com/appreviews/${id}?json=1`);
    const steamData = steamResponse.data.query_summary;

    // 2. Obtener datos de RAWG (por ejemplo, "the-witcher-3-wild-hunt")
    // Para este ejemplo, hacemos un fallback hardcoded — luego mejoraremos esto
    const rawgSlug = "the-witcher-3-wild-hunt";

    const rawgResponse = await axios.get(
      `https://api.rawg.io/api/games/${rawgSlug}?key=${process.env.RAWG_API_KEY}`
    );
    const rawgData = rawgResponse.data;

    // 3. Combinar todo
    return {
      gameId: id,
      name: rawgData.name,
      metacritic: rawgData.metacritic,
      steam_rating: steamData.review_score_desc,
      total_reviews: steamData.total_reviews,
      genres: rawgData.genres.map((g) => g.name),
      description: rawgData.description_raw.slice(0, 200) + "..."
    };

  } catch (error) {
    console.error("❌ Error al obtener datos:", error.message);
    return { error: "No se pudieron obtener los datos del juego." };
  }
};

module.exports = { getGameDataById };
