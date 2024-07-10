// App.tsx
import { enableScreens } from 'react-native-screens';
import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigations/AppNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';
import { EmployeeProvider } from './src/context/EmployeeContext';




enableScreens();

const App: React.FC = () => {
  return (
    <EmployeeProvider>
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
      
        <AppNavigator />
      </GestureHandlerRootView>
    </Provider>
    </EmployeeProvider>
  );
};

export default App;
