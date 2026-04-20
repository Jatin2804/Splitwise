import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNaigation from './src/AppNaigation';
import { AppProvider } from './src/context/AppContext';

function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNaigation />
      </AppProvider>
    </SafeAreaProvider>
  );
}

export default App;
