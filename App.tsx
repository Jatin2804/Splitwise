import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNaigation from './src/AppNaigation';

function App() {
  return (
    <SafeAreaProvider>
      <AppNaigation />
    </SafeAreaProvider>
  );
}

export default App;
