import { Redirect } from 'expo-router';
import { Text, View } from 'react-native';

export default function Index() {
  // Rediriger vers l'onglet principal
  return <Redirect href="/home" />;
  // return (
  //   <View>
  //     <Text>aaaaaaaaaaaa</Text>
  //   </View>
  // );
}
