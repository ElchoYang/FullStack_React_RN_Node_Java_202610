import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  Text,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import SearchFlightScreen from './src/screens/SearchFlightScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#351401' },
        headerTintColor: 'white',
        sceneStyle: { backgroundColor: '#3f2f25' },
        headerTitleAlign: 'center',
      }}
    >
      <Drawer.Screen
        name="DrawerScreen"
        component={HomeScreen}
        options={{
          title: 'Home Screen',
        }}
      />
    </Drawer.Navigator>
  );
}

function App() {
  return (
    <GestureHandlerRootView>
      <SafeAreaProvider style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
            <Stack.Screen
              name="Drawer"
              component={DrawerNavigator}
              options={{
                headerShown: false,
              }}
            />

            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                title: 'Home Screen',
              }}
            />

            <Stack.Screen
              name="SearchFlight"
              component={SearchFlightScreen}
              options={{
                title: 'Search Flight Screen',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
