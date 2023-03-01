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
import {userFavourites, userRatings} from '../../hooks/UserFunctionality';

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
  } = route.params;
  const {favourites, addFavourite, removeFavourite} = userFavourites(fileId);
  const {
    addLike,
    addDisLike,
    btnLikeDisable,
    btnDisLikeDisable,
    likeCount,
    disLikeCount,
  } = userRatings(user.user_id, fileId);

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
      navigation.navigate('Chats');
    }
  };

  const getOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const owner = await getUserById(userId, token);
      console.log('ProductDetails owner', owner);
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
            <Text style={styles.listTitle}>
              {descriptionObj.title.toUpperCase()}
            </Text>
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
              <Icon
                name="thumb-up"
                size={26}
                color={btnLikeDisable !== undefined ? 'green' : 'grey'}
                onPress={() => addLike(fileId)}
              />
              <Text style={styles.iconText}>{likeCount}</Text>
            </View>
            <View style={styles.iconbox}>
              <Icon
                name="thumb-down"
                size={26}
                color={btnDisLikeDisable !== undefined ? '#EB212E' : 'grey'}
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
