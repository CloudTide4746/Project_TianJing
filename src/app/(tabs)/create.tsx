/** @format */

import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  View,
  Alert,
} from 'react-native';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/themed-text';
import { ArtImage } from '@/components/ui/art-image';
import { GlowCard } from '@/components/ui/glow-card';
import { PrimaryButton } from '@/components/ui/primary-button';
import { ScreenShell } from '@/components/ui/screen-shell';
import { StatusPill } from '@/components/ui/status-pill';
import { UploadDropzone } from '@/components/ui/upload-dropzone';
import { Fonts, Spacing } from '@/constants/theme';
import { getLocationInfo, uploadCollectible, type LocationInfo } from '@/services/api';
import { CustomizationPanel } from '@/components/create/customization-panel';
import type { GenerateOptions } from '@/types/generate-options';
import { DEFAULT_GENERATE_OPTIONS } from '@/types/generate-options';

const ART_BANNER_URI = require('@/assets/art/create-banner.png');
const ART_UPLOAD_BG_URI = require('@/assets/art/upload-placeholder-bg.png');

const LOCATION_TIMEOUT_MS = 15000;

export default function CreateScreen() {
  const router = useRouter();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [imprintTitle, setImprintTitle] = useState('');
  const [uploading, setUploading] = useState(false);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationPhase, setLocationPhase] = useState('');
  const gpsAcquiredRef = useRef(false);
  const [generateOptions, setGenerateOptions] = useState<GenerateOptions>(DEFAULT_GENERATE_OPTIONS);

  const fetchLocation = async () => {
    if (gpsAcquiredRef.current) return; // avoid double-fetch
    setLocationLoading(true);
    setLocationError(null);
    setLocationPhase('正在请求定位权限...');

    const timeoutId = setTimeout(() => {
      if (gpsAcquiredRef.current) return;
      setLocationError('定位请求超时，请检查网络连接后重试。');
      setLocationLoading(false);
    }, LOCATION_TIMEOUT_MS);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        clearTimeout(timeoutId);
        setLocationError('需要定位权限才能锚定时空坐标。请在设置中开启定位权限。');
        setLocationLoading(false);
        return;
      }

      setLocationPhase('正在获取GPS坐标...');
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setGpsCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });

      setLocationPhase('正在查询天气与地点信息...');
      const info = await getLocationInfo(loc.coords.latitude, loc.coords.longitude);
      setLocationInfo(info);
      gpsAcquiredRef.current = true;
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('Network') || msg.includes('fetch') || msg.includes('Abort')) {
        setLocationError('无法连接刻迹服务器。请确保手机与后端在同一网络，并检查 MANUAL_BASE_URL 配置。');
      } else if (msg.includes('Location') || msg.includes('position')) {
        setLocationError('无法获取GPS定位。请确保已开启定位服务并授权。');
      } else {
        setLocationError(`定位失败: ${msg}`);
      }
    } finally {
      clearTimeout(timeoutId);
      setLocationLoading(false);
      setLocationPhase('');
    }
  };

  // Get GPS location on mount
  useEffect(() => {
    fetchLocation();
  }, []);

  const handleRetryLocation = () => {
    gpsAcquiredRef.current = false;
    fetchLocation();
  };

  const handleTakePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('需要相机权限', '请允许访问相机以拍摄此刻的场景。');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.85,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handlePickFromGallery = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('需要相册权限', '请允许访问相册以选择照片。');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.85,
      allowsEditing: true,
      aspect: [3, 4],
    });
    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setImageUri(null);
  };

  const handleMint = async () => {
    if (!imageUri || !locationInfo || !gpsCoords) return;

    setUploading(true);
    try {
      const result = await uploadCollectible(
        imageUri,
        gpsCoords.lat,
        gpsCoords.lng,
        message,
        generateOptions,
        imprintTitle,
      );
      router.push(`/generating?collectibleId=${result.collectibleId}` as never);
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('Network') || msg.includes('fetch') || msg.includes('Abort')) {
        Alert.alert(
          '无法连接服务器',
          '请检查：\n1. 后端是否已启动 (uvicorn main:app --host 0.0.0.0 --port 8000)\n2. MANUAL_BASE_URL 是否设置为电脑的局域网IP',
          [
            { text: '取消', style: 'cancel' },
            { text: '重试', onPress: handleMint },
          ],
        );
      } else {
        Alert.alert('上传失败', msg, [
          { text: '取消', style: 'cancel' },
          { text: '重试', onPress: handleMint },
        ]);
      }
    } finally {
      setUploading(false);
    }
  };

  const isReady = Boolean(imageUri) && Boolean(locationInfo) && Boolean(gpsCoords) && !uploading;

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

  const subtitle = locationInfo
    ? `${locationInfo.weatherCondition} · ${locationInfo.temperature}°C · ${locationInfo.locationName}`
    : locationError
      ? '定位失败，请重试'
      : '拍照即锚定：坐标、时间、天气自动存档';

  const footer = (
    <View style={styles.footer}>
      <ThemedText themeColor="textSecondary" style={styles.footerHint}>
        {isReady
          ? '坐标、时间、天气已自动锚定，确认后即可铸造。'
          : locationLoading
            ? locationPhase || '正在获取位置与气象数据...'
            : locationError
              ? '请先解决定位问题后再拍摄照片。'
              : '拍摄或选择一张照片，系统将自动锚定时空气象数据。'}
      </ThemedText>
      <PrimaryButton
        disabled={!isReady}
        label={uploading ? '上传中...' : '从时间里挖掘'}
        loading={uploading}
        loadingLabel="正在上传..."
        onPress={handleMint}
        tone="default"
        size="lg"
      />
    </View>
  );

  return (
    <ScreenShell
      eyebrow="创作"
      footer={footer}
      headerDensity="compact"
      subtitle={subtitle}
      title="铸造刻迹"
      tone="default"
    >

      {/* 标题输入：留空则AI自动生成 */}
      <GlowCard padding="sm" tone="default">
        <View style={styles.titleHeader}>
          <ThemedText style={styles.titleLabel}>印记标题</ThemedText>
          <ThemedText themeColor="textMuted" style={styles.titleHint}>
            {imprintTitle.trim() ? '将使用你输入的标题' : '留空将由 AI 自动生成'}
          </ThemedText>
        </View>
        <TextInput
          autoCapitalize="sentences"
          autoCorrect={false}
          onChangeText={setImprintTitle}
          placeholder="为这个刻迹起个名字，或留空让 AI 帮你..."
          placeholderTextColor="#8c837a"
          style={styles.titleInput}
          value={imprintTitle}
          multiline={false}
          returnKeyType="done"
        />
      </GlowCard>

      <ArtImage
        aspectRatio={686 / 120}
        placeholderLabel="创作台氛围图"
        src={ART_BANNER_URI}
        style={styles.artBanner}
      />

      <UploadDropzone
        artPlaceholderUri={ART_UPLOAD_BG_URI}
        description="拍照或从相册选择"
        hint="拍摄你此刻所在的地方"
        imageUri={imageUri}
        onPick={handleTakePhoto}
        onPickFromGallery={handlePickFromGallery}
        onRemove={handleRemoveImage}
        onReplace={handleTakePhoto}
        style={styles.uploadCard}
        title="拍摄此刻"
        tone="default"
      />

      <CustomizationPanel
        onChange={setGenerateOptions}
        value={generateOptions}
      />

      {/* Location loading indicator */}
      {locationLoading && !locationInfo && (
        <GlowCard padding="sm" tone="default">
          <View style={styles.loadingState}>
            <ActivityIndicator size="small" color="#b08a59" />
            <View style={styles.loadingText}>
              <ThemedText style={styles.loadingTitle}>
                {locationPhase || '正在获取位置数据...'}
              </ThemedText>
              <ThemedText themeColor="textSecondary" style={styles.loadingDesc}>
                通过GPS获取坐标、时间、天气与AQI数据
              </ThemedText>
            </View>
          </View>
        </GlowCard>
      )}

      {/* Location error */}
      {locationError && !locationInfo && (
        <GlowCard padding="sm" tone="error">
          <View style={styles.errorState}>
            <StatusPill dot={false} label="定位失败" size="sm" tone="error" />
            <ThemedText themeColor="textSecondary" style={styles.errorText}>
              {locationError}
            </ThemedText>
            <PrimaryButton
              fullWidth={false}
              label="重新获取位置"
              onPress={handleRetryLocation}
              size="sm"
              tone="default"
              variant="secondary"
            />
          </View>
        </GlowCard>
      )}

      {/* Anchor data */}
      {locationInfo ? (
        <>
          <GlowCard padding="sm" tone="default">
            <View style={styles.autoHeader}>
              <ThemedText style={styles.autoTitle}>自动锚定数据</ThemedText>
              <StatusPill dot status="complete" tone="success" />
            </View>

            <View style={styles.anchorGrid}>
              <AnchorRow label="定位" value={gpsCoords ? `${gpsCoords.lat.toFixed(4)}°N ${gpsCoords.lng.toFixed(4)}°E` : '--°N --°E'} />
              <AnchorRow label="地点" value={locationInfo.locationName} />
              <AnchorRow label="时间" value={timeStr} />
              <AnchorRow
                label="天气"
                value={`${locationInfo.weatherCondition} · ${locationInfo.temperature}°C`}
              />
              <AnchorRow label="风" value={`${locationInfo.windDirection} ${locationInfo.windLevel}级`} />
              <AnchorRow label="空气" value={`${locationInfo.aqiLevel} · AQI ${locationInfo.aqi}`} />
              <AnchorRow label="地点气质" value={`${locationInfo.locationStyle} · ${locationInfo.eraLabel}`} />
              <AnchorRow label="在场序列" value={`第 ${locationInfo.mintNumber} 位铸造者`} />
            </View>

            <ThemedText themeColor="textMuted" style={styles.anchorNote}>
              数据通过设备GPS与公开气象API自动获取，无需手动输入。
            </ThemedText>
          </GlowCard>

          {/* Optional message */}
          <GlowCard padding="sm" tone="default">
            <View style={styles.messageHeader}>
              <ThemedText style={styles.autoTitle}>一行留言</ThemedText>
              <ThemedText themeColor="textMuted" style={styles.messageOptional}>选填</ThemedText>
            </View>
            <TextInput
              autoCapitalize="sentences"
              autoCorrect={false}
              onChangeText={setMessage}
              placeholder="写给此刻的自己，或未来的观者..."
              placeholderTextColor="#8c837a"
              style={styles.messageInput}
              value={message}
              multiline={false}
              returnKeyType="done"
            />
          </GlowCard>
        </>
      ) : (!locationLoading && !locationError) ? (
        <GlowCard padding="sm" tone="default">
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyTitle}>拍摄后自动锚定</ThemedText>
            <ThemedText themeColor="textSecondary" style={styles.emptyDesc}>
              系统将通过 GPS 获取你的坐标、当前时间与天气数据，作为这张刻迹的不可篡改锚点。
            </ThemedText>
            <View style={styles.threeItems}>
              <View style={styles.threeItem}>
                <ThemedText style={styles.threeIcon}>📍</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.threeLabel}>GPS坐标</ThemedText>
              </View>
              <View style={styles.threeItem}>
                <ThemedText style={styles.threeIcon}>🕐</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.threeLabel}>时间戳</ThemedText>
              </View>
              <View style={styles.threeItem}>
                <ThemedText style={styles.threeIcon}>🌤</ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.threeLabel}>天气/AQI</ThemedText>
              </View>
            </View>
          </View>
        </GlowCard>
      ) : null}
    </ScreenShell>
  );
}

function AnchorRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.anchorRow}>
      <ThemedText themeColor="textMuted" style={styles.anchorRowLabel}>{label}</ThemedText>
      <ThemedText style={styles.anchorRowValue}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    gap: Spacing.two,
  },
  footerHint: {
    fontSize: 12,
    lineHeight: 16,
  },
  artBanner: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
    borderRadius: 18,
  },
  uploadCard: {
    width: '100%',
    maxWidth: 520,
    alignSelf: 'center',
  },
  autoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autoTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 700,
  },
  anchorGrid: {
    gap: 8,
    marginTop: Spacing.two,
  },
  anchorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  anchorRowLabel: {
    fontSize: 13,
    lineHeight: 18,
  },
  anchorRowValue: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: 600,
  },
  anchorNote: {
    fontSize: 11,
    lineHeight: 16,
    marginTop: Spacing.two,
  },
  titleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleLabel: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 700,
  },
  titleHint: {
    fontSize: 11,
    lineHeight: 14,
  },
  titleInput: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(176, 138, 89, 0.24)',
    backgroundColor: 'rgba(255, 253, 248, 0.92)',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: 600,
    color: '#1b1714',
    marginTop: Spacing.two,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageOptional: {
    fontSize: 12,
    lineHeight: 16,
  },
  messageInput: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(176, 138, 89, 0.24)',
    backgroundColor: 'rgba(255, 253, 248, 0.92)',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 21,
    color: '#1b1714',
    marginTop: Spacing.two,
  },
  loadingState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    paddingVertical: Spacing.one,
  },
  loadingText: {
    flex: 1,
    gap: 2,
  },
  loadingTitle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: 600,
  },
  loadingDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
  errorState: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    gap: Spacing.two,
    paddingVertical: Spacing.one,
  },
  emptyTitle: {
    fontSize: 17,
    lineHeight: 22,
    fontWeight: 700,
  },
  emptyDesc: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },
  threeItems: {
    flexDirection: 'row',
    gap: Spacing.four,
    marginTop: Spacing.two,
  },
  threeItem: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  threeIcon: {
    fontSize: 28,
  },
  threeLabel: {
    fontSize: 12,
    lineHeight: 16,
  },
});
