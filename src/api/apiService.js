
import axios from 'axios';
import { VERSION_API, LANDING_API } from '@env';

// Fetch version number only
export const fetchRemoteVersion = async () => {
  try {
    const response = await axios.get(VERSION_API);
    const version = response?.data?.version;

    if (version === undefined || version === null) {
      throw new Error('Version not found in response');
    }

    return String(version); // ✅ Ensure version is a string
  } catch (error) {
    console.warn('[fetchRemoteVersion] Failed:', error.message);
    return '0'; // ✅ fallback version string
  }
};

// Fetch full landing JSON
export const fetchLatestLandingData = async () => {
  try {
    const response = await axios.get(LANDING_API);
    const data = response?.data;

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid landing data');
    }

    return data;
  } catch (error) {
    console.error('[fetchLatestLandingData] Failed:', error.message);
    throw error; // Let the saga handle the fallback via preloadedData
  }
};
