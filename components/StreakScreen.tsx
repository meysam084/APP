import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function StreakScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🔥</Text>
      <Text style={styles.title}>استریک شما</Text>
      <Text style={styles.subtitle}>شما ۳ روز پشت سر هم تمرین کردید!</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardText}>فردا هم برگرد تا شعله‌ات خاموش نشه! 💪</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>ادامه میدم! 🚀</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff1f2', alignItems: 'center', justifyContent: 'center', padding: 20 },
  emoji: { fontSize: 100, marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#e11d48', marginBottom: 10, fontFamily: 'Vazir' },
  subtitle: { fontSize: 18, color: '#4c0519', marginBottom: 30, fontFamily: 'Vazir' },
  card: { backgroundColor: '#ffe4e6', padding: 20, borderRadius: 15, marginBottom: 40, width: '100%', alignItems: 'center' },
  cardText: { fontSize: 16, color: '#be123c', fontFamily: 'Vazir', textAlign: 'center' },
  button: { backgroundColor: '#e11d48', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 25, elevation: 3 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold', fontFamily: 'Vazir' },
});
