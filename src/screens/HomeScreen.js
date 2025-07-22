// src/screens/HomeScreen.js
import React from 'react';
import { View, Text,TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
    const navigation = useNavigation();
  const { data, version } = useSelector(state => state.data);

  return (
    <ScrollView contentContainerStyle={styles.root}>
        <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
        <Text style={styles.backText}>← Go to Landing</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Data Version: {version}</Text>

      {data?.sections?.map((item, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text>{item.description || "..."}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  card: { marginBottom: 12, padding: 12, backgroundColor: '#f1f1f1', borderRadius: 8 },
  title: { fontSize: 16, fontWeight: '600' },
  backText: { color: 'blue', fontSize: 16, marginBottom: 12 },
});
