import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl, vw} from '../utils/variables';

const ChatListItem = ({singleMedia, navigation}) => {
  const item = singleMedia;

  return (
    <TouchableOpacity
      onPress={() => {
        console.log('Go to message: ');
        navigation.navigate('Message');
      }}
    >
      <View style={styles.container}>
        <View style={styles.itemPicContainer}>
          <Image
            style={styles.itemPic}
            source={{
              uri: uploadsUrl + item.thumbnails?.w160,
            }}
          />
          <View style={styles.messageBox}>
            <Text style={styles.title}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.message}>
              {item.description}
            </Text>
          </View>
        </View>

        <Text style={styles.time}>1 Sept 2022</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F0F0',
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    position: 'relative',
  },

  itemPicContainer: {
    flexDirection: 'row',
  },

  itemPic: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  messageBox: {
    margin: 10,
    width: 50 * vw,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  message: {
    fontSize: 12,
  },

  time: {
    position: 'absolute',
    bottom: 5,
    right: 10,
    fontSize: 10,
    color: '#626161',
  },
});

ChatListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ChatListItem;
