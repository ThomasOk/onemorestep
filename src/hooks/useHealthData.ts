import { useEffect, useState, useCallback, useRef } from 'react';
import { initialize, requestPermission, readRecords } from 'react-native-health-connect';
import { TimeRangeFilter } from 'react-native-health-connect/lib/typescript/types/base.types';
import { Platform, AppState } from 'react-native';

// Variable globale pour le suivi des chargements initiaux
let isInitialLoadDone = false;

const useHealthData = (selectedDate: Date = new Date()) => {
  const [steps, setSteps] = useState(0);
  const [yesterdaySteps, setYesterdaySteps] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  // Référence pour le timer d'intervalle
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  // Référence pour la date sélectionnée
  const dateRef = useRef(selectedDate);

  // Fonction pour vérifier si une date est aujourd'hui
  const isToday = useCallback((date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, []);

  // Fonction pour obtenir les pas pour une date spécifique
  const getStepsForDate = useCallback(
    async (date: Date) => {
      // Vérifier si l'initialisation et les permissions sont OK
      if (!hasPermission) {
        console.log("Tentative d'accès sans permission");
        return null;
      }

      // Créer la plage de temps pour la date
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const timeRangeFilter: TimeRangeFilter = {
        operator: 'between',
        startTime: startOfDay.toISOString(),
        endTime: endOfDay.toISOString(),
      };

      // Lecture des enregistrements de pas
      try {
        console.log('Tentative de lecture des pas pour', date.toDateString());
        const stepsResponse = await readRecords('Steps', { timeRangeFilter });
        console.log('Réponse obtenue:', stepsResponse?.records?.length || 0, 'enregistrements');
        return stepsResponse;
      } catch (error) {
        console.error(`Erreur lors de la récupération des pas pour ${date.toDateString()}:`, error);
        return null;
      }
    },
    [hasPermission]
  );

  // Fonction pour calculer le nombre total de pas
  const calculateTotalSteps = useCallback((response: any): number => {
    if (!response || !response.records || response.records.length === 0) {
      return 0;
    }

    // Additionner tous les pas
    let totalSteps = 0;
    response.records.forEach((record: any) => {
      totalSteps += record.count || 0;
    });

    return totalSteps;
  }, []);

  // Fonction pour initialiser l'API Health Connect et obtenir les permissions
  const setupHealthConnect = useCallback(async (): Promise<boolean> => {
    if (Platform.OS !== 'android') {
      console.log('Non Android, permissions ignorées');
      // Sur iOS ou web, on considère que c'est bon
      setHasPermission(true);
      return true;
    }

    try {
      console.log('Initialisation de Health Connect...');
      const isInitialized = await initialize();

      if (!isInitialized) {
        console.log("Échec de l'initialisation de Health Connect");
        return false;
      }

      console.log('Demande de permission pour les pas...');
      const permissions = await requestPermission([{ accessType: 'read', recordType: 'Steps' }]);

      const hasStepsPermission = permissions.some((perm) => perm.recordType === 'Steps');
      console.log('Permission pour les pas:', hasStepsPermission);

      setHasPermission(hasStepsPermission);
      return hasStepsPermission;
    } catch (error) {
      console.error("Erreur lors de l'initialisation:", error);
      return false;
    }
  }, []);

  // Fonction pour charger les données de santé
  const loadHealthData = useCallback(
    async (date: Date) => {
      // Éviter les chargements multiples simultanés
      if (Platform.OS !== 'android') {
        // Sur iOS, on simule des données pour tester l'interface
        console.log('Simulation de données sur non-Android');
        setSteps(8754);
        setYesterdaySteps(7432);
        setIsLoading(false);
        setLastUpdated(new Date());
        return;
      }

      console.log('Début du chargement des données pour', date.toDateString());
      setIsLoading(true);

      try {
        // S'assurer que nous avons les permissions avant de continuer
        const permissionOk = hasPermission || (await setupHealthConnect());

        if (!permissionOk) {
          console.log('Pas de permission, impossible de charger les données');
          // Même sans permission, on arrête le chargement
          setIsLoading(false);
          return;
        }

        // 1. Récupérer les pas pour la date sélectionnée
        const todayResponse = await getStepsForDate(date);
        const todaySteps = calculateTotalSteps(todayResponse);
        console.log('Pas trouvés:', todaySteps);

        // 2. Récupérer les pas pour la veille
        const yesterday = new Date(date);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayResponse = await getStepsForDate(yesterday);
        const ystdySteps = calculateTotalSteps(yesterdayResponse);
        console.log("Pas d'hier trouvés:", ystdySteps);

        // Mettre à jour l'état même si les résultats sont à 0
        setSteps(todaySteps);
        setYesterdaySteps(ystdySteps);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        // En cas d'erreur, on affiche 0 pour ne pas bloquer l'interface
        setSteps(0);
        setYesterdaySteps(0);
      } finally {
        // Important: toujours terminer le chargement, même en cas d'erreur
        console.log('Fin du chargement des données');
        setIsLoading(false);
      }
    },
    [hasPermission, setupHealthConnect, getStepsForDate, calculateTotalSteps]
  );

  // Effet principal pour gérer le chargement des données et les intervalles
  useEffect(() => {
    // Mettre à jour la référence de date
    dateRef.current = selectedDate;

    // Vérifier si c'est la première exécution
    const isFirstLoad = !isInitialLoadDone;

    // Fonction asynchrone pour charger les données
    const loadData = async () => {
      if (isFirstLoad) {
        console.log('Premier chargement des données');
        isInitialLoadDone = true;
      }

      // Charger les données
      await loadHealthData(selectedDate);
    };

    // Lancer le chargement
    loadData();

    // Nettoyer l'intervalle existant
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }

    // Configurer un nouvel intervalle uniquement pour aujourd'hui
    if (isToday(selectedDate)) {
      console.log("Configuration de l'intervalle de mise à jour");
      intervalIdRef.current = setInterval(() => {
        if (isToday(dateRef.current)) {
          loadHealthData(dateRef.current);
        }
      }, 60000);
    }

    // Configuration du listener AppState pour les mises à jour quand l'app revient au premier plan
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && isToday(dateRef.current)) {
        console.log('App revenue au premier plan, chargement des données');
        loadHealthData(dateRef.current);
      }
    });

    // Nettoyage lors du démontage
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      subscription.remove();
    };
  }, [selectedDate, isToday, loadHealthData]);

  // Formats et utilités
  const formatDate = useCallback((date: Date): string => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  }, []);

  const getLastUpdatedText = useCallback((): string => {
    if (!lastUpdated) return 'Jamais mis à jour';
    return `Mis à jour à ${lastUpdated.toLocaleTimeString('fr-FR')}`;
  }, [lastUpdated]);

  return {
    steps,
    yesterdaySteps,
    isLoading,
    lastUpdated,
    formatDate,
    isToday,
    getLastUpdatedText,
  };
};

export default useHealthData;
