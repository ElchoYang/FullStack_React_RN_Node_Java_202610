import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

type PrimaryButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
};

function PrimaryButton({ children, onPress }: PrimaryButtonProps) {
  function pressHandler() {
    console.log("press");
  }

  return (
    <View style={styles.buttonOutercontainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnercontainer, styles.pressed]
            : styles.buttonInnercontainer
        }
        onPress={onPress}
        android_ripple={{ color: "#640233" }}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default PrimaryButton;
const styles = StyleSheet.create({
  buttonOutercontainer: {
    borderRadius: 28,
    margin: 4,
    overflow: "hidden",
  },
  buttonInnercontainer: {
    backgroundColor: "#72063c",
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  buttonText: { color: "white", textAlign: "center" },
  pressed: { opacity: 0.75 },
});
