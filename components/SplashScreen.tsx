import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }: any) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.15, duration: 1000, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 0.9, duration: 1000, useNativeDriver: true }),
      ])
    ).start();

    const timer = setTimeout(() => { navigation.replace('Login'); }, 3500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#7c3aed', '#3b82f6', '#0ea5e9']} style={styles.container}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.mascot}>🦉🚀</Text>
        <Text style={styles.titleTitle}>English 21</Text>
      </Animated.View>

      <View style={styles.footer}>
        <Text style={styles.subtitle}>سفر جادویی یادگیری زبان 🌟</Text>
        <Text style={styles.author}>با وحید غفروئی</Text>
        <Text style={styles.stars}>✨ 🌟 ✨</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoContainer: { 
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', 
    width: width * 0.7, height: width * 0.7, borderRadius: (width * 0.7) / 2, 
    elevation: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, 
    shadowOpacity: 0.3, shadowRadius: 20, marginBottom: 50, 
    borderWidth: 6, borderColor: '#e0e7ff' 
  },
  mascot: { fontSize: 75, marginBottom: 5 },
  titleTitle: { fontSize: 32, fontWeight: '900', color: '#7c3aed', letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 50, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', padding: 15, borderRadius: 25, width: width * 0.85 },
  subtitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 5, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 3 },
  author: { fontSize: 22, fontWeight: '900', color: '#fde047', marginBottom: 10, textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 3 },
  stars: { fontSize: 24 }
});