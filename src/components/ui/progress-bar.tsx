import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, DimensionValue } from 'react-native';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

export interface PixelProgressBarProps {
  progress: number | SharedValue<number>; // Accepte une valeur normale ou une SharedValue de Reanimated
  maxValue?: number;
  width?: DimensionValue;
  height?: number;
  outerBorderWidth?: number;
  innerBorderWidth?: number;
  backgroundColor?: string;
  fillColor?: string;
  outerBorderColor?: string;
  innerBorderColor?: string;
  showPixelCorners?: boolean;
  style?: StyleProp<ViewStyle>;
}

/**
 * Composant de barre de progression style pixel art/rétro (similaire à NES.css)
 * Avec double bordure : externe (blanche) et interne (noire)
 * Personnalisable en largeur et hauteur
 * Supporte l'animation avec Reanimated
 */
export const ProgressBar: React.FC<PixelProgressBarProps> = ({
  progress,
  maxValue = 10000,
  width = '100%',
  height = 28,
  outerBorderWidth = 4,
  innerBorderWidth = 2,
  backgroundColor = '#333333',
  fillColor = '#92d050',
  outerBorderColor = '#ffffff',
  innerBorderColor = '#000000',
  showPixelCorners = true,
  style,
}) => {
  // Déterminer si progress est une SharedValue ou un nombre simple
  const isSharedValue = typeof progress !== 'number';

  // Style animé pour la barre de progression
  const animatedProgressStyle = useAnimatedStyle(() => {
    // Obtenir la valeur actuelle (soit directement, soit depuis la SharedValue)
    const currentProgress = isSharedValue ? progress.value : progress;

    // S'assurer que la progression est entre 0 et maxValue
    const clampedProgress = Math.max(0, Math.min(currentProgress, maxValue));
    const progressPercentage = (clampedProgress / maxValue) * 100;

    return {
      width: `${progressPercentage}%`,
    };
  });

  // Coins pixelisés pour un effet encore plus rétro
  const renderPixelCorners = () => {
    if (!showPixelCorners) return null;

    const cornerSize = Math.min(outerBorderWidth, 4);

    return (
      <>
        {/* Coin supérieur gauche */}
        <View
          className="absolute left-0 top-0 bg-black"
          style={{ width: cornerSize, height: cornerSize }}
        />
        {/* Coin supérieur droit */}
        <View
          className="absolute right-0 top-0 bg-black"
          style={{ width: cornerSize, height: cornerSize }}
        />
        {/* Coin inférieur gauche */}
        <View
          className="absolute bottom-0 left-0 bg-black"
          style={{ width: cornerSize, height: cornerSize }}
        />
        {/* Coin inférieur droit */}
        <View
          className="absolute bottom-0 right-0 bg-black"
          style={{ width: cornerSize, height: cornerSize }}
        />
      </>
    );
  };

  // Styles définis avec StyleSheet pour optimiser les performances
  const styles = StyleSheet.create({
    container: {
      width,
      height,
      backgroundColor: outerBorderColor,
      padding: outerBorderWidth,
    },
    innerBorder: {
      width: '100%',
      height: '100%',
      backgroundColor: innerBorderColor,
      padding: innerBorderWidth,
    },
    background: {
      width: '100%',
      height: '100%',
      backgroundColor,
      overflow: 'hidden',
    },
    progress: {
      height: '100%',
      backgroundColor: fillColor,
    },
    line: {
      position: 'absolute',
      width: '100%',
      height: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
  });

  return (
    <View className="relative shadow-md" style={[styles.container, style]}>
      {renderPixelCorners()}

      {/* Conteneur avec bordure interne noire */}
      <View className="h-full w-full" style={styles.innerBorder}>
        {/* Conteneur du fond de la barre et de la progression */}
        <View className="h-full w-full overflow-hidden" style={styles.background}>
          {/* Barre de progression animée */}
          <Animated.View className="h-full" style={[styles.progress, animatedProgressStyle]} />
        </View>
      </View>
    </View>
  );
};
