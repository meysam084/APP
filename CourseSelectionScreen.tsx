import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from './App';

const { width } = Dimensions.get('window');

export default function CourseSelectionScreen({ navigation }: any) {
  const [selectedGrade, setSelectedGrade] = useState<7 | 8 | 9 | null>(7);
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  const grades = [
    { level: 7, title: 'هفتم 🎒', color: '#ef4444', gradient: ['#f87171', '#ef4444'] as const },
    { level: 8, title: 'هشتم 🛹', color: '#10b981', gradient: ['#34d399', '#10b981'] as const },
    { level: 9, title: 'نهم 🎓', color: '#f59e0b', gradient: ['#fbbf24', '#f59e0b'] as const },
  ];
  
  const lessonBgColors = ['#e0f2fe', '#dcfce7', '#fef3c7', '#fce7f3', '#f3e8ff', '#f1f5f9', '#ffe4e6', '#e0e7ff'];
  const lessonBorders = ['#38bdf8', '#4ade80', '#facc15', '#f472b6', '#c084fc', '#94a3b8', '#fb7185', '#818cf8'];
  const lessons = ['🍎', '🐶', '⚽️', '🚗', '🎨', '🍕', '🎸', '🚀'];

  const openLesson = (grade: number, lesson: number) => {
    navigation.navigate('MyWordsScreen', { grade, lesson });
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkBackground]}>
      <LinearGradient colors={['#7c3aed', '#3b82f6']} style={styles.headerBanner}>
        <Text style={[styles.mainTitle, isDarkMode && styles.darkText]}>مسیر یادگیری من 🌟</Text>
        <Text style={styles.subTitle}>پایه تحصیلی و درس مورد نظرت رو انتخاب کن</Text>
      </LinearGradient>

      <View style={styles.gradeContainer}>
        {grades.map((g) => {
          const isSelected = selectedGrade === g.level;
          return (
            <TouchableOpacity
              key={g.level}
              activeOpacity={0.8}
              style={styles.gradeCardWrapper}
              onPress={() => setSelectedGrade(g.level as 7 | 8 | 9)}
            >
              {isSelected ? (
                <LinearGradient colors={g.gradient} style={[styles.gradeCard, styles.activeGradeCard]}>
                  <Text style={styles.gradeTextActive}>{g.title}</Text>
                </LinearGradient>
              ) : (
                <View style={[styles.gradeCard, styles.inactiveGradeCard, isDarkMode && styles.darkCard]}>
                  <Text style={[styles.gradeTextInactive, isDarkMode && styles.darkTextGray]}>{g.title}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedGrade && (
        <ScrollView contentContainerStyle={styles.lessonsGrid} showsVerticalScrollIndicator={false}>
          {lessons.map((emoji, index) => {
            const lessonNum = index + 1;
            const bg = lessonBgColors[index % lessonBgColors.length];
            const border = lessonBorders[index % lessonBorders.length];

            return (
              <TouchableOpacity
                key={lessonNum}
                activeOpacity={0.8}
                style={[
                  styles.lessonCard, 
                  { backgroundColor: isDarkMode ? '#1e293b' : bg, borderColor: isDarkMode ? '#334155' : border }
                ]}
                onPress={() => openLesson(selectedGrade, lessonNum)}
              >
                <View style={[styles.emojiCircle, isDarkMode && styles.darkEmojiCircle]}>
                  <Text style={styles.lessonEmoji}>{emoji}</Text>
                </View>
                <Text style={[styles.lessonTitle, isDarkMode && styles.darkText]}>درس {lessonNum}</Text>
                <View style={[styles.startBadge, { backgroundColor: isDarkMode ? '#475569' : border }]}>
                  <Text style={styles.startBadgeText}>شروع 🚀</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f6ff' },
  headerBanner: {
    padding: 25,
    paddingTop: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: 'center',
    elevation: 6,
    marginBottom: 20,
  },
  mainTitle: { fontSize: 26, fontFamily: 'ShabnamBold', color: '#fff' },
  subTitle: { fontSize: 13, color: '#e0e7ff', marginTop: 5, fontFamily: 'Shabnam' },
  gradeContainer: { flexDirection: 'row-reverse', justifyContent: 'space-between', paddingHorizontal: 15, marginBottom: 20 },
  gradeCardWrapper: { flex: 1, marginHorizontal: 4 },
  gradeCard: {
    paddingVertical: 14,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  activeGradeCard: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  inactiveGradeCard: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  gradeTextActive: { fontSize: 16, fontFamily: 'ShabnamBold', color: '#fff' },
  gradeTextInactive: { fontSize: 16, fontFamily: 'ShabnamBold', color: '#64748b' },
  lessonsGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 15, paddingBottom: 40 },
  lessonCard: { 
    width: '47%', 
    padding: 18, 
    marginBottom: 15, 
    borderRadius: 25, 
    alignItems: 'center', 
    elevation: 4,
    borderWidth: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  emojiCircle: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
  },
  lessonEmoji: { fontSize: 36 },
  lessonTitle: { fontSize: 18, fontFamily: 'ShabnamBold', color: '#1e293b', marginBottom: 8 },
  startBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  startBadgeText: { color: '#fff', fontFamily: 'ShabnamBold', fontSize: 12 },
  
  // استایل‌های دارک مود
  darkBackground: { backgroundColor: '#0f172a' },
  darkText: { color: '#f8fafc' },
  darkTextGray: { color: '#94a3b8' },
  darkCard: { backgroundColor: '#1e293b', borderColor: '#334155' },
  darkEmojiCircle: { backgroundColor: '#334155' },
});