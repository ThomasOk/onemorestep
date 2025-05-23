import { useState, useEffect } from 'react';
import { getLeaderboard, getCurrentUserRank } from '../../../services/leaderboard';

interface LeaderboardUser {
  id: string;
  name: string;
  steps: number;
}

export default function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        // Dans un vrai scénario, ces données viendraient d'une API
        // Pour l'instant, on utilise des données fictives
        const leaderboardData = await getLeaderboard();
        const userRank = await getCurrentUserRank();

        setLeaderboard(leaderboardData);
        setCurrentUserRank(userRank);
      } catch (error) {
        console.error('Erreur lors de la récupération du classement:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return { leaderboard, isLoading, currentUserRank };
}
