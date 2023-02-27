import React, {useContext, useEffect, useState} from 'react';
import {
  inputBackground,
  primaryColour,
  uploadsUrl,
  vw,
} from '../../utils/variables';
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
  StatusBar,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {MainContext} from '../../contexts/MainContext';
import {useFavourite, useRating, useTag, useUser} from '../../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetails = ({navigation, route}) => {
  console.log('routeParams: ', route.params);

  const assetImage = Image.resolveAssetSource(
    require('../../assets/avatar.png')
  ).uri;
  const {
    isLoggedIn,
    updateFavourite,
    setUpdateFavourite,
    updateRating,
    setUpdateRating,
    update,
    setUpdate,
  } = useContext(MainContext);
  const {getUserById} = useUser();
  const [owner, setOwner] = useState({});
  const [avatar, setAvatar] = useState(assetImage);
  const {getFilesByTag} = useTag();
  const [favourites, setFavourites] = useState([]);
  const [userFavouritesIt, setuserFavouritesIt] = useState(false);
  const {user} = useContext(MainContext);
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();
  const {postRating, deleteRating, getRatingsByFileId} = useRating();
  const [ratings, setRatings] = useState([]);
  const [likesArray, setLikesArray] = useState([]);
  const [dislikesArray, setDislikesArray] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);
  const [userDislikesIt, setUserDislikesIt] = useState(false);

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
      Alert.alert(
        'Continue',
        'To continue using all the features, you must log in!',
        [
          {
            text: 'Go to Login',
            onPress: () => {
              navigation.navigate('Login');
            },
          },
          {text: 'Continue as a guest'},
        ]
      );
    } else {
      navigation.navigate('Chats');
    }
  };

  const getOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const owner = await getUserById(userId, token);
      console.log('owner', owner);
      setOwner(owner);
    } catch (error) {
      throw new Error('getOwner error, ' + error.message);
    }
  };

  const getFavourites = async () => {
    try {
      const favourites = await getFavouritesByFileId(fileId);
      // console.log('likes', likes, 'user', user);
      setFavourites(favourites);
      // check if the current user id is included in the 'likes' array and
      // set the 'userLikesIt' state accordingly
      for (const favourite of favourites) {
        if (favourite.user_id === user.user_id) {
          setuserFavouritesIt(true);
          break;
        }
      }
    } catch (error) {
      console.log('Product details [getFavourites]', error);
    }
  };

  const favouriteFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await postFavourite(fileId, token);
      setuserFavouritesIt(true);
      setUpdateFavourite(!updateFavourite);
      setUpdate(update + 1);
    } catch (error) {
      // note: you cannot like same file multiple times
      // console.log(error);
      // console.log('Product details [favouriteFile]', error);
    }
  };

  const unfavouriteFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await deleteFavourite(fileId, token);
      setuserFavouritesIt(false);
      setUpdateFavourite(!updateFavourite);
      setUpdate(update + 1);
    } catch (error) {
      // note: you cannot like same file multiple times
      // console.log(error);
      // console.log('Product details [nfavouriteFile]', error);
    }
  };

  const getRatings = async () => {
    try {
      const ratings = await getRatingsByFileId(fileId);
      setRatings(ratings);

      // checking if user likes or dislikes the item
      for (const rating of ratings) {
        if (rating.user_id === user.user_id && rating.rating === 1) {
          setUserLikesIt(true);
          break;
        } else if (rating.user_id === user.user_id && rating.rating === 2) {
          setUserDislikesIt(true);
          break;
        }
      }
      // making new array of likes and dislikes
      setLikesArray(ratings.filter((obj) => obj.rating === 1));
      setDislikesArray(ratings.filter((obj) => obj.rating === 2));
    } catch (error) {
      // console.log('Product details [getRatings]', error);
    }
  };

  const likeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await postRating(fileId, token, 1);
      setUserLikesIt(true);
      getRatings();
      setUpdateRating(!updateRating);
    } catch (error) {
      // note: you cannot like same file multiple times
      // console.log('Product details [rateFile]', error);
    }
  };

  const unlikeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await deleteRating(fileId, token);
      setUserLikesIt(false);
      getRatings();
      setUpdateRating(!updateRating);
    } catch (error) {
      // note: you cannot like same file multiple times
      // console.log(error);
    }
  };

  const dislikeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await postRating(fileId, token, 2);
      setUserDislikesIt(true);
      getRatings();
      setUpdateRating(!updateRating);
    } catch (error) {
      // note: you cannot like same file multiple times
      // console.log('Product details [rateFile]', error);
    }
  };

  const unDislikeFile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await deleteRating(fileId, token);
      setUserDislikesIt(false);
      getRatings();
      setUpdateRating(!updateRating);
    } catch (error) {
      // note: you cannot like same file multiple times
      // console.log(error);
    }
  };

  async function loadAvatar() {
    if (isLoggedIn) {
      try {
        const avatarArray = await getFilesByTag('avatar_' + owner.user_id);
        // console.log('Profile avatar', avatarArray.filename);
        if (avatarArray.length > 0) {
          setAvatar(uploadsUrl + avatarArray.pop().filename);
        }
      } catch (error) {
        // console.error('user avatar fetch failed', error.message);
      }
    }
  }

  useEffect(() => {
    getOwner();
  }, []);

  useEffect(() => {
    loadAvatar();
  }, [owner]);

  useEffect(() => {
    getFavourites();
  }, [update, updateFavourite]);

  useEffect(() => {
    getRatings();
  }, [update, updateRating]);

  const handleLikePress = () => {
    if (userDislikesIt) {
      unDislikeFile();
      likeFile();
    }
    likeFile();
  };

  const handleDislikePress = () => {
    if (userLikesIt) {
      unlikeFile();
      dislikeFile();
    }
    dislikeFile();
  };

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
          >
            <Icon name="arrow-back" color="black" />
          </Button>
        </ImageBackground>
      </View>
      <ScrollView
      /* style={{
          backgroundColor: 'beige',
          borderTopLeftRadius: 40,
          borderTopRightRadius: 40,
        }} */
      >
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
                  resizeMode: 'cover',
                  width: 40,
                  height: 30,
                  borderRadius: 15,
                  alignSelf: 'center',
                  marginRight: 10,
                }}
                source={{uri: avatar}}
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
        {isLoggedIn ? (
          <View style={styles.userInteraction}>
            <View style={styles.iconbox}>
              {userLikesIt ? (
                <Icon
                  name="thumb-up"
                  size={26}
                  color="green"
                  onPress={unlikeFile}
                />
              ) : (
                <Icon
                  name="thumb-up-off-alt"
                  size={26}
                  onPress={handleLikePress}
                />
              )}
              <Text style={styles.iconText}>{likesArray.length}</Text>
            </View>
            <View style={styles.iconbox}>
              {userDislikesIt ? (
                <Icon
                  name="thumb-down"
                  size={26}
                  color="#EB212E"
                  onPress={unDislikeFile}
                />
              ) : (
                <Icon
                  name="thumb-down-off-alt"
                  size={26}
                  onPress={handleDislikePress}
                />
              )}
              <Text style={styles.iconText}>{dislikesArray.length}</Text>
            </View>
            <View style={styles.iconbox}>
              {userFavouritesIt ? (
                <Icon
                  name="favorite"
                  color="red"
                  size={26}
                  onPress={unfavouriteFile}
                />
              ) : (
                <Icon
                  name="favorite-border"
                  size={26}
                  onPress={favouriteFile}
                />
              )}
              <Text style={styles.iconText}>{favourites.length}</Text>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Login',
                'To continue using all the features, you must log in!',
                [
                  {
                    text: 'Go to Login',
                    onPress: () => {
                      navigation.navigate('Login');
                    },
                  },
                  {text: 'Continue as a guest'},
                ]
              );
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: 10,
              }}
            >
              <View style={styles.iconbox}>
                <Icon name="thumb-up-off-alt" size={20} />
              </View>
              <View style={styles.iconbox}>
                <Icon name="thumb-down-off-alt" size={20} />
              </View>
              <View style={{alignSelf: 'flex-start'}}>
                <Icon name="chat" size={20} />
              </View>
              <View style={styles.iconbox}>
                <Icon name="favorite-border" size={20} />
              </View>
            </View>
          </TouchableOpacity>
        )}

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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
  iconbox: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});

ProductDetails.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
  singleMedia: PropTypes.object,
};

export default ProductDetails;
