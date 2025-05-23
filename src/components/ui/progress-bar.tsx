import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, DimensionValue } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';

export interface PixelProgressBarProps {
  progress: number | SharedValue<number>;
  maxValue?: number;
  width?: DimensionValue;
  height?: number;
  outerBorderWidth?: number;
  innerBorderWidth?: number;
  backgroundColor?: string;
  fillColor?: string;
  outerBorderColor?: string;
  innerBorderColor?: string;
  showPixelCorners?: boolean;
  style?: StyleProp<ViewStyle>;
  // Nouveaux props pour l'effet flash
  flashTrigger?: SharedValue<number>; // Déclenche le flash quand la valeur change
  flashColor?: string;
  flashDuration?: number;
}

export const ProgressBar: React.FC<PixelProgressBarProps> = ({
  progress,
  maxValue = 10000,
  width = '100%',
  height = 28,
  outerBorderWidth = 4,
  innerBorderWidth = 2,
  backgroundColor = '#333333',
  fillColor = '#92d050',
  outerBorderColor = '#ffffff',
  innerBorderColor = '#000000',
  showPixelCorners = true,
  style,
  flashTrigger,
  flashColor = '#ffffff',
  flashDuration = 300,
}) => {
  // Valeur pour contrôler l'effet flash
  const flashOpacity = useSharedValue(0);
  const lastFlashTrigger = useSharedValue(0);

  // Déclencher le flash quand flashTrigger change
  useAnimatedReaction(
    () => flashTrigger?.value ?? 0,
    (currentValue, previousValue) => {
      // Vérifier que la valeur a vraiment changé et qu'on n'est pas déjà en train de flasher
      if (
        currentValue !== previousValue &&
        currentValue > lastFlashTrigger.value &&
        flashOpacity.value === 0
      ) {
        lastFlashTrigger.value = currentValue;

        // Animation flash: apparition rapide puis disparition
        flashOpacity.value = withSequence(
          withTiming(0.8, {
            duration: flashDuration / 3,
            easing: Easing.out(Easing.cubic),
          }),
          withTiming(0.4, {
            duration: flashDuration / 3,
            easing: Easing.inOut(Easing.cubic),
          }),
          withTiming(0, {
            duration: flashDuration / 3,
            easing: Easing.in(Easing.cubic),
          })
        );
      }
    }
  );

  // Détermine si progress est une SharedValue ou un nombre simple
  const isSharedValue = typeof progress !== 'number';

  // Style animé pour la barre de progression
  const animatedProgressStyle = useAnimatedStyle(() => {
    const currentProgress = isSharedValue ? progress.value : progress;
    const clampedProgress = Math.max(0, Math.min(currentProgress, maxValue));
    const progressPercentage = (clampedProgress / maxValue) * 100;

    return {
      width: `${progressPercentage}%`,
    };
  });

  // Style animé pour l'effet flash
  const flashStyle = useAnimatedStyle(() => {
    return {
      opacity: flashOpacity.value,
    };
  });

  // Rendu des coins pixelisés
  const renderPixelCorners = () => {
    if (!showPixelCorners) return null;

    const cornerSize = Math.min(outerBorderWidth, 4);

    return (
      <>
        <View
          className="absolute left-0 top-0 bg-black"
          style={{ width: cornerSize, height: cornerSize }}
        />
        <View
          className="absolute right-0 top-0 bg-black"
          style={{ width: cornerSize, height: cornerSize }}
        />
        <View
          className="absolute bottom-0 left-0 bg-black"
          style={{ width: cornerSize, height: cornerSize }}
        />
        <View
          className="absolute bottom-0 right-0 bg-black"
          style={{ width: cornerSize, height: cornerSize }}
        />
      </>
    );
  };

  const styles = StyleSheet.create({
    container: {
      width,
      height,
      backgroundColor: outerBorderColor,
      padding: outerBorderWidth,
    },
    innerBorder: {
      width: '100%',
      height: '100%',
      backgroundColor: innerBorderColor,
      padding: innerBorderWidth,
    },
    background: {
      width: '100%',
      height: '100%',
      backgroundColor,
      overflow: 'hidden',
    },
    progress: {
      height: '100%',
      backgroundColor: fillColor,
    },
    // Styles pour l'effet flash
    flashOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: flashColor,
      pointerEvents: 'none',
    },
    sparkle: {
      position: 'absolute',
      width: 4,
      height: 4,
      backgroundColor: flashColor,
      borderRadius: 2,
    },
  });

  return (
    <View className="relative shadow-md" style={[styles.container, style]}>
      {renderPixelCorners()}

      <View className="h-full w-full" style={styles.innerBorder}>
        <View className="relative h-full w-full overflow-hidden" style={styles.background}>
          {/* Barre de progression */}
          <Animated.View className="h-full" style={[styles.progress, animatedProgressStyle]} />

          {/* Effet flash par-dessus la barre */}
          <Animated.View style={[styles.flashOverlay, flashStyle]} pointerEvents="none" />

          {/* Effet de brillance/sparkle optionnel */}
          <Animated.View style={[styles.sparkle, { top: '25%', left: '20%' }, flashStyle]} />
          <Animated.View style={[styles.sparkle, { top: '60%', right: '30%' }, flashStyle]} />
          <Animated.View style={[styles.sparkle, { top: '40%', left: '60%' }, flashStyle]} />
        </View>
      </View>
    </View>
  );
};
