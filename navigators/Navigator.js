const {createBottomTabNavigator} = require('@react-navigation/bottom-tabs');
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Icon, Image} from '@rneui/themed';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import Chats from '../views/Chats';
import Home from '../views/Home';
import Login from '../views/Login';
import Profile from '../views/Profile';
import Search from '../views/Search';
import Upload from '../views/Upload';
import EditProfile from '../views/EditProfile';
import Message from '../views/Message';
import GoLogin from '../views/GoLogin';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import {StyleSheet} from 'react-native';
import ProductDetails from '../components/product/ProductDetails';
import ModifyProduct from '../components/product/ModifyProduct';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = ({navigation}) => {
  const {isLoggedIn, user} = useContext(MainContext);
  const assetImage = Image.resolveAssetSource(
    require('../assets/avatar.png')
  ).uri;
  const [avatar, setAvatar] = useState(assetImage);
  const {getFilesByTag} = useTag();

  const loadAvatar = async () => {
    if (isLoggedIn) {
      try {
        const avatarArray = await getFilesByTag('avatar_' + user.user_id);
        if (avatarArray.length > 0) {
          setAvatar(uploadsUrl + avatarArray.pop().filename);
        }
      } catch (error) {
        throw new Error('load avatar from tab navigator, ' + error.message);
      }
    }
  };

  const navigateScreen = (destinationScreen) => {
    !isLoggedIn
      ? navigation.navigate('Login')
      : navigation.navigate(destinationScreen);
  };

  useEffect(() => {
    loadAvatar();
  }, [user, isLoggedIn]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#19a119',
        headerShown: false,
        tabBarShowLabel: false,
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

      {isLoggedIn && (
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
      )}
      {isLoggedIn && (
        <Tab.Screen
          name="Chats"
          component={Chats}
          options={{
            tabBarIcon: ({color}) => <Icon name="chat" color={color} />,
          }}
        />
      )}
      {isLoggedIn && (
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({focused}) => (
              <Image
                style={[styles.tabIcon, focused && styles.activeTabIcon]}
                source={{uri: avatar}}
                onPress={() => navigation.navigate('Profile')}
              />
            ),
          }}
        />
      )}
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
        <Stack.Screen name="ProductDetails" component={ProductDetails} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ModifyProduct" component={ModifyProduct} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="Message" component={Message} />
        <Stack.Screen name="GoLogin" component={GoLogin} />
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

const styles = StyleSheet.create({
  tabIcon: {
    width: 35,
    height: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  activeTabIcon: {
    borderColor: '#19a119',
  },
});

export default Navigator;
