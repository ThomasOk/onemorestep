// PixelButton.tsx
import React from 'react';
import { TouchableOpacity, View, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { AppText } from '@/components/app-text';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Types de boutons disponibles comme dans l'image
type ButtonType = 'normal' | 'primary' | 'success' | 'warning' | 'error' | 'disabled';

interface PixelButtonProps {
  onPress: () => void;
  text: string;
  type?: ButtonType;
  disabled?: boolean;
  className?: string;
  style?: StyleProp<ViewStyle>;
  textClassName?: string;
  textStyle?: StyleProp<TextStyle>;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  onPress,
  text,
  type = 'primary',
  disabled = false,
  className = '',
  style = {},
  textClassName = '',
  textStyle = {},
}) => {
  // Si le bouton est désactivé, on force le type à 'disabled'
  const buttonType = disabled ? 'disabled' : type;

  // Définition des couleurs selon le type de bouton
  const getColors = (): { bg: string; textColor: string } => {
    switch (buttonType) {
      case 'normal':
        return { bg: 'bg-black', textColor: 'text-white' };
      case 'primary':
        return { bg: 'bg-blue-500', textColor: 'text-white' };
      case 'success':
        return { bg: 'bg-green-500', textColor: 'text-white' };
      case 'warning':
        return { bg: 'bg-yellow-500', textColor: 'text-black' };
      case 'error':
        return { bg: 'bg-red-500', textColor: 'text-white' };
      case 'disabled':
        return { bg: 'bg-gray-300', textColor: 'text-gray-500' };
      default:
        return { bg: 'bg-blue-500', textColor: 'text-white' };
    }
  };

  const { bg, textColor } = getColors();

  return (
    <View className={`relative ${className}`} style={style}>
      {/* Bordure noire externe */}
      <View className="rounded-md border-2 border-white">
        {/* Fond du bouton et l'effet d'ombre */}
        <View className={` rounded-md border-b-2 border-r-2 border-gray-300`}>
          {/* Le bouton lui-même */}
          <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
            className={`${bg} rounded-none px-2 py-1`}>
            <View className="flex-row items-center justify-center">
              <AppText className={`${textColor} ml-1 text-lg ${textClassName}`} style={textStyle}>
                {text}
              </AppText>
              <View className="ml-1 mt-1">
                <MaterialIcons name="sync" size={16} color="white" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
