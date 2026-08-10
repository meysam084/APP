import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { GamificationContext, ThemeContext } from '../App';
import { Moon, Sun } from 'lucide-react-native';

export default function ProfileScreen({ navigation, route }: any) {
  const [avatar, setAvatar] = useState(route.params?.updatedAvatar || require('../assets/avatars/boy1.png'));
  const { coins, streak } = useContext(GamificationContext);
  
  // استفاده از کانتکست تم برای تغییر حالت
  const { theme, toggleTheme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  useEffect(() => { 
    if (route.params?.updatedAvatar) {
      setAvatar(route.params.updatedAvatar); 
    }
  }, [route.params?.updatedAvatar]);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc' }]} 
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient colors={isDarkMode ? ['#4c1d95', '#1e1b4b'] : ['#8b5cf6', '#3b82f6']} style={styles.avatarHeader}>
        <View style={styles.avatarContainer}>
          <Image source={avatar} style={styles.avatarImage} resizeMode="contain" />
        </View>
        <TouchableOpacity style={styles.changeAvatarBtn} onPress={() => navigation.navigate('AvatarCreator')}>
          <Text style={styles.changeAvatarText}>تغییر لباس آواتار 🎨</Text>
        </TouchableOpacity>
        <Text style={styles.userName}>کاربر قهرمان 🥇</Text>
        <Text style={styles.joinDate}>عضویت: فروردین ۱۴۰۵</Text>
      </LinearGradient>

      {/* 🌙 سوئیچ حالت تاریک / روشن */}
      <View style={[styles.themeToggleCard, { backgroundColor: isDarkMode ? '#1e293b' : '#ffffff' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Switch 
            value={isDarkMode} 
            onValueChange={toggleTheme} 
            thumbColor={isDarkMode ? "#a78bfa" : "#f59e0b"}
            trackColor={{ false: "#cbd5e1", true: "#4c1d95" }}
          />
          <View style={{ marginLeft: 10 }}>
            {isDarkMode ? <Moon color="#a78bfa" size={24} /> : <Sun color="#f59e0b" size={24} />}
          </View>
        </View>
        <Text style={[styles.themeText, { color: isDarkMode ? '#f8fafc' : '#1e293b' }]}>
          {isDarkMode ? 'حالت شب 🌙' : 'حالت روز ☀️'}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#4c1d95' }]}>🏆 آمار قدرت من</Text>
        <View style={styles.statsGrid}>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: '#f43f5e' }]} onPress={() => navigation.navigate('Streak')}>
            <Text style={[styles.statValue, { color: isDarkMode ? '#fff' : '#1e293b' }]}>🔥 {streak}</Text>
            <Text style={[styles.statLabel, { color: isDarkMode ? '#cbd5e1' : '#64748b' }]}>روزهای متوالی</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.statCard, { backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: '#eab308' }]} onPress={() => navigation.navigate('Shop')}>
            <Text style={[styles.statValue, { color: isDarkMode ? '#fff' : '#1e293b' }]}>🪙 {coins}</Text>
            <Text style={[styles.statLabel, { color: isDarkMode ? '#cbd5e1' : '#64748b' }]}>سکه‌های طلا</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#f8fafc' : '#4c1d95' }]}>🎒 کوله‌پشتی من</Text>
        {['👑 وضعیت اشتراک VIP', '📥 مدیریت فایل‌های دانلود شده', '🔄 بروزرسانی برنامه‌ها'].map((item, idx) => (
          <TouchableOpacity key={idx} style={[styles.menuItem, { backgroundColor: isDarkMode ? '#1e293b' : '#fff', borderColor: isDarkMode ? '#334155' : '#e2e8f0' }]}>
            <Text style={[styles.menuText, { color: isDarkMode ? '#f8fafc' : '#334155' }]}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  avatarHeader: { alignItems: 'center', paddingTop: 60, paddingBottom: 30, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, elevation: 5 },
  avatarContainer: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 8, borderWidth: 4, borderColor: '#a78bfa' },
  avatarImage: { width: 90, height: 90 },
  changeAvatarBtn: { marginTop: -15, backgroundColor: '#fcd34d', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 20, borderWidth: 2, borderColor: '#fff', elevation: 3 },
  changeAvatarText: { color: '#9a3412', fontWeight: 'bold', fontSize: 13, fontFamily: 'Vazir' },
  userName: { fontSize: 26, fontWeight: '900', color: '#ffffff', fontFamily: 'Vazir', marginTop: 15, textShadowColor: 'rgba(0,0,0,0.2)', textShadowOffset: {width: 1, height: 1}, textShadowRadius: 2 },
  joinDate: { fontSize: 14, color: '#e0e7ff', fontFamily: 'Vazir', marginTop: 5 },
  
  themeToggleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 25,
    padding: 18,
    borderRadius: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  themeText: { fontSize: 16, fontFamily: 'Vazir', fontWeight: 'bold' },

  statsContainer: { marginTop: 25, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 19, fontWeight: '900', fontFamily: 'Vazir', textAlign: 'right', marginBottom: 15 },
  statsGrid: { flexDirection: 'row-reverse', justifyContent: 'space-between' },
  statCard: { width: '48%', borderRadius: 25, padding: 20, alignItems: 'center', borderWidth: 3, elevation: 4 },
  statValue: { fontSize: 24, fontWeight: '900', marginBottom: 5 },
  statLabel: { fontSize: 14, fontFamily: 'Vazir', fontWeight: 'bold' },
  menuContainer: { marginTop: 25, paddingHorizontal: 20, paddingBottom: 40 },
  menuItem: { padding: 18, borderRadius: 20, marginBottom: 12, borderWidth: 2, elevation: 2 },
  menuText: { fontSize: 16, fontFamily: 'Vazir', textAlign: 'right', fontWeight: 'bold' },
});