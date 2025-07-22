// redux/sagas/rootSaga.js
import { call, put, takeLatest, all } from 'redux-saga/effects';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  FETCH_DATA_REQUEST,
  FETCH_DATA_SUCCESS,
  FETCH_DATA_FAILURE,
} from '../slices/dataSlice';
import { fetchRemoteVersion, fetchLatestLandingData } from '../../api/apiService';
import preloadedData from '../../assets/preloadedData.json'; // local bundled data

function* handleFetchData() {
  try {
    const remoteVersion = yield call(fetchRemoteVersion);
    const remoteVersionStr = String(remoteVersion || '0');

    const cachedVersion = yield call(AsyncStorage.getItem, 'version');
    const cachedDataStr = yield call(AsyncStorage.getItem, 'data');
    const cachedData = cachedDataStr ? JSON.parse(cachedDataStr) : null;

    if (!cachedData) {
      // First Launch: use pre-bundled + check version + optionally update
      yield put(FETCH_DATA_SUCCESS({ data: preloadedData, version: 'offline' }));

      const latestData = yield call(fetchLatestLandingData);
      if (latestData?.sections) {
        yield call(AsyncStorage.setItem, 'data', JSON.stringify(latestData));
        yield call(AsyncStorage.setItem, 'version', remoteVersionStr);
        yield put(FETCH_DATA_SUCCESS({ data: latestData, version: remoteVersionStr }));
      }
    } else if (remoteVersionStr !== cachedVersion) {
      // Version has changed — fetch and update
      const latestData = yield call(fetchLatestLandingData);
      if (latestData?.sections) {
        yield call(AsyncStorage.setItem, 'data', JSON.stringify(latestData));
        yield call(AsyncStorage.setItem, 'version', remoteVersionStr);
        yield put(FETCH_DATA_SUCCESS({ data: latestData, version: remoteVersionStr }));
      } else {
        yield put(FETCH_DATA_SUCCESS({ data: cachedData, version: cachedVersion }));
      }
    } else {
      // Version matches — use locally cached data
      yield put(FETCH_DATA_SUCCESS({ data: cachedData, version: cachedVersion }));
    }
  } catch (error) {
    console.log('Saga Fetch Error:', error.message);
    yield put(FETCH_DATA_SUCCESS({ data: preloadedData, version: 'offline' }));
  }
}

export default function* rootSaga() {
  yield all([takeLatest(FETCH_DATA_REQUEST.type, handleFetchData)]);
}
