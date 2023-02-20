import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';

const SecondaryListItem = ({singleMedia, navigation}) => {
  const item = singleMedia;
  return (
    <View style={styles.column}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ModifyItem', {file: item});
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
    minWidth: '31%',
  },
  image: {
    flex: 1,
    aspectRatio: 1.2,
    minHeight: 50,
    borderRadius: 5,
    resizeMode: 'cover',
  },
});

SecondaryListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default SecondaryListItem;
