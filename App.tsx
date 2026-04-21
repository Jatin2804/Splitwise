import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNaigation from './src/AppNaigation';
import { AppProvider } from './src/context/AppContext';
import { UserProvider } from './src/context/UserContext';

function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <AppProvider>
          <AppNaigation />
        </AppProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}

export default App;
