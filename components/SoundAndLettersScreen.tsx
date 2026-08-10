import React, { useRef, useState, useEffect } from "react";
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get("window");

// زمان‌بندی دقیق کلمات ویدیو به میلی‌ثانیه برای هایلایت شدن همزمان با ویدیو تدریس صداها
const speechTimeline = [
  { text: "Welcome", start: 0, end: 1500 },
  { text: "to", start: 1500, end: 2200 },
  { text: "English", start: 2200, end: 3500 },
  { text: "twenty one", start: 3500, end: 5500 },
  { text: "lesson", start: 5500, end: 7000 },
  { text: "one", start: 7000, end: 8500 },
  { text: "phonics", start: 8500, end: 11000 },
];

export default function SoundAndLettersScreen() {
  const navigation = useNavigation();
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPos, setCurrentPos] = useState(0);
  const [sliderValue, setSliderValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const togglePlayback = async () => {
    if (!videoRef.current) return;
    if (status.isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
  };

  const onSlidingComplete = async (value: number) => {
    if (!videoRef.current || !status.durationMillis) return;
    const seekPosition = value * status.durationMillis;
    await videoRef.current.setPositionAsync(seekPosition);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>صداها و حروف 🗣️</Text>

      {/* بخش پخش ویدیو */}
      <View style={styles.videoWrapper}>
        <Video
          ref={videoRef}
          source={require("../assets/video/sound.mp4")} // ویدیو اختصاصی بخش حروف و صداها
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          onPlaybackStatusUpdate={(s) => {
            setStatus(s);
            if (s.isLoaded) {
              setIsLoading(false);
              setIsPlaying(s.isPlaying);
              setCurrentPos(s.positionMillis);
              setSliderValue(s.positionMillis / (s.durationMillis || 1));
            }
          }}
        />
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#7c3aed" />
          </View>
        )}
      </View>

      {/* نوار کنترل اسلایدر زمان ویدیو */}
      <View style={styles.sliderRow}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={sliderValue}
          minimumTrackTintColor="#7c3aed"
          maximumTrackTintColor="#d1d5db"
          thumbTintColor="#7c3aed"
          onSlidingComplete={onSlidingComplete}
        />
      </View>

      {/* بخش بسیار جذاب متن هوشمند و همگام با ویدیو */}
      <View style={styles.textContainerCard}>
        <ScrollView contentContainerStyle={styles.wordsWrapper} showsVerticalScrollIndicator={false}>
          {speechTimeline.map((item, index) => {
            const isCurrent = currentPos >= item.start && currentPos < item.end;
            return (
              <Text
                key={index}
                style={[
                  styles.baseWordText,
                  isCurrent && styles.highlightedWordText
                ]}
              >
                {item.text}
              </Text>
            );
          })}
        </ScrollView>
      </View>

      {/* کنترلر پخش پایینی */}
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.circlePlayBtn} onPress={togglePlayback}>
          <Text style={styles.playText}>{isPlaying ? "⏸" : "▶️"}</Text>
        </TouchableOpacity>
        <Text style={styles.helperText}>همزمان با ویدیو متن رو دنبال کن!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', alignItems: 'center', padding: 20 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1e1b4b', marginBottom: 15, fontFamily: 'Vazir' },
  videoWrapper: { width: '100%', height: 210, backgroundColor: '#000', borderRadius: 15, overflow: 'hidden', elevation: 5 },
  video: { width: '100%', height: '100%' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  sliderRow: { 
  width: '100%', 
  marginVertical: 10, // 👈 به جای my: 10 این خط را جایگزین کنید
  alignItems: 'center' 
},
  slider: { width: width * 0.9, height: 40 },
  textContainerCard: { flex: 1, width: '100%', backgroundColor: '#fff', borderRadius: 20, padding: 20, marginVertical: 15, elevation: 3 },
  wordsWrapper: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 12 },
  baseWordText: { fontSize: 20, color: '#9ca3af', fontWeight: '500', fontFamily: 'Vazir' },
  highlightedWordText: { 
  fontSize: 28, 
  color: '#7c3aed', 
  fontWeight: 'bold', 
  transform: [{ scale: 1.1 }] // 👈 مشکل اینجا بود؛ مقیاس باید داخل آرایه transform باشد
},
  controlsRow: { width: '100%', alignItems: 'center', paddingBottom: 10 },
  circlePlayBtn: { width: 65, height: 65, borderRadius: 32.5, backgroundColor: '#7c3aed', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  playText: { fontSize: 26, color: '#fff' },
  helperText: { marginTop: 10, color: '#6b7280', fontSize: 13, fontFamily: 'Vazir' }
});