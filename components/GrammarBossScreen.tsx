import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { GamificationContext } from '../App'; 
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const grammarQuestions = [
  { id: 1, question: 'She ___ to school every day.', options: ['go', 'goes', 'going'], answer: 'goes' },
  { id: 2, question: 'I have never ___ to Paris.', options: ['be', 'was', 'been'], answer: 'been' },
  { id: 3, question: 'If it rains, we ___ at home.', options: ['will stay', 'stayed', 'staying'], answer: 'will stay' },
];

export default function GrammarBossScreen({ navigation }: any) {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [showResult, setShowResult] = useState(false);
  const { setCoins } = useContext(GamificationContext);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setShowResult(true);
    }
  }, [timeLeft, showResult]);

  const handleAnswer = (selectedOption: string) => {
    if (selectedOption === grammarQuestions[currentQIndex].answer) setScore(score + 1);
    if (currentQIndex < grammarQuestions.length - 1) setCurrentQIndex(currentQIndex + 1);
    else setShowResult(true);
  };

  if (showResult) {
    const earnedCoins = score * 15;
    return (
      <LinearGradient colors={['#f43f5e', '#9f1239']} style={styles.container}>
        <Text style={styles.emoji}>👹⚔️</Text>
        <Text style={[styles.title, {color: '#fff'}]}>نتیجه نبرد با غول!</Text>
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>شکست غول تا مرحله: {score} از {grammarQuestions.length}</Text>
          <Text style={styles.coinText}>🪙 سکه‌های غارت شده: {earnedCoins}+</Text>
        </View>
        <TouchableOpacity 
          style={styles.backBtn} 
          onPress={() => { setCoins((prev: number) => prev + earnedCoins); navigation.goBack(); }}
        >
          <Text style={styles.btnText}>دریافت غنائم و فرار 🏃‍♂️</Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  const currentQ = grammarQuestions[currentQIndex];

  return (
    <LinearGradient colors={['#ffe4e6', '#fecdd3']} style={styles.container}>
      <View style={styles.timerBadge}>
        <Text style={styles.timerText}>⏱ زمان: {timeLeft} ثانیه</Text>
      </View>
      
      <View style={styles.questionCard}>
        <Text style={styles.title}>مبارزه با غول گرامر 👹</Text>
        <Text style={styles.questionText}>{currentQ.question}</Text>
      </View>
      
      {currentQ.options.map((option, index) => (
        <TouchableOpacity key={index} style={styles.optionBtn} onPress={() => handleAnswer(option)}>
          <LinearGradient colors={['#e11d48', '#be123c']} style={styles.optionGradient}>
            <Text style={styles.optionText}>{option}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  timerBadge: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginBottom: 20, elevation: 3, borderWidth: 2, borderColor: '#fda4af' },
  timerText: { fontSize: 18, color: '#e11d48', fontWeight: '900', fontFamily: 'Vazir' },
  questionCard: { backgroundColor: '#fff', width: width * 0.9, padding: 30, borderRadius: 30, alignItems: 'center', elevation: 5, marginBottom: 30, borderWidth: 3, borderColor: '#fca5a5' },
  title: { fontSize: 24, fontWeight: '900', marginBottom: 20, color: '#be123c', fontFamily: 'Vazir', textAlign: 'center' },
  questionText: { fontSize: 22, textAlign: 'center', fontFamily: 'Vazir', color: '#1e293b', fontWeight: 'bold' },
  optionBtn: { width: width * 0.85, marginBottom: 15, borderRadius: 25, elevation: 4, overflow: 'hidden' },
  optionGradient: { padding: 18, alignItems: 'center' },
  optionText: { color: '#fff', fontSize: 20, fontWeight: '900', fontFamily: 'Vazir' },
  emoji: { fontSize: 80, marginBottom: 15 },
  resultCard: { backgroundColor: '#fff', width: width * 0.85, padding: 25, borderRadius: 30, alignItems: 'center', marginBottom: 25, elevation: 10 },
  resultText: { fontSize: 18, marginBottom: 15, fontFamily: 'Vazir', fontWeight: 'bold', color: '#334155' },
  coinText: { fontSize: 20, color: '#d97706', fontWeight: '900', fontFamily: 'Vazir' },
  backBtn: { backgroundColor: '#10b981', padding: 20, borderRadius: 25, width: width * 0.85, alignItems: 'center', elevation: 5, borderWidth: 2, borderColor: '#34d399' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '900', fontFamily: 'Vazir' }
});