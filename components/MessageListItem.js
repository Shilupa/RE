import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl, vw} from '../utils/variables';

const MessageListItem = ({singleMedia, navigation}) => {
  const item = singleMedia;
  const sender = true;

  return (
    <TouchableOpacity
      onPress={() => {
        console.log('Go to message: ');
      }}
    >
      <View style={sender ? styles.containerSender : styles.containerOwner}>
        <Image
          style={styles.avatar}
          source={{
            uri: uploadsUrl + item.thumbnails?.w160,
          }}
        />

        <View style={sender ? styles.messageBoxSender : styles.messageBoxOwner}>
          <Text style={sender ? styles.messageSender : styles.messageOwner}>
            {item.description}
          </Text>
          <Text style={sender ? styles.timeSender : styles.timeOwner}>
            1 Sept 2022
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerOwner: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },

  containerSender: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  messageBoxOwner: {
    position: 'relative',
    backgroundColor: '#F2F0F0',
    marginHorizontal: 5,
    width: 60 * vw,
    borderRadius: 15,
  },

  messageBoxSender: {
    position: 'relative',
    backgroundColor: '#E2FAE4',
    marginHorizontal: 5,
    width: 60 * vw,
    borderRadius: 15,
  },

  messageOwner: {
    fontSize: 12,
    padding: 10,
    alignSelf: 'flex-end',
  },

  messageSender: {
    fontSize: 12,
    padding: 10,
    alignSelf: 'flex-start',
  },

  timeOwner: {
    position: 'absolute',
    bottom: -13,
    left: 10,
    fontSize: 10,
    color: '#626161',
  },

  timeSender: {
    position: 'absolute',
    bottom: -13,
    right: 10,
    fontSize: 10,
    color: '#626161',
  },
});

MessageListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default MessageListItem;
