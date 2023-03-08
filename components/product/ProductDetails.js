import React, {useContext, useEffect, useRef, useState} from 'react';
import {primaryColour, uploadsUrl, vw} from '../../utils/variables';
import PropTypes from 'prop-types';
import {Card, Icon, Button, Image} from '@rneui/themed';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {MainContext} from '../../contexts/MainContext';
import {useMedia, useTag, useUser} from '../../hooks/ApiHooks';
import {userFavourites, userRatings} from '../../hooks/UserFunctionality';
import {Video} from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetails = ({navigation, route}) => {
  const assetImage = Image.resolveAssetSource(
    require('../../assets/avatar.png')
  ).uri;
  const {isLoggedIn} = useContext(MainContext);
  const {getUserById} = useUser();
  const [owner, setOwner] = useState({});
  const [avatar, setAvatar] = useState(assetImage);
  const {getFilesByTag} = useTag();
  const {user} = useContext(MainContext);

  const {
    title,
    description,
    filename,
    file_id: fileId,
    time_added: timeAdded,
    user_id: userId,
    media_type: type,
  } = route.params;
  // console.log('FileID: ', fileId);

  const video = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {favourites, addFavourite, removeFavourite} = userFavourites(fileId);
  const {
    addLike,
    addDisLike,
    btnLikeColor,
    btnDislikeColor,
    likeCount,
    disLikeCount,
  } = userRatings(user.user_id, fileId);

  // using image's uploded time to display the time since the item was posted
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

  // navigates to ModifyProduct component
  const editItem = () => {
    navigation.navigate('ModifyProduct', {
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
      navigation.navigate('Message', {
        file: {
          title,
          description,
          filename,
          file_id: fileId,
          time_added: timeAdded,
          user_id: userId,
        },
      });
    }
  };

  const getOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const owner = await getUserById(userId, token);
      setOwner(owner);
    } catch (error) {
      throw new Error('getOwner error, ' + error.message);
    }
  };

  async function loadAvatar() {
    if (isLoggedIn) {
      try {
        const avatarArray = await getFilesByTag('avatar_' + owner.user_id);
        if (avatarArray.length > 0) {
          setAvatar(uploadsUrl + avatarArray.pop().filename);
        }
      } catch (error) {
        console.error('user avatar fetch failed', error.message);
      }
    }
  }

  const handlePlaybackStatusUpdate = (playbackStatus) => {
    if (playbackStatus.didJustFinish) {
      video.current.setPositionAsync(0); // Set the video position  back to the start of the video
      video.current.pauseAsync(); // Pause the video instead of restarting it
    }
  };

  useEffect(() => {
    getOwner();
  }, []);

  useEffect(() => {
    loadAvatar();
  }, [owner]);

  // Parsing string object to json object
  const descriptionObj = JSON.parse(description);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.imageContainer}>
        {type === 'image' ? (
          <View style={{flex: 1}}>
            <Image
              source={{uri: uploadsUrl + filename}}
              containerStyle={styles.backgroundImage}
              onPress={() => setModalVisible(true)}
            />
            <Button
              type="solid"
              buttonStyle={styles.backBtn}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Icon name="arrow-back" color="black" />
            </Button>
          </View>
        ) : (
          <View style={{flex: 1}}>
            <Video
              ref={video}
              source={{uri: uploadsUrl + filename}}
              resizeMode="contain"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
              }}
              useNativeControls={true}
              onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
              onError={(error) => {
                console.log(error);
              }}
              onFullscreenUpdate={async ({fullscreenUpdate}) => {
                console.log('fullscreen', fullscreenUpdate, Video[0]);
                if (Platform.OS === 'android') {
                  switch (fullscreenUpdate) {
                    case 1:
                      await ScreenOrientation.unlockAsync();
                      break;
                    default:
                      await ScreenOrientation.lockAsync(
                        ScreenOrientation.OrientationLock.PORTRAIT
                      );
                      break;
                  }
                }
              }}
            />
            <Button
              type="solid"
              buttonStyle={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" color="black" />
            </Button>
          </View>
        )}
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
            justifyContent: 'space-between',
          }}
        >
          <View style={styles.box}>
            <Text style={styles.listTitle}>
              {descriptionObj.title.toUpperCase()}
            </Text>
            <Text style={styles.time}>listed {time}ago</Text>
          </View>
          {isLoggedIn && (
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Profile', owner.user_id);
                }}
              >
                <Image
                  style={{
                    resizeMode: 'cover',
                    width: 40,
                    height: 30,
                    borderRadius: 15,
                    alignSelf: 'center',
                  }}
                  source={{uri: avatar}}
                ></Image>
              </TouchableOpacity>
              <View style={styles.userNameBox}>
                <Text>{owner.username} </Text>
              </View>
            </View>
          )}
        </View>

        {isLoggedIn && user.user_id === owner.user_id ? (
          <Button onPress={editItem} buttonStyle={styles.editBtn}>
            Edit Item
          </Button>
        ) : (
          <Button onPress={messageSeller} buttonStyle={styles.messageBtn}>
            Message Seller
          </Button>
        )}
        {isLoggedIn ? (
          <View style={styles.userInteraction}>
            <View style={styles.iconbox}>
              <Icon
                name="thumb-up"
                size={26}
                color={btnLikeColor !== undefined ? 'green' : 'grey'}
                onPress={() => addLike(fileId)}
              />
              <Text style={styles.iconText}>{likeCount}</Text>
            </View>
            <View style={styles.iconbox}>
              <Icon
                name="thumb-down"
                size={26}
                color={btnDislikeColor !== undefined ? '#EB212E' : 'grey'}
                onPress={() => addDisLike(fileId)}
              />
              <Text style={styles.iconText}>{disLikeCount}</Text>
            </View>
            <View style={styles.iconbox}>
              {favourites.length > 0 ? (
                <Icon
                  name="favorite"
                  color="red"
                  size={26}
                  onPress={() => removeFavourite(fileId)}
                />
              ) : (
                <Icon
                  name="favorite-border"
                  size={26}
                  onPress={() => addFavourite(fileId)}
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
        <Text style={styles.listHeader}>Details</Text>
        <Text style={{padding: 10}}>
          Condition {'->'} {descriptionObj.condition}
        </Text>
        <Text style={{padding: 10}}>
          Availibility {'->'} {descriptionObj.status}
        </Text>
        <Card.Divider />
        <Text style={styles.listHeader}>Description</Text>
        <Text style={{padding: 10}}>{descriptionObj.detail}</Text>
      </ScrollView>
      <Modal
        visible={modalVisible}
        style={{flex: 1}}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Image
          resizeMode="contain"
          onPress={() => setModalVisible(false)}
          style={{height: '100%'}}
          source={{uri: uploadsUrl + filename}}
        />
      </Modal>
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
    maxWidth: '100%',
  },
  time: {
    fontSize: 11,
    color: '#5A5A5A',
  },
  box: {
    margin: 10,
    maxWidth: 70 * vw,
  },

  userNameBox: {
    maxWidth: 30 * vw,
  },

  messageBtn: {
    backgroundColor: primaryColour,
    borderRadius: 25,
    height: 50,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 5,
  },
  editBtn: {
    backgroundColor: '#F7B500',
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
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
