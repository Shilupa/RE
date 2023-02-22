import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Icon} from '@rneui/themed';
import {Card} from '@rneui/base';
import {useContext, useEffect, useRef, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useTag, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import defaultAvatar from '../assets/avatar.png';

const ListItem = ({singleMedia, navigation}) => {
  const defaultAvatarUri = Image.resolveAssetSource(defaultAvatar).uri;
  const item = singleMedia;
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState(defaultAvatarUri);
  const {getUserById} = useUser();
  const [owner, setOwner] = useState({});
  const {isLoggedIn} = useContext(MainContext);
  const isMountedRef = useRef(false);

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + item.user_id);
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.log('set avatr faile', error.message);
    }
  };
  const getOwner = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const owner = await getUserById(item.user_id, token);
      console.log('owner', owner);
      setOwner(owner);
    } catch (error) {
      console.error('owner set failed', item.user_id);
    }
  };

  /*   useEffect(() => {
    loadAvatar();
    getOwner();
  }, [isLoggedIn]); */

  useEffect(() => {
    if (isMountedRef.current) {
      loadAvatar();
      getOwner();
    } else {
      isMountedRef.current = true;
    }
  }, [isLoggedIn]);

  return (
    <View style={styles.column} elevation={5}>
      {isLoggedIn && (
        <View style={styles.userInfo}>
          <Image
            style={styles.avatar}
            source={{
              uri: uploadsUrl + avatar,
            }}
          ></Image>
          <Text>{owner.username}</Text>
        </View>
      )}

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
          <Icon name="chat" size={20} />
          <Text style={styles.iconText}>Message</Text>
        </View>
        <View style={styles.iconbox}>
          <Icon name="favorite-border" size={20} />
          <Text style={styles.iconText}>Favourite</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    backgroundColor: '#FAFBFB',
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
    width: '50%',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  userInteraction: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    width: 40,
    height: 40,
    borderRadius: 400 / 2,
    alignSelf: 'center',
    marginRight: 10,
  },
  iconbox: {
    flexDirection: 'column',
  },
  iconText: {
    fontSize: 12,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
