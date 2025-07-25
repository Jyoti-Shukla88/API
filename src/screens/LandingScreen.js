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

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.82;
//const WINDOW_WIDTH = Dimensions.get('window').width ;
//const WINDOW_HEIGHT = Dimensions.get('window').height;

const WATERMARK_IMAGE = require('../assets/placeholder/a273co1g-removebg-preview.png');

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
    
    color: '#36cc8eff',
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

  const enrichedSections =
    Array.isArray(languageData) ?
     languageData.map((item) => {
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
        style={[styles.watermark, { opacity: 0.5}]}
        resizeMode="cover"
      />

      {/* Animated Header */}
      <Animatable.View
        animation="fadeInDown"
        delay={100}
        duration={800}
        style={styles.header}
      >
        <Text style={styles.headerLine1}>👩‍⚕️ WHO Malaria</Text>
        <Text style={styles.headerLine2}>Toolkit</Text>
       
      </Animatable.View>

      {/* Animated Lang Select */}
      <Animatable.View animation="fadeInDown" delay={200} duration={800}>
        <TouchableOpacity
          onPress={() => setLanguage(prev => (prev === 'en' ? 'fr' : 'en'))}
          style={styles.langSelect}
        >
          <Text style={styles.langText}>{language === 'en' ? '🌍 English ▼' : '🌍 Français ▼'}</Text>
        </TouchableOpacity>
      </Animatable.View>
      {/* FlatList with animated cards */}
      <FlatList
        ref={flatListRef}
        horizontal
        data={enrichedSections}
        keyExtractor={(item) => item.key.toString()}
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 24 }
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

            {/*<Image source={{ uri: item.image }} style={styles.cardImage} />*/}
            <Text style={styles.title}>{item.title || item.text}</Text>
            
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
  alignItems: 'flex-start',
  backgroundColor: '#fff',
  elevation: 4,
  shadowColor: '#000',
  shadowOpacity: 0.15,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 6,
  marginBottom: 25,
},

  cardImage: {
    width: 300,
    height: 400,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  title: {
    fontSize:35,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    marginBottom: 10,
    marginLeft: 0,
    
  },
  desc: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
    marginBottom: 16,
  },
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
    width: SCREEN_WIDTH,  
    height: SCREEN_HEIGHT,
    alignSelf: 'flex-start'     
    
  },
  headerLine1: {
  fontSize: 28,
  fontWeight: '700',
  color: '#fff',
  lineHeight: 36,
},
headerLine2: {
  fontSize: 28,
  fontWeight: '700',
  color: '#fff',
  lineHeight: 36,
  marginLeft: 40
},
});
