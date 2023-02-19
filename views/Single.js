import React, {useContext, useEffect, useState} from 'react';
import {primaryColour, uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Card, Icon, Button} from '@rneui/themed';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Single = ({route}) => {
  console.log(route.params);
  const {setIsLoggedIn} = useContext(MainContext);
  const {getUserById} = useUser();
  const [owner, setOwner] = useState({});
  const [avatar, setAvatar] = useState('');
  const {getFilesByTag} = useTag();

  const {
    title,
    description,
    filename,
    time_added: timeAdded,
    user_id: userId,
  } = route.params;

  const mediaUploded = new Date(timeAdded);
  const timeNow = new Date();
  const timeDiff = timeNow.getTime() - mediaUploded.getTime();
  let time;
  // Convert the time difference to seconds
  if (timeDiff > 60e3 && timeDiff < 36e5) {
    time = Math.floor(timeDiff / 60e3) + 'm ';
  } else if (timeDiff < 864e5 && timeDiff > 36e5) {
    time = Math.round(Math.abs(timeDiff) / 36e5) + 'h ';
  } else if (timeDiff > 864e5) {
    time = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 'd ';
  } else {
    time = Math.floor(timeDiff / 1e3) + 's ';
  }

  console.log('waka', time);

  const getOwner = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const owner = await getUserById(userId, token);
    console.log('owner', owner);
    setOwner(owner);
  };

  const logOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Yes',
        onPress: () => {
          setIsLoggedIn(false);
        },
      },
      {text: 'No'},
    ]);
  };

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + owner.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.error('user avatar fetch failed', error.message);
    }
  };

  loadAvatar();
  useEffect(() => {
    getOwner();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Icon style={styles.logOut} name="arrow-back" color="black" />
        <Icon
          style={styles.logOut}
          onPress={logOut}
          name="power-settings-new"
          color="red"
        />
      </View>
      <Card.Divider />

      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            margin: 5,
            marginTop: 0,
          }}
        >
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 400 / 2,
              resizeMode: 'contain',
              margin: 5,
            }}
            source={{uri: uploadsUrl + avatar}}
          ></Image>
          <View style={styles.box}>
            <Text>{owner.username} </Text>
          </View>
        </View>

        <Image style={styles.image} source={{uri: uploadsUrl + filename}} />

        <View style={styles.box}>
          <Text style={styles.listTitle}>{title}</Text>
          <Text style={styles.time}>listed {time}ago</Text>
        </View>

        <Button buttonStyle={styles.button}> Message Seller</Button>

        <View style={styles.userInteraction}>
          <View style={styles.iconbox}>
            <Icon name="thumb-up-off-alt" size={20} />
            <Text style={styles.iconText}>Like</Text>
          </View>
          <View style={styles.iconbox}>
            <Icon name="thumb-down-off-alt" size={20} />
            <Text style={styles.iconText}>Dislike</Text>
          </View>
          <View style={styles.iconbox}>
            <Icon name="favorite-border" size={20} />
            <Text style={styles.iconText}>Favourite</Text>
          </View>
        </View>

        <Card.Divider />
        <Text style={styles.listHeader}>Description</Text>
        <Text style={{padding: 10}}>{description}</Text>
      </ScrollView>
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
  column: {
    flexDirection: 'column',
    backgroundColor: '#FAFBFB',
    margin: 10,
    borderRadius: 6,
  },
  userInteraction: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  image: {
    resizeMode: 'cover',
    height: 300,
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  time: {
    fontSize: 11,
    color: '#5A5A5A',
  },
  box: {
    margin: 10,
  },
  button: {
    backgroundColor: primaryColour,
    borderRadius: 25,
    height: 50,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 5,
  },
  listHeader: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
  },
});

Single.propTypes = {
  route: PropTypes.object,
};

export default Single;
