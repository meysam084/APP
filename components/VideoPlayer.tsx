import React, { useRef, useState, useEffect } from "react";
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  useWindowDimensions,
  TouchableWithoutFeedback
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as ScreenOrientation from 'expo-screen-orientation';
import Slider from '@react-native-community/slider';
import { 
  Volume2, VolumeX, Maximize, Minimize, 
  Play, Pause, ChevronsRight, ChevronsLeft 
} from 'lucide-react-native';

export default function VideoPlayerScreen() {
  const route: any = useRoute();
  const navigation = useNavigation();
  const videoSource = route.params?.video;
  const pageTitle = route.params?.title || "پخش ویدیو";
  
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<any>({});
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showControls, setShowControls] = useState(true);
  const [sliderValue, setSliderValue] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  let controlsTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  let lastTap = useRef<number>(0);

  useEffect(() => {
    navigation.setOptions({ title: pageTitle, headerShown: !isFullscreen });
    resetControlsTimeout();

    return () => {
      if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, [pageTitle, isFullscreen]);

  // مخفی کردن هوشمند کنترل‌ها
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
    controlsTimeout.current = setTimeout(() => {
      if (status.isPlaying) setShowControls(false);
    }, 3500);
  };

  // تشخیص لمس برای ظاهر/مخفی کردن منوها و دابل تپ
  const handleScreenPress = (evt: any) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    const pageX = evt.nativeEvent.pageX;

    if (now - lastTap.current < DOUBLE_TAP_DELAY) {
      // دابل تپ تشخیص داده شد
      const isLeft = pageX < SCREEN_WIDTH / 2;
      if (isLeft) {
        skipBackward();
      } else {
        skipForward();
      }
    } else {
      // لمس تکی (نمایش/مخفی کردن منوها)
      if (showControls) {
        setShowControls(false);
        if (controlsTimeout.current) clearTimeout(controlsTimeout.current);
      } else {
        resetControlsTimeout();
      }
    }
    lastTap.current = now;
  };

  const togglePlayback = async () => {
    if (!videoRef.current) return;
    status.isPlaying ? await videoRef.current.pauseAsync() : await videoRef.current.playAsync();
    resetControlsTimeout();
  };

  const toggleFullscreen = async () => {
    if (isFullscreen) {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      setIsFullscreen(false);
    } else {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
      setIsFullscreen(true);
    }
    resetControlsTimeout();
  };

  const skipBackward = async () => {
    if (!videoRef.current || !status.positionMillis) return;
    await videoRef.current.setPositionAsync(Math.max(0, status.positionMillis - 10000));
    resetControlsTimeout();
  };

  const skipForward = async () => {
    if (!videoRef.current || !status.positionMillis || !status.durationMillis) return;
    await videoRef.current.setPositionAsync(Math.min(status.durationMillis, status.positionMillis + 10000));
    resetControlsTimeout();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    resetControlsTimeout();
  };

  const formatTime = (millis: number) => {
    if (!millis) return "00:00";
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <View style={[styles.container, isFullscreen ? { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: '#000' } : null]}>
      <TouchableWithoutFeedback onPress={handleScreenPress}>
        <View style={isFullscreen ? styles.videoWrapperFullscreen : styles.videoWrapper}>
          
          <Video
            ref={videoRef}
            source={videoSource}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isMuted={isMuted}
            onPlaybackStatusUpdate={(s) => {
              setStatus(s);
              if (s.isLoaded) {
                setIsLoading(false);
                if (s.durationMillis) {
                  setSliderValue(s.positionMillis / s.durationMillis);
                }
              }
            }}
          />

          {/* لودینگ اولیه */}
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#8b5cf6" />
            </View>
          )}

          {/* لایه کنترل‌های اصلی */}
          {(!isLoading && showControls) && (
            <View style={styles.controlsOverlay}>
              
              {/* هدر بالا */}
              <View style={styles.topControls}>
                {!isFullscreen ? (
                  <TouchableOpacity style={styles.iconBtnBg} onPress={() => navigation.goBack()}>
                    <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 16}}>✕</Text>
                  </TouchableOpacity>
                ) : <View/>}
                
                {/* دکمه بی‌صدا کردن */}
                <TouchableOpacity style={styles.iconBtnBg} onPress={toggleMute}>
                  {isMuted ? <VolumeX color="#fff" size={20} /> : <Volume2 color="#fff" size={20} />}
                </TouchableOpacity>
              </View>

              {/* کنترل‌های مرکزی */}
              <View style={styles.centerControlsRow}>
                <TouchableOpacity style={styles.skipBtn} onPress={skipBackward}>
                  <ChevronsLeft color="#fff" size={36} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.circlePlayBtn} onPress={togglePlayback}>
                  {status.isPlaying ? <Pause color="#fff" size={36} fill="#fff" /> : <Play color="#fff" size={36} fill="#fff" style={{marginLeft: 4}} />}
                </TouchableOpacity>

                <TouchableOpacity style={styles.skipBtn} onPress={skipForward}>
                  <ChevronsRight color="#fff" size={36} />
                </TouchableOpacity>
              </View>

              {/* نوار پایین */}
              <View style={styles.bottomBar}>
                <Text style={styles.timeText}>{formatTime(status.positionMillis)}</Text>

                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={sliderValue}
                  minimumTrackTintColor="#a855f7"
                  maximumTrackTintColor="rgba(255,255,255,0.3)"
                  thumbTintColor="#a855f7"
                  onValueChange={() => { resetControlsTimeout(); }}
                  onSlidingComplete={async (value) => {
                    if (status.durationMillis && videoRef.current) {
                      await videoRef.current.setPositionAsync(value * status.durationMillis);
                    }
                    resetControlsTimeout();
                  }}
                />

                <Text style={styles.timeText}>{formatTime(status.durationMillis)}</Text>

                <TouchableOpacity onPress={toggleFullscreen} style={styles.fullscreenTouch}>
                  {isFullscreen ? <Minimize color="#fff" size={22} /> : <Maximize color="#fff" size={22} />}
                </TouchableOpacity>
              </View>

            </View>
          )}

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", justifyContent: "center" },
  videoWrapper: { width: "100%", height: 250, backgroundColor: "#000", position: 'relative' },
  videoWrapperFullscreen: { width: "100%", height: "100%", backgroundColor: "#000", position: 'relative', justifyContent: 'center' },
  video: { width: "100%", height: "100%" },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "space-between",
    padding: 15,
  },
  topControls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  iconBtnBg: { backgroundColor: "rgba(0,0,0,0.6)", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center" },
  centerControlsRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 50 },
  circlePlayBtn: {
    width: 75, height: 75, borderRadius: 37.5, backgroundColor: "rgba(124, 58, 237, 0.9)",
    justifyContent: "center", alignItems: "center", elevation: 10, shadowColor: '#a855f7', shadowOpacity: 0.5, shadowRadius: 10,
  },
  skipBtn: { alignItems: 'center', justifyContent: 'center', padding: 10 },
  bottomBar: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 5 },
  slider: { flex: 1, height: 40, marginHorizontal: 10 },
  timeText: { color: "#fff", fontSize: 13, fontWeight: 'bold' },
  fullscreenTouch: { padding: 8, marginLeft: 10 },
});