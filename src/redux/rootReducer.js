import { combineReducers } from 'redux';
import dataSlice from './slices/dataSlice';

const rootReducer = combineReducers({
  data: dataSlice,
  // add other reducers here if needed
});

export default rootReducer;
