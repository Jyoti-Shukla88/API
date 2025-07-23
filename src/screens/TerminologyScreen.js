import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export default function TerminologyScreen() {
  const navigation = useNavigation();
  const { data, loading, error } = useSelector(state => state.data);
  
  const terms = data?.sections?.[2]?.items || [];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1c69dd" />
        <Text style={{ marginTop: 10 }}>Loading glossary...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>Failed to load data: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back </Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.header}>🩸 Malaria Glossary</Text>

      {/* Terms List */}
      <FlatList
        data={terms}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.termCard}>
            <Text style={styles.termTitle}>{item.term || item.title}</Text>
            <Text style={styles.termDesc}>{item.definition || item.description}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No terms available.</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  // Back navigation
  backBtn: { marginBottom: 12 },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 30,
  },

  // Title
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 16,
    color: '#222',
  },

  // Card for each term
  termCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: Platform.OS === 'android' ? 3 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  termTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  termDesc: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
    lineHeight: 20,
  },

  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
});
