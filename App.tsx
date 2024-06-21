// App.tsx
import { enableScreens } from 'react-native-screens';
import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigations/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';




enableScreens();

const App: React.FC = () => {
  return (

    <AppNavigator />

  );
};

export default App;
