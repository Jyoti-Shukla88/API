import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Linking,Alert, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export default function GuideLinesScreen() {
  const navigation = useNavigation();
  const { data, loading, error } = useSelector(state => state.data);
  const guidelinesData = data?.sections?.[1]?.items || [];

  const openPDF = async (url) => {
    if (!url) {
      Alert.alert('No PDF link provided');
      return;
    }

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      Linking.openURL(url);
    } else {
      Alert.alert('Cannot open the PDF link:', url);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading guidelines...</Text>
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
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back </Text>
      </TouchableOpacity>

      <Text style={styles.heading}>WHO {'\n'}Guidelines</Text>

      <FlatList
        data={guidelinesData}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.itemCard} onPress={() => openPDF(item.link)}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle|| item.description || 'Tap to open PDF'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No guidelines available.</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  heading: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 16 
  },
  itemCard: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: Platform.OS === 'android' ? 2 : 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#222'
  },
  subtitle: { 
    fontSize: 14, 
    color: '#555' ,
    marginTop: 4
  },
  backBtn: { 
    marginBottom: 10 
  },
  backText: { 
    color: '#007AFF', 
    fontSize: 16 ,
    marginTop: 30,
  },
  listContainer: { 
    paddingBottom: 40 
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 40 },
});
