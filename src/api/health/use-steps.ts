import { useEffect, useState } from 'react';
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';
import { Platform } from 'react-native';

type StepsBySource = {
  [key: string]: number;
};

export const useSteps = (selectedDate: Date = new Date()) => {
  const [steps, setSteps] = useState(0);
  const [yesterdaySteps, setYesterdaySteps] = useState(0);
  const [stepsBySource, setStepsBySource] = useState<StepsBySource>({});
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour calculer le nombre total de pas à partir d'une réponse Health Connect
  const calculateTotalSteps = (
    response: any
  ): { maxSteps: number; maxSource: string; stepsBySource: StepsBySource } => {
    if (!response || !response.records || response.records.length === 0) {
      return { maxSteps: 0, maxSource: '', stepsBySource: {} };
    }

    // Grouper par source
    const sourcesMap: StepsBySource = {};
    response.records.forEach((record: any) => {
      const source = record.metadata?.dataOrigin || 'inconnu';
      if (!sourcesMap[source]) {
        sourcesMap[source] = 0;
      }
      sourcesMap[source] += record.count;
    });

    // Trouver la source avec le plus grand nombre de pas
    let maxSteps = 0;
    let maxSource = '';

    Object.entries(sourcesMap).forEach(([source, count]) => {
      if (count > maxSteps) {
        maxSteps = count;
        maxSource = source;
      }
    });

    return { maxSteps, maxSource, stepsBySource: sourcesMap };
  };

  const getStepsForDate = async (date: Date) => {
    // Créer la plage de temps pour la date (de minuit à minuit)
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Filtre de temps pour la journée
    const timeRangeFilter: TimeRangeFilter = {
      operator: 'between',
      startTime: startOfDay.toISOString(),
      endTime: endOfDay.toISOString(),
    };

    // Lecture des enregistrements de pas
    try {
      const stepsResponse = await readRecords('Steps', { timeRangeFilter });
      return stepsResponse;
    } catch (error) {
      console.error(`Erreur lors de la récupération des pas pour ${date.toDateString()}:`, error);
      return null;
    }
  };

  // Fonction pour charger les données de santé
  const loadHealthData = async (date: Date) => {
    if (Platform.OS !== 'android') {
      return;
    }

    setIsLoading(true);

    try {
      // Initialisation du client Health Connect
      const isInitialized = await initialize();
      if (!isInitialized) {
        console.log('Failed to initialize Health Connect');
        setIsLoading(false);
        return;
      }

      // Demande permission pour les pas
      const grantedPermissions = await requestPermission([
        { accessType: 'read', recordType: 'Steps' },
      ]);

      // Vérifie si la permission pour les pas a été accordée
      const hasStepsPermission = grantedPermissions.some((perm) => perm.recordType === 'Steps');

      if (!hasStepsPermission) {
        console.log('No permission for Steps');
        setIsLoading(false);
        return;
      }

      // POUR TESTS: Décommentez et modifiez ces lignes pour tester avec des dates spécifiques
      /*
      // Test: Définir une plage de dates personnalisée pour le jour actuel
      const customStartDate = new Date('2024-05-08T00:00:00'); // Format YYYY-MM-DDTHH:MM:SS
      const customEndDate = new Date('2024-05-08T23:59:59');   // Format YYYY-MM-DDTHH:MM:SS
      
      // Remplacez date par customStartDate dans les appels ci-dessous
      // Et utilisez ces dates pour les tests
      console.log('Test: Plage de dates personnalisée', {
        start: customStartDate.toLocaleString(),
        end: customEndDate.toLocaleString()
      });
      */

      // 1. Récupérer les pas pour la date sélectionnée
      const todayResponse = await getStepsForDate(date);
      const { maxSteps, maxSource, stepsBySource: sourcesMap } = calculateTotalSteps(todayResponse);

      // 2. Récupérer les pas pour la veille
      const yesterday = new Date(date);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayResponse = await getStepsForDate(yesterday);
      const { maxSteps: yesterdayMaxSteps } = calculateTotalSteps(yesterdayResponse);

      // Mettre à jour l'état
      setSteps(maxSteps);
      setYesterdaySteps(yesterdayMaxSteps);
      setStepsBySource(sourcesMap);
      setSelectedSource(maxSource);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   loadHealthData(selectedDate);
  // }, [selectedDate]);

  // Fonction pour obtenir un nom convivial pour une source
  // const getSourceDisplayName = (source: string): string => {
  //   return sourceDisplayNames[source] || source;
  // };

  // Fonction pour formater une date
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return {
    steps,
    yesterdaySteps,
    stepsBySource,
    selectedSource,
    //getSourceDisplayName,
    isLoading,
    loadHealthData,
    formatDate,
  };
};
