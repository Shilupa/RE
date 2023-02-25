import {Image, StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';

const SearchListItem = ({singleMedia, navigation}) => {
  const item = singleMedia;
  // console.log('Item: ', item);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DetailProductView', item);
        }}
      >
        <Image
          style={styles.image}
          source={{uri: uploadsUrl + item.thumbnails?.w160}}
        />
      </TouchableOpacity>

      <View style={styles.profileAndInfo}>
        <Image
          style={styles.profilePic}
          source={{uri: uploadsUrl + item.thumbnails?.w160}}
        />
        <Text style={{marginLeft: 10}}>{item.title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F0F0',
    margin: 10,
    borderRadius: 5,
    width: '47%',
    padding: 2,
  },

  image: {
    minHeight: 50,
    borderRadius: 10,
    aspectRatio: 1.2,
    resizeMode: 'cover',
  },
  profilePic: {
    height: 30,
    aspectRatio: 1,
    borderRadius: 15,
    resizeMode: 'cover',
  },
  profileAndInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7,
    marginStart: 7,
  },
});

SearchListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default SearchListItem;
