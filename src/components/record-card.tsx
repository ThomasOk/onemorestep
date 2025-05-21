import { View, Text } from 'react-native';

interface RecordCardProps {
  recordSteps: number;
  recordDate: string | null;
  currentSteps: number;
}

export default function RecordCard({ recordSteps, recordDate, currentSteps }: RecordCardProps) {
  const recordProgress = Math.round((currentSteps / recordSteps) * 100);

  return (
    <View className="mb-4 w-11/12 items-center rounded-xl bg-gray-800 p-4">
      <Text className="font-dotgothic text-lg text-yellow-400">Record Personnel</Text>

      <Text className="font-dotgothic text-3xl text-yellow-400">{recordSteps}</Text>

      {recordDate && (
        <Text className="mt-1 font-dotgothic text-xs text-gray-400">{recordDate}</Text>
      )}

      <View className="mt-3 h-2 w-full rounded-full bg-gray-700">
        <View
          className="h-2 rounded-full bg-yellow-400"
          style={{ width: `${Math.min(recordProgress, 100)}%` }}
        />
      </View>

      <Text className="mt-1 font-dotgothic text-xs text-gray-400">
        {recordProgress}% de votre record
      </Text>
    </View>
  );
}
