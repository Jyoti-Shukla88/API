// screens/LandingScreen.js
import React, {  useState, useRef, useEffect } from 'react';
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
import { useDispatch,useSelector } from 'react-redux';
import CustomButton from '../components/CustomButton';
import { FETCH_DATA_REQUEST } from '../redux/slices/dataSlice';
import landing1 from '../assets/landing1.json';
import versionEn from '../assets/versionEn.json';
import ChevronRight from '../assets/placeholder/chevron_right.svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.72;
const preloadedData = {
  landingData: landing1,
  versionEnData: versionEn,
};

const WATERMARK_IMAGE = require('../assets/placeholder/landing_bg.png');

const SCREEN_CONFIG = [
  {
    key: '1',
    screen: 'ReportScreen',
    
    color: '#0F529D',
  },
  {
    key: '2',
    screen: 'GuideLinesScreen',
    
    color: '#ea6d14ff',
  },
  {
    key: '3',
    screen: 'TerminologyScreen',
    
    color: '#1f845aff',
  },
];

export default function LandingScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { data, loading, error } = useSelector((state) => state.data);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();
  const [language, setLanguage] = useState('en');
  useEffect(() => {
    console.log('Dispatching FETCH_DATA_REQUEST');
    dispatch(FETCH_DATA_REQUEST());
  }, [dispatch]);
  
const languageData = data?.[language] ?? [];
// fallback to preloaded json data depending on language
  const localLanguageData =
    language === 'en' ? preloadedData.versionEnData : preloadedData.landingData;

//const localLanguageData = preloadedData?.[language] ?? [];
const effectiveData =
    Array.isArray(languageData) && languageData.length > 0
      ? languageData
      : localLanguageData;

  const enrichedSections =
   Array.isArray(effectiveData) && effectiveData.length > 0
      ? effectiveData.map((item) => {
        const config = SCREEN_CONFIG.find(conf => conf.key === item.id);
        return {
            key: item.id,
            title: item.title,
            description: item.description,
            image: item.img,
            screen: config?.screen || 'ReportScreen', // fallback
            color: config?.color || '#0F529D',
          };
        })
        
      : SCREEN_CONFIG.map((conf) => ({
        key: conf.key,
          title: conf.title || 'Default',
          description: '',
          image: null,
          screen: conf.screen,
          color: conf.color,
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
console.log('Redux data:', data);
console.log('Enriched Sections:', enrichedSections);
enrichedSections.forEach((item, idx) => {
  console.log(`Item ${idx} - id: ${item.key}, title: ${item.title}, image present: ${!!item.image}`);
});

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: SCREEN_CONFIG[activeIndex]?.color || '#0F529D' },
      ]}
    >
    
      <ImageBackground
        source={WATERMARK_IMAGE}
        style={styles.watermark}
      
        resizeMode="cover"
      />

      {/* Animated Header */}
      <Animatable.View
        animation="fadeInDown"
        delay={100}
        duration={800}
        style={styles.header}
      >
        <Text style={styles.headerLine1}>WHO Malaria</Text>
        <Text style={styles.headerLine2}>Toolkit</Text>
       
      </Animatable.View>

      {/* Animated Lang Select */}
      <Animatable.View animation="fadeInDown" delay={200} duration={800}>
        <TouchableOpacity
          onPress={() => setLanguage(prev => (prev === 'en' ? 'fr' : 'en'))}
          style={styles.langSelect}
        >
          <Text style={styles.langText}>{language === 'en' ? 'English ▼' : ' Français ▼'}</Text>
        </TouchableOpacity>
      </Animatable.View>
      {/* FlatList with animated cards */}
      <FlatList
        ref={flatListRef}
        horizontal
        data={enrichedSections}
        keyExtractor={(item) => item.key.toString()}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH }
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
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.cardImage} />
            ) : (
              <View style={[styles.cardImage, {backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'}]}>
                <Text>No Image</Text>
              </View>
            )}
              <View style={styles.titleRow}>
                <Text style={styles.title}>{item.title || item.text}</Text>
                <ChevronRight width={24} height={24} style={styles.chevronIcon} />
              </View>
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
    marginTop: 50,
    marginLeft: 16,
    marginBottom: 8, 
  },

   titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,  
  },

  chevronIcon: {
    marginLeft: 8,
  },

  langSelect: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'flex-start',
    marginLeft: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)', 
  },

  langText: { 
    fontSize: 14, 
    color: '#FFFFFF', 
    fontWeight: '500' 
  },

  card: {
  width: CARD_WIDTH,
  borderRadius: 20,
  marginRight: 24,
  paddingVertical: 30,
  paddingHorizontal: 16,
  alignItems: 'flex-start',
  backgroundColor: '#fff',
  elevation: 4,
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 6,
  marginBottom: 80, 
},

  cardImage: {
    width: '100%',
    height: 400,
    borderRadius: 20,
    marginBottom: 12,
    resizeMode: 'cover',
    marginLeft:0,
  },

  title: {
    fontSize:35,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 10,
    marginLeft: 8,
    flexShrink: 1,
    flexWrap: 'wrap', 
  },

  desc: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
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
    position: 'absolute',
    width: SCREEN_WIDTH,  
    height: SCREEN_HEIGHT,
    alignSelf: 'flex-start' , 
    opacity: '5%',  
    top : 0,
    left: 0,
  },

  headerLine1: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    lineHeight: '110%',
    marginLeft:8,
  },

headerLine2: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fff',
    lineHeight: '110%',
    marginLeft: 8
  },
});
