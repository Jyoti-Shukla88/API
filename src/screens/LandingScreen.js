// screens/LandingScreen.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { FETCH_DATA_REQUEST } from '../redux/slices/dataSlice';
import CustomButton from '../components/CustomButton';

const CARD_WIDTH = Dimensions.get('window').width * 0.82;
const WINDOW_WIDTH = Dimensions.get('window').width ;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const WATERMARK_IMAGE = require('../assets/placeholder/a273co1g-removebg-preview.png');

const SCREEN_CONFIG = [
  {
    key: 'report',
    screen: 'ReportScreen',
    text: 'World malaria report 2024',
    image: 'https://tse4.mm.bing.net/th/id/OIP.mR9-Gdc0XOf5TQ4Rm0g00AHaKf',
    color: '#0F529D',
  },
  {
    key: 'guidelines',
    screen: 'GuideLinesScreen',
    text: 'WHO guidelines',
    image: 'https://tse4.mm.bing.net/th/id/OIP.Ms3z6L-wJi7s0s695Ce-ngHaKd',
    color: '#ea6d14ff',
  },
  {
    key: 'terminology',
    screen: 'TerminologyScreen',
    text: 'WHO malaria terminology',
    image: 'https://iris.who.int/bitstream/handle/10665/349442/9789240038400-eng.pdf.jpg',
    color: '#36cc8eff',
  },
];

export default function LandingScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { data, loading, error } = useSelector((state) => state.data);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();

  useEffect(() => {
    dispatch(FETCH_DATA_REQUEST());
  }, [dispatch]);

  const enrichedSections =
    Array.isArray(data?.sections) && data.sections.length >= 3
      ? data.sections.map((item, i) => ({
          ...item,
          ...SCREEN_CONFIG[i],
        }))
      : SCREEN_CONFIG.map((conf) => ({
          ...conf,
          title: conf.text,
          
        }));

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0F529D" />
        <Text>Loading toolkit...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>Failed to load: {error}</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: enrichedSections[activeIndex]?.color || '#0F529D' },
      ]}
    >
    
      <ImageBackground
        source={WATERMARK_IMAGE}
        style={[styles.watermark, { opacity: 0.5}]}
        resizeMode="cover"
      />

      {/* Animated Header */}
      <Animatable.Text
        animation="fadeInDown"
        delay={100}
        duration={800}
        style={styles.header}
      >
        👩‍⚕️ WHO Malaria{'\n\t\t\t\t\t\t'}Toolkit
      </Animatable.Text>

      {/* Animated Lang Select */}
      <Animatable.View animation="fadeInDown" delay={200} duration={800}>
        <TouchableOpacity style={styles.langSelect}>
          <Text style={styles.langText}>🌍 English ▼</Text>
        </TouchableOpacity>
      </Animatable.View>

      {/* FlatList with animated cards */}
      <FlatList
        ref={flatListRef}
        horizontal
        data={enrichedSections}
        keyExtractor={(item, idx) => item.key || idx.toString()}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 24}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 16 }}
        onMomentumScrollEnd={(event) => {
          const offsetX = event.nativeEvent.contentOffset.x;
          const index = Math.round(offsetX / (CARD_WIDTH + 24));
          setActiveIndex(index);
        }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No toolkit cards available.</Text>
        }
        renderItem={({ item, index }) => (
          <Animatable.View
            animation="fadeInUp"
            duration={600}
            delay={index * 150}
            useNativeDriver
            style={[styles.card, { backgroundColor: '#fff' }]}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.title}>{item.title || item.text}</Text>
            <Text style={styles.desc}>{item.description }</Text>
            <CustomButton
                title="Explore"
                backgroundColor={item.color || '#0F529D'}
                onPress={() => navigation.navigate(item.screen)}
              />
          </Animatable.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 50,
    marginLeft: 16,
    marginBottom: 8,
    lineHeight: 36,
  },
  langSelect: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    marginLeft: 58,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  langText: { fontSize: 14, color: '#333', fontWeight: '500' },
  card: {
    width: CARD_WIDTH,
    borderRadius: 20,
    marginRight: 24,
    paddingVertical: 30,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    marginBottom: 20,
  },
  cardImage: {
    width: 300,
    height: 400,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 10,
  },
  desc: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
  },
  /*btn: {
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 22,
    backgroundColor: '#0F529D',
    elevation: 2,
  },*/
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
  },
  watermark: {
    flex:1,
    width: WINDOW_WIDTH,   // exact screen width
    height: WINDOW_HEIGHT,// exact screen height
    alignSelf: 'flex-start'     
    
  },
});
