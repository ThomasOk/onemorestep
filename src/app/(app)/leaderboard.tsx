import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useFonts, DotGothic16_400Regular } from '@expo-google-fonts/dotgothic16';
import useLeaderboard from '@/features/leaderboard/hooks/use-leaderboard';
import LeaderboardItem from '@/features/leaderboard/components/leaderboard-item';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LeaderboardScreen() {
  const [fontsLoaded] = useFonts({
    DotGothic16_400Regular,
  });

  const { leaderboard, isLoading, currentUserRank } = useLeaderboard();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <Text className="my-4 text-center font-dotgothic text-2xl text-white">Classement</Text>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <LeaderboardItem
              rank={index + 1}
              user={item.name}
              steps={item.steps}
              isCurrentUser={item.id === currentUserRank?.id}
            />
          )}
          ListEmptyComponent={
            <Text className="p-4 text-center font-dotgothic text-white">
              Aucune donnée de classement disponible
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
