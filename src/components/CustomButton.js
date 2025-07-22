import { Button, View, StyleSheet } from 'react-native';

export default function CustomButton({ onPress, title, backgroundColor }) {
  const platformColor = backgroundColor || '#0F529D';

  return (
    <View style={[styles.wrapper, { backgroundColor: platformColor }]}>
      <Button
        title={title}
        onPress={onPress}
        color={"#0b70e4ff"} // white text for Android (only)
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 310,               // Increased width
    height: 35, 
    borderRadius: 22,
    alignSelf: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
});
