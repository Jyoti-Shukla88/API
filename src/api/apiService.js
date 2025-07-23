// src/api/apiService.js
import axios from 'axios';
import { VERSION_API, LANDING_API } from '@env';

export const fetchRemoteVersion = async () => {
  try {
    const response = await axios.get(VERSION_API);
    return String(response.data?.version || '0');
  } catch (error) {
    console.warn('[fetchRemoteVersion] error:', error.message);
    return '0';
  }
};

export const fetchLatestLandingData = async () => {
  try {
    const response = await axios.get(LANDING_API);
    return response.data; // Should include .sections
  } catch (error) {
    throw new Error('[fetchLatestLandingData] error: ' + error.message);
  }
};
