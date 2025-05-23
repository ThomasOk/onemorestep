// src/app/(app)/home.tsx
import { View, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '@/components/app-text';
import { StepsDisplay } from '@/features/steps/components/steps-display';
import { useSteps } from '@/features/steps/hooks/use-steps-health-api';
import { useStepAnimation } from '@/features/steps/hooks/use-steps-animation';
import { getErrorMessage } from '@/utils/error-utils';
import { getLevelsGained } from '@/features/steps/utils/level-utils';
import { toast } from 'sonner-native';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [previousSteps, setPreviousSteps] = useState(0);
  const [devMode, setDevMode] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);
  const [syncError, setSyncError] = useState<string | null>(null);

  const today = useMemo(() => new Date(), []);

  const { steps: originalSteps, yesterdaySteps, isLoading, loadHealthData } = useSteps(today);

  const steps = devMode ? originalSteps + refreshCount * 500 : originalSteps;

  const { displayedSteps, animatedProgress, levelInfo } = useStepAnimation(steps, previousSteps);

  const showSyncNotification = (newSteps: number, oldSteps: number, hasError: boolean) => {
    if (hasError) {
      toast.error('Sync failed', {
        description: 'Unable to sync your steps',
        duration: 4000,
      });
      return;
    }

    const stepsDiff = newSteps - oldSteps;
    const levelsGained = getLevelsGained(oldSteps, newSteps);

    if (stepsDiff > 0) {
      toast.success(`${stepsDiff} steps added!`, {
        duration: 3000,
      });
    } else if (oldSteps === 0 && newSteps === 0) {
      toast('No step to add', {
        description: 'Start walking to track your steps',
        duration: 3000,
      });
    } else {
      toast('No more step to add', {
        description: 'Your steps are up to date',
        duration: 3000,
      });
    }
    if (levelsGained > 0) {
      // Notification spéciale pour le passage de niveau
      toast.success(`🎉 Level Up!`, {
        description: `You reached level ${levelInfo.currentLevel}!`,
        duration: 5000,
      });
    }
  };

  const resetDevCounter = () => {
    setRefreshCount(0);
    setPreviousSteps(originalSteps);
    console.log('Compteur développement réinitialisé');
  };

  // Préparation avant rafraîchissement des données
  const handleBeforeRefresh = useCallback(() => {
    setPreviousSteps(steps);
  }, [steps]);

  // Chargement initial des données
  const handleLoadData = useCallback(async () => {
    handleBeforeRefresh();
    try {
      setSyncError(null);
      await loadHealthData(today);
      setDataLoaded(true);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setSyncError(errorMessage);
      console.error('Error loading initial data:', error);
    }
  }, [loadHealthData, today, handleBeforeRefresh]);

  // Gestion du rafraîchissement par pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    const oldSteps = steps; // Capturer les pas avant le refresh
    handleBeforeRefresh();

    try {
      setSyncError(null);
      await loadHealthData(today);
      setDataLoaded(true);

      // En mode développement, incrémenter le compteur de refreshes
      if (devMode) {
        setRefreshCount((prev) => prev + 1);
      }

      // Afficher la notification après la synchronisation réussie
      // On utilise une petite attente pour que les états soient mis à jour
      setTimeout(() => {
        const newSteps = devMode ? originalSteps + (refreshCount + 1) * 500 : originalSteps;
        showSyncNotification(newSteps, oldSteps, false);
      }, 100);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setSyncError(errorMessage);
      showSyncNotification(0, 0, true);
      console.error('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, [loadHealthData, today, handleBeforeRefresh, devMode, steps, originalSteps, refreshCount]);

  // Charger les données au démarrage
  useEffect(() => {
    if (!dataLoaded && !isLoading) {
      handleLoadData();
    }
  }, [dataLoaded, isLoading, handleLoadData]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressBackgroundColor="#000"
            colors={['#FFFFFF']}
          />
        }>
        <View className="mb-20 items-center justify-center">
          <View className="mb-20 items-center">
            <AppText className="text-sm text-slate-500">Pull down to sync your steps</AppText>
            <AppText className="text-sm text-slate-500">↓</AppText>
          </View>
          <AppText className="mb-10 text-3xl text-white">Today</AppText>
          <AppText className="text-5xl text-white">{displayedSteps}</AppText>
          <AppText className="text-base text-slate-300">
            {displayedSteps > 0 ? 'steps' : 'step'}
          </AppText>
        </View>

        {isLoading && !refreshing ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FFFFFF" />
            <AppText className="mt-3 text-white">Chargement des données...</AppText>
          </View>
        ) : (
          <StepsDisplay
            displayedSteps={displayedSteps}
            animatedProgress={animatedProgress}
            yesterdaySteps={yesterdaySteps}
            levelInfo={levelInfo}
            devMode={devMode}
            setDevMode={setDevMode}
            resetDevCounter={resetDevCounter}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
