import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl, vw} from '../utils/variables';
import {useEffect, useState} from 'react';
import {getUserById} from '../hooks/ApiHooks';

const FavouriteListItem = ({singleMedia, navigation}) => {
  const item = singleMedia;
  const [owner, setOwner] = useState({});

  const getOwner = async () => {
    const user = await getUserById(singleMedia.user_id);
    setOwner(user);
  };

  useEffect(() => {
    getOwner();
  }, []);

  return (
    <View style={styles.column}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Single', item);
        }}
      >
        <Image
          style={styles.image}
          source={{uri: uploadsUrl + item.thumbnails?.w160}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    backgroundColor: '#FAFBFB',
    margin: 4.5,
    borderRadius: 6,
    minWidth: 31 * vw,
  },
  image: {
    flex: 1,
    aspectRatio: 1.2,
    width: 31 * vw,
    borderRadius: 5,
    resizeMode: 'cover',
  },
});

FavouriteListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default FavouriteListItem;