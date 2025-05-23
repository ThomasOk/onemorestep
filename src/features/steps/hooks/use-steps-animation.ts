// src/features/steps/hooks/use-steps-animation.ts
import { useEffect, useState } from 'react';
import {
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { calculateLevelInfo, hasLeveledUp, LevelInfo } from '../utils/level-utils';

export const useStepAnimation = (currentSteps: number, previousSteps: number = 0) => {
  const [displayedSteps, setDisplayedSteps] = useState(previousSteps);
  const [levelInfo, setLevelInfo] = useState<LevelInfo>(calculateLevelInfo(previousSteps));

  // Valeurs animées pour le compteur et la barre de progression
  const animatedStepsValue = useSharedValue(previousSteps);
  const animatedProgress = useSharedValue(calculateLevelInfo(previousSteps).progressInCurrentLevel);

  // Animation lorsque les pas changent
  useEffect(() => {
    if (currentSteps > 0) {
      const currentLevelInfo = calculateLevelInfo(currentSteps);
      const previousLevelInfo = calculateLevelInfo(previousSteps);
      const leveledUp = hasLeveledUp(previousSteps, currentSteps);

      // Mettre à jour les informations de niveau
      setLevelInfo(currentLevelInfo);

      if (leveledUp) {
        // Animation spéciale pour le passage de niveau
        // 1. Remplir la barre jusqu'à 1000 (fin du niveau précédent)
        // 2. Réinitialiser la barre à 0
        // 3. Remplir jusqu'à la nouvelle progression
        animatedProgress.value = withSequence(
          // Étape 1: Remplir jusqu'à 1000 (fin du niveau)
          withTiming(1000, {
            duration: 300,
            easing: Easing.out(Easing.cubic),
          }),
          // Étape 2: Petite pause pour montrer le niveau complet
          withDelay(150, withTiming(1000, { duration: 0 })),
          // Étape 3: Réinitialiser à 0 (nouveau niveau)
          withTiming(0, {
            duration: 200,
            easing: Easing.inOut(Easing.cubic),
          }),
          // Étape 4: Remplir jusqu'à la nouvelle progression
          withTiming(currentLevelInfo.progressInCurrentLevel, {
            duration: 500,
            easing: Easing.out(Easing.cubic),
          })
        );
      } else {
        // Animation normale (pas de changement de niveau)
        animatedProgress.value = withDelay(
          300,
          withTiming(currentLevelInfo.progressInCurrentLevel, {
            duration: 500,
            easing: Easing.out(Easing.cubic),
          })
        );
      }

      // Animation du compteur de pas (inchangée)
      animatedStepsValue.value = withDelay(
        300,
        withTiming(currentSteps, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        })
      );

      console.log(`Animation démarrée: de ${previousSteps} à ${currentSteps}`, {
        leveledUp,
        previousLevel: previousLevelInfo.currentLevel,
        currentLevel: currentLevelInfo.currentLevel,
        progressInLevel: currentLevelInfo.progressInCurrentLevel,
      });
    }
  }, [currentSteps, previousSteps]);

  // Mise à jour de l'affichage selon la valeur animée
  useEffect(() => {
    const updateDisplayedSteps = () => {
      const valueToDisplay = Math.round(animatedStepsValue.value);
      setDisplayedSteps(valueToDisplay);
    };

    const intervalId = setInterval(updateDisplayedSteps, 16); // ~60fps
    return () => clearInterval(intervalId);
  }, [animatedStepsValue.value]);

  return {
    displayedSteps,
    animatedStepsValue,
    animatedProgress,
    levelInfo, // Nouvelles informations de niveau
  };
};
