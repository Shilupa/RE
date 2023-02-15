import {Platform, StyleSheet, SafeAreaView, View, Image} from 'react-native';
import PropTypes from 'prop-types';
import {Tab, TabView, Text, Button} from '@rneui/themed';
import {useTag} from '../hooks/ApiHooks';
import {uploadsUrl} from '../utils/variables';
import React, {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import MyFiles from './MyFiles';

const Profile = ({navigation}) => {
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState('');
  const [index, setIndex] = useState(0);

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

  return (
    <SafeAreaView style={styles.container}>
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
