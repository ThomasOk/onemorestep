import { View, Text } from 'react-native';

interface LeaderboardItemProps {
  rank: number;
  user: string;
  steps: number;
  isCurrentUser: boolean;
}

export default function LeaderboardItem({
  rank,
  user,
  steps,
  isCurrentUser,
}: LeaderboardItemProps) {
  return (
    <View
      className={`mx-2 my-1 flex-row items-center justify-between rounded-lg p-4 ${isCurrentUser ? 'bg-blue-900' : 'bg-gray-800'}`}>
      <View className="flex-row items-center">
        <View
          className={`h-8 w-8 items-center justify-center rounded-full ${getRankBackgroundColor(rank)}`}>
          <Text className="font-dotgothic font-bold text-white">{rank}</Text>
        </View>

        <Text className="ml-3 font-dotgothic text-lg text-white">
          {user} {isCurrentUser && '👤'}
        </Text>
      </View>

      <Text className="font-dotgothic text-xl text-white">{steps}</Text>
    </View>
  );
}

function getRankBackgroundColor(rank: number): string {
  switch (rank) {
    case 1:
      return 'bg-yellow-500'; // Or
    case 2:
      return 'bg-gray-400'; // Argent
    case 3:
      return 'bg-yellow-700'; // Bronze
    default:
      return 'bg-gray-700'; // Autres rangs
  }
}
