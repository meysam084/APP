import React, { useState, useEffect, useContext, createContext  } from 'react';
import { ThemeProvider } from './ThemeContext'; // مطمئن شوید آدرس فایل کانتکست درست است
import { Easing } from 'react-native';
import { useRef } from 'react';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Alert,
  Animated
} from 'react-native';
import AppText from './components/AppText'

import { ActivityIndicator, } from 'react-native';
import {  useTheme } from './ThemeContext';
import VocabChallengeScreen from './components/VocabChallengeScreen';
import GrammarBossScreen from './components/GrammarBossScreen';
import AudioPlayerScreen from './components/AudioPlayerScreen';
import QuizScreen from './components/QuizScreen';
import StreakScreen from './components/StreakScreen';
import SplashScreen from './components/SplashScreen';
import ShopScreen from './components/ShopScreen';
import AvatarCreatorScreen from './AvatarCreatorScreen';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFonts } from 'expo-font'
import { Switch } from 'react-native';
import { Settings as SettingsIcon } from 'lucide-react-native';

import { LinearGradient } from 'expo-linear-gradient';
import * as ScreenCapture from 'expo-screen-capture';

import {
  Home,
  PlayCircle,
  User,
  GraduationCap,
  ArrowRight,
  Video as VideoIcon,
  Languages,
  Activity,
  Mic2,
  Headset,
  ChevronLeft,
  Trophy,
  BookOpen,
  Book,
  ClipboardCheck,
  Crown
} from 'lucide-react-native';
import VideoPlayerScreen from "./components/VideoPlayer";
   import ProfileScreen from './components/ProfileScreen';


import LoginScreen from './components/LoginScreen';
const { width } = Dimensions.get('window');





const Tab = createBottomTabNavigator();

import { db } from './firebaseConfig';
import { Video, ResizeMode } from 'expo-av';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import MyWordsScreen from './MyWordsScreen';
import CourseSelectionScreen from './CourseSelectionScreen';
import AudioVocabScreen from './components/AudioVocabScreen';
import SoundAndLettersScreen from './components/SoundAndLettersScreen';


// تعریف Context برای گیمیفیکیشن
export const GamificationContext = createContext<any>(null);

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const [coins, setCoins] = useState(150);
  const [streak, setStreak] = useState(3);

  return (
    <GamificationContext.Provider value={{ coins, setCoins, streak, setStreak }}>
      {children}
    </GamificationContext.Provider>
  );
}

// --- کامپوننت دکمه‌های جذاب برای نوجوانان ---
const DetailButton = ({ title, icon: IconComponent, color, emoji, onPress }: any) => (
  <TouchableOpacity style={styles.detailBtn} onPress={onPress}>
    <LinearGradient colors={[color, color + 'DD']} style={styles.detailBtnGradient}>
      <View style={styles.iconCircle}>
        <IconComponent color={color} size={24} />
      </View>
      <Text style={styles.detailBtnText}>{title} {emoji}</Text>
      <ChevronLeft color="#fff" size={20} />
    </LinearGradient>
  </TouchableOpacity>
);

// --- ۱. صفحه اختصاصی هر درس (با ۶ بخش جذاب) ---
const LessonDetailsScreen = ({ route, navigation }: any) => {
  const { title } = route.params;
  
  return (
    <View style={styles.container}>
      <LinearGradient colors={['#a855f7', '#7c3aed']} style={styles.headerDetail}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#fff" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitleDetail}>{title} 📚</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.detailScroll}>
        <DetailButton title="ویدیو آموزشی" emoji="📺" icon={Video} color="#6366f1" />
        <DetailButton title="انیمیشن مکالمه" emoji="💬" icon={Languages} color="#8b5cf6" />
        <DetailButton title="انیمیشن تمرین" emoji="🎮" icon={Activity} color="#ec4899" />
        <DetailButton title="بخش Sound and Letters" emoji="🔤" icon={Mic2} color="#f59e0b" />
        <DetailButton title="فایل صوتی Listening" emoji="🎧" icon={Headset} color="#10b981" />
        {/* بخش آزمون که اضافه شد */}
        <DetailButton 
          title="آزمون آنلاین" 
          emoji="🏆" 
          icon={Trophy} 
          color="#ef4444" 
          onPress={() => Alert.alert("آماده‌ای؟", "بزن بریم برای کسب مدال طلا! 🥇")}
        />
      </ScrollView>
    </View>
  );
};

// --- ۲. کارت‌های دروس در صفحه اصلی ---
const AdvancedVideoCard = ({ title, colors, navigation, emoji }: any) => (
  <TouchableOpacity 
    style={styles.videoWrapper} 
    onPress={() => navigation.navigate('LessonDetails', { title })}
  >
    <LinearGradient colors={colors} style={styles.videoCard}>
      <Text style={styles.cardEmoji}>{emoji}</Text>
      <Text style={styles.videoCardText}>{title}</Text>
      <View style={styles.startBadge}>
        <Text style={styles.startBadgeText}>شروع کن 🚀</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);
