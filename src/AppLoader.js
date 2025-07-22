// AppLoader.js
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { FETCH_DATA_REQUEST } from './redux/slices/dataSlice';

export default function AppLoader({ onFinish }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(FETCH_DATA_REQUEST());
    setTimeout(() => {
      onFinish(); // continue to main app after saga completes
    }, 2000); // allow saga time to load
  }, );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
    </View>
  );
}
