import {StatusBar} from 'expo-status-bar';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';

const App = () => {
  return (
    <MainProvider>
      <StatusBar style="auto" />
      <Navigator />
    </MainProvider>
  );
};

export default App;
