import React from 'react';
import { View, Text } from 'react-native';
function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <View>
      <Text>{children}</Text>
    </View>
  );
}

export default PrimaryButton;
