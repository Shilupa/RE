const {createBottomTabNavigator} = require('@react-navigation/bottom-tabs');
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Icon, Image} from '@rneui/themed';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import PropTypes from 'prop-types';
import CoverPage from '../views/CoverPage';
import Chats from '../views/Chats';
import Home from '../views/Home';
import Login from '../views/Login';
import Profile from '../views/Profile';
import Search from '../views/Search';
import Upload from '../views/Upload';
import EditProfile from '../views/EditProfile';
import Message from '../views/Message';
import GoLogin from '../views/GoLogin';
import {useComments, useMedia, useRating, useTag} from '../hooks/ApiHooks';
import {avatarUrl, messageId, uploadsUrl} from '../utils/variables';
import {Platform, StyleSheet, View} from 'react-native';
import ProductDetails from '../components/product/ProductDetails';
import ModifyProduct from '../components/product/ModifyProduct';
import {Text} from 'react-native';
import LottieView from 'lottie-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabScreen = ({navigation}) => {
  const {isLoggedIn, user, token, updateMessage, update, setUpdate} =
    useContext(MainContext);
  const assetImage = avatarUrl;
  const [avatar, setAvatar] = useState(assetImage);
  const [unseenNumber, setUnseenNumber] = useState();
  const {getFilesByTag} = useTag();
  const {searchMedia} = useMedia();
  const {getRatingsByFileId} = useRating();
  const {getCommentsByFileId} = useComments();

  const loadAvatar = async () => {
    if (isLoggedIn) {
      try {
        const avatarArray = await getFilesByTag('avatar_' + user.user_id);
        if (avatarArray.length > 0) {
          setAvatar(uploadsUrl + avatarArray.pop().filename);
        }
      } catch (error) {
        console.error('loadavatar from tab navigator, ' + error.message);
      }
    }
  };

  const numberOfUnreadMessage = async () => {
    if (isLoggedIn && token != null) {
      const title = user.user_id + messageId;
      const userIdNumber = user.user_id;

      try {
        // console.log('title: ', title);
        const chatGroups = await searchMedia(title, token);
        // console.log('chatGroups: ', chatGroups);
        const chatGroupWithComment = await Promise.all(
          chatGroups.map(async (group) => {
            const commentResponse = await getCommentsByFileId(group.file_id);
            group.allComments = await commentResponse;
            return await group;
          })
        );
        const filteredChatGroupWithComment = chatGroupWithComment.filter(
          (obj) => obj.allComments.length != 0
        );

        /* console.log(
          'filteredChatGroupWithComment: ',
          filteredChatGroupWithComment
        ); */

        // Map data for ratings

        const chatGroupWithRatings = await Promise.all(
          filteredChatGroupWithComment.map(async (group) => {
            const ratingResponse = await getRatingsByFileId(group.file_id);
            group.rating = await ratingResponse;
            return await group;
          })
        );

        // console.log('chatGroupWithRatings: ', chatGroupWithRatings);

        const numberUnseen = chatGroupWithRatings.reduce(
          (accumulator, current) => {
            const id1 = current.title.split('_')[0].replace(messageId, '');
            const id2 = current.title.split('_')[1].replace(messageId, '');

            // console.log('Id1: ', id1);
            // console.log('Id2: ', id2);

            // console.log('UserId: ', userIdNumber);

            const otherId = id1 == userIdNumber ? id2 : id1;
            // console.log('OtherId: ', otherId);

            // const isSeen = JSON.parse(current.description);
            const userRating = current.rating.find(
              (singleRating) => singleRating.user_id == userIdNumber
            );

            /* console.log('user rating: ', userRating ? userRating.rating : null); */

            const otherRating = current.rating.find(
              (singleRating) => singleRating.user_id == otherId
            );

            /* console.log(
              'Otherrating: ',
              otherRating ? otherRating.rating : null
            ); */

            if (otherRating === undefined) {
              return accumulator;
            } else if (otherRating != undefined && userRating === undefined) {
              return accumulator + 1;
            } else if (userRating.rating === 3 && otherRating.rating === 4) {
              return accumulator + 1;
            } else if (userRating.rating === 4 && otherRating.rating === 5) {
              return accumulator + 1;
            } else if (userRating.rating === 5 && otherRating.rating === 3) {
              return accumulator + 1;
            } else {
              return accumulator;
            }
          },
          0
        );

        // console.log('numberUnseen: ', numberUnseen);

        setUnseenNumber(numberUnseen);
      } catch (error) {
        console.error('loadChatGroups from navigator error: ' + error.message);
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

  useEffect(() => {
    numberOfUnreadMessage();
  }, [user, isLoggedIn, updateMessage]);

  useEffect(() => {
    const interval = setInterval(() => {
      numberOfUnreadMessage();
    }, 10000);
    return () => clearInterval(interval);
  }, [unseenNumber]);

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
        options={{
          tabBarIcon: ({color}) => (
            <Icon
              name="home"
              color={color}
              onPress={() => {
                navigateScreen('Home');
                setUpdate(!update);
              }}
            />
          ),
        }}
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
            tabBarIcon: ({color}) =>
              Platform.OS === 'android' ? (
                <Icon
                  name="cloud-upload"
                  color={color}
                  onPress={() => navigateScreen('Upload')}
                />
              ) : (
                <LottieView
                  source={require('../lottie/upload.json')}
                  style={{
                    width: 30,
                    height: 30,
                    alignSelf: 'center',
                    backgroundColor: color,
                    borderRadius: 15,
                  }}
                  autoPlay
                  loop={false}
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
            tabBarIcon: ({color}) => (
              <>
                <Icon
                  containerStyle={{position: 'absolute'}}
                  name="chat"
                  color={color}
                />
                {unseenNumber > 0 && (
                  <View
                    style={{
                      position: 'relative',
                      top: -8,
                      right: -12,
                      backgroundColor: 'red',
                      borderRadius: 8,
                      width: 16,
                      height: 16,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text
                      style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}
                    >
                      {unseenNumber}
                    </Text>
                  </View>
                )}
              </>
            ),
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
                onPress={() => navigation.navigate('Profile', user.user_id)}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const StackScreen = () => {
  const [showComponent, setShowComponent] = useState(true);

  // Shows cover page for 3 secs
  useEffect(() => {
    setInterval(() => {
      setShowComponent(false);
    }, 3000);
  }, []);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <>
        {showComponent ? (
          <Stack.Screen name="CoverPage" component={CoverPage} />
        ) : (
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
        )}
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
