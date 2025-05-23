import { useEffect, useState } from 'react';
import { useSharedValue, withTiming, withDelay, Easing } from 'react-native-reanimated';

export const useStepAnimation = (currentSteps: number, previousSteps: number = 0) => {
  const [displayedSteps, setDisplayedSteps] = useState(previousSteps);

  // Valeurs animées pour le compteur et la barre de progression
  const animatedStepsValue = useSharedValue(previousSteps);
  const animatedProgress = useSharedValue(previousSteps);

  // Animation lorsque les pas changent
  useEffect(() => {
    if (currentSteps > 0) {
      // Animation de la barre de progression
      animatedProgress.value = withDelay(
        300,
        withTiming(currentSteps, {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        })
      );

      // Animation du compteur de pas
      animatedStepsValue.value = withDelay(
        300,
        withTiming(currentSteps, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        })
      );

      console.log(`Animation démarrée: de ${previousSteps} à ${currentSteps}`);
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
  };
};
