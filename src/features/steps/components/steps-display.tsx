import React from 'react';
import { View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';
import { AppText } from '@/components/app-text';
import { ProgressBar } from '@/components/ui/progress-bar';
import { DevControls } from './dev-controls';
import { LevelInfo } from '../utils/level-utils';

interface StepsDisplayProps {
  displayedSteps: number;
  animatedProgress: SharedValue<number>;
  yesterdaySteps: number;
  levelInfo: LevelInfo;
  devMode: boolean;
  setDevMode: (mode: boolean) => void;
  resetDevCounter: () => void;
}

export const StepsDisplay: React.FC<StepsDisplayProps> = ({
  displayedSteps,
  animatedProgress,
  yesterdaySteps,
  levelInfo,
  devMode,
  setDevMode,
  resetDevCounter,
}) => {
  return (
    <>
      <View className="flex-1 items-center">
        <View className="items-center">
          <AppText className="mb-5 text-2xl text-white">Lv {levelInfo.currentLevel}</AppText>
          {/* ↑ */}
          {/* <AppText className="mb-5 text-3xl text-white">{displayedSteps}</AppText> */}
        </View>
        <View className="w-1/2">
          <AppText className="text-base text-white">next level</AppText>

          <ProgressBar
            progress={animatedProgress}
            maxValue={levelInfo.totalStepsForCurrentLevel}
            width="100%"
            height={12}
            outerBorderWidth={2}
            innerBorderWidth={2}
            outerBorderColor="#ffffff"
            innerBorderColor="#000000"
            backgroundColor="#333333"
            fillColor="#fecdd3"
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
