// App.tsx
import { enableScreens } from 'react-native-screens';
import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigations/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';




enableScreens();

const App: React.FC = () => {
  return (
<GestureHandlerRootView style={{ flex: 1 }}>
    <AppNavigator />
    </GestureHandlerRootView>
  );
};

export default App;
