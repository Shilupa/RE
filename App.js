import {StatusBar} from 'expo-status-bar';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import {MainProvider} from './contexts/MainContext';
import Navigator from './navigators/Navigator';

const App = () => {
  return (
    <MainProvider>
      {/* <Navigator /> */}
      <RegisterForm/>
      <StatusBar style="auto" />
    </MainProvider>
  );
};

export default App;
