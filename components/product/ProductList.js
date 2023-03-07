import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import {Icon} from '@rneui/themed';
import {Card} from '@rneui/base';
import {useContext, useEffect, useRef, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTag, useUser} from '../../hooks/ApiHooks';
import {MainContext} from '../../contexts/MainContext';
import {uploadsUrl} from '../../utils/variables';
import Availibility from '../Availibility';
import {userFavourites, userRatings} from '../../hooks/UserFunctionality';
import {Video} from 'expo-av';

const ProductList = ({singleMedia, navigation}) => {
  const assetImage = Image.resolveAssetSource(
    require('../../assets/avatar.png')
  ).uri;
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState(assetImage);
  const {getUserById} = useUser();
  const [owner, setOwner] = useState({});
  const {isLoggedIn, user, token} = useContext(MainContext);

  const video = useRef(null);
  const {favourites, addFavourite, removeFavourite} = userFavourites(
    singleMedia.file_id
  );
  const media = {
    file: singleMedia,
  };

  const {
    addLike,
    addDisLike,
    btnLikeColor,
    btnDislikeColor,
    likeCount,
    disLikeCount,
  } = userRatings(user.user_id, singleMedia.file_id);

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
        console.error('user avatar fetch failed', error.message);
      }
    }
  };

  const getOwner = async () => {
    if (isLoggedIn) {
      try {
        const owner = await getUserById(singleMedia.user_id, token);
        setOwner(owner);
      } catch (error) {
        console.error('owner set failed', error);
      }
    }
  };

  const navigateToMessage = () => {
    if (user.user_id === singleMedia.user_id) {
      navigation.navigate('Chats', singleMedia); // opens a new chat
    } else {
      navigation.navigate('Message', media); // opens a new chat
    }
  };

  const handlePlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.didJustFinish) {
      video.current.setPositionAsync(0); // Set the video position to 0 (start of the video)
      video.current.pauseAsync(); // Pause the video instead of restarting it
    }
  };

  useEffect(() => {
    getOwner();
    loadAvatar();
    // getFile();
  }, [isLoggedIn]);

  return (
    <View style={styles.mainContainer} elevation={5}>
      {singleMedia.media_type === 'video' ? (
        <>
          <View style={styles.videoContainer}>
            <View style={styles.box}>
              <Video
                ref={video}
                source={{uri: uploadsUrl + singleMedia.filename}}
                style={styles.video}
                resizeMode="cover"
                useNativeControls
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                onError={(error) => {
                  console.log(error);
                }}
              />
              <Availibility text={descriptionObj.status} />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProductDetails', singleMedia);
            }}
          >
            <View style={styles.box}>
              <Text style={styles.listTitle}>
                {descriptionObj.title.toUpperCase()}
              </Text>
              <Text numberOfLines={1}>{descriptionObj.detail}</Text>
            </View>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ProductDetails', singleMedia);
          }}
        >
          <View style={styles.box}>
            <ImageBackground
              style={styles.image}
              source={{uri: uploadsUrl + singleMedia.thumbnails?.w640}}
            >
              <Availibility text={descriptionObj.status} />
            </ImageBackground>
          </View>
          <View style={styles.box}>
            <Text style={styles.listTitle}>
              {descriptionObj.title.toUpperCase()}
            </Text>
            <Text numberOfLines={1}>{descriptionObj.detail}</Text>
          </View>
        </TouchableOpacity>
      )}
      <Card.Divider />
      {isLoggedIn ? (
        <View style={styles.userInteraction}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Profile', owner.user_id);
            }}
          >
            <View style={styles.userInfo}>
              <Image style={styles.avatar} source={{uri: avatar}}></Image>
              <Text style={{fontSize: 10}}>{owner.username}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.icons}>
            <View style={styles.iconbox}>
              <Icon
                name="thumb-up"
                size={26}
                color={btnLikeColor !== undefined ? 'green' : 'grey'}
                onPress={() => addLike(singleMedia.file_id)}
              />
              <Text style={styles.iconText}>{likeCount}</Text>
            </View>
            <View style={styles.iconbox}>
              <Icon
                name="thumb-down"
                size={26}
                color={btnDislikeColor !== undefined ? '#EB212E' : 'grey'}
                onPress={() => addDisLike(singleMedia.file_id)}
              />
              <Text style={styles.iconText}>{disLikeCount}</Text>
            </View>
            <View style={{alignItems: 'center'}}>
              <Icon name="chat" size={26} onPress={navigateToMessage} />
              <Text style={styles.iconText}>chat</Text>
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
  mainContainer: {
    flexDirection: 'column',
    backgroundColor: '#F2F0F0',
    margin: 10,
    borderRadius: 6,
  },
  box: {
    flex: 1,
    padding: 10,
  },
  videoContainer: {
    width: '100%',
    height: 300,
  },
  rowBigbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  userInfo: {
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
  },
  iconbox: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 10,
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    margin: 10,
  },
});

ProductList.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ProductList;
