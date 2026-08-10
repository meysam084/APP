import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GamificationContext } from '../App';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const vocabQuestions = [
  { id: 1, word: 'Essential', options: ['غیرضروری', 'ضروری', 'سخت', 'آسان'], answer: 'ضروری' },
  { id: 2, word: 'Improve', options: ['بهبود بخشیدن', 'خراب کردن', 'توقف کردن', 'شروع کردن'], answer: 'بهبود بخشیدن' },
];

export default function VocabChallengeScreen({ navigation }: any) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const { setCoins } = useContext(GamificationContext);

  const handleAnswer = (selectedOption: string) => {
    if (selectedOption === vocabQuestions[currentQIndex].answer) setScore(score + 1);
    if (currentQIndex < vocabQuestions.length - 1) setCurrentQIndex(currentQIndex + 1);
    else setShowResult(true);
  };

  if (showResult) {
    const earnedCoins = score * 10;
    return (
      <LinearGradient colors={['#4c1d95', '#7c3aed', '#c084fc']} style={styles.container}>
        <Text style={styles.emoji}>🎉🏆</Text>
        <Text style={[styles.title, { color: '#fff', fontSize: 30 }]}>آفرین قهرمان!</Text>
        <Text style={{ color: '#f3e8ff', fontSize: 16, marginBottom: 20, fontFamily: 'Vazir' }}>چالش لغات رو با موفقیت تموم کردی</Text>
        
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>پاسخ‌های صحیح: {score} از {vocabQuestions.length}</Text>
          <View style={styles.badgeCoin}>
            <Text style={styles.coinText}>🪙 {earnedCoins}+ سکه طلایی جایزه گرفتی!</Text>
          </View>
        </View>

        <TouchableOpacity 
          activeOpacity={0.85}
          style={styles.backBtn} 
          onPress={() => { if (setCoins) setCoins((p: number) => p + earnedCoins); navigation.goBack(); }}
        >
          <LinearGradient colors={['#10b981', '#059669']} style={styles.btnGradient}>
            <Text style={styles.btnText}>دریافت جایزه و بازگشت 🚀</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const currentQ = vocabQuestions[currentQIndex];

  return (
    <LinearGradient colors={['#f0f5ff', '#e0e7ff']} style={styles.container}>
      {/* 💡 نشانگر مراحل سوال */}
      <View style={styles.progressBadge}>
        <Text style={styles.progressText}>سوال {currentQIndex + 1} از {vocabQuestions.length} 🧠</Text>
      </View>

      {/* 🎯 کارت سوال اصلی */}
      <View style={styles.questionCard}>
        <Text style={styles.title}>چالش لغات 🔤</Text>
        <Text style={styles.questionText}>
          معنی کلمه <Text style={styles.highlight}>"{currentQ.word}"</Text> چیست؟
        </Text>
      </View>
      
      {/* 🔘 گزینه های انتخابی */}
      {currentQ.options.map((option, index) => (
        <TouchableOpacity 
          key={index} 
          activeOpacity={0.8}
          style={styles.optionBtn} 
          onPress={() => handleAnswer(option)}
        >
          <LinearGradient colors={['#8b5cf6', '#6d28d9']} style={styles.optionGradient}>
            <Text style={styles.optionText}>{option}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  progressBadge: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, marginBottom: 15, elevation: 3, borderWidth: 2, borderColor: '#c4b5fd' },
  progressText: { fontSize: 15, fontWeight: 'bold', color: '#6d28d9', fontFamily: 'Vazir' },
  questionCard: { backgroundColor: '#fff', width: width * 0.9, padding: 25, borderRadius: 30, alignItems: 'center', elevation: 6, marginBottom: 25, borderWidth: 3, borderColor: '#a78bfa' },
  title: { fontSize: 24, fontWeight: '900', marginBottom: 12, color: '#6d28d9', fontFamily: 'Vazir' },
  questionText: { fontSize: 20, textAlign: 'center', fontFamily: 'Vazir', color: '#1e293b', lineHeight: 32 },
  highlight: { color: '#ec4899', fontSize: 26, fontWeight: '900' },
  optionBtn: { width: width * 0.85, marginBottom: 14, borderRadius: 22, elevation: 4, overflow: 'hidden' },
  optionGradient: { padding: 18, alignItems: 'center' },
  optionText: { color: '#fff', fontSize: 19, fontWeight: '900', fontFamily: 'Vazir' },
  emoji: { fontSize: 85, marginBottom: 10 },
  resultCard: { backgroundColor: '#fff', width: width * 0.85, padding: 25, borderRadius: 30, alignItems: 'center', marginBottom: 25, elevation: 10 },
  resultText: { fontSize: 19, marginBottom: 15, fontFamily: 'Vazir', fontWeight: 'bold', color: '#334155' },
  badgeCoin: { backgroundColor: '#fef3c7', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 15, borderWidth: 1, borderColor: '#fde047' },
  coinText: { fontSize: 18, color: '#d97706', fontWeight: '900', fontFamily: 'Vazir' },
  backBtn: { width: width * 0.85, borderRadius: 25, overflow: 'hidden', elevation: 5 },
  btnGradient: { padding: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '900', fontFamily: 'Vazir' }
});