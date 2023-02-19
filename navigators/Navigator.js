const {createBottomTabNavigator} = require('@react-navigation/bottom-tabs');
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Icon} from '@rneui/themed';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import Chats from '../views/Chats';
import Home from '../views/Home';
import Login from '../views/Login';
import ModifyItem from '../views/ModifyItem';
import Profile from '../views/Profile';
import Search from '../views/Search';
import Single from '../views/Single';
import Upload from '../views/Upload';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = ({navigation}) => {
  const {isLoggedIn} = useContext(MainContext);

  const navigateScreen = (destinationScreen) => {
    !isLoggedIn
      ? navigation.navigate('Login')
      : navigation.navigate(destinationScreen);
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#19a119',
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{tabBarIcon: ({color}) => <Icon name="home" color={color} />}}
      />
      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({color}) => <Icon name="search" color={color} />,
        }}
      />
      <Tab.Screen
        name="Upload"
        component={Upload}
        options={{
          tabBarIcon: ({color}) => (
            <Icon
              name="cloud-upload"
              color={color}
              onPress={() => navigateScreen('Upload')}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Chats"
        component={Chats}
        options={{
          tabBarIcon: ({color}) => <Icon name="chat" color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({color}) => (
            <Icon
              name="person"
              color={color}
              onPress={() => navigateScreen('Profile')}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <>
        <Stack.Screen
          name="Tabs"
          component={TabScreen}
          screenOptions={{headerShown: false}}
        />
        <Stack.Screen name="Single" component={Single} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ModifyItem" component={ModifyItem} />
      </>
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

TabScreen.propTypes = {
  navigation: PropTypes.object,
};

export default Navigator;
