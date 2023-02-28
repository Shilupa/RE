import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl, vw} from '../utils/variables';

const ChatListItem = ({singleComment, navigation}) => {
  const item = singleComment;
  const {message, commentAddedTime} = singleComment.chatGroup[0];
  const file = singleComment.file;
  const {title} = JSON.parse(file.description);

  const commentUploadTime = new Date(commentAddedTime);
  const month = commentUploadTime.toLocaleString('default', {month: 'short'});
  const day = commentUploadTime.getUTCDate();
  const year = commentUploadTime.getUTCFullYear();
  const hours = commentUploadTime.getHours() % 12 || 12;
  const minutes = commentUploadTime.getUTCMinutes();
  const ampm = commentUploadTime.getHours() >= 12 ? 'PM' : 'AM';
  const formattedDate = `${month} ${day} ${year} ${hours}:${minutes
    .toString()
    .padStart(2, '0')} ${ampm}`;

  const timeNow = new Date();
  const timeDiff = timeNow.getTime() - commentUploadTime.getTime();

  let timeformat;
  // Convert the time difference to seconds mins hours
  if (timeDiff < 60000) {
    timeformat = Math.floor(timeDiff / 1000) + 's ';
  } else if (timeDiff >= 60000 && timeDiff < 3600000) {
    timeformat = Math.round(Math.abs(timeDiff) / 60000) + 'm ';
  } else if (timeDiff >= 3600000 && timeDiff < 24 * 3600000) {
    timeformat = Math.floor(timeDiff / 3600000) + 'h ';
  } else {
    timeformat = formattedDate;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        // console.log('Go to  message: ');
        // console.log('ItemSend: ', item.chatGroup[0]);
        navigation.navigate('Message', item);
      }}
    >
      <View style={styles.container}>
        <View style={styles.itemPicContainer}>
          <Image
            style={styles.itemPic}
            source={{
              uri: uploadsUrl + file.thumbnails?.w160,
            }}
          />
          <View style={styles.messageBox}>
            <Text style={styles.title}>{title}</Text>
            <Text numberOfLines={1} style={styles.message}>
              {message}
            </Text>
          </View>
        </View>

        <Text style={styles.time}>{timeformat}</Text>
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
  singleComment: PropTypes.object,
  navigation: PropTypes.object,
};

export default ChatListItem;
