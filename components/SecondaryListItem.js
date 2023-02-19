import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';

const SecondaryListItem = ({singleMedia, navigation}) => {
  const item = singleMedia;
  return (
    <View style={styles.column}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Home', item); // TODO : Fix navigation
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
    margin: 6,
    borderRadius: 6,
    minWidth: 125,
  },
  image: {
    flex: 1,
    minHeight: 200,
    borderRadius: 6,
    resizeMode: 'stretch',
  },
});

SecondaryListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default SecondaryListItem;
