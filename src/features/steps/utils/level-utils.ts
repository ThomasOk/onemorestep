export interface LevelInfo {
  currentLevel: number;
  progressInCurrentLevel: number;
  progressPercentage: number;
  stepsToNextLevel: number;
  totalStepsForCurrentLevel: number;
}

const STEPS_PER_LEVEL = 1000;

/**
 * Calcule les informations de niveau basées sur le nombre total de pas
 */
export const calculateLevelInfo = (totalSteps: number): LevelInfo => {
  // Le niveau actuel (commence à 0)
  const currentLevel = Math.floor(totalSteps / STEPS_PER_LEVEL);

  // Les pas dans le niveau actuel (reste de la division)
  const progressInCurrentLevel = totalSteps % STEPS_PER_LEVEL;

  // Pourcentage de progression dans le niveau actuel
  const progressPercentage = (progressInCurrentLevel / STEPS_PER_LEVEL) * 100;

  // Pas nécessaires pour atteindre le niveau suivant
  const stepsToNextLevel = STEPS_PER_LEVEL - progressInCurrentLevel;

  // Total de pas nécessaires pour compléter le niveau actuel
  const totalStepsForCurrentLevel = STEPS_PER_LEVEL;

  return {
    currentLevel,
    progressInCurrentLevel,
    progressPercentage,
    stepsToNextLevel,
    totalStepsForCurrentLevel,
  };
};

/**
 * Vérifie si l'utilisateur vient de passer un niveau
 */
export const hasLeveledUp = (previousSteps: number, currentSteps: number): boolean => {
  const previousLevel = Math.floor(previousSteps / STEPS_PER_LEVEL);
  const currentLevel = Math.floor(currentSteps / STEPS_PER_LEVEL);

  return currentLevel > previousLevel;
};

/**
 * Obtient le nombre de niveaux gagnés
 */
export const getLevelsGained = (previousSteps: number, currentSteps: number): number => {
  const previousLevel = Math.floor(previousSteps / STEPS_PER_LEVEL);
  const currentLevel = Math.floor(currentSteps / STEPS_PER_LEVEL);

  return Math.max(0, currentLevel - previousLevel);
};
