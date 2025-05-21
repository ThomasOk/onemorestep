// Ce service simule des appels API pour récupérer le classement
// Dans une application réelle, ces fonctions feraient des appels à votre backend

interface LeaderboardUser {
  id: string;
  name: string;
  steps: number;
}

// Données fictives de classement
const mockLeaderboard: LeaderboardUser[] = [
  { id: '1', name: 'Sophie', steps: 12453 },
  { id: '2', name: 'Thomas', steps: 11289 },
  { id: '3', name: 'Julie', steps: 10876 },
  { id: '4', name: 'Vous', steps: 8567 }, // L'utilisateur actuel
  { id: '5', name: 'Maxime', steps: 7921 },
  { id: '6', name: 'Léa', steps: 6543 },
  { id: '7', name: 'Antoine', steps: 5432 },
  { id: '8', name: 'Emma', steps: 4983 },
  { id: '9', name: 'Lucas', steps: 3254 },
  { id: '10', name: 'Chloé', steps: 2198 },
];

// Simuler une récupération des données de classement
export async function getLeaderboard(): Promise<LeaderboardUser[]> {
  // Simulation d'un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Trier par nombre de pas décroissant
  return [...mockLeaderboard].sort((a, b) => b.steps - a.steps);
}

// Récupérer le rang de l'utilisateur actuel
export async function getCurrentUserRank(): Promise<LeaderboardUser | null> {
  // Simulation d'un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Dans une vraie application, vous identifieriez l'utilisateur par son ID
  return mockLeaderboard.find((user) => user.id === '4') || null;
}

// Mettre à jour les pas de l'utilisateur actuel
export async function updateUserSteps(steps: number): Promise<void> {
  // Simulation d'un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Dans une vraie application, vous mettriez à jour les données sur le serveur
  const currentUser = mockLeaderboard.find((user) => user.id === '4');
  if (currentUser) {
    currentUser.steps = steps;
  }
}
