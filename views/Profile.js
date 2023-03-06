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
import {Tab, TabView, Text, Button, Icon} from '@rneui/themed';
import {useTag, useUser} from '../hooks/ApiHooks';
import {primaryColour, uploadsUrl, vw} from '../utils/variables';
import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Divider} from '@rneui/base';
import Favourite from '../components/userList/Favourite';
import MyList from '../components/userList/MyList';

const Profile = ({navigation, route}) => {
  const assetImage = Image.resolveAssetSource(
    require('../assets/avatar.png')
  ).uri;
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, isLoggedIn, updateUser, user, setUser, token} =
    useContext(MainContext);
  const [avatar, setAvatar] = useState(assetImage);
  const [index, setIndex] = useState();
  const {getUserById} = useUser();
  const [owner, setOwner] = useState({});

  const userId = route.params !== undefined ? route.params : user.user_id;

  const getOwner = async () => {
    try {
      // const token = await AsyncStorage.getItem('userToken');
      const owner = await getUserById(userId, token);
      setOwner(owner);
    } catch (error) {
      throw new Error('getOwner error, ' + error.message);
    }
  };

  const loadAvatar = async () => {
    if (isLoggedIn) {
      try {
        const avatarArray = await getFilesByTag('avatar_' + userId);
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
    getOwner();
    loadAvatar();
  }, [userId, updateUser]);

  const UserTab = () => {
    return (
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
    );
  };

  const OwnerTab = () => {
    return (
      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: 'black',
          height: 3,
        }}
      >
        <Tab.Item
          title={`${owner.username}'s Listings`}
          titleStyle={{fontSize: 16, color: primaryColour}}
        />
      </Tab>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {route.params !== undefined && route.params !== user.user_id ? (
        <Button
          type="solid"
          buttonStyle={styles.backBtn}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Icon name="arrow-back" color="black" />
        </Button>
      ) : (
        ''
      )}
      <View style={styles.titleBar}>
        {route.params !== undefined && route.params !== user.user_id ? (
          ''
        ) : (
          <>
            <Text style={styles.title}>Profile</Text>
            <Text style={styles.logOut} onPress={logOut}>
              Log Out
            </Text>
          </>
        )}
      </View>

      {route.params !== undefined && route.params !== user.user_id ? (
        ''
      ) : (
        <Divider />
      )}

      <View style={styles.userProfile}>
        <Image style={styles.avatar} source={{uri: avatar}} />
        <Text style={{textAlign: 'center', fontSize: 18}}>
          {owner !== null ? owner.username : ''}
        </Text>
        <Text style={{textAlign: 'center', fontSize: 12}}>
          {owner !== null ? owner.email : ''}
        </Text>
        {route.params !== undefined && route.params !== user.user_id ? (
          ''
        ) : (
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
        )}
      </View>
      {route.params !== undefined && route.params !== user.user_id ? (
        <OwnerTab />
      ) : (
        <UserTab />
      )}
      <TabView
        value={index}
        onChange={setIndex}
        animationType="spring"
        disableSwipe={
          route.params !== undefined && route.params !== user.user_id
            ? true
            : false
        }
      >
        <TabView.Item>
          <MyList navigation={navigation} userId={owner.user_id} />
        </TabView.Item>
        {route.params !== undefined ? (
          ''
        ) : (
          <TabView.Item>
            <Favourite navigation={navigation} />
          </TabView.Item>
        )}
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
    marginTop: 10,
  },
  avatar: {
    resizeMode: 'cover',
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
  },
  backBtn: {
    borderRadius: 25,
    padding: 0,
    marginTop: 10,
    width: 45,
    height: 45,
    left: -40 * vw,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#81C784',
    elevation: 10,
    position: 'relative',
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
