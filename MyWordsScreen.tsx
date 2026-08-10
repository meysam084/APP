import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import { Volume2, RefreshCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from './App'; 
import { allWords, Word } from './data/wordsData'; 

export default function MyWordsScreen({ route, navigation }: any) {
  const { grade = 7, lesson = 1 } = route?.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [lessonWords, setLessonWords] = useState<Word[]>([]);
  
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

  useEffect(() => {
    const filteredWords = allWords.filter(w => w.grade === grade && w.lesson === lesson);
    setLessonWords(filteredWords);
  }, [grade, lesson]);

  const currentWord = lessonWords[currentIndex];

  if (lessonWords.length === 0) {
    return (
      <View style={[styles.emptyContainer, isDarkMode && styles.darkBackground]}>
        <Text style={{ fontSize: 70 }}>🥺</Text>
        <Text style={[styles.emptyText, isDarkMode && styles.darkText]}>هنوز لغتی برای این درس اضافه نشده!</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>بازگشت به لیست درس‌ها 🚀</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const speakWord = () => {
    Speech.speak(currentWord.word, { language: 'en-US', pitch: 1, rate: 0.8 });
  };

  const handleNextWord = (difficulty: 'hard' | 'good' | 'easy') => {
    if (currentIndex < lessonWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowTranslation(false);
    } else {
      Alert.alert('🎉 آفرین قهرمان!', 'مرور لغات امروزت عالی بود و تمام شد! 🥇👏');
      setCurrentIndex(0);
      setShowTranslation(false);
    }
  };

  if (!currentWord) return null;

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkBackground]}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        
        <LinearGradient colors={isDarkMode ? ['#4c1d95', '#1e1b4b'] : ['#7c3aed', '#3b82f6']} style={styles.headerBanner}>
          <Text style={styles.headerTitle}>جعبه کلمات جادویی 🪄</Text>
          <View style={styles.badgeProgress}>
            <Text style={styles.badgeProgressText}>کلمه {currentIndex + 1} از {lessonWords.length} 🌟</Text>
          </View>
        </LinearGradient>

        <View style={[styles.cardContainer, isDarkMode && styles.darkCardContainer]}>
          <View style={[styles.imageContainer, isDarkMode && styles.darkImageContainer]}>
            <Image source={currentWord.image} style={styles.wordImage} />
          </View>

          <View style={styles.wordRow}>
            <Text style={[styles.englishWord, isDarkMode && styles.darkText]}>{currentWord.word}</Text>
            <TouchableOpacity activeOpacity={0.8} onPress={speakWord} style={styles.speakerButton}>
              <Volume2 color="#fff" size={26} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.wordType, isDarkMode && styles.darkTextGray]}>({currentWord.type})</Text>

          {!showTranslation ? (
            <TouchableOpacity activeOpacity={0.85} style={styles.showAnswerButton} onPress={() => setShowTranslation(true)}>
              <LinearGradient colors={['#8b5cf6', '#6d28d9']} style={styles.showAnswerGradient}>
                <RefreshCcw color="#fff" size={22} style={{ marginRight: 8 }} />
                <Text style={styles.showAnswerText}>نمایش معنی 👀</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View style={styles.translationContainer}>
              <View style={[styles.translationCard, isDarkMode && styles.darkTranslationCard]}>
                <Text style={[styles.persianTranslation, isDarkMode && styles.darkPersianTranslation]}>✨ {currentWord.translation} ✨</Text>
                <Text style={[styles.exampleText, isDarkMode && styles.darkExampleText]}>📝 مثال: {currentWord.example}</Text>
              </View>

              <Text style={[styles.questionText, isDarkMode && styles.darkTextGray]}>🤔 یادآوری این کلمه چطور بود؟</Text>

              <View style={styles.ankiButtonsRow}>
                <TouchableOpacity activeOpacity={0.8} style={styles.ankiBtnWrapper} onPress={() => handleNextWord('hard')}>
                  <LinearGradient colors={['#f43f5e', '#be123c']} style={styles.ankiBtn}>
                    <Text style={styles.ankiBtnText}>سخت 🥵</Text>
                    <Text style={styles.ankiBtnSub}>۱ دقیقه</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} style={styles.ankiBtnWrapper} onPress={() => handleNextWord('good')}>
                  <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.ankiBtn}>
                    <Text style={styles.ankiBtnText}>خوب 🙂</Text>
                    <Text style={styles.ankiBtnSub}>۱۰ دقیقه</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.8} style={styles.ankiBtnWrapper} onPress={() => handleNextWord('easy')}>
                  <LinearGradient colors={['#10b981', '#059669']} style={styles.ankiBtn}>
                    <Text style={styles.ankiBtnText}>آسان 😎</Text>
                    <Text style={styles.ankiBtnSub}>۱ روز</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f6ff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f6ff', padding: 20 },
  emptyText: { fontSize: 18, fontFamily: 'ShabnamBold', color: '#334155', marginTop: 15, textAlign: 'center' },
  backBtn: { marginTop: 25, backgroundColor: '#7c3aed', paddingVertical: 14, paddingHorizontal: 25, borderRadius: 20, elevation: 4 },
  backBtnText: { color: '#fff', fontFamily: 'ShabnamBold', fontSize: 15 },
  headerBanner: { width: '100%', padding: 25, paddingTop: 35, borderBottomLeftRadius: 35, borderBottomRightRadius: 35, alignItems: 'center', elevation: 6, marginBottom: 20 },
  headerTitle: { fontSize: 26, fontFamily: 'ShabnamBold', color: '#fff' },
  badgeProgress: { backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 15, marginTop: 10 },
  badgeProgressText: { color: '#e0e7ff', fontFamily: 'ShabnamBold', fontSize: 13 },
  cardContainer: { width: '90%', backgroundColor: '#fff', borderRadius: 30, padding: 20, alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 10, borderWidth: 2, borderColor: '#e2e8f0' },
  imageContainer: { width: '100%', height: 210, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center', borderRadius: 22, overflow: 'hidden', marginBottom: 15, borderWidth: 2, borderColor: '#f1f5f9' },
  wordImage: { width: '95%', height: '95%', resizeMode: 'contain' },
  wordRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  englishWord: { fontSize: 30, fontFamily: 'ShabnamBold', color: '#1e293b', marginRight: 12 },
  speakerButton: { backgroundColor: '#7c3aed', padding: 10, borderRadius: 25, elevation: 4 },
  wordType: { fontSize: 15, color: '#64748b', marginTop: 4, marginBottom: 20, fontFamily: 'Shabnam' },
  showAnswerButton: { width: '100%', borderRadius: 22, overflow: 'hidden', marginTop: 10, elevation: 4 },
  showAnswerGradient: { flexDirection: 'row-reverse', paddingVertical: 16, justifyContent: 'center', alignItems: 'center' },
  showAnswerText: { color: '#fff', fontSize: 18, fontFamily: 'ShabnamBold' },
  translationContainer: { width: '100%', alignItems: 'center', marginTop: 5 },
  translationCard: { width: '100%', backgroundColor: '#f0fdf4', padding: 15, borderRadius: 20, alignItems: 'center', borderWidth: 2, borderColor: '#bbf7d0', marginBottom: 20 },
  persianTranslation: { fontSize: 26, fontFamily: 'ShabnamBold', color: '#16a34a', marginBottom: 8 },
  exampleText: { fontSize: 15, color: '#334155', textAlign: 'center', fontFamily: 'Shabnam', lineHeight: 24 },
  questionText: { fontSize: 15, fontFamily: 'ShabnamBold', color: '#475569', marginBottom: 12 },
  ankiButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  ankiBtnWrapper: { flex: 1, marginHorizontal: 3, borderRadius: 18, overflow: 'hidden', elevation: 3 },
  ankiBtn: { paddingVertical: 12, alignItems: 'center', borderRadius: 18 },
  ankiBtnText: { color: '#fff', fontFamily: 'ShabnamBold', fontSize: 13 },
  ankiBtnSub: { color: '#fff', fontSize: 9, fontFamily: 'Shabnam', opacity: 0.9, marginTop: 3 },
  
  // استایل‌های حالت تاریک
  darkBackground: { backgroundColor: '#0f172a' },
  darkText: { color: '#f8fafc' },
  darkTextGray: { color: '#94a3b8' },
  darkCardContainer: { backgroundColor: '#1e293b', borderColor: '#334155' },
  darkImageContainer: { backgroundColor: '#334155', borderColor: '#475569' },
  darkTranslationCard: { backgroundColor: '#064e3b', borderColor: '#047857' },
  darkPersianTranslation: { color: '#34d399' },
  darkExampleText: { color: '#d1d5db' },
});