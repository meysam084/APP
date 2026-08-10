import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { Audio } from 'expo-av';

const { width } = Dimensions.get('window');

// کلمات به همراه زمان‌بندی دقیق پخش به میلی‌ثانیه برای هایلایت شدن همزمان
const speechTimeline = [
  { text: "Welcome", start: 0, end: 1500 },
  { text: "to", start: 1500, end: 2200 },
  { text: "English", start: 2200, end: 3500 },
  { text: "twenty one", start: 3500, end: 5500 },
  { text: "lesson", start: 5500, end: 7000 },
];

export default function AudioVocabScreen({ navigation }: any) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);

  useEffect(() => {
    // بارگذاری فایل صوتی بخش صداها و حروف
    async function loadAudio() {
      const { sound: newSound } = await Audio.Sound.createAsync(
        require('../assets/Lesson1.mp3'), // مطمئن شوید این فایل صوتی در پوشه assets شما موجود است
        { shouldPlay: false }
      );
      setSound(newSound);

      // مانیتور کردن وضعیت پخش لحظه‌ای صوت
      newSound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded) {
          setCurrentPosition(status.positionMillis);
          if (status.didJustFinish) {
            setIsPlaying(false);
            setCurrentPosition(0);
          }
        }
      });
    }

    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const handlePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>آواها و کلمات 🗣️</Text>
      
      {/* باکس نمایش متن‌های پویا و هایلایت شونده */}
      <View style={styles.wordCard}>
        <ScrollView contentContainerStyle={styles.wordsContainer} horizontal showsHorizontalScrollIndicator={false}>
          {speechTimeline.map((item, index) => {
            // بررسی اینکه آیا زمان فعلی صوت در بازه این کلمه هست یا خیر
            const isHighlighted = currentPosition >= item.start && currentPosition < item.end;
            
            return (
              <Text 
                key={index} 
                style={[
                  styles.baseWordText, 
                  isHighlighted && styles.highlightedWordText
                ]}
              >
                {item.text} 
              </Text>
            );
          })}
        </ScrollView>
      </View>

      {/* پلیر کنترل پایینی */}
      <View style={styles.playerContainer}>
        <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
          <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶️"}</Text>
        </TouchableOpacity>
        <Text style={styles.infoText}>گوش کن و کلمات فعال رو همزمان ببین!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1e1b4b', marginBottom: 40, fontFamily: 'Vazir' },
  wordCard: { backgroundColor: '#fff', width: width * 0.9, padding: 30, borderRadius: 20, elevation: 4, alignItems: 'center', justifyContent: 'center', height: 150 },
  wordsContainer: { alignItems: 'center', flexDirection: 'row' },
  baseWordText: { 
  fontSize: 22, 
  color: '#9ca3af', 
  marginHorizontal: 8, 
  fontWeight: '500' 
  // ❌ خط transitionDuration: '0.2s' کاملا پاک شد
},
  highlightedWordText: { fontSize: 32, color: '#7c3aed', fontWeight: 'bold', transform: [{ scale: 1.1 }] },
  playerContainer: { marginTop: 50, alignItems: 'center' },
  playButton: { width: 75, height: 75, borderRadius: 37.5, backgroundColor: '#7c3aed', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  playIcon: { fontSize: 28, color: '#fff' },
  infoText: { marginTop: 20, fontSize: 14, color: '#6b7280', fontFamily: 'Vazir' }
});