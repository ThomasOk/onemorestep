// src/features/steps/components/steps-display.tsx
import React from 'react';
import { View } from 'react-native';
import Animated, {
  SharedValue,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { AppText } from '@/components/app-text';
import { ProgressBar } from '@/components/ui/progress-bar';
import { DevControls } from './dev-controls';
import { LevelInfo } from '../utils/level-utils';

interface StepsDisplayProps {
  displayedSteps: number;
  animatedProgress: SharedValue<number>;
  flashTrigger: SharedValue<number>;
  yesterdaySteps: number;
  levelInfo: LevelInfo;
  devMode: boolean;
  setDevMode: (mode: boolean) => void;
  resetDevCounter: () => void;
  isLevelingUp: boolean;
}

// Composant Badge "Level Up!" séparé
const LevelUpBadge: React.FC<{ flashTrigger: SharedValue<number> }> = ({ flashTrigger }) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(20); // Commence à droite, hors de vue
  const scale = useSharedValue(0.8);

  useAnimatedReaction(
    () => flashTrigger?.value ?? 0,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue > 0) {
        // Animation d'apparition du badge depuis la droite
        opacity.value = withSequence(
          withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.2)) }),
          withDelay(2000, withTiming(0, { duration: 500, easing: Easing.in(Easing.cubic) }))
        );

        translateX.value = withSequence(
          withTiming(0, { duration: 300, easing: Easing.out(Easing.back(1.2)) }),
          withDelay(2000, withTiming(20, { duration: 500, easing: Easing.in(Easing.cubic) }))
        );

        scale.value = withSequence(
          withTiming(1.1, { duration: 150, easing: Easing.out(Easing.back(1.2)) }),
          withTiming(1, { duration: 200, easing: Easing.inOut(Easing.cubic) }),
          withDelay(1800, withTiming(0.8, { duration: 500, easing: Easing.in(Easing.cubic) }))
        );
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }, { scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          right: -70, // Position fixe à droite du texte (ajuste selon la largeur de ton texte)
          top: 0, // Aligné avec le haut du texte
          backgroundColor: '#000000',
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 6,
          // borderWidth: 1,
          // borderColor: '#22c55e',
        },
      ]}
      pointerEvents="none">
      <AppText className="text-xs text-green-500">LEVEL UP!</AppText>
    </Animated.View>
  );
};

export const StepsDisplay: React.FC<StepsDisplayProps> = ({
  displayedSteps,
  animatedProgress,
  flashTrigger,
  yesterdaySteps,
  levelInfo,
  devMode,
  setDevMode,
  resetDevCounter,
  isLevelingUp,
}) => {
  return (
    <>
      <View className="flex-1 items-center">
        <View className="items-center">
          {/* Conteneur du niveau - structure originale restaurée */}
          <View className="relative mb-5">
            <AppText className="text-2xl text-white">Lv {levelInfo.currentLevel}</AppText>

            {/* Badge "Level Up!" positionné absolument à droite */}
            <LevelUpBadge flashTrigger={flashTrigger} />
          </View>
        </View>

        <View className="w-1/2">
          <AppText className="text-base text-white">next level</AppText>

          <ProgressBar
            progress={animatedProgress}
            flashTrigger={flashTrigger}
            maxValue={levelInfo.totalStepsForCurrentLevel}
            width="100%"
            height={12}
            outerBorderWidth={2}
            innerBorderWidth={2}
            outerBorderColor="#ffffff"
            innerBorderColor="#000000"
            backgroundColor="#333333"
            fillColor="#fecdd3"
            flashColor="#ffffff"
            flashDuration={400}
          />
        </View>

        <DevControls devMode={devMode} setDevMode={setDevMode} resetDevCounter={resetDevCounter} />
      </View>

      <View className="w-full items-center pb-10">
        <AppText className="text-lg text-white">{`Yesterday: ${yesterdaySteps}`}</AppText>
      </View>
    </>
  );
};
