import { useEffect, useState } from 'react';
import {
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { calculateLevelInfo, hasLeveledUp, LevelInfo } from '../utils/level-utils';

export const useStepAnimation = (currentSteps: number, previousSteps: number = 0) => {
  const [displayedSteps, setDisplayedSteps] = useState(previousSteps);
  const [levelInfo, setLevelInfo] = useState<LevelInfo>(calculateLevelInfo(previousSteps));
  const [displayedLevel, setDisplayedLevel] = useState(
    calculateLevelInfo(previousSteps).currentLevel
  );
  const [isLevelingUp, setIsLevelingUp] = useState(false);

  // Valeurs animées
  const animatedStepsValue = useSharedValue(previousSteps);
  const animatedProgress = useSharedValue(calculateLevelInfo(previousSteps).progressInCurrentLevel);

  // Flash trigger qui ne se déclenche QUE pour les passages de niveau
  const levelUpFlashTrigger = useSharedValue(0);

  const updateDisplayedLevel = (newLevel: number) => {
    setDisplayedLevel(newLevel);
    setIsLevelingUp(false);
  };

  // Fonction pour déclencher le flash de passage de niveau
  const triggerLevelUpFlash = () => {
    levelUpFlashTrigger.value = levelUpFlashTrigger.value + 1;
    console.log('🎉 Level up flash triggered!');
  };

  const ANIMATION_TIMINGS = {
    fillToPrevious: 300,
    pauseAtFull: 0,
    resetToZero: 200,
    fillToNew: 500,
    stepsCounter: 800,
    delayBeforeStart: 300,
  };

  useEffect(() => {
    if (currentSteps > 0) {
      const currentLevelInfo = calculateLevelInfo(currentSteps);
      const previousLevelInfo = calculateLevelInfo(previousSteps);
      const leveledUp = hasLeveledUp(previousSteps, currentSteps);

      setLevelInfo(currentLevelInfo);

      if (leveledUp) {
        setIsLevelingUp(true);
        console.log(
          `🚀 Level up detected: ${previousLevelInfo.currentLevel} → ${currentLevelInfo.currentLevel}`
        );

        animatedProgress.value = withSequence(
          // 1. Remplir jusqu'à la fin du niveau précédent
          withTiming(
            1000,
            {
              duration: ANIMATION_TIMINGS.fillToPrevious,
              easing: Easing.out(Easing.cubic),
            },
            () => {
              // Flash UNIQUEMENT au passage de niveau quand on atteint 100%
              runOnJS(triggerLevelUpFlash)();
            }
          ),

          // 2. Pause
          withDelay(ANIMATION_TIMINGS.pauseAtFull, withTiming(1000, { duration: 0 })),

          // 3. Vider la barre + mettre à jour le niveau
          withTiming(
            0,
            {
              duration: ANIMATION_TIMINGS.resetToZero,
              easing: Easing.inOut(Easing.cubic),
            },
            () => {
              runOnJS(updateDisplayedLevel)(currentLevelInfo.currentLevel);
            }
          ),

          // 4. Remplir vers la nouvelle progression
          withTiming(currentLevelInfo.progressInCurrentLevel, {
            duration: ANIMATION_TIMINGS.fillToNew,
            easing: Easing.out(Easing.cubic),
          })
        );
      } else {
        // Animation normale - PAS de flash
        console.log('📈 Normal progress animation');
        animatedProgress.value = withDelay(
          ANIMATION_TIMINGS.delayBeforeStart,
          withTiming(currentLevelInfo.progressInCurrentLevel, {
            duration: ANIMATION_TIMINGS.fillToNew,
            easing: Easing.out(Easing.cubic),
          })
        );
      }

      // Animation du compteur de pas
      animatedStepsValue.value = withDelay(
        ANIMATION_TIMINGS.delayBeforeStart,
        withTiming(currentSteps, {
          duration: ANIMATION_TIMINGS.stepsCounter,
          easing: Easing.out(Easing.cubic),
        })
      );
    }
  }, [currentSteps, previousSteps]);

  useEffect(() => {
    const updateDisplayedSteps = () => {
      const valueToDisplay = Math.round(animatedStepsValue.value);
      setDisplayedSteps(valueToDisplay);
    };

    const intervalId = setInterval(updateDisplayedSteps, 16);
    return () => clearInterval(intervalId);
  }, [animatedStepsValue.value]);

  return {
    displayedSteps,
    animatedStepsValue,
    animatedProgress,
    flashTrigger: levelUpFlashTrigger, // Renommé pour clarifier
    levelInfo: {
      ...levelInfo,
      currentLevel: displayedLevel,
    },
    isLevelingUp,
  };
};
