import { View, TextInput } from 'react-native';
import PrimaryButton from '../components/Primarybutton';
function StartGameScreen() {
  return (
    <View>
      <TextInput></TextInput>
      <PrimaryButton>Reset</PrimaryButton>
      <PrimaryButton>Confirm</PrimaryButton>
    </View>
  );
}

export default StartGameScreen;
