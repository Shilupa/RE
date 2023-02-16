import {StatusBar} from 'expo-status-bar';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';
import Login from './views/Login';

const App = () => {
  return (
    <MainProvider>
      <StatusBar style="auto" />
      <Login />
    </MainProvider>
  );
};

export default App;
