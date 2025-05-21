import { Text as RNText, TextProps } from 'react-native';
import { useFonts, DotGothic16_400Regular } from '@expo-google-fonts/dotgothic16';

export function AppText({ style, ...props }: TextProps) {
  const [fontsLoaded] = useFonts({
    DotGothic16_400Regular,
  });

  return (
    <RNText
      style={[{ fontFamily: fontsLoaded ? 'DotGothic16_400Regular' : undefined }, style]}
      {...props}
    />
  );
}
