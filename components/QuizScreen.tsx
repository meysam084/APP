import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';

export default function QuizScreen() {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  return (
    <ScrollView style={styles.quizContainer}>
      <Text style={styles.headerTitle}>خودآزمایی 📝</Text>

      {/* سوال تستی */}
      <View style={styles.card}>
        <Text style={styles.questionText}>۱. معنی کلمه "Experience" چیست؟</Text>
        {['تجربه', 'آزمایش', 'متخصص', 'هیچکدام'].map((option, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.optionBtn, selectedOption === index && styles.optionBtnSelected]}
            onPress={() => setSelectedOption(index)}
          >
            <Text style={[styles.optionText, selectedOption === index && { color: 'white' }]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* سوال تشریحی */}
      <View style={styles.card}>
        <Text style={styles.questionText}>۲. یک جمله با کلمه فوق بسازید:</Text>
        <TextInput 
          style={styles.textInput}
          multiline
          placeholder="پاسخ خود را اینجا بنویسید..."
          textAlign="right"
        />
      </View>

      <TouchableOpacity style={styles.submitBtn}>
        <Text style={styles.submitBtnText}>ثبت پاسخ‌ها</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  quizContainer: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20, fontFamily: 'Vazirmatn' },
  card: { backgroundColor: 'white', padding: 20, borderRadius: 15, marginBottom: 20, elevation: 3 },
  questionText: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, textAlign: 'right', fontFamily: 'Vazirmatn' },
  optionBtn: { padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#D1D5DB', marginBottom: 10 },
  optionBtnSelected: { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6' },
  optionText: { textAlign: 'right', fontSize: 15, fontFamily: 'Vazirmatn' },
  textInput: { height: 100, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 10, padding: 15, textAlignVertical: 'top', fontFamily: 'Vazirmatn' },
  submitBtn: { backgroundColor: '#10B981', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 40 },
  submitBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold', fontFamily: 'Vazirmatn' }
});
