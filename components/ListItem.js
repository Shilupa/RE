import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Icon} from '@rneui/themed';
import {Card} from '@rneui/base';
import {useContext, useEffect, useRef, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GoLogin from '../views/GoLogin';

const ListItem = ({singleMedia, navigation}) => {
  const assetImage = Image.resolveAssetSource(
    require('../assets/avatar.png')
  ).uri;
  const item = singleMedia;
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState(assetImage);
  const {getUserById} = useUser();
  const [owner, setOwner] = useState({});
  const {isLoggedIn} = useContext(MainContext);
  const isMountedRef = useRef(false);

  const loadAvatar = async () => {
    if (isLoggedIn) {
      try {
        const avatarArray = await getFilesByTag('avatar_' + item.user_id);
        console.log('Profile avatar', avatarArray.filename);
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
        const owner = await getUserById(item.user_id, token);
        // console.log('owner', owner);
        setOwner(owner);
      } catch (error) {
        console.error('owner set failed', item.user_id);
      }
    }
  };

  useEffect(() => {
    loadAvatar();
    getOwner();
  }, [isLoggedIn]);

  const goToLogin = () => {
    navigation.navigate('GoLogin');
  };

  return (
    <View style={styles.column} elevation={5}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Single', item);
        }}
      >
        <View style={styles.box}>
          <Image
            style={styles.image}
            source={{uri: uploadsUrl + item.thumbnails?.w160}}
          />
        </View>
        <View style={styles.box}>
          <Text style={styles.listTitle}>{item.title}</Text>
          <Text numberOfLines={1}>{item.description}</Text>
        </View>
      </TouchableOpacity>
      <Card.Divider />
      {isLoggedIn ? (
        <View style={styles.userInteraction}>
          <View style={styles.userInfo}>
            <Image
              style={styles.avatar}
              /* source={{
                uri: uploadsUrl + avatar,
              }} */
              /* source={require('../assets/avatar.png')} */
              source={{uri: avatar}}
            ></Image>
            <Text style={{fontSize: 10}}>{owner.username}</Text>
          </View>

          <View style={styles.icons}>
            <View style={styles.iconbox}>
              <Icon name="thumb-up-off-alt" size={20} />
              <Text style={styles.iconText}>1.4k</Text>
            </View>
            <View style={styles.iconbox}>
              <Icon name="thumb-down-off-alt" size={20} />
              <Text style={styles.iconText}>1.4k</Text>
            </View>
            <View style={{alignSelf: 'flex-start'}}>
              <Icon name="chat" size={20} />
              {/* <Text style={styles.iconText}>Message</Text> */}
            </View>
            <View style={styles.iconbox}>
              <Icon name="favorite-border" size={20} />
              <Text style={styles.iconText}>1.4k</Text>
            </View>
          </View>
        </View>
      ) : (
        <TouchableOpacity onPress={goToLogin}>
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
              <Text style={styles.iconText}>1.4k</Text>
            </View>
            <View style={styles.iconbox}>
              <Icon name="thumb-down-off-alt" size={20} />
              <Text style={styles.iconText}>1.4k</Text>
            </View>
            <View style={{alignSelf: 'flex-start'}}>
              <Icon name="chat" size={20} />
            </View>
            <View style={styles.iconbox}>
              <Icon name="favorite-border" size={20} />
              <Text style={styles.iconText}>1.4k</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  image: {
    flex: 1,
    minHeight: 300,
    borderRadius: 6,
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 15,
  },
  avatar: {
    resizeMode: 'cover',
    width: 30,
    height: 30,
    borderRadius: 200 / 2,
    alignSelf: 'center',
    marginRight: 10,
  },
  iconbox: {
    flexDirection: 'column',
  },
  iconText: {
    fontSize: 10,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
