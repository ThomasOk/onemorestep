import { useFonts, DotGothic16_400Regular } from '@expo-google-fonts/dotgothic16';
import './global.css';
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import useHealthData from '@/hooks/useHealthData';

export default function App() {
  const [fontsLoaded] = useFonts({
    DotGothic16_400Regular,
  });

  // État pour la date sélectionnée
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Utiliser le hook avec la date sélectionnée
  const { steps, yesterdaySteps, selectedSource, getSourceDisplayName, isLoading, formatDate } =
    useHealthData(selectedDate);

  // Fonction pour changer de jour
  const changeDay = (direction: 'previous' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'previous') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      // Empêcher la sélection d'une date future
      const today = new Date();
      if (newDate < today) {
        newDate.setDate(newDate.getDate() + 1);
      }
    }
    setSelectedDate(newDate);
  };

  // Fonction pour vérifier si la date est aujourd'hui
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Obtenir un texte convivial pour la date
  const getDateText = (): string => {
    if (isToday(selectedDate)) {
      return 'Today';
    } else {
      return formatDate(selectedDate);
    }
  };

  // Calculer le pourcentage de changement par rapport à la veille
  const calculateChange = (): { percent: number; isIncrease: boolean } => {
    if (yesterdaySteps === 0) return { percent: 0, isIncrease: true };

    const change = steps - yesterdaySteps;
    const percent = Math.abs(Math.round((change / yesterdaySteps) * 100));

    return {
      percent: percent,
      isIncrease: change >= 0,
    };
  };

  const { percent, isIncrease } = calculateChange();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 items-center justify-center bg-black">
      {/* Sélecteur de date */}
      <View className="mb-6 w-full flex-row items-center justify-center px-4">
        <TouchableOpacity
          onPress={() => changeDay('previous')}
          className="rounded-full bg-gray-800 p-2">
          <Text className="font-dotgothic text-xl text-white">←</Text>
        </TouchableOpacity>

        <View className="flex-1 items-center">
          <Text className="mx-4 font-dotgothic text-xl text-white">{getDateText()}</Text>
        </View>

        <TouchableOpacity
          onPress={() => changeDay('next')}
          className="rounded-full bg-gray-800 p-2"
          disabled={isToday(selectedDate)}
          style={{ opacity: isToday(selectedDate) ? 0.5 : 1 }}>
          <Text className="font-dotgothic text-xl text-white">→</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : (
        <View className="items-center">
          <Text className="mb-1 font-dotgothic text-6xl text-white">{steps}</Text>
          <Text className="mb-2 font-dotgothic text-2xl text-white">steps</Text>

          {/* {selectedSource && steps > 0 && (
            <Text className="mt-2 font-dotgothic text-sm text-gray-400">
              Source : {getSourceDisplayName(selectedSource)}
            </Text>
          )} */}

          {/* Comparaison avec la veille */}
          {isToday(selectedDate) && yesterdaySteps > 0 && (
            <View className="mt-6 items-center">
              <Text className="font-dotgothic text-xl text-gray-400">
                Yesterday: {yesterdaySteps}
              </Text>

              {/* {percent > 0 && (
                <View className="mt-2 flex-row items-center">
                  <Text
                    className={`font-dotgothic text-lg ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
                    {isIncrease ? '↑' : '↓'} {percent}%
                  </Text>
                  <Text className="ml-2 font-dotgothic text-sm text-gray-400">vs hier</Text>
                </View>
              )} */}
            </View>
          )}
          <Text className="font-dotgothic text-xl text-gray-400">Highest: 12556</Text>
        </View>
      )}
    </View>
  );
}
