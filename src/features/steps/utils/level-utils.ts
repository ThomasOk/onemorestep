export type LevelInfo = {
  currentLevel: number;
  progressInCurrentLevel: number; // pas dans le niveau actuel (0-999)
  progressPercentage: number; // pourcentage de progression dans le niveau actuel (0-100)
  totalStepsForNextLevel: number; // pas totaux nécessaires pour le prochain niveau
  stepsToNextLevel: number; // pas restants pour le prochain niveau
};

/**
 * Calcule les informations de niveau basées sur le nombre total de pas
 * @param totalSteps Nombre total de pas de l'utilisateur
 * @param stepsPerLevel Nombre de pas nécessaires par niveau (défaut: 1000)
 * @returns Informations détaillées sur le niveau actuel
 */
export const calculateLevelInfo = (totalSteps: number, stepsPerLevel: number = 1000): LevelInfo => {
  // Niveau actuel (commence à 0)
  const currentLevel = Math.floor(totalSteps / stepsPerLevel);

  // Progression dans le niveau actuel (0 à stepsPerLevel-1)
  const progressInCurrentLevel = totalSteps % stepsPerLevel;

  // Pourcentage de progression dans le niveau actuel
  const progressPercentage = (progressInCurrentLevel / stepsPerLevel) * 100;

  // Pas totaux nécessaires pour atteindre le prochain niveau
  const totalStepsForNextLevel = (currentLevel + 1) * stepsPerLevel;

  // Pas restants pour le prochain niveau
  const stepsToNextLevel = totalStepsForNextLevel - totalSteps;

  return {
    currentLevel,
    progressInCurrentLevel,
    progressPercentage,
    totalStepsForNextLevel,
    stepsToNextLevel,
  };
};

/**
 * Calcule le nombre total de pas basé sur le niveau et la progression
 * @param level Niveau actuel
 * @param progressInLevel Progression dans le niveau (0-999)
 * @param stepsPerLevel Pas par niveau
 * @returns Nombre total de pas
 */
export const calculateTotalStepsFromLevel = (
  level: number,
  progressInLevel: number,
  stepsPerLevel: number = 1000
): number => {
  return level * stepsPerLevel + progressInLevel;
};

/**
 * Vérifie si l'utilisateur a gagné un ou plusieurs niveaux
 * @param oldSteps Ancien nombre de pas
 * @param newSteps Nouveau nombre de pas
 * @param stepsPerLevel Pas par niveau
 * @returns Informations sur les niveaux gagnés
 */
export const checkLevelUp = (
  oldSteps: number,
  newSteps: number,
  stepsPerLevel: number = 1000
): {
  hasLeveledUp: boolean;
  levelsGained: number;
  oldLevel: number;
  newLevel: number;
} => {
  const oldLevel = Math.floor(oldSteps / stepsPerLevel);
  const newLevel = Math.floor(newSteps / stepsPerLevel);

  const levelsGained = newLevel - oldLevel;
  const hasLeveledUp = levelsGained > 0;

  return {
    hasLeveledUp,
    levelsGained,
    oldLevel,
    newLevel,
  };
};

/**
 * Formate le niveau pour l'affichage
 * @param level Niveau à formater
 * @returns Texte formaté (ex: "Lv 5")
 */
export const formatLevel = (level: number): string => {
  return `Lv ${level}`;
};

/**
 * Calcule les récompenses potentielles pour un niveau donné
 * @param level Niveau atteint
 * @returns Description des récompenses (à personnaliser selon vos besoins)
 */
export const getLevelRewards = (level: number): string[] => {
  const rewards: string[] = [];

  // Exemples de récompenses par paliers
  if (level >= 1) rewards.push('Déblocage du leaderboard');
  if (level >= 5) rewards.push('Badge Marcheur');
  if (level >= 10) rewards.push('Badge Explorateur');
  if (level >= 25) rewards.push('Badge Athlète');
  if (level >= 50) rewards.push('Badge Champion');
  if (level >= 100) rewards.push('Badge Légende');

  return rewards;
};

/**
 * Obtient un message motivationnel basé sur le niveau
 * @param level Niveau actuel
 * @returns Message motivationnel
 */
export const getLevelMotivationMessage = (level: number): string => {
  if (level === 0) return 'Faites vos premiers pas !';
  if (level < 5) return 'Bon début ! Continuez comme ça !';
  if (level < 10) return 'Vous prenez le rythme !';
  if (level < 25) return 'Marcheur confirmé !';
  if (level < 50) return 'Véritable athlète !';
  if (level < 100) return 'Champion de la marche !';
  return 'Légende vivante !';
};
