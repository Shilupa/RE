import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Icon} from '@rneui/themed';
import {Card} from '@rneui/base';

const ListItem = ({singleMedia, navigation}) => {
  const item = singleMedia;
  return (
    <View style={styles.column} elevation={5}>
      <View style={styles.userInfo}>
        <Text>Picture</Text>
        <Text>Bella</Text>
      </View>
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
          <Text>{item.description}</Text>
        </View>
      </TouchableOpacity>
      <Card.Divider />
      <View style={styles.userInteraction}>
        <Icon name="thumb-up-off-alt" />
        <Icon name="thumb-down-off-alt" />
        <Icon name="chat" />
        <Icon name="favorite-border" />
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
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
