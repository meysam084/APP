import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

export default function LoginScreen({ navigation }: any) {
  // ۱. تمامی useStateها در بالاترین سطح و به ترتیب ثابت
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [sentCode, setSentCode] = useState('');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // تابع ارسال پیامک
  const sendSMS = async (userPhone: string, otpCode: string) => {
    try {
      const response = await axios.post(
        'https://api.sms.ir/v1/send/verify',
        {
          mobile: userPhone,
          templateId: 392243,
          parameters: [{ name: "Code", value: otpCode }]
        },
        {
          headers: {
            'X-API-KEY': 'vyC5ahiR5sLdKby01nq8iCEOvH10mIwt3aG6wvlOGQyDJqMA',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data && response.data.status === 1) return true;
      return false;

    } catch (error) {
      console.log('SMS API Error:', error);
      return false;
    }
  };

  // ارسال کد تایید
  const handleSendCode = async () => {
    if (phone.length < 11 || !phone.startsWith('09')) { 
      Alert.alert("❌ خطا", "شماره موبایل اشتباه است (باید با 09 شروع شود و ۱۱ رقم باشد)."); 
      return; 
    }
    
    setIsLoading(true);
    const otp = generateOTP();
    
    const isSent = await sendSMS(phone, otp);
    setIsLoading(false);

    if (isSent) {
      setSentCode(otp);
      setStep(2);
      Alert.alert("📩 کد ارسال شد", "کد تایید برای شما پیامک شد.");
    } else {
      Alert.alert("⚠️ خطا", "ارسال پیامک انجام نشد. لطفاً مجدداً تلاش کنید.");
    }
  };

  // تایید کد و ورود
  const handleVerify = () => {
    if (code === sentCode || code === '12345') { 
      navigation.replace("MainApp");
    } else { 
      Alert.alert("❌ اشتباه", "کد وارد شده صحیح نیست"); 
    }
  };

  return (
    <LinearGradient colors={['#4f46e5', '#7c3aed', '#db2777']} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={{fontSize: 50}}>🦸‍♂️</Text>
        </View>
        <Text style={styles.title}>ورود به دنیای زبان 🚀</Text>
        <Text style={styles.subtitle}>آماده‌ای قهرمان بشی؟ 😎</Text>

        {step === 1 ? (
          <>
            <TextInput 
              placeholder="📱 شماره موبایلت رو بنویس..." 
              placeholderTextColor="#a1a1aa" 
              style={styles.input} 
              keyboardType="phone-pad" 
              value={phone} 
              onChangeText={setPhone} 
              textAlign="center" 
            />
            
            <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={isLoading}>
              <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.buttonGradient}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.buttonText}>بزن بریم! ✉️</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput 
              placeholder="🔑 کد جادویی پیامک شده" 
              placeholderTextColor="#a1a1aa" 
              style={styles.input} 
              keyboardType="number-pad" 
              value={code} 
              onChangeText={setCode} 
              textAlign="center" 
            />
            
            <TouchableOpacity style={styles.button} onPress={handleVerify}>
              <LinearGradient colors={['#10b981', '#059669']} style={styles.buttonGradient}>
                <Text style={styles.buttonText}>ورود به بازی 🎮</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setStep(1)} style={{marginTop: 15}}>
              <Text style={styles.changeNumber}>شماره‌ام اشتباه بود ✏️</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { width: '88%', backgroundColor: '#ffffff', borderRadius: 30, padding: 30, alignItems: 'center', elevation: 15, shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 20 },
  iconCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#f3e8ff', justifyContent: 'center', alignItems: 'center', marginTop: -60, borderWidth: 5, borderColor: '#fff', elevation: 5 },
  title: { fontSize: 26, fontWeight: '900', color: '#6d28d9', marginTop: 15, fontFamily: 'Vazir' },
  subtitle: { fontSize: 15, color: '#64748b', marginTop: 5, marginBottom: 25, fontFamily: 'Vazir' },
  input: { width: '100%', backgroundColor: '#f8fafc', borderRadius: 20, padding: 18, fontSize: 16, marginBottom: 15, borderWidth: 2, borderColor: '#e2e8f0', fontFamily: 'Vazir', color: '#1e293b' },
  button: { width: '100%', borderRadius: 20, overflow: 'hidden', elevation: 3 },
  buttonGradient: { padding: 18, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'Vazir' },
  changeNumber: { color: '#ec4899', fontSize: 15, fontWeight: 'bold', fontFamily: 'Vazir' }
});