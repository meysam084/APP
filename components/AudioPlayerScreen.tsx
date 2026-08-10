import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, ArrowRight } from 'lucide-react-native'; // نصب با دستور: npm i lucide-react-native

const { width } = Dimensions.get('window');

export default function AudioPlayerScreen() {
  const route: any = useRoute();
  const navigation = useNavigation();
  
  // گرفتن فایل صوتی و عنوان از نیوگیشن (اگر نبود مقدار پیش‌فرض می‌گذارد)
  const audioSource = route.params?.audio || require('../assets/Lesson1.mp3');
  const pageTitle = route.params?.title || "پخش‌کننده صوتی";

  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // بروزرسانی وضعیت زمان پخش صوتی
  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis || 1);

      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  // لود کردن موزیک در بدو ورود به صفحه
  useEffect(() => {
    async function loadAudio() {
      try {
        setIsLoading(true);
        // اگر صدایی از قبل مانده بود آن را خالی کن
        if (sound) {
          await sound.unloadAsync();
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          audioSource,
          { volume: 0.7, shouldPlay: false },
          onPlaybackStatusUpdate
        );
        
        setSound(newSound);
        setIsLoading(false);
      } catch (error) {
        console.log('Error loading audio:', error);
        setIsLoading(false);
      }
    }

    loadAudio();

    // پاکسازی و متوقف کردن موزیک هنگام خروج از صفحه
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioSource]);

  // تابع پخش و توقف
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

  // جلو بردن موزیک (به اندازه ۱۰ ثانیه)
  const handleSkipForward = async () => {
    if (!sound) return;
    const newPosition = Math.min(position + 10000, duration);
    await sound.setPositionAsync(newPosition);
  };

  // عقب بردن موزیک (به اندازه ۱۰ ثانیه)
  const handleSkipBackward = async () => {
    if (!sound) return;
    const newPosition = Math.max(position - 10000, 0);
    await sound.setPositionAsync(newPosition);
  };

  // ریست کردن موزیک از اول
  const handleReset = async () => {
    if (!sound) return;
    await sound.setPositionAsync(0);
    if (!isPlaying) {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  // تبدیل میلی‌ثانیه به فرمت زمان معمولی (00:00)
  const formatTime = (millis: number) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // محاسبه درصد پیشرفت نوار پلی‌بک
  const progressPercent = (position / duration) * 100;

  return (
    <View style={styles.container}>
      {/* هدر بالایی برای بازگشت */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowRight color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{pageTitle}</Text>
        <View style={{ width: 24 }} /> {/* برای بالانس شدن هدر */}
      </View>

      {/* بخش افکت ظاهری وسط صفحه */}
      <View style={styles.centerSection}>
        <View style={[styles.avatarContainer, isPlaying && styles.playingAnimation]}>
          <Text style={styles.playerIcon}>🎵</Text>
        </View>
        <Text style={styles.subtitle}>English 21 Listening</Text>
      </View>

      {/* لودینگ در صورت عدم بارگذاری فایل صوتی */}
      {isLoading ? (
        <ActivityIndicator size="large" color="#8B5CF6" />
      ) : (
        <>
          {/* نوار وضعیت پیشرفت پروژه */}
          <View style={styles.progressContainer}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>

          {/* دکمه‌های کنترل موسیقی */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity onPress={handleReset} style={styles.subControlBtn}>
              <RotateCcw color="#A0A0B0" size={24} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkipBackward} style={styles.subControlBtn}>
              <SkipBack color="#fff" size={28} />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
              {isPlaying ? <Pause color="#fff" size={36} fill="#fff" /> : <Play color="#fff" size={36} fill="#fff" style={{ marginLeft: 5 }} />}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleSkipForward} style={styles.subControlBtn}>
              <SkipForward color="#fff" size={28} />
            </TouchableOpacity>

            <View style={{ width: 40 }} /> {/* بالانس منو */}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2E', // تم تاریک شیک مخصوص مدیا پلیر
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#2D2D44',
    borderRadius: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'VazirBold',
  },
  centerSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarContainer: {
    width: width * 0.5,
    height: width * 0.5,
    backgroundColor: '#2D2D44',
    borderRadius: (width * 0.5) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#3D3D5C',
  },
  playingAnimation: {
    borderColor: '#8B5CF6',
    transform: [{ scale: 1.03 }],
  },
  playerIcon: {
    fontSize: 70,
  },
  subtitle: {
    fontSize: 18,
    color: '#A0A0B0',
    fontFamily: 'Vazir',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width * 0.85,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#383850',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 14,
    width: 45,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    width: width * 0.9,
    marginBottom: 20,
  },
  playButton: {
    width: 75,
    height: 75,
    backgroundColor: '#8B5CF6',
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  subControlBtn: {
    padding: 12,
    backgroundColor: '#2D2D44',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});