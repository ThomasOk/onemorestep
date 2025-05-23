import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AppText } from '@/components/app-text';

interface DevControlsProps {
  devMode: boolean;
  setDevMode: (mode: boolean) => void;
  resetDevCounter: () => void;
}

export const DevControls: React.FC<DevControlsProps> = ({
  devMode,
  setDevMode,
  resetDevCounter,
}) => {
  return (
    <>
      <TouchableOpacity
        className="mt-6 rounded-lg bg-gray-800 p-3"
        onPress={() => setDevMode(!devMode)}>
        <AppText className="text-white">
          {devMode ? 'Mode Dev: ON (+500 pas/refresh)' : 'Mode Dev: OFF'}
        </AppText>
      </TouchableOpacity>

      {devMode && (
        <TouchableOpacity className="mt-3 rounded-lg bg-red-800 p-3" onPress={resetDevCounter}>
          <AppText className="text-white">Reset Dev Counter</AppText>
        </TouchableOpacity>
      )}
    </>
  );
};
