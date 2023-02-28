import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {Button, Icon} from '@rneui/themed';
import {Card} from '@rneui/base';
import {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFavourite, useRating, useTag, useUser} from '../../hooks/ApiHooks';
import {MainContext} from '../../contexts/MainContext';
import {uploadsUrl} from '../../utils/variables';
import {userFavourites, userRatings} from '../../hooks/UserFunctionality';

const ProductList = ({singleMedia, navigation}) => {
  const assetImage = Image.resolveAssetSource(
    require('../../assets/avatar.png')
  ).uri;
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState(assetImage);
  const {getUserById} = useUser();
  const [owner, setOwner] = useState({});
  const {
    isLoggedIn,
    user,
    update,
    updateRating,
    setUpdateRating,
    userDislikesIt,
  } = useContext(MainContext);

  const {getFavouritesByFileId, deleteFavourite} = useFavourite();
  const [ratings, setRatings] = useState([]);
  const [likesArray, setLikesArray] = useState([]);
  const [dislikesArray, setDislikesArray] = useState([]);
  const [userLikesIt, setUserLikesIt] = useState(false);
  //const [userDislikesIt, setUserDislikesIt] = useState(false);
  const {postRating, deleteRating, getRatingsByFileId} = useRating();
  const {favourites, addFavourite, removeFavourite} = userFavourites(
    singleMedia.file_id
  );
  const {getAllRatings, userLiked} = userRatings(
    singleMedia.file_id,
    user.user_id
  );

  // Parsing string object to json object
  const descriptionObj = JSON.parse(singleMedia.description);
  const loadAvatar = async () => {
    if (isLoggedIn) {
      try {
        const avatarArray = await getFilesByTag(
          'avatar_' + singleMedia.user_id
        );
        if (avatarArray.length > 0) {
          setAvatar(uploadsUrl + avatarArray.pop().filename);
        }
      } catch (error) {
        // console.error('user avatar fetch failed', error.message);
      }
    }
  };

  const getOwner = async () => {
    if (isLoggedIn) {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const owner = await getUserById(singleMedia.user_id, token);
        // console.log('owner', owner);
        setOwner(owner);
      } catch (error) {
        // console.error('owner set failed', singleMedia.user_id);
      }
    }
  };

  const getRatings = async () => {
    try {
      const ratings = await getRatingsByFileId(singleMedia.file_id);
      setRatings(ratings);

      // checking if user likes or dislikes the item
      for (const rating of ratings) {
        if (rating.user_id === user.user_id && rating.rating === 1) {
          setUserLikesIt(true);
          break;
        } else if (rating.user_id === user.user_id && rating.rating === 2) {
          //setUserDislikesIt(true);
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
      await postRating(singleMedia.file_id, token, 1);
      //setUserLikesIt(true);
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
      await deleteRating(singleMedia.file_id, token);
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
      await postRating(singleMedia.file_id, token, 2);
      //setUserDislikesIt(true);
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
      await deleteRating(singleMedia.file_id, token);
      setUserDislikesIt(false);
      getRatings();
      setUpdateRating(!updateRating);
    } catch (error) {
      // note: you cannot like same file multiple times
      // console.log(error);
    }
  };

  useEffect(() => {
    getOwner();
    loadAvatar();
  }, [isLoggedIn]);

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
    <View style={styles.column} elevation={5}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProductDetails', singleMedia);
        }}
      >
        <View style={styles.box}>
          <Image
            style={styles.image}
            source={{uri: uploadsUrl + singleMedia.thumbnails?.w640}}
          />
        </View>
        <View style={styles.box}>
          <Text style={styles.listTitle}>{singleMedia.title}</Text>
          <Text numberOfLines={1}>{descriptionObj.detail}</Text>
          <Text numberOfLines={1}>{descriptionObj.condition}</Text>
          <Text numberOfLines={1}>{descriptionObj.status}</Text>
          <Text numberOfLines={1}>{descriptionObj.title}</Text>
        </View>
      </TouchableOpacity>
      <Card.Divider />
      {isLoggedIn ? (
        <View style={styles.userInteraction}>
          <View style={styles.userInfo}>
            <Image style={styles.avatar} source={{uri: avatar}}></Image>
            <Text style={{fontSize: 10}}>{owner.username}</Text>
          </View>

          <View style={styles.icons}>
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
            <View style={{alignSelf: 'flex-start'}}>
              <Icon
                name="chat"
                size={26}
                onPress={() => {
                  navigation.navigate('Chats'); // opens a new chat
                }}
              />
              {/* <Text style={styles.iconText}>chat</Text> */}
            </View>
            <View style={styles.iconbox}>
              {favourites.length > 0 ? (
                <Icon
                  name="favorite"
                  color="red"
                  onPress={() => removeFavourite(singleMedia.file_id)}
                />
              ) : (
                <Icon
                  name="favorite-border"
                  onPress={() => addFavourite(singleMedia.file_id)}
                />
              )}
              <Text style={styles.iconText}>{favourites.length}</Text>
            </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    backgroundColor: '#F2F0F0',
    margin: 10,
    borderRadius: 6,
  },
  box: {
    flex: 1,
    padding: 10,
  },
  rowBigbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  userInfo: {
    width: '40%',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  icons: {
    width: '60%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10,
  },
  userInteraction: {
    marginTop: -10,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  image: {
    flex: 1,
    height: 200,
    borderRadius: 6,
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 15,
  },
  avatar: {
    resizeMode: 'cover',
    width: 40,
    height: 30,
    borderRadius: 15,
    alignSelf: 'center',
    marginRight: 10,
  },
  iconbox: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 10,
  },
});

ProductList.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ProductList;
