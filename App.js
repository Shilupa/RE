import {StatusBar} from 'expo-status-bar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';
import Login from './views/Login';

const App = () => {
  return (
    <MainProvider>
      <Login />
      <StatusBar style="auto" />
    </MainProvider>
  );
};

export default App;
