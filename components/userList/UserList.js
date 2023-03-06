import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl, vw} from '../../utils/variables';

const UserList = ({navigation, singleMedia}) => {
  return (
    <View style={styles.column}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProductDetails', singleMedia);
        }}
      >
        <ImageBackground
          style={styles.image}
          source={{uri: uploadsUrl + singleMedia.thumbnails?.w160}}
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
