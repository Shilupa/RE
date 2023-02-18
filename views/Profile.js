import {
  Platform,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {Tab, TabView, Text, Button, Icon} from '@rneui/themed';
import {useTag} from '../hooks/ApiHooks';
import {primaryColour, uploadsUrl} from '../utils/variables';
import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import MyFiles from './MyFiles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = ({navigation}) => {
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, isLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');
  const [index, setIndex] = useState(0);

  console.log(isLoggedIn);
  if (!isLoggedIn) {
    navigation.navigate('Login');
  }

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.error('user avatar fetch failed', error.message);
    }
  };

  useEffect(() => {
    loadAvatar();
  }, []);

  const removeToken = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch (error) {
      console.log('removeToken: ', error.message);
    }
  };

  const logOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Yes',
        onPress: () => {
          setIsLoggedIn(false);
          removeToken();
          setUser({});
          navigation.navigate('Home');
        },
      },
      {text: 'No'},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Profile</Text>
        {isLoggedIn && (
          <Icon
            size={30}
            style={styles.logOut}
            onPress={logOut}
            name="power-settings-new"
            color="red"
          />
        )}
      </View>

      <View style={styles.userProfile}>
        <Image
          style={styles.image}
          source={{
            uri: uploadsUrl + avatar,
          }}
        ></Image>
        <Text style={{textAlign: 'center', fontSize: 18}}>
          {' '}
          {user.username}{' '}
        </Text>
        <Text style={{textAlign: 'center', fontSize: 12}}> {user.email} </Text>
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
        ></Button>
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
          title="Your Listings ()"
          titleStyle={{fontSize: 12, color: 'black'}}
        />
        <Tab.Item
          title="Your Favourites ()"
          titleStyle={{fontSize: 12, color: 'black'}}
        />
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item>
          <MyFiles />
        </TabView.Item>
        <TabView.Item
          style={{backgroundColor: 'green', width: '100%'}}
        ></TabView.Item>
      </TabView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  titleBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginVertical: 25,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
  logOut: {
    marginVertical: 25,
    marginHorizontal: 25,
    color: primaryColour,
  },
  userProfile: {
    width: '100%',
    flexDirection: 'column',
    alignSelf: 'center',
  },
  image: {
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
