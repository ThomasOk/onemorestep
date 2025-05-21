import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  withSequence,
  withDelay,
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import StepsCard from '@/components/steps-card';
import { AppText } from '@/components/app-text';
import { PixelButton } from '@/components/ui/pixel-button';
import { useSteps } from '@/api/health/use-steps';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ProgressBar } from '@/components/ui/progress-bar';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [previousSteps, setPreviousSteps] = useState(0);
  const [displayedSteps, setDisplayedSteps] = useState(0);

  // Utilisez useMemo pour créer la date une seule fois
  const today = useMemo(() => new Date(), []);

  // Utiliser le hook avec la date mémorisée
  const { steps: originalSteps, yesterdaySteps, isLoading, loadHealthData } = useSteps(today);

  // Mode développement pour tester l'animation
  const [devMode, setDevMode] = useState(false);
  // Compteur de refreshes pour augmenter artificiellement les pas en dev
  const [refreshCount, setRefreshCount] = useState(0);
  // Pas simulés pour le développement
  const steps = devMode ? originalSteps + refreshCount * 500 : originalSteps;

  // Fonction pour réinitialiser le compteur en mode développement
  const resetDevCounter = () => {
    setRefreshCount(0);
    setPreviousSteps(originalSteps);
    setPreviousProgressValue(originalSteps);
    animatedStepsValue.value = originalSteps;
    animatedProgress.value = originalSteps;
    setDisplayedSteps(originalSteps);
    console.log('Compteur développement réinitialisé');
  };

  // Valeur animée pour la progression
  const animatedProgress = useSharedValue(0);

  // Valeur précédente de la progress bar pour l'animation
  const [previousProgressValue, setPreviousProgressValue] = useState(0);

  // Valeur animée pour le compteur de pas
  const animatedStepsValue = useSharedValue(0);

  // Effet pour animer les valeurs lorsque steps change
  useEffect(() => {
    if (dataLoaded && !isLoading && steps > 0) {
      // Définir la valeur de départ de l'animation des pas
      // Si c'est le premier chargement, partir de 0
      // Sinon, partir de la valeur précédente
      const startStepsValue = previousSteps > 0 ? previousSteps : 0;

      // Conserver la valeur actuelle de la barre de progression
      const currentProgressValue = animatedProgress.value;

      // Mettre à jour la valeur de départ pour l'animation des pas
      animatedStepsValue.value = startStepsValue;

      // Animation de la barre de progression - depuis sa dernière valeur
      // Ne pas réinitialiser à 0, mais continuer depuis la position actuelle
      animatedProgress.value = withDelay(
        300,
        withTiming(steps, {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        })
      );

      // Animation du compteur de pas
      animatedStepsValue.value = withDelay(
        300,
        withTiming(steps, {
          duration: 800,
          easing: Easing.out(Easing.cubic),
        })
      );

      console.log(`Animation démarrée: de ${startStepsValue} à ${steps}`);
      console.log(`Progress bar: de ${currentProgressValue} à ${steps}`);

      // Mettre à jour la valeur précédente pour la prochaine animation
      setPreviousProgressValue(steps);
    }
  }, [steps, dataLoaded, isLoading]);

  // Écouter les changements de la valeur animée et mettre à jour l'état
  useEffect(() => {
    // Créer une fonction pour mettre à jour l'état basé sur la valeur animée
    const updateDisplayedSteps = () => {
      const valueToDisplay = Math.round(animatedStepsValue.value);
      setDisplayedSteps(valueToDisplay);
    };

    // Créer un intervalle pour mettre à jour l'état pendant l'animation
    const intervalId = setInterval(updateDisplayedSteps, 16); // ~60fps

    // Nettoyer l'intervalle quand le composant est démonté
    return () => clearInterval(intervalId);
  }, [animatedStepsValue.value]);

  // Sauvegarder les pas précédents avant un refresh
  const handleBeforeRefresh = () => {
    setPreviousSteps(steps);
    setPreviousProgressValue(animatedProgress.value);
  };

  const handleLoadData = async () => {
    handleBeforeRefresh();
    await loadHealthData(today);
    setDataLoaded(true);
    console.log('tests steps with useSteps: ' + steps);
    console.log('tests yesterdaySteps with useSteps: ' + yesterdaySteps);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    handleBeforeRefresh();
    await loadHealthData(today);
    setDataLoaded(true);

    // En mode développement, incrémenter le compteur de refreshes
    if (devMode) {
      setRefreshCount((prev) => prev + 1);
    }

    setRefreshing(false);
    console.log('tests steps with useSteps: ' + originalSteps);
    console.log('tests yesterdaySteps with useSteps: ' + yesterdaySteps);
  }, [loadHealthData, today, originalSteps, devMode]);

  // Initialiser les données au démarrage
  useEffect(() => {
    if (!dataLoaded && !isLoading) {
      handleLoadData();
    }
  }, []);

  // Effet d'initialisation unique pour la barre de progression
  useEffect(() => {
    if (steps > 0 && animatedProgress.value === 0) {
      // Initialiser la barre directement à la valeur actuelle sans animation
      // pour le premier chargement seulement
      animatedProgress.value = steps;
      setPreviousProgressValue(steps);
      console.log(`Initialisation directe de la barre de progression à ${steps}`);
    }
  }, [steps]);

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
        <View className="absolute left-0 right-0 top-0 z-10 items-center py-2">
          <AppText className="text-sm text-slate-500">Pull down to sync your steps</AppText>
          <AppText className="text-sm text-slate-500">↓</AppText>
          <AppText className="mt-20 text-3xl text-white">Today</AppText>
        </View>

        {isLoading && !refreshing ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={{ color: 'white', marginTop: 10 }}>Chargement des données...</Text>
          </View>
        ) : (
          <>
            {/* Contenu principal centré */}
            <View className="flex-1 items-center justify-center">
              {/* Affichage des données de pas avec animation */}
              <View className="items-center">
                <AppText className="mb-5 text-3xl text-white">{displayedSteps}</AppText>
              </View>
              <ProgressBar
                progress={animatedProgress}
                maxValue={8000}
                width="50%"
                height={12}
                outerBorderWidth={2}
                innerBorderWidth={2}
                outerBorderColor="#ffffff"
                innerBorderColor="#000000"
                backgroundColor="#333333"
                fillColor="#fecdd3"
              />

              {/* Bouton pour activer/désactiver le mode développement */}
              <TouchableOpacity
                className="mt-6 rounded-lg bg-gray-800 p-3"
                onPress={() => setDevMode(!devMode)}>
                <AppText className="text-white">
                  {devMode ? 'Mode Dev: ON (+500 pas/refresh)' : 'Mode Dev: OFF'}
                </AppText>
              </TouchableOpacity>

              {/* Bouton de réinitialisation - visible uniquement en mode dev */}
              {devMode && (
                <TouchableOpacity
                  className="mt-3 rounded-lg bg-red-800 p-3"
                  onPress={resetDevCounter}>
                  <AppText className="text-white">Reset Dev Counter</AppText>
                </TouchableOpacity>
              )}
            </View>

            {/* Texte en bas de l'écran - affiché uniquement quand les données sont chargées */}
            <View className="w-full items-center pb-10">
              <AppText className="text-lg text-white">{`Yesterday: ${yesterdaySteps}`}</AppText>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
