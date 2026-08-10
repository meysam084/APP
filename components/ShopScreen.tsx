import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { GamificationContext } from '../App';
import { LinearGradient } from 'expo-linear-gradient';

export default function ShopScreen() {
  const { coins, setCoins } = useContext(GamificationContext);

  const handleBuyItem = (itemName: string, cost: number) => {
    if (coins < cost) { Alert.alert("خطا ❌", "سکه‌هات کمه! بازی کن تا سکه بگیری."); return; }
    setCoins((prev: number) => prev - cost);
    Alert.alert("ایول! 🎉", `آیتم "${itemName}" به وسایلت اضافه شد!`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#f59e0b', '#fbbf24']} style={styles.header}>
        <Text style={styles.title}>فروشگاه جادویی 🎪</Text>
        <View style={styles.coinBadge}>
          <Text style={styles.coins}>{coins} 🪙</Text>
        </View>
      </LinearGradient>

      <ScrollView style={{padding: 20}}>
        <Text style={styles.sectionTitle}>خریدنی‌های ویژه ✨</Text>
        
        <View style={styles.itemCard}>
          <View style={[styles.iconBox, {backgroundColor: '#dbeafe'}]}><Text style={styles.itemIcon}>🧊</Text></View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>سپر یخی (استریک)</Text>
            <Text style={styles.itemDesc}>اگه یه روز نیومدی، آتشت خاموش نمیشه!</Text>
          </View>
          <TouchableOpacity style={styles.buyButton} onPress={() => handleBuyItem("سپر یخی", 50)}>
            <Text style={styles.buyText}>۵۰ 🪙</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.itemCard}>
          <View style={[styles.iconBox, {backgroundColor: '#fce7f3'}]}><Text style={styles.itemIcon}>👕</Text></View>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>لباس خفن آواتار</Text>
            <Text style={styles.itemDesc}>آواتارت رو خوشتیپ‌تر از قبل کن!</Text>
          </View>
          <TouchableOpacity style={styles.buyButton} onPress={() => handleBuyItem("لباس آواتار", 100)}>
            <Text style={styles.buyText}>۱۰۰ 🪙</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', padding: 25, paddingTop: 50, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 5 },
  title: { fontSize: 24, fontWeight: '900', color: '#fff', fontFamily: 'Vazir' },
  coinBadge: { backgroundColor: '#fff', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, elevation: 3 },
  coins: { fontSize: 18, fontWeight: '900', color: '#d97706' },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#6d28d9', marginBottom: 20, fontFamily: 'Vazir', textAlign: 'right' },
  itemCard: { flexDirection: 'row-reverse', backgroundColor: '#fff', padding: 15, borderRadius: 25, marginBottom: 15, alignItems: 'center', elevation: 3, borderWidth: 2, borderColor: '#e2e8f0' },
  iconBox: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginLeft: 15 },
  itemIcon: { fontSize: 35 },
  itemInfo: { flex: 1, alignItems: 'flex-end' },
  itemName: { fontSize: 17, fontWeight: '900', color: '#1e293b', fontFamily: 'Vazir' },
  itemDesc: { fontSize: 12, color: '#64748b', textAlign: 'right', marginTop: 4, fontFamily: 'Vazir' },
  buyButton: { backgroundColor: '#10b981', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 20, elevation: 2 },
  buyText: { color: '#fff', fontWeight: '900', fontSize: 15 }
});