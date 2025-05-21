import { View, Text, ActivityIndicator } from 'react-native';

interface StepsCardProps {
  steps: number;
  yesterdaySteps: number;
  isLoading: boolean;
}

export default function StepsCard({ steps, yesterdaySteps, isLoading }: StepsCardProps) {
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

  return (
    <View className="mb-4 w-11/12 rounded-xl bg-gray-800 p-5">
      <Text className="mb-2 text-center font-dotgothic text-2xl text-white">Today Steps</Text>

      {isLoading ? (
        <View className="items-center py-4">
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text className="mt-2 font-dotgothic text-sm text-gray-400">Chargement...</Text>
        </View>
      ) : (
        <View className="items-center">
          <Text className="font-dotgothic text-6xl text-white">{steps}</Text>

          {yesterdaySteps > 0 && (
            <View className="mt-4 items-center">
              <Text className="font-dotgothic text-sm text-gray-400">Hier: {yesterdaySteps}</Text>

              {percent > 0 && (
                <Text
                  className={`font-dotgothic text-lg ${isIncrease ? 'text-green-500' : 'text-red-500'}`}>
                  {isIncrease ? '↑' : '↓'} {percent}%
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
