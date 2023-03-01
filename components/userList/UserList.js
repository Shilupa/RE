import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl, vw} from '../../utils/variables';
import {useContext, useEffect, useState} from 'react';
import {useUser} from '../../hooks/ApiHooks';
import {MainContext} from '../../contexts/MainContext';

const UserList = ({singleMedia, navigation}) => {
  const item = singleMedia;
  const [owner, setOwner] = useState({});
  const {getUserById} = useUser();
  const {token} = useContext(MainContext);

  const getOwner = async () => {
    try {
      const user = await getUserById(singleMedia.user_id, token);
      setOwner(user);
    } catch (error) {
      throw new Error('getOwner error, ' + error.message);
    }
  };

  useEffect(() => {
    getOwner();
  }, []);

  return (
    <View style={styles.column}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProductDetails', item);
        }}
      >
        <ImageBackground
          style={styles.image}
          source={{uri: uploadsUrl + item.thumbnails?.w160}}
        ></ImageBackground>
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

UserList.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default UserList;
