// src/features/steps/components/steps-display.tsx
import React, { useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
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

// Composant Badge avec animation verticale
const LevelUpBadge: React.FC<{
  flashTrigger: SharedValue<number>;
  textWidth: number;
}> = ({ flashTrigger, textWidth }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30); // Commence EN BAS (valeur positive)
  const scale = useSharedValue(0.8);
  const animatedLeft = useSharedValue(textWidth + 8);

  // Animer la position quand textWidth change
  React.useEffect(() => {
    animatedLeft.value = withTiming(textWidth + 8, {
      duration: 200,
      easing: Easing.inOut(Easing.cubic),
    });
  }, [textWidth]);

  useAnimatedReaction(
    () => flashTrigger?.value ?? 0,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue && currentValue > 0) {
        opacity.value = withSequence(
          withTiming(1, { duration: 300, easing: Easing.out(Easing.back(1.2)) }),
          withDelay(4000, withTiming(0, { duration: 500, easing: Easing.in(Easing.cubic) }))
        );

        // Animation de bas en haut
        translateY.value = withSequence(
          withTiming(0, { duration: 300, easing: Easing.out(Easing.back(1.2)) }), // Monte vers sa position normale
          withDelay(4000, withTiming(-20, { duration: 500, easing: Easing.in(Easing.cubic) })) // Continue vers le haut pour disparaître
        );

        scale.value = withSequence(
          withTiming(1.1, { duration: 150, easing: Easing.out(Easing.back(1.2)) }),
          withTiming(1, { duration: 200, easing: Easing.inOut(Easing.cubic) }),
          withDelay(3800, withTiming(0.8, { duration: 500, easing: Easing.in(Easing.cubic) }))
        );
      }
    }
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    left: animatedLeft.value,
    transform: [
      { translateY: translateY.value }, // Animation verticale au lieu d'horizontale
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          top: 0,
          backgroundColor: '#000000',
          // paddingHorizontal: 8,
          // paddingVertical: 2,
          // borderRadius: 6,
          // borderWidth: 2,
          // borderColor: '#22c55e',
        },
      ]}
      pointerEvents="none">
      <AppText className="text-xs text-green-500">LEVEL UP↑</AppText>
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
  // État pour stocker la largeur du texte du niveau
  const [textWidth, setTextWidth] = useState(0);

  // Fonction appelée quand le texte est mesuré
  const onTextLayout = (event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setTextWidth(width);
  };

  return (
    <>
      <View className="flex-1 items-center">
        <View className="items-center">
          <View className="relative mb-5">
            {/* Texte du niveau avec mesure de largeur */}
            <AppText className="text-2xl text-white" onLayout={onTextLayout}>
              Lv {levelInfo.currentLevel}
            </AppText>

            {/* Badge positionné dynamiquement */}
            {textWidth > 0 && <LevelUpBadge flashTrigger={flashTrigger} textWidth={textWidth} />}
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
