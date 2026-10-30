import { useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import PrimaryButton from "../components/Primarybutton";

type startGameScreenProps = {
  onPickNumer: (num: Number) => void;
};

function StartGameScreen({ onPickNumer }: startGameScreenProps) {
  const [enteredNumber, setEnteredNumber] = useState("");

  function numberInputHandler(enterdText: string) {
    setEnteredNumber(enterdText);
  }
  function resetInputHandler() {
    setEnteredNumber("");
  }
  function confirmInputHandler() {
    const choserNumber = parseInt(enteredNumber);
    if (isNaN(choserNumber) || choserNumber <= 0) {
    }

    onPickNumer(choserNumber);
  }

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.numberInput}
        maxLength={2}
        keyboardType="number-pad"
        autoCorrect={false}
        autoCapitalize="none"
        onChangeText={numberInputHandler}
      ></TextInput>
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonContainer}>
          <PrimaryButton onPress={resetInputHandler}>Reset</PrimaryButton>
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton onPress={confirmInputHandler}>Confirm</PrimaryButton>
        </View>
      </View>
    </View>
  );
}

export default StartGameScreen;

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    marginHorizontal: 20,
    padding: 16,
    backgroundColor: "#4e0329",
    borderRadius: 8,
    elevation: 4,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.25,
  },
  numberInput: {
    width: 50,
    height: 55,
    fontSize: 32,
    color: "#fff",
    borderBottomColor: "#ddb52f",
    borderBottomWidth: 4,
    marginVertical: 8,
    fontWeight: "bold",
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  buttonContainer: { flex: 1 },
});
