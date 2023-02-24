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
  ScrollView,
  ImageBackground,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useFavourite, useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Single = ({navigation, route}) => {
  console.log(route.params);
  const {isLoggedIn, updateFavourite, setUpdateFavourite} =
    useContext(MainContext);
  const {getUserById} = useUser();
  const [owner, setOwner] = useState({});
  const [avatar, setAvatar] = useState('');
  const {getFilesByTag} = useTag();
  const [favourites, setFavourites] = useState([]);
  const [userFavouritesIt, setuserFavouritesIt] = useState(false);
  const {user} = useContext(MainContext);
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();

  const {
    title,
    description,
    filename,
    file_id: fileId,
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

  const editItem = () => {
    navigation.navigate('ModifyItem', {
      file: {
        title,
        description,
        filename,
        file_id: fileId,
        time_added: timeAdded,
        user_id: userId,
      },
    });
  };

  const messageSeller = () => {
    if (!isLoggedIn) {
      navigation.navigate('Login');
    }
    console.log('Hahaha');
  };

  const getOwner = async () => {
    const token = await AsyncStorage.getItem('userToken');
    const owner = await getUserById(userId, token);
    console.log('owner', owner);
    setOwner(owner);
  };

  const getFavourites = async () => {
    const favourites = await getFavouritesByFileId(fileId);
    // console.log('likes', likes, 'user', user);
    setFavourites(favourites);
    // check if the current user id is included in the 'likes' array and
    // set the 'userLikesIt' state accordingly
    for (const favorite of favourites) {
      if (favorite.user_id === user.user_id) {
        setuserFavouritesIt(true);
        break;
      }
    }
  };

  const favouriteFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await postFavourite(fileId, token);
      setuserFavouritesIt(true);
      getFavourites();
      setUpdateFavourite(!updateFavourite);
    } catch (error) {
      // note: you cannot like same file multiple times
      // console.log(error);
    }
  };

  const unfavouriteFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await deleteFavourite(fileId, token);
      setuserFavouritesIt(false);
      getFavourites();
      setUpdateFavourite(!updateFavourite);
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log(error);
    }
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
    getFavourites();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{uri: uploadsUrl + filename}}
          style={styles.backgroundImage}
        >
          <Button
            type="solid"
            buttonStyle={styles.backBtn}
            onPress={() => navigation.goBack()}
            containerStyle={{
              marginHorizontal: 20,
              marginVertical: 10,
              borderRadius: 100 / 2,
            }}
          >
            <Icon name="arrow-back" color="black" />
          </Button>
        </ImageBackground>
      </View>
      <ScrollView>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'space-between',
            justifyContent: 'space-between',
          }}
        >
          <View style={styles.box}>
            <Text style={styles.listTitle}>{title}</Text>
            <Text style={styles.time}>listed {time}ago</Text>
          </View>
          {isLoggedIn && (
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
          )}
        </View>

        {isLoggedIn && user.user_id === owner.user_id ? (
          <Button onPress={editItem} buttonStyle={styles.button}>
            Edit Item
          </Button>
        ) : (
          <Button onPress={messageSeller} buttonStyle={styles.button}>
            Message Seller
          </Button>
        )}

        <View style={styles.userInteraction}>
          <View style={styles.iconbox}>
            <Icon name="thumb-up-off-alt" size={20} />
            <Text style={styles.iconText}>1.4k</Text>
          </View>
          <View style={styles.iconbox}>
            <Icon name="thumb-down-off-alt" size={20} />
            <Text style={styles.iconText}>1.4k</Text>
          </View>
          <View style={styles.iconbox}>
            {userFavouritesIt ? (
              <Icon name="favorite" color="red" onPress={unfavouriteFile} />
            ) : (
              <Icon name="favorite-border" onPress={favouriteFile} />
            )}
            <Text style={styles.iconText}>1.4k</Text>
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
  imageContainer: {
    width: '100%',
    height: 300,
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
  logIn: {
    marginVertical: 25,
    marginHorizontal: 25,
    color: primaryColour,
    fontSize: 16,
    fontWeight: 'bold',
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
    flex: 1,
    resizeMode: 'cover',
    opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
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
  backBtn: {
    borderRadius: 200 / 2,
    width: 50,
    height: 50,
    left: -150,
    alignSelf: 'center',
    marginBottom: 5,
    backgroundColor: '#81C784',
    elevation: 10,
  },
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
  iconbox: {
    flexDirection: 'column',
  },
});

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
  singleMedia: PropTypes.object,
};

export default Single;
