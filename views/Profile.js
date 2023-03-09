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
import {TabView, Text, Button, Icon, Tab} from '@rneui/themed';
import {useTag, useUser} from '../hooks/ApiHooks';
import {avatarUrl, primaryColour, uploadsUrl, vw} from '../utils/variables';
import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Divider} from '@rneui/base';
import Favourite from '../components/userList/Favourite';
import MyList from '../components/userList/MyList';

const Profile = ({navigation, route}) => {
  const assetImage = avatarUrl;
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, isLoggedIn, updateUser, user, setUser, token} =
    useContext(MainContext);
  const [avatarImg, setAvatarImg] = useState(assetImage);
  const [index, setIndex] = useState(0);
  const {getUserById} = useUser();
  const [owner, setOwner] = useState({});

  const userId = route.params;

  const getOwner = async () => {
    try {
      const owner = await getUserById(userId, token);
      setOwner(owner);
    } catch (error) {
      console.error('getOwner error, ' + error.message);
    }
  };

  const loadAvatar = async () => {
    if (isLoggedIn) {
      try {
        const avatarArray = await getFilesByTag('avatar_' + userId);

        if (avatarArray.length > 0) {
          setAvatarImg(
            uploadsUrl + avatarArray[avatarArray.length - 1].filename
          );
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
      console.error('removeToken: ', error.message);
    }
  };

  const logOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Yes',
        onPress: () => {
          setIsLoggedIn(false);
          setUser({});
          setIndex(0);
          navigation.navigate('Home');
          removeToken();
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
  }, [userId, updateUser]);

  useEffect(() => {
    loadAvatar();
  }, [userId, updateUser, avatarImg]);

  return (
    <SafeAreaView style={styles.container}>
      {userId !== user.user_id ? (
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
        {userId !== user.user_id ? (
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

      {userId !== user.user_id ? '' : <Divider />}

      <View style={styles.userProfile}>
        <Image style={styles.avatar} source={{uri: avatarImg}} />
        <Text style={{textAlign: 'center', fontSize: 18}}>
          {owner !== null ? owner.username : ''}
        </Text>
        <Text style={{textAlign: 'center', fontSize: 12}}>
          {owner !== null ? owner.email : ''}
        </Text>
        {userId !== user.user_id ? (
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

      <Tab
        value={index}
        scrollable={false}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: userId === user.user_id ? 'black' : 'white',
          height: 3,
        }}
      >
        <Tab.Item
          title={
            userId === user.user_id
              ? 'My Listings.'
              : `${owner.username}'s Listings`
          }
          titleStyle={{fontSize: 14, fontWeight: 'bold', color: 'black'}}
        />
        {userId === user.user_id ? (
          <Tab.Item
            title="My Favourites."
            titleStyle={{fontSize: 14, fontWeight: 'bold', color: 'black'}}
          />
        ) : (
          <></>
        )}
      </Tab>

      <TabView
        value={index}
        onChange={setIndex}
        animationType="spring"
        disableSwipe={userId !== user.user_id ? true : false}
      >
        <TabView.Item>
          <MyList navigation={navigation} userId={owner.user_id} />
        </TabView.Item>
        {userId === user.user_id ? (
          <TabView.Item>
            <Favourite navigation={navigation} />
          </TabView.Item>
        ) : (
          <></>
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
  route: PropTypes.object,
};

export default Profile;
