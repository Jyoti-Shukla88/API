import { call, put, takeLatest, all } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
} from '../slices/dataSlice';
import {
  fetchRemoteVersion,
  fetchLatestLandingData,
} from '../../api/apiService';
import preloadedData from '../../assets/preloadedData.json';

const CACHED_DATA_KEY = 'TOOLKIT_DATA';
const IS_FIRST_LAUNCH_KEY = 'IS_FIRST_LAUNCH_DONE';

function* handleFetchData() {
  try {
    const isFirstLaunch = yield call(AsyncStorage.getItem, IS_FIRST_LAUNCH_KEY);
    const cachedStr = yield call(AsyncStorage.getItem, CACHED_DATA_KEY);
    const cached = cachedStr ? JSON.parse(cachedStr) : null;
    const cachedVersion = cached?.version || null;

    // Fetch server version with fallback
    let serverVersion = '0';
    try {
      serverVersion = yield call(fetchRemoteVersion);
    } catch {
      // fetchRemoteVersion already logs error
    }

    const normalizedServerVersion = String(serverVersion).trim();
    const normalizedCachedVersion = String(cachedVersion).trim();
    const normalizedPreloadedVersion = String(preloadedData.version).trim();

    // ✅ First Launch
    if (!isFirstLaunch) {
      yield put(FETCH_DATA_SUCCESS({
        data: preloadedData.data,
        version: preloadedData.version,
      }));
      console.log('✅ First launch: using preloaded data');

      // Cache preloaded data
      yield call(AsyncStorage.setItem, CACHED_DATA_KEY, JSON.stringify(preloadedData));
      yield call(AsyncStorage.setItem, IS_FIRST_LAUNCH_KEY, 'true');

      // 🔁 Compare with server
      if (normalizedServerVersion !== normalizedPreloadedVersion) {
        try {
          const latestData = yield call(fetchLatestLandingData);
          console.log('[DEBUG] Fetched data from server (preloaded context):', latestData);

          if (latestData && Array.isArray(latestData.sections)) {
            const payload = {
              data: latestData,
              version: normalizedServerVersion,
            };
            yield call(AsyncStorage.setItem, CACHED_DATA_KEY, JSON.stringify(payload));
            yield put(FETCH_DATA_SUCCESS(payload));
            console.log('🌐 Server version newer — updated from preloaded data');
          } else {
            console.warn('⚠️ latestData.sections missing or invalid on first launch');
            console.warn('[Payload Returned]', JSON.stringify(latestData));
          }
        } catch (err) {
          console.warn('⚠️ Failed to fetch updated data after preload:', err.message);
        }
      } else {
        console.log('✅ Version match — preloaded data is current');
      }

      return; // ✔ Exit
    }

    // ✅ Subsequent Launch with Cached Data
    if (cached) {
      yield put(FETCH_DATA_SUCCESS({
        data: cached.data,
        version: cached.version,
      }));
      console.log('🔁 Using cached data');

      console.log('[DEBUG] Server version:', `"${normalizedServerVersion}"`);
      console.log('[DEBUG] Cached version:', `"${normalizedCachedVersion}"`);

      if (normalizedServerVersion !== normalizedCachedVersion) {
        try {
          const latestData = yield call(fetchLatestLandingData);
          console.log('[DEBUG] Fetched data from server (cached context):', latestData);

          if (latestData && Array.isArray(latestData.sections)) {
            const payload = {
              data: latestData,
              version: normalizedServerVersion,
            };
            yield call(AsyncStorage.setItem, CACHED_DATA_KEY, JSON.stringify(payload));
            yield put(FETCH_DATA_SUCCESS(payload));
            console.log('🌐 Server version newer — updated from cached data');
          } else {
            console.warn('⚠️ latestData.sections missing or invalid when refreshing cache');
            console.warn('[Payload Returned]', JSON.stringify(latestData));
          }
        } catch (err) {
          console.warn('⚠️ Failed to fetch updated data:', err.message);
        }
      } else {
        console.log('✅ Version match — no update needed');
      }

      return; // ✔ Exit
    }

    // ❗ Fallback: No cache found
    yield put(FETCH_DATA_SUCCESS({
      data: preloadedData.data,
      version: preloadedData.version,
    }));
    yield call(AsyncStorage.setItem, CACHED_DATA_KEY, JSON.stringify(preloadedData));
    console.warn('⚠️ No cache found — using bundled preloaded data');

  } catch (error) {
    console.error('❌ Saga Fetch Failed:', error.message);
    yield put(FETCH_DATA_FAILURE({ error: error.message }));
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(FETCH_DATA_REQUEST.type, handleFetchData),
  ]);
}