const CourseViewer = ({ route, navigation }: any) => {
  const { lesson } = route.params;

  const sections = [
    {
      id: 1,
      title: "ویدیوی تدریس استاد",
      subtitle: "آموزش کامل درس 👨‍🏫",
      icon: <VideoIcon color="#fff" size={24} />,
      colors: ['#7c3aed', '#6d28d9'] as const,
      type: "main_video"
    },
    {
      id: 2,
      title: "انیمیشن مکالمه (Conversation)",
      subtitle: "دیدن و شنیدن مکالمه 💬",
      icon: <Languages color="#fff" size={24} />,
      colors: ['#10b981', '#059669'] as const,
      type: "conversation"
    },
    {
      id: 3,
      title: "انیمیشن تمرین‌ها (Practice)",
      subtitle: "حل تمرین‌های کلاسی ✍️",
      icon: <Activity color="#fff" size={24} />,
      colors: ['#f59e0b', '#d97706'] as const,
      type: "practice"
    },
    {
      id: 4,
      title: "قسمت Sound and Letters",
      subtitle: "تلفظ و متن همزمان 🔤",
      icon: <Mic2 color="#fff" size={24} />,
      colors: ['#ef4444', '#be123c'] as const,
      type: "letters"
    },
    {
      id: 5,
      title: "فایل‌های صوتی Listening",
      subtitle: "تقویت مهارت شنیداری 🎧",
      icon: <Headset color="#fff" size={24} />,
      colors: ['#3b82f6', '#1d4ed8'] as const,
      type: "audio"
    },
    {
      id: 6,
      title: "خودآزمایی و تست",
      subtitle: "سنجش یادگیری و دریافت مدال 🏆",
      icon: <Trophy color="#fff" size={24} />,
      colors: ['#8b5cf6', '#a855f7'] as const,
      type: "quiz"
    },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f0f6ff" }} showsVerticalScrollIndicator={false}>
      {/* هدر جذاب درس */}
      <LinearGradient colors={['#7c3aed', '#3b82f6']} style={styles.lessonHeaderV2}>
        <Text style={styles.lessonTitleV2}>{lesson.title} 📚</Text>
        <View style={styles.lessonSubBadgeV2}>
          <Text style={styles.lessonSubTextV2}>پایه {lesson.grade || 'هفتم'} — محتوای تعاملی</Text>
        </View>
      </LinearGradient>

      {/* ۶ کارت بخش محتوا */}
      <View style={{ padding: 20 }}>
        {sections.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.85}
            style={styles.modernActionCardV2}
            onPress={() => {
              if (item.type === 'letters') navigation.navigate('SoundAndLettersScreen', { lesson });
              else if (item.type === 'audio') navigation.navigate('AudioPlayerScreen', { lesson });
              else if (item.type === 'quiz') navigation.navigate('QuizScreen', { lesson });
              else if (item.type === 'conversation') {
                navigation.navigate("VideoPlayer", {
                  video: require("./assets/video/conversation.mp4"),
                  title: "انیمیشن مکالمه 💬"
                });
              } else if (item.type === 'practice') {
                navigation.navigate("VideoPlayer", {
                  video: require("./assets/video/practice.mp4"),
                  title: "انیمیشن تمرین‌ها ✍️"
                });
              } else {
                navigation.navigate("VideoPlayer", {
                  video: require("./assets/video/lesson1.mp4"),
                  title: "ویدیوی تدریس استاد 👨‍🏫"
                });
              }
            }}
          >
            <LinearGradient colors={item.colors} style={styles.iconBoxV2}>
              {item.icon}
            </LinearGradient>

            <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 15 }}>
              <Text style={styles.actionTextV2}>{item.title}</Text>
              <Text style={styles.actionSubTextV2}>{item.subtitle}</Text>
            </View>

            <ArrowRight color="#cbd5e1" size={20} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const GradeLessonsScreen = ({ route, navigation }: any) => {
  const { title, lessons } = route.params;
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  // 👈 چند رنگ شاد و ملایم (آبی، سبز، زرد، صورتی، بنفش)
  const funColors = ['#e0f2fe', '#dcfce7', '#fef3c7', '#fce7f3', '#f3e8ff'];
  const funBorders = ['#bae6fd', '#bbf7d0', '#fde047', '#fbcfe8', '#e9d5ff'];

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#f8fafc' }]}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', textAlign: 'right', marginBottom: 20, color: isDarkMode ? '#f8fafc' : '#1e293b' }}>
          لیست کامل {title}
        </Text>

        {/* 👈 اضافه شدن index برای انتخاب رنگ */}
        {lessons.map((lesson: any, index: number) => (
          <TouchableOpacity
            key={lesson.id}
            style={[
              styles.horizontalCard, 
              { 
                width: '100%', 
                marginBottom: 15, 
                alignSelf: 'center', 
                // اختصاص رنگ‌های شاد به پس‌زمینه و حاشیه کارت‌ها
                backgroundColor: isDarkMode ? '#1e293b' : funColors[index % funColors.length],
                borderWidth: 2,
                borderColor: isDarkMode ? '#334155' : funBorders[index % funBorders.length],
              }
            ]}
            onPress={() => navigation.navigate('CourseViewer', { lesson })}
          >
            <Image source={{ uri: lesson.image }} style={styles.cardImage} />
            <Text style={[styles.cardTitle, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>{lesson.title}</Text>
            <View style={{flexDirection: 'row-reverse', justifyContent: 'space-between', paddingHorizontal: 15, paddingBottom: 10}}>
              <Text style={styles.cardDuration}>{lesson.duration}</Text>
              <Text>{lesson.icon}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const VideosScreen = ({ navigation }: any) => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  // 🎨 پلت رنگ‌های شاد و متنوّع چندرنگ برای کارت‌های درس‌ها (با تایپ مشخص جهت جلوگیری از ارور TypeScript)
  const cardGradients: [string, string][] = [
    ['#8b5cf6', '#6366f1'], // بنفش به نیلی
    ['#ec4899', '#f43f5e'], // صورتی به قرمز
    ['#0ea5e9', '#2563eb'], // آبی آسمانی به آبی پررنگ
    ['#10b981', '#059669'], // سبز زمردی
    ['#f59e0b', '#d97706'], // نارنجی طلایی
    ['#a855f7', '#d946ef'], // بنفش روشن به ارغوانی
  ];

  const gradesData = [
    {
      title: 'پایه هفتم (Prospect 1) 🎒',
      color: '#10b981',
      lessons: [
        { id: '7-1', title: 'Lesson 1: My Name', duration: '12:00', icon: '👋' },
        { id: '7-2', title: 'Lesson 2: My Classmates', duration: '15:30', icon: '👦' },
        { id: '7-3', title: 'Lesson 3: My Age', duration: '14:15', icon: '🎂' },
        { id: '7-4', title: 'Lesson 4: My Family', duration: '16:45', icon: '👨‍👩‍👧‍👦' },
        { id: '7-5', title: 'Lesson 5: My Appearance', duration: '13:20', icon: '👀' },
        { id: '7-6', title: 'Lesson 6: My House', duration: '18:00', icon: '🏠' },
        { id: '7-7', title: 'Lesson 7: My Address', duration: '11:50', icon: '📍' },
        { id: '7-8', title: 'Lesson 8: My Favorite Food', duration: '17:10', icon: '🍕' },
      ]
    },
    {
      title: 'پایه هشتم (Prospect 2) 🏫',
      color: '#f59e0b',
      lessons: [
        { id: '8-1', title: 'Lesson 1: My Nationality', grade: 'هشتم', videoUrl: 'v', convAnim: 'c', pracAnim: 'p', soundLetters: 's', audioFile: 'a', icon: '🌍' },
        { id: '8-2', title: 'Lesson 3: My Abilities', grade: 'هشتم', videoUrl: 'v', icon: '⚡' },
      ]
    },
    {
      title: 'پایه نهم (Prospect 3) 🎓',
      color: '#ef4444',
      lessons: [
        { id: '9-1', title: 'Lesson 1: Personality', grade: 'نهم', videoUrl: 'v', convAnim: 'c', pracAnim: 'p', soundLetters: 's', audioFile: 'a', icon: '🧠' },
        { id: '9-2', title: 'Lesson 2: Travel', grade: 'نهم', videoUrl: 'v', icon: '✈️' },
      ]
    }
  ];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f0f6ff' }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 🌟 هدر بنر بالایی شاد و سه بعدی */}
      <LinearGradient 
        colors={['#7c3aed', '#3b82f6']} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerDetailV2}
      >
        <Text style={styles.headerTitleDetailV2}>کتابخانه جامع ویدیویی 📽️</Text>
        <Text style={styles.headerSubTitleV2}>ویدیوهای جذاب پایه هفتم، هشتم و نهم</Text>
      </LinearGradient>

      {/* 📚 لیست پایه‌ها و درس‌ها */}
      {gradesData.map((section, index) => (
        <View key={index} style={{ marginTop: 25 }}>
          <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 }}>
            <Text style={{ fontSize: 19, fontWeight: '900', color: isDarkMode ? '#ffffff' : '#1e1b4b', fontFamily: 'Vazir' }}>
              {section.title}
            </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('GradeLessons', { 
                title: section.title, 
                lessons: section.lessons 
              })}
              style={styles.viewAllBadge}
            >
              <Text style={{ color: section.color, fontWeight: 'bold', fontSize: 13 }}>مشاهده همه ←</Text>
            </TouchableOpacity>
          </View>

          {/* 🎡 اسکرول افقی کارت‌های هر درس با ترکیب رنگ اختصاصی */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20, paddingLeft: 10 }}>
            {section.lessons.map((lesson: any, lessonIdx: number) => {
              // اختصاص چرخشی رنگ گرادیانت برای هر کارت
              const gradientColors = cardGradients[lessonIdx % cardGradients.length];

              return (
                <TouchableOpacity
                  key={lesson.id}
                  activeOpacity={0.85}
                  style={[styles.horizontalVideoCardV2, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }]}
                  onPress={() => navigation.navigate('CourseViewer', { lesson })}
                >
                  <LinearGradient colors={gradientColors} style={styles.cardVideoIconV2}>
                    <PlayCircle color="#fff" size={36} />
                    <Text style={styles.cardEmojiTag}>{lesson.icon || '🎬'}</Text>
                  </LinearGradient>

                  <View style={{ padding: 10, width: '100%', alignItems: 'center' }}>
                    <Text style={[styles.cardTitleV2, { color: isDarkMode ? '#ffffff' : '#1e293b' }]} numberOfLines={1}>
                      {lesson.title}
                    </Text>
                    <View style={styles.contentBadgeV2}>
                      <Text style={styles.contentBadgeText}>۶ بخش کامل 🎮</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      ))}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};


export const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// این کامپوننت جدید، وضعیت تاریک و روشن را در حافظه خود نگه می‌دارد
export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

const MainApp = () => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';
  // دریافت سکه و آتش از Context
  const { coins, streak } = useContext(GamificationContext);

  return (
    <Tab.Navigator
      initialRouteName="اصلی"
      screenOptions={({ navigation }) => ({
        tabBarActiveTintColor: '#7c3aed',
        headerTitle: "English 21",
        headerTitleAlign: 'center',
        
        // 👇 نمایش کپسول منسجم و شکیل سکه و استریک در سمت راست هدر مطابق طرح اصلی شما
       // 👇 نمایش کپسول منسجم و شکیل سکه و استریک در سمت راست هدر مطابق طرح اصلی شما
       headerRight: () => (
          <View style={{
            flexDirection: 'row-reverse',
            backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
            paddingVertical: 5,
            paddingHorizontal: 12,
            borderRadius: 20,
            alignItems: 'center',
            marginRight: 15,
            borderWidth: 1,
            borderColor: isDarkMode ? '#334155' : '#e2e8f0'
          }}>
            {/* بخش شعله استریک */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('Streak')} 
              style={{ flexDirection: 'row-reverse', alignItems: 'center' }}
            >
              <Text style={{ fontSize: 16 }}>🔥</Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold', marginRight: 4, color: isDarkMode ? '#f8fafc' : '#1e293b' }}>
                {streak}
              </Text>
            </TouchableOpacity>

            {/* خط جداکننده */}
            <View style={{ width: 1, height: 14, backgroundColor: isDarkMode ? '#475569' : '#cbd5e1', marginHorizontal: 10 }} />

            {/* بخش سکه */}
            <TouchableOpacity 
              onPress={() => navigation.navigate('Shop')} 
              style={{ flexDirection: 'row-reverse', alignItems: 'center' }}
            >
              <Text style={{ fontSize: 16 }}>🪙</Text>
              <Text style={{ fontSize: 15, fontWeight: 'bold', marginRight: 4, color: '#d97706' }}>
                {coins}
              </Text>
            </TouchableOpacity>
          </View>
        ),
      })}
    >
      {/* تب پروفایل در سمت چپ */}
      <Tab.Screen 
        name="پروفایل" 
        component={ProfileScreen} 
        options={{ tabBarIcon: ({color}) => <User color={color} size={24} /> }} 
      />
      
      {/* تب جدید: لغات من */}
      <Tab.Screen 
        name="لغات من" 
        component={CourseSelectionScreen} 
        options={{ tabBarIcon: ({color}) => <Book color={color} size={24} /> }} 
      />
      
      {/* تب ویدیوها */}
      <Tab.Screen 
        name="ویدیوها" 
        component={VideosScreen} 
        options={{ tabBarIcon: ({color}) => <GraduationCap color={color} size={24} /> }} 
      />
      
      {/* تب اصلی در سمت راست (تب پیش‌فرض) */}
      <Tab.Screen 
        name="اصلی" 
        component={HomeScreen} 
        options={{ tabBarIcon: ({color}) => <Home color={color} size={24} /> }} 
      />
    </Tab.Navigator>
  );
};
const VoicePracticeCard = ({ word = "Serendipity" }) => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // ۱. تابع تلفظ لغت (معلم)
  const speakWord = () => {
    // سرعت رو 0.8 گذاشتیم تا بچه‌ها واضح‌تر بشنوند
    Speech.speak(word, { language: 'en-US', rate: 0.8 }); 
  };

  // ۲. شروع ضبط صدای کاربر
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // ۳. پایان ضبط صدا
  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    
    if (uri) {
      // آماده‌سازی صدا برای پخش
      const { sound } = await Audio.Sound.createAsync({ uri });
      setSound(sound);
    }
    setRecording(null);
  };

  // ۴. پخش صدای ضبط شده کاربر
  const playMyVoice = async () => {
    if (sound) {
      await sound.playAsync();
    }
  };

  return (
    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 20, elevation: 3, alignItems: 'center', marginVertical: 10 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1e293b', marginBottom: 15 }}>{word}</Text>
      
      <View style={{ flexDirection: 'row-reverse', gap: 15 }}>
        {/* دکمه تلفظ معلم */}
        <TouchableOpacity onPress={speakWord} style={{ backgroundColor: '#3b82f6', padding: 15, borderRadius: 50 }}>
          <Text style={{ fontSize: 20 }}>📢</Text>
        </TouchableOpacity>

        {/* دکمه ضبط صدا */}
        <TouchableOpacity 
          onPressIn={startRecording} // نگه داشتن دکمه برای ضبط
          onPressOut={stopRecording} // رها کردن دکمه برای پایان
          style={{ backgroundColor: isRecording ? '#ef4444' : '#ecfdf5', padding: 15, borderRadius: 50, borderWidth: 2, borderColor: isRecording ? '#ef4444' : '#10b981' }}
        >
          <Text style={{ fontSize: 20 }}>{isRecording ? '⏺️' : '🎙️'}</Text>
        </TouchableOpacity>

        {/* دکمه پخش صدای کاربر (فقط اگه صدایی ضبط شده باشه نشون داده میشه) */}
        {sound && (
          <TouchableOpacity onPress={playMyVoice} style={{ backgroundColor: '#a855f7', padding: 15, borderRadius: 50 }}>
            <Text style={{ fontSize: 20 }}>▶️</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={{ color: '#64748b', fontSize: 12, marginTop: 10 }}>
        {isRecording ? 'در حال ضبط... رها کنید تا قطع شود' : 'برای ضبط صدات، دکمه میکروفون رو نگه دار'}
      </Text>
    </View>
  );
};


const AdminPanel = ({ navigation }: any) => {
  const [lessonData, setLessonData] = useState({
    title: '',
    grade: 'هفتم',
    videoUrl: '',
    convAnim: '',
    pracAnim: '',
    soundLetters: '',
    audioFile: ''
  });

  const handleUpload = async () => {
    // چک کردن پر بودن فیلد اصلی
    if (!lessonData.title || !lessonData.videoUrl) {
      Alert.alert("استاد عزیز! ⚠️", "لطفاً حداقل عنوان و لینک ویدیو رو وارد کنید.");
      return;
    }

    try {
      await addDoc(collection(db, "Lessons"), {
  ...lessonData,
  adminKey: "mySecretKey", // این کلید باید با اونی که در Rules نوشتی یکی باشه
  createdAt: serverTimestamp(),
});
      Alert.alert("ایول! 🎉", "محتوا با موفقیت برای دانش‌آموزان منتشر شد.");
      navigation.goBack();
    } catch (e) {
      Alert.alert("خطا در آپلود ❌", "ارتباط با فایربیس برقرار نشد.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#1e293b', '#0f172a']} style={styles.headerDetail}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color="#fff" size={30} />
        </TouchableOpacity>
        <Text style={styles.headerTitleDetail}>پنل انتشار محتوا 🛠️</Text>
      </LinearGradient>

      <View style={{ padding: 20 }}>
        <Text style={styles.adminLabel}>انتخاب پایه تحصیلی:</Text>
        <View style={styles.gradePicker}>
          {['هفتم', 'هشتم', 'نهم'].map((g) => (
            <TouchableOpacity 
              key={g} 
              style={[styles.adminGradeBtn, lessonData.grade === g && styles.activeAdminGrade]}
              onPress={() => setLessonData({...lessonData, grade: g})}
            >
              <Text style={{color: lessonData.grade === g ? '#fff' : '#1e293b'}}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput placeholder="عنوان درس (مثلاً: درس سوم - سفر)" style={styles.adminInput} onChangeText={(t) => setLessonData({...lessonData, title: t})} />
        <TextInput placeholder="🔗 لینک ویدیو آموزشی" style={styles.adminInput} onChangeText={(t) => setLessonData({...lessonData, videoUrl: t})} />
        <TextInput placeholder="🔗 لینک انیمیشن مکالمه" style={styles.adminInput} onChangeText={(t) => setLessonData({...lessonData, convAnim: t})} />
        <TextInput placeholder="🔗 لینک انیمیشن تمرین" style={styles.adminInput} onChangeText={(t) => setLessonData({...lessonData, pracAnim: t})} />
        <TextInput placeholder="🔗 لینک Sound and Letters" style={styles.adminInput} onChangeText={(t) => setLessonData({...lessonData, soundLetters: t})} />
        <TextInput placeholder="🔗 لینک فایل صوتی Listening" style={styles.adminInput} onChangeText={(t) => setLessonData({...lessonData, audioFile: t})} />

        <TouchableOpacity style={styles.uploadBtn} onPress={handleUpload}>
          <Text style={styles.loginBtnText}>تایید و انتشار نهایی 🚀</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// بقیه ایمپورت‌های شما...

const Stack = createNativeStackNavigator();

export default function App() {
  // بارگذاری دقیق فونت‌های داخل پوشه assets/fonts
  const [fontsLoaded] = useFonts({
    'Vazir': require('./assets/fonts/Vazirmatn-Regular.ttf'),
    'VazirBold': require('./assets/fonts/Vazirmatn-Bold.ttf'),
    'Shabnam': require('./assets/fonts/Shabnam-Light-FD.ttf'),
    'ShabnamBold': require('./assets/fonts/Shabnam-Bold-FD.ttf'),
    'Yekan': require('./assets/fonts/BYekan+.ttf'),
    'YekanBold': require('./assets/fonts/BYekan+ Bold.ttf'),
  });

  // تا زمانی که فونت‌ها کاملا لود بشن یه لودینگ تمیز نشون میده
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f6ff' }}>
        <ActivityIndicator size="large" color="#7c3aed" />
      </View>
    );
  }

  return (
<AppThemeProvider>
        <GamificationProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen 
  name="Splash" 
  component={SplashScreen} 
  options={{ headerShown: false }} 
/>
                <Stack.Screen name="GradeLessons" component={GradeLessonsScreen} options={{ title: 'لیست درس‌ها' }} />
<Stack.Screen name="CourseSelection" component={CourseSelectionScreen} />
<Stack.Screen name="AudioVocabScreen" component={AudioVocabScreen} />
<Stack.Screen name="MyWordsScreen" component={MyWordsScreen} />
<Stack.Screen name="AudioPlayerScreen" component={AudioPlayerScreen} />
<Stack.Screen name="QuizScreen" component={QuizScreen} />
<Stack.Screen 
  name="SoundAndLettersScreen" 
  component={SoundAndLettersScreen} 
  options={{ title: 'صداها و حروف 🗣️', headerTitleAlign: 'center' }} 
/>
<Stack.Screen name="Shop" component={ShopScreen} options={{ title: 'فروشگاه' }} />
        <Stack.Screen name="Streak" component={StreakScreen} options={{ title: 'استریک' }} />
        <Stack.Screen name="AudioPlayer" component={AudioPlayerScreen} options={{ title: 'پخش صدا' }} />
<Stack.Screen name="AvatarCreator" component={AvatarCreatorScreen} options={{ headerShown: false }} />
           <Stack.Screen name="VocabChallenge" component={VocabChallengeScreen} />
    <Stack.Screen name="GrammarBoss" component={GrammarBossScreen} />
          <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
        <Stack.Screen name="DailyQuizScreen" component={DailyQuizScreen} />
          <Stack.Screen name="VipScreen" component={VipScreen} />
          <Stack.Screen name="ProgressReportScreen" component={ProgressReportScreen} />
          <Stack.Screen name="LibraryScreen" component={LibraryScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="CourseViewer" component={CourseViewer} />
          <Stack.Screen name="AdminPanel" component={AdminPanel} />
          <Stack.Screen name="MainApp" component={MainApp} />
          <Stack.Screen name="LessonDetails" component={LessonDetailsScreen} />
         </Stack.Navigator>
        </NavigationContainer>
      </GamificationProvider>
    </AppThemeProvider>
  );
}








const SimpleVideoCard = ({ title, colors }: any) => (
  <View style={styles.simpleCard}>
    <LinearGradient colors={colors} style={styles.videoCard}>
      <PlayCircle color="#fff" size={35} />
      <Text style={styles.videoCardText}>{title}</Text>
    </LinearGradient>
  </View>
);
// ----------------------------
//  صفحات placeholder
// ----------------------------
const VipScreen = ({ navigation }: any) => (
  <LinearGradient colors={['#fef3c7', '#f59e0b']} style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
    <Text style={{ fontSize: 90 }}>👑</Text>
    <Text style={{ fontSize: 32, fontWeight: '900', color: '#78350f', marginTop: 20, fontFamily: 'Vazir' }}>بخش ویژه VIP</Text>
    <Text style={{ fontSize: 16, color: '#92400e', textAlign: 'center', marginTop: 10, fontFamily: 'Vazir', fontWeight: 'bold' }}>به زودی کلی امکانات خفن و دسترسی‌های نامحدود به اینجا اضافه میشه! 🚀</Text>
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 30, backgroundColor: '#78350f', padding: 15, borderRadius: 20, width: '80%', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>بازگشت</Text>
    </TouchableOpacity>
  </LinearGradient>
);

const ProgressReportScreen = ({ navigation }: any) => (
  <LinearGradient colors={['#dcfce7', '#10b981']} style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
    <Text style={{ fontSize: 90 }}>📈</Text>
    <Text style={{ fontSize: 32, fontWeight: '900', color: '#064e3b', marginTop: 20, fontFamily: 'Vazir' }}>کارنامه من</Text>
    <Text style={{ fontSize: 16, color: '#065f46', textAlign: 'center', marginTop: 10, fontFamily: 'Vazir', fontWeight: 'bold' }}>اینجا می‌تونی پیشرفتت رو ببینی. در حال آماده‌سازی نمودارها هستیم! 📊</Text>
    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 30, backgroundColor: '#064e3b', padding: 15, borderRadius: 20, width: '80%', alignItems: 'center' }}>
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>بازگشت</Text>
    </TouchableOpacity>
  </LinearGradient>
);

const LibraryScreen = ({ navigation }: any) => {
  const isDarkMode = false; // می‌توانید از ThemeContext استفاده کنید

  return (
    <ScrollView style={[styles.libraryContainer, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]}>
      <LinearGradient colors={['#8b5cf6', '#6d28d9']} style={styles.libraryHeader}>
        <Text style={{ fontSize: 50 }}>📚</Text>
        <Text style={styles.libraryHeaderTitle}>کتابخانه هوشمند</Text>
      </LinearGradient>
      
      <Text style={[styles.librarySectionTitle, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>کتاب‌های درسی 🎒</Text>
      
      {['هفتم (Prospect 1)', 'هشتم (Prospect 2)', 'نهم (Prospect 3)'].map((book, index) => {
        const colors = ['#10b981', '#f59e0b', '#ef4444'];
        return (
          <TouchableOpacity key={index} style={[styles.libraryCard, { borderRightColor: colors[index], borderRightWidth: 8 }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.libraryCardTitle}>کتاب پایه {book}</Text>
              <Text style={styles.libraryCardSub}>دانلود فایل PDF کتاب درسی 📥</Text>
            </View>
            <Text style={{ fontSize: 30 }}>📖</Text>
          </TouchableOpacity>
        );
      })}

      <Text style={[styles.librarySectionTitle, { color: isDarkMode ? '#f8fafc' : '#1e293b', marginTop: 25 }]}>نمونه سوالات امتحانی 📝</Text>
      
      {['هفتم', 'هشتم', 'نهم'].map((grade, index) => (
        <TouchableOpacity key={index} style={[styles.libraryCard, { borderRightColor: '#6366f1', borderRightWidth: 8 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.libraryCardTitle}>فایل امتحانات پایه {grade}</Text>
            <Text style={styles.libraryCardSub}>سوالات نوبت اول و دوم + پاسخنامه 💡</Text>
          </View>
          <Text style={{ fontSize: 30 }}>📄</Text>
        </TouchableOpacity>
      ))}
      <View style={{height: 100}} />
    </ScrollView>
  );
};

// ----------------------------
//     نسخه جدید HomeScreen
// ----------------------------
const HomeScreen = ({ navigation }: any) => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f0f6ff' }]}
      showsVerticalScrollIndicator={false}
    >
      {/* 🌟 بنر خوش‌آمدگویی هدر */}
      <LinearGradient 
        colors={['#7c3aed', '#3b82f6']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        style={styles.heroBanner}
      >
        <View style={styles.heroBadge}>
          <Text style={styles.heroBadgeText}>سطح فعال: قهرمان 🌟</Text>
        </View>
        <Text style={styles.heroBannerTitle}>سلام قهرمان! 👋</Text>
        <Text style={styles.heroBannerSub}>آماده‌ای امروز یه قدم به انگلیسی مسلط‌تر بشی؟ 🚀</Text>
      </LinearGradient>

      {/* 🔥 بخش پیشنهاد ویژه امروز */}
      <View style={{ paddingHorizontal: 20, marginTop: 25 }}>
        <Text style={[styles.sectionTitleHeader, { color: isDarkMode ? '#f8fafc' : '#1e1b4b' }]}>
          پیشنهاد ویژه امروز 🔥
        </Text>

        {/* کارت بنفش چالش لغات جدید */}
        <TouchableOpacity 
          activeOpacity={0.85}
          style={styles.cardChallengePurple}
          onPress={() => navigation.navigate('VocabChallenge')}
        >
          <LinearGradient colors={['#8b5cf6', '#6d28d9']} style={styles.cardGradientInternal}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.emojiCircleBg}>
                <Text style={{ fontSize: 26 }}>🧠</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 12 }}>
                <Text style={styles.cardTitleMain}>چالش لغات جدید</Text>
                <Text style={styles.cardSubMain}>یادگیری لغات پرکاربرد با بازی</Text>
              </View>
            </View>
            <View style={styles.cardFooterAction}>
              <Text style={styles.cardActionText}>شروع چالش 🚀</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* کارت قرمز/زرشکی مبارزه با غول گرامر */}
        <TouchableOpacity 
          activeOpacity={0.85}
          style={styles.cardChallengeRed}
          onPress={() => navigation.navigate('GrammarBoss')}
        >
          <LinearGradient colors={['#f43f5e', '#be123c']} style={styles.cardGradientInternal}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.emojiCircleBg}>
                <Text style={{ fontSize: 26 }}>👹</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 12 }}>
                <Text style={styles.cardTitleMain}>مبارزه با غول گرامر</Text>
                <Text style={styles.cardSubMain}>تست‌های سریع و دریافت سکه</Text>
              </View>
            </View>
            <View style={styles.cardFooterAction}>
              <Text style={styles.cardActionText}>نبرد با غول ⚔️</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* 🟩 مسیر یادگیری */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <Text style={[styles.sectionTitleHeader, { color: isDarkMode ? '#f8fafc' : '#1e1b4b' }]}>
          مسیر یادگیری 🚀
        </Text>

        <View style={[styles.learningPathCardV2, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }]}>
          <View style={styles.pathHeaderRow}>
            <View style={styles.unitBadge}><Text style={styles.unitBadgeText}>Unit 1</Text></View>
            <Text style={[styles.pathTitleV2, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>سلام و معرفی 👋</Text>
          </View>
          <View style={styles.progressBarBgV2}>
            <LinearGradient colors={['#a855f7', '#6366f1']} style={{ width: '30%', height: '100%', borderRadius: 10 }} />
          </View>
          <Text style={styles.pathSmallTextV2}>۳۰٪ تکمیل شده ✨</Text>
        </View>

        <View style={[styles.learningPathCardV2, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }]}>
          <View style={styles.pathHeaderRow}>
            <View style={[styles.unitBadge, { backgroundColor: '#3b82f6' }]}><Text style={styles.unitBadgeText}>Unit 2</Text></View>
            <Text style={[styles.pathTitleV2, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>اعداد و زمان ⏰</Text>
          </View>
          <View style={styles.progressBarBgV2}>
            <LinearGradient colors={['#3b82f6', '#06b6d4']} style={{ width: '10%', height: '100%', borderRadius: 10 }} />
          </View>
          <Text style={styles.pathSmallTextV2}>۱۰٪ تکمیل شده ✨</Text>
        </View>
      </View>

      {/* 🟦 کوییز روزانه */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <Text style={[styles.sectionTitleHeader, { color: isDarkMode ? '#f8fafc' : '#1e1b4b' }]}>
          کوییز روزانه 🎯
        </Text>

        <TouchableOpacity 
          activeOpacity={0.8}
          style={styles.dailyQuizBoxV2}
          onPress={() => navigation.navigate('DailyQuizScreen')}
        >
          <LinearGradient colors={['#0ea5e9', '#2563eb']} style={styles.dailyQuizGradient}>
            <Text style={{ fontSize: 40, marginLeft: 15 }}>💡</Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text style={styles.dailyQuizTitleV2}>بزن بریم! امروز ۵ سؤال داری</Text>
              <Text style={styles.dailyQuizSubV2}>با هر کوییز ۵ سکه جایزه بگیر 🪙</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* ✨ منوی جادویی رنگی */}
<View style={{ paddingHorizontal: 20, marginTop: 25, marginBottom: 40 }}>
  <Text style={[styles.sectionTitleHeader, { color: isDarkMode ? '#f8fafc' : '#1e1b4b' }]}>
    منوی جادویی ✨
  </Text>

  <View style={styles.toolGridV2}>
    {/* VIP - کارت طلایی/نارنجی */}
    <TouchableOpacity 
      activeOpacity={0.85}
      style={styles.toolCardV2Colored}
      onPress={() => navigation.navigate("VipScreen")}
    >
      <LinearGradient colors={['#fde047', '#eab308']} style={styles.toolGradientV2}>
        <View style={styles.toolIconCircleV2Colored}>
          <Crown color="#78350f" size={28} />
        </View>
        <Text style={styles.toolTextV2Dark}>اشتراک VIP 💎</Text>
      </LinearGradient>
    </TouchableOpacity>

    {/* Progress - کارت سبزرنگ */}
    <TouchableOpacity 
      activeOpacity={0.85}
      style={styles.toolCardV2Colored}
      onPress={() => navigation.navigate("ProgressReportScreen")}
    >
      <LinearGradient colors={['#4ade80', '#10b981']} style={styles.toolGradientV2}>
        <View style={styles.toolIconCircleV2Colored}>
          <ClipboardCheck color="#064e3b" size={28} />
        </View>
        <Text style={styles.toolTextV2Light}>کارنامه 📊</Text>
      </LinearGradient>
    </TouchableOpacity>

    {/* Library - کارت نیلی/بنفش */}
    <TouchableOpacity 
      activeOpacity={0.85}
      style={styles.toolCardV2Colored}
      onPress={() => navigation.navigate("LibraryScreen")}
    >
      <LinearGradient colors={['#818cf8', '#6366f1']} style={styles.toolGradientV2}>
        <View style={styles.toolIconCircleV2Colored}>
          <BookOpen color="#312e81" size={28} />
        </View>
        <Text style={styles.toolTextV2Light}>کتابخانه 📚</Text>
      </LinearGradient>
    </TouchableOpacity>
  </View>
</View>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
};
export const DailyQuizScreen = ({ navigation }: any) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const questions = [
    { question: 'معنی کلمه "Beautiful" چیست؟', options: ['زشت', 'زیبا', 'بزرگ', 'کوچک'], answer: 'زیبا' },
    { question: 'کدام کلمه یک رنگ است؟', options: ['Car', 'Blue', 'Book', 'Tree'], answer: 'Blue' },
    { question: 'گذشته فعل "Go" چیست؟', options: ['Going', 'Goes', 'Went', 'Gone'], answer: 'Went' },
    { question: 'جمع کلمه "Child" چه می‌شود؟', options: ['Childs', 'Children', 'Childrens', 'Childes'], answer: 'Children' },
    { question: 'مخالف کلمه "Fast" چیست؟', options: ['Slow', 'Quick', 'Hard', 'Easy'], answer: 'Slow' },
  ];

  const handleAnswer = (selectedOption: string) => {
    if (selectedOption === questions[currentQuestion].answer) setScore(score + 5);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) setCurrentQuestion(nextQuestion);
    else setShowScore(true);
  };

  return (
    <LinearGradient colors={['#e0f2fe', '#bae6fd']} style={styles.quizContainer}>
      {showScore ? (
        <View style={styles.resultBox}>
          <Text style={{fontSize: 70}}>🎉🥇</Text>
          <Text style={styles.resultText}>کارت عالی بود!</Text>
          <View style={styles.scoreCard}>
            <Text style={styles.scoreText}>امتیاز شما: {score} از {questions.length * 5}</Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={() => navigation.goBack()}>
            <Text style={styles.btnText}>بازگشت به خانه 🏠</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{width: '100%', alignItems: 'center'}}>
          <View style={styles.questionCounterBadge}>
            <Text style={styles.questionCounterText}>سوال {currentQuestion + 1} از {questions.length} 💡</Text>
          </View>
          
          <View style={styles.dailyQuestionCard}>
            <Text style={styles.dailyQuestionText}>{questions[currentQuestion].question}</Text>
          </View>

          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity key={index} style={styles.dailyOptionBtn} onPress={() => handleAnswer(option)}>
              <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.dailyOptionGradient}>
                <Text style={styles.dailyOptionText}>{option}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </LinearGradient>
  );
};



      


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f4ff' },
  adminLabel: { textAlign: 'right', marginBottom: 10, fontFamily: 'ShabnamBold', color: '#475569' },
  adminInput: { backgroundColor: '#fff', padding: 15, borderRadius: 12, marginBottom: 12, textAlign: 'right', borderWidth: 1, borderColor: '#cbd5e1', fontFamily: 'Shabnam' },
  adminGradeBtn: { padding: 10, borderRadius: 10, backgroundColor: '#e2e8f0', width: '30%', alignItems: 'center' },
  activeAdminGrade: { backgroundColor: '#7c3aed' },
  uploadBtn: {
    backgroundColor: '#10b981',
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
  },

  avatarWrapper: { position: 'relative' },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 15,
    elevation: 5,
  },
  toolIconCircle: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  gradePicker: { flexDirection: 'row-reverse', justifyContent: 'space-around', paddingHorizontal: 15 },

  activeGrade: { backgroundColor: '#7c3aed', transform: [{ scale: 1.1 }] },
  headerDetail: { height: 90, justifyContent: 'center', alignItems: 'center', borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
  headerTitleDetail: { color: '#fff', fontSize: 21, fontFamily: 'ShabnamBold', marginTop: 10 },
  backBtn: { position: 'absolute', left: 20, top: 60 },

  detailScroll: { padding: 20 },
  detailBtn: {
    width: '100%',
    height: 85,
    marginBottom: 15,
    borderRadius: 25,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  detailBtnGradient: { flex: 1, borderRadius: 25, flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: 20 },
  iconCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  detailBtnText: { color: '#fff', fontSize: 18, fontFamily: 'ShabnamBold', flex: 1, textAlign: 'right', marginRight: 15 },

  videoWrapper: { marginLeft: 15, width: 180, height: 160 },
  cardEmoji: { fontSize: 40, marginBottom: 5 },
  videoCardText: { color: '#fff', fontFamily: 'ShabnamBold', fontSize: 20 },

  startBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 10,
  },
  startBadgeText: { color: '#fff', fontSize: 10, fontFamily: 'ShabnamBold' },

  welcomeBox: { padding: 20, alignItems: 'center' },
  welcomeText: { fontSize: 16, fontFamily: 'ShabnamBold', color: '#4c1d95' },

  sectionTitle: {
    fontSize: 20,
    fontFamily: 'ShabnamBold',
    textAlign: 'right',
    marginHorizontal: 25,
    marginTop: 10,
    color: '#1e293b',
  },
  gradeContainer: { marginBottom: 10 },

  toolText: { marginTop: 5, fontSize: 10, fontFamily: 'ShabnamBold', color: '#4c1d95' },
  nameInput: { fontSize: 18, fontFamily: 'ShabnamBold', marginTop: 15, width: '60%', borderBottomWidth: 1, borderBottomColor: '#ccc' },

  adminBtn: {
    backgroundColor: '#1e293b',
    flexDirection: 'row-reverse',
    padding: 15,
    borderRadius: 12,
    margin: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminBtnText: { color: '#fff', fontFamily: 'ShabnamBold', marginRight: 10 },

  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#ddd' },
  gradeSection: { marginTop: 25, paddingHorizontal: 20 },
  gradeBtn: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    elevation: 3,
  },
  gradeBtnText: { color: '#64748b', fontFamily: 'ShabnamBold', fontSize: 14 },
  activeGradeText: { color: '#fff' },

  bannerText: { color: '#fff', fontSize: 24, fontFamily: 'ShabnamBold' },
  bannerSub: { color: '#e0e0e0', fontSize: 12, fontFamily: 'Shabnam' },

  toolGrid: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingHorizontal: 20 },
  banner: {
    width: width - 40,
    height: 100,
    alignSelf: 'center',
    marginTop: 15,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
  },
  toolCard: { width: '31%', backgroundColor: '#fff', padding: 12, borderRadius: 15, alignItems: 'center', elevation: 2 },
  simpleCard: { marginLeft: 15, width: 160 },

  tapHint: { color: '#e0e0e0', fontSize: 10, marginTop: 5, fontFamily: 'Shabnam' },

  videoCard: {
    backgroundColor: '#fff',
    flexDirection: 'row-reverse',
    padding: 15,
    borderRadius: 20,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3,
  },

  actionCard: {
    backgroundColor: '#fff',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    padding: 18,
    borderRadius: 20,
    marginBottom: 12,
    elevation: 4,
    borderRightWidth: 6,
  },
  actionIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  actionText: { flex: 1, textAlign: 'right', fontFamily: 'ShabnamBold', fontSize: 16, color: '#1e293b' },

  sectionLabel: { textAlign: 'right', color: '#64748b', marginBottom: 15, fontSize: 14, fontFamily: 'Shabnam' },
  videoInfo: { flex: 1, marginRight: 15 },
  videoTitle: { fontSize: 16, fontFamily: 'ShabnamBold', color: '#1e293b', textAlign: 'right' },
  videoSubtitle: { fontSize: 12, color: '#64748b', textAlign: 'right', marginTop: 4, fontFamily: 'Shabnam' },

  detailItem: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: 'center',
  },
  horizontalCard: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginLeft: 15,
    padding: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    alignItems: 'center',
  },
  cardIcon: {
    width: '100%',
    height: 90,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  libraryContainer: {
    flex: 1,
    padding: 20,
  },
  librarySectionTitle: {
    fontSize: 20,
    fontFamily: 'ShabnamBold',
    marginBottom: 15,
    textAlign: 'right',
  },
  libraryCard: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  libraryCardTitle: {
    fontSize: 16,
    fontFamily: 'ShabnamBold',
    textAlign: 'right',
    marginBottom: 5,
  },
  libraryCardSub: {
    fontSize: 13,
    fontFamily: 'Shabnam',
    textAlign: 'right',
  },
  cardTitle: { fontFamily: 'ShabnamBold', fontSize: 14, color: '#1e293b', textAlign: 'center' },
  cardSub: { fontSize: 11, color: '#94a3b8', marginTop: 4, fontFamily: 'Shabnam' },

  modernActionCard: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 18,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  // استایل‌های جدید CourseViewer (۶ بخش هر درس)
  lessonHeaderV2: {
    padding: 30,
    paddingTop: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: 'center',
    elevation: 6,
  },
  lessonTitleV2: { color: '#fff', fontSize: 24, fontFamily: 'ShabnamBold' },
  lessonSubBadgeV2: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, marginTop: 8 },
  lessonSubTextV2: { color: '#e0e7ff', fontSize: 13, fontFamily: 'Shabnam' },

  modernActionCardV2: {
    flexDirection: 'row-reverse',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 22,
    alignItems: 'center',
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconBoxV2: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextV2: { fontFamily: 'ShabnamBold', fontSize: 16, color: '#1e293b' },
  actionSubTextV2: { fontSize: 12, color: '#64748b', marginTop: 3, fontFamily: 'Shabnam' },

  // استایل‌های منوی جادویی جدید
  toolCardV2Colored: {
    width: '31%',
    borderRadius: 22,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
  },
  toolGradientV2: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 22,
  },
  toolIconCircleV2Colored: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolTextV2Dark: { fontSize: 12, fontFamily: 'ShabnamBold', color: '#78350f' },
  toolTextV2Light: { fontSize: 12, fontFamily: 'ShabnamBold', color: '#ffffff' },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  detailItemText: { marginRight: 15, fontFamily: 'ShabnamBold', fontSize: 16 },

  splashContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  splashTitle: { color: '#fff', fontSize: 42, fontFamily: 'ShabnamBold' },
  splashSub: { color: '#e0e0e0', fontSize: 16, fontFamily: 'Shabnam' },

  loginContainer: { flex: 1, backgroundColor: '#fff', padding: 30, justifyContent: 'center' },
  loginHeader: { marginBottom: 40, alignItems: 'flex-end' },

  profileHeader: { alignItems: 'center', marginTop: 30 },

  loginTitle: { fontSize: 28, fontFamily: 'ShabnamBold' },
  loginSub: { fontSize: 14, color: '#64748b', fontFamily: 'Shabnam' },

  inputWrapper: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 60,
  },
  contentBadgeText: {
    fontSize: 11,
    color: '#64748b',
    fontFamily: 'ShabnamBold',
  },
  phoneInput: { flex: 1, textAlign: 'right', fontFamily: 'Shabnam' },

  loginBtn: {
    backgroundColor: '#7c3aed',
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loginBtnText: { color: '#fff', fontSize: 18, fontFamily: 'ShabnamBold' },

  skipBtn: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  skipText: { color: '#64748b', fontFamily: 'Shabnam' },
  lessonHeader: {
    backgroundColor: '#7c3aed',
    padding: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'flex-end'
  },

  lessonTitle: {
    color: '#fff',
    fontSize: 22,
    fontFamily: 'ShabnamBold'
  },

  lessonSub: {
    color: '#e9d5ff',
    marginTop: 5,
    fontSize: 13,
    fontFamily: 'Shabnam'
  },

  continueBtn: {
    backgroundColor: '#22c55e',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
    marginTop: 15,
    alignSelf: 'flex-start'
  },

  continueBtnText: {
    color: '#fff',
    fontFamily: 'ShabnamBold',
    fontSize: 14
  },

  learningPathCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderRadius: 20,
    elevation: 3
  },

  pathTitle: {
    fontSize: 16,
    fontFamily: 'ShabnamBold',
    color: '#1e293b',
    textAlign: 'right'
  },

  pathSmallText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 4,
    fontFamily: 'Shabnam'
  },

  progressBarBg: {
    height: 10,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden'
  },

  progressBarFill: {
    height: 10,
    backgroundColor: '#7c3aed',
    width: '40%',
    borderRadius: 10
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    resizeMode: 'cover',
  },
  cardDuration: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    fontFamily: 'Shabnam',
  },

  dailyQuizBox: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    elevation: 3,
    flexDirection: 'row-reverse',
    alignItems: 'center'
  },

  dailyQuizTitle: {
    fontSize: 16,
    fontFamily: 'ShabnamBold',
    color: '#1e293b',
    textAlign: 'right'
  },

  dailyQuizSub: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'right',
    marginTop: 3,
    fontFamily: 'Shabnam'
  },
  themeSwitcher: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  themeLabel: {
    fontSize: 16,
    fontFamily: 'ShabnamBold',
  },
  profileHeaderHorizontal: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    gap: 15,
  },
  avatarSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
  },
  nameInputBox: {
    backgroundColor: '#7c3aed',
    color: '#fff',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 30,
    fontSize: 16,
    fontFamily: 'ShabnamBold',
  },
  linksSection: {
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  heroBanner: {
    padding: 25,
    paddingTop: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: 'center',
    elevation: 8,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  heroBadgeText: { color: '#fff', fontSize: 13, fontFamily: 'ShabnamBold' },
  heroBannerTitle: { color: '#fff', fontSize: 26, fontFamily: 'ShabnamBold', textAlign: 'center' },
  heroBannerSub: { color: '#e0e7ff', fontSize: 14, marginTop: 6, textAlign: 'center', fontFamily: 'Shabnam' },

  sectionTitleHeader: {
    fontSize: 20,
    fontFamily: 'ShabnamBold',
    textAlign: 'right',
    marginBottom: 15,
  },

  cardChallengePurple: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 15,
    elevation: 6,
  },
  cardChallengeRed: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 6,
  },
  cardGradientInternal: {
    padding: 20,
    borderRadius: 25,
  },
  cardHeaderRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  emojiCircleBg: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitleMain: { color: '#fff', fontSize: 19, fontFamily: 'ShabnamBold' },
  cardSubMain: { color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 3, fontFamily: 'Shabnam' },
  cardFooterAction: {
    marginTop: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  cardActionText: { color: '#fff', fontFamily: 'ShabnamBold', fontSize: 13 },

  learningPathCardV2: {
    padding: 18,
    borderRadius: 22,
    marginBottom: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pathHeaderRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unitBadge: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  unitBadgeText: { color: '#fff', fontSize: 12, fontFamily: 'ShabnamBold' },
  pathTitleV2: { fontSize: 16, fontFamily: 'ShabnamBold' },
  progressBarBgV2: {
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    marginTop: 12,
    overflow: 'hidden',
  },
  pathSmallTextV2: { fontSize: 12, color: '#64748b', textAlign: 'right', marginTop: 6, fontFamily: 'Shabnam' },

  dailyQuizBoxV2: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
  },
  dailyQuizGradient: {
    padding: 20,
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  dailyQuizTitleV2: { color: '#fff', fontSize: 17, fontFamily: 'ShabnamBold' },
  dailyQuizSubV2: { color: '#e0f2fe', fontSize: 13, marginTop: 4, fontFamily: 'Shabnam' },

  toolGridV2: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  toolCardV2: {
    width: '31%',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  toolIconCircleV2: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  toolTextV2: { fontSize: 12, fontFamily: 'ShabnamBold' },

  headerDetailV2: {
    padding: 30,
    paddingTop: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: 'center',
    elevation: 6,
  },
  headerTitleDetailV2: { color: '#fff', fontSize: 24, fontFamily: 'ShabnamBold' },
  headerSubTitleV2: { color: '#e0e7ff', fontSize: 13, marginTop: 5, fontFamily: 'Shabnam' },

  viewAllBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 15,
  },
  horizontalVideoCardV2: {
    width: 165,
    borderRadius: 22,
    marginRight: 15,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardVideoIconV2: {
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardEmojiTag: {
    position: 'absolute',
    top: 8,
    right: 8,
    fontSize: 20,
  },
  cardTitleV2: { fontFamily: 'ShabnamBold', fontSize: 14, textAlign: 'center', marginBottom: 6 },
  contentBadgeV2: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  linkItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  linkText: {
    textAlign: 'right',
    fontSize: 16,
    fontFamily: 'Shabnam',
  },
  quizContainer: { flex: 1, justifyContent: 'center', padding: 20 },
  questionCounterBadge: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginBottom: 20, elevation: 3 },
  questionCounterText: { fontSize: 16, fontFamily: 'ShabnamBold', color: '#0369a1' },
  dailyQuestionCard: { backgroundColor: '#fff', width: '100%', padding: 30, borderRadius: 25, alignItems: 'center', elevation: 5, marginBottom: 30, borderWidth: 3, borderColor: '#7dd3fc' },
  dailyQuestionText: { fontSize: 22, fontFamily: 'ShabnamBold', color: '#0c4a6e', textAlign: 'center' },
  dailyOptionBtn: { width: '100%', marginBottom: 15, borderRadius: 25, elevation: 4, overflow: 'hidden' },
  dailyOptionGradient: { padding: 18, alignItems: 'center' },
  dailyOptionText: { color: 'white', fontSize: 20, fontFamily: 'ShabnamBold' },
  resultBox: { alignItems: 'center', backgroundColor: '#fff', padding: 30, borderRadius: 30, elevation: 10 },
  resultText: { fontSize: 28, fontFamily: 'ShabnamBold', color: '#0369a1', marginBottom: 15, marginTop: 10 },
  scoreCard: { backgroundColor: '#f0f9ff', padding: 20, borderRadius: 20, marginBottom: 25, width: '100%', alignItems: 'center', borderWidth: 2, borderColor: '#bae6fd' },
  scoreText: { fontSize: 22, fontFamily: 'ShabnamBold', color: '#0c4a6e' },
  btn: { backgroundColor: '#0284c7', padding: 18, borderRadius: 20, width: '100%', alignItems: 'center', elevation: 3 },
  btnText: { color: '#fff', fontSize: 18, fontFamily: 'ShabnamBold' },

  libraryHeader: { padding: 30, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, alignItems: 'center', elevation: 5, marginBottom: 25 },
  libraryHeaderTitle: { fontSize: 26, fontFamily: 'ShabnamBold', color: '#fff', marginTop: 10 },
  
  questionCounter: { fontSize: 16, fontFamily: 'Shabnam', color: '#6b7280', marginBottom: 10, textAlign: 'center' },
  questionText: { fontSize: 22, fontFamily: 'ShabnamBold', color: '#1f2937', marginBottom: 30, textAlign: 'center' },
  optionBtn: { backgroundColor: '#7c3aed', padding: 15, borderRadius: 10, width: '100%', marginBottom: 10, alignItems: 'center' },
  optionText: { color: 'white', fontSize: 18, fontFamily: 'ShabnamBold' },
});



