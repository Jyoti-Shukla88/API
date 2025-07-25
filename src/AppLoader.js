import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_DATA_REQUEST } from './redux/slices/dataSlice';

export default function AppLoader({ onFinish }) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.data?.loading ?? false);
  const finishedRef = useRef(false);

  useEffect(() => {
    dispatch(FETCH_DATA_REQUEST());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !finishedRef.current) {
      finishedRef.current = true;
      if (onFinish) {
        onFinish();
      }
    }
  }, [loading, onFinish]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0F529D" />
    </View>
  );
}
