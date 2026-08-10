import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ThemeContext } from './App';

const AVATAR_LIST = [
  require('./assets/avatars/boy1.png'),
  require('./assets/avatars/boy2.png'),
  require('./assets/avatars/boy3.png'),
  require('./assets/avatars/girl1.png'),
  require('./assets/avatars/girl2.png'),
  require('./assets/avatars/girl3.png'),
];

export default function AvatarCreatorScreen({ navigation }: any) {
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_LIST[0]);
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === 'dark';

 const saveAvatar = () => {
    // حل قطعی ارور تودرتو: اول به کامپوننت تب‌ها (MainApp) می‌رویم، سپس به صفحه پروفایل
    navigation.navigate('MainApp', {
      screen: 'پروفایل',
      params: { updatedAvatar: selectedAvatar },
    });
  };
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#0f172a' : '#f0f8ff' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#f8fafc' : '#333' }]}>
        آواتار خودت را انتخاب کن! 🎨
      </Text>
      
      <View style={[styles.previewContainer, { backgroundColor: isDarkMode ? '#1e293b' : '#fff' }]}>
        <Image source={selectedAvatar} style={styles.previewImage} resizeMode="contain" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
        <View style={styles.grid}>
          {AVATAR_LIST.map((avatar, index) => {
            const isSelected = selectedAvatar === avatar;
            return (
              <TouchableOpacity 
                key={index} 
                activeOpacity={0.8}
                style={[
                  styles.avatarCard, 
                  { backgroundColor: isDarkMode ? '#1e293b' : '#fff' },
                  isSelected && styles.selectedCard
                ]}
                onPress={() => setSelectedAvatar(avatar)}
              >
                <Image source={avatar} style={styles.gridImage} resizeMode="contain" />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.saveBtn} onPress={saveAvatar}>
        <Text style={styles.saveBtnText}>✅ تایید و ذخیره</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', fontFamily: 'Vazir', marginBottom: 30, marginTop: 50 },
  previewContainer: { width: 150, height: 150, borderRadius: 75, justifyContent: 'center', alignItems: 'center', elevation: 8, marginBottom: 40, overflow: 'hidden', borderWidth: 4, borderColor: '#7c3aed' },
  previewImage: { width: 130, height: 130 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 20 },
  avatarCard: { width: 90, height: 90, borderRadius: 25, justifyContent: 'center', alignItems: 'center', elevation: 4, overflow: 'hidden' },
  selectedCard: { borderWidth: 4, borderColor: '#10b981', transform: [{scale: 1.05}] },
  gridImage: { width: 80, height: 80 },
  saveBtn: { backgroundColor: '#10b981', width: '100%', padding: 18, borderRadius: 20, alignItems: 'center', marginTop: 20, marginBottom: 20, elevation: 5 },
  saveBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold', fontFamily: 'Vazir' }
});