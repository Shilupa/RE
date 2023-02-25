import {
  Platform,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Alert,
  StatusBar,
} from 'react-native';
import PropTypes from 'prop-types';
import {Tab, TabView, Text, Button} from '@rneui/themed';
import {useTag} from '../hooks/ApiHooks';
import {primaryColour, uploadsUrl} from '../utils/variables';
import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import MyFiles from './MyFiles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FavouriteList from '../components/FavouriteList';

const Profile = ({navigation}) => {
  const assetImage = Image.resolveAssetSource(
    require('../assets/avatar.png')
  ).uri;
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, isLoggedIn, user, setUser, updateUser} =
    useContext(MainContext);
  const [avatar, setAvatar] = useState(assetImage);
  const [index, setIndex] = useState();

  const loadAvatar = async () => {
    if (isLoggedIn) {
      try {
        const avatarArray = await getFilesByTag('avatar_' + user.user_id);
        // Checking if user has added avatar previously
        if (avatarArray.length > 0) {
          setAvatar(uploadsUrl + avatarArray.pop().filename);
        }
      } catch (error) {
        console.error('user avatar fetch failed', error.message);
      }
    }
  };

  const removeToken = async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.log('removeToken: ', error.message);
    }
  };

  const logOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Yes',
        onPress: () => {
          removeToken();
          setUser({});
          setIsLoggedIn(false);
          setIndex(0);
          navigation.navigate('Home');
        },
      },
      {text: 'No'},
    ]);
  };

  const navigateToEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  useEffect(() => {
    loadAvatar();
  }, [updateUser]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.logOut} onPress={logOut}>
          Log Out
        </Text>
      </View>

      <View style={styles.userProfile}>
        <Image style={styles.avatar} source={{uri: avatar}} />
        <Text style={{textAlign: 'center', fontSize: 18}}>
          {user !== null ? user.username : ''}
        </Text>
        <Text style={{textAlign: 'center', fontSize: 12}}>
          {user !== null ? user.email : ''}
        </Text>
        <Button
          containerStyle={{
            width: '40%',
            marginHorizontal: 50,
            marginVertical: 10,
            alignSelf: 'center',
          }}
          type="solid"
          size="md"
          color={'#4CBB17'}
          radius={6}
          title={'Edit Profile'}
          onPress={navigateToEditProfile}
        />
      </View>
      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: 'black',
          height: 3,
        }}
      >
        <Tab.Item
          title="My Listings."
          titleStyle={{fontSize: 12, color: 'black'}}
        />
        <Tab.Item
          title="My Favourites."
          titleStyle={{fontSize: 12, color: 'black'}}
        />
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item>
          <MyFiles navigation={navigation} />
        </TabView.Item>
        <TabView.Item>
          <FavouriteList navigation={navigation} />
        </TabView.Item>
      </TabView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  titleBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  title: {
    marginTop: 25,
    marginBottom: 15,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
  logOut: {
    marginTop: 25,
    marginBottom: 15,
    marginHorizontal: 25,
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userProfile: {
    width: '100%',
    flexDirection: 'column',
    alignSelf: 'center',
  },
  avatar: {
    resizeMode: 'cover',
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
