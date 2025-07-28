import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

export default function ReportScreen() {
  const navigation = useNavigation();
  const { data, version, } = useSelector(state => state.data);

  const reportSection = data?.sections?.[0];

  const handleDownload = () => {
    if (reportSection?.link) {
      Linking.openURL(reportSection.link);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      {/* Title Card */}
      <View style={styles.card}>
        <Text style={styles.title}>
          {reportSection?.title || 'World malaria report'}
        </Text>
        <Text style={styles.desc}>
          {reportSection?.description ||
            'No detailed description available for this report.'}
        </Text>
      </View>

      {/* Download Button */}
      {!!reportSection?.link && (
        <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload}>
          <Text style={styles.downloadText}>Download Full Report</Text>
        </TouchableOpacity>
      )}

      {/* Footer */}
      <Text style={styles.versionText}>Version: {version || 'N/A'}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#FAFAFA' },

  backBtn: { marginBottom: 10 },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    marginTop: 30
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#222'
  },

  desc: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
  },

  downloadBtn: {
    backgroundColor: '#0F529D',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 30,
  },

  downloadText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  versionText: {
    fontSize: 13,
    color: '#aaa',
    textAlign: 'center',
  }
});
