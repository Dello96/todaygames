import axios from 'axios';

const serverUrl = process.env.REACT_APP_SERVER_URL;

if (!serverUrl) {
  throw new Error('REACT_APP_SERVER_URL is not set. Please configure your Cloudflare Worker URL.');
}

const getMostPlayedGames = async () => {
  try {
    const response = await axios.get(`${serverUrl}/api/most-played-games`);
    const mostPlayedGamesData = response.data.response.ranks;
   
    return mostPlayedGamesData;
  } catch (error) {
    console.error('getMostPlayedGames fetch 에러: ', error);
    throw error;
  }
};

const getTopReleases = async () => {
  try {
    const response = await axios.get(`${serverUrl}/api/top-releases`);
    const topReleases = response.data.response.pages[0].item_ids;
    return topReleases;
  } catch (error) {
    console.error('getTopReleases fetch 에러: ', error);
    throw error;
  }
};

const getSelectedGenre = async (tag: string) => {
  try {
    const response = await axios.get(`${serverUrl}/api/genre/${tag}`);
    const SelectedGenre = response.data.applist.apps;

    if (SelectedGenre) {
      return SelectedGenre;
    } else {
      console.error('Invalide game genre', tag);
      throw new Error('Invalid response');
    }
  } catch (error) {
    console.error('fetch error: ', error);
    throw error;
  }
};

const getGameDetails = async (appid: number) => {
  try {
    const response = await axios.get(`${serverUrl}/api/game-details/${appid}`);
    const gameDetails = response.data[appid]?.data;

    if (gameDetails) {
      return gameDetails;
    } else {
      console.error('Invalide game deatil', appid);
      throw new Error('Invalid response');
    }
  } catch (error) {
    console.error('fetch error: ', error);
    throw error;
  }
};

export { getMostPlayedGames, getGameDetails, getTopReleases, getSelectedGenre };
