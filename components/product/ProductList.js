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
import {Button, Icon} from '@rneui/themed';
import {Card} from '@rneui/base';
import {useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useRating, useTag, useUser} from '../../hooks/ApiHooks';
import {MainContext} from '../../contexts/MainContext';
import {uploadsUrl} from '../../utils/variables';
import Availibility from '../Availibility';
import {userFavourites, userRatings} from '../../hooks/UserFunctionality';

const ProductList = ({singleMedia, navigation}) => {
  const assetImage = Image.resolveAssetSource(
    require('../../assets/avatar.png')
  ).uri;
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState(assetImage);
  const {getUserById} = useUser();
  const [owner, setOwner] = useState({});
  const {isLoggedIn, user} = useContext(MainContext);

  const {favourites, addFavourite, removeFavourite} = userFavourites(
    singleMedia.file_id
  );
  const {
    addLike,
    removeLike,
    btnLikeDisable,
    btnDisLikeDisable,
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
        const token = await AsyncStorage.getItem('userToken');
        const owner = await getUserById(singleMedia.user_id, token);
        setOwner(owner);
      } catch (error) {
        console.error('owner set failed', error);
      }
    }
  };

  useEffect(() => {
    getOwner();
    loadAvatar();
  }, [isLoggedIn]);

  return (
    <View style={styles.column} elevation={5}>
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
            <Availibility
              text={descriptionObj.status}
              style={styles.availibility}
            />
          </ImageBackground>
        </View>
        <View style={styles.box}>
          <Text style={styles.listTitle}>
            {descriptionObj.title.toUpperCase()}
          </Text>
          <Text numberOfLines={1}>{descriptionObj.detail}</Text>
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
              <Icon
                name="thumb-up"
                size={26}
                color={btnLikeDisable !== undefined ? 'green' : 'grey'}
                onPress={() => addLike(singleMedia.file_id)}
              />
              <Text style={styles.iconText}>{likeCount}</Text>
            </View>
            <View style={styles.iconbox}>
              {/* {userDislikesIt ? ( */}
              <Icon
                name="thumb-down"
                size={26}
                color={btnDisLikeDisable !== undefined ? '#EB212E' : 'grey'}
                onPress={() => removeLike(singleMedia.file_id)}
              />
              <Text style={styles.iconText}>{disLikeCount}</Text>
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
