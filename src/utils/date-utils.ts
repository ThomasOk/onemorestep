/**
 * Vérifie si la date fournie est aujourd'hui
 * @param date Date à vérifier
 * @returns Vrai si la date est aujourd'hui, faux sinon
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Formate une date dans un format lisible en français
 * @param date Date à formater
 * @returns Chaîne formatée (ex: "lundi 10 mai")
 */
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
};

/**
 * Obtient la date d'hier
 * @param date Date de référence (aujourd'hui par défaut)
 * @returns Une nouvelle date représentant hier
 */
export const getYesterday = (date: Date = new Date()): Date => {
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday;
};
