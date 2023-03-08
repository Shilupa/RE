import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {messageId, uploadsUrl, vw} from '../utils/variables';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useMedia} from '../hooks/ApiHooks';

const ChatListItem = ({navigation, singleChatGroup}) => {
  const item = singleChatGroup;
  // console.log('Chat list Item:::', item);
  const {user, token, updateMessage, setUpdateMessage} =
    useContext(MainContext);
  const {deleteMedia} = useMedia();

  const {comment, time_added} = item.allComments[item.allComments.length - 1];
  const description = JSON.parse(item.file.description);

  const commentUploadTime = new Date(time_added);
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

  // const isSeenOld = JSON.parse(item.description)[user.user_id];
  //console.log('Is Seen: ', isSeen);

  // Check if the message has been read
  const isSeen = () => {
    const userIdNumber = user.user_id;
    const id1 = item.title.split('_')[0].replace(messageId, '');
    const id2 = item.title.split('_')[1].replace(messageId, '');

    // console.log('Id1: ', id1);
    // console.log('Id2: ', id2);

    // console.log('UserId: ', userIdNumber);

    const otherId = id1 == userIdNumber ? id2 : id1;
    // console.log('OtherId: ', otherId);

    const userRating = item.rating.find(
      (singleRating) => singleRating.user_id == userIdNumber
    );
    console.log('user rating: ', userRating ? userRating.rating : null);

    const otherRating = item.rating.find(
      (singleRating) => singleRating.user_id == otherId
    );

    console.log('Other rating: ', otherRating ? otherRating.rating : null);

    if (otherRating === undefined) {
      return true;
    } else if (otherRating === undefined && userRating === undefined) {
      return true;
    } else if (otherRating != undefined && userRating === undefined) {
      return false;
    } else if (userRating.rating === 3 && otherRating.rating === 4) {
      return false;
    } else if (userRating.rating === 4 && otherRating.rating === 5) {
      return false;
    } else if (userRating.rating === 5 && otherRating.rating === 3) {
      return false;
    } else {
      return true;
    }
  };

  console.log('Is seen new: ', isSeen());

  isSeen();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Message', item);
      }}
      onLongPress={() => {
        Alert.alert(
          'Delete',
          'Are you sure you want to delete this conversation?',
          [
            {
              text: 'Yes',
              onPress: () => {
                if (item.user_id === user.user_id) {
                  deleteMedia(item.file_id, token);
                  setUpdateMessage(updateMessage + 1);
                } else {
                  Alert.alert(
                    'Info',
                    "As you didn't start this conversation, you are not allowed to delete this converstaion!",
                    [{text: 'Ok'}]
                  );
                }
              },
            },
            {text: 'No'},
          ]
        );
      }}
      activeOpacity={0.6}
    >
      <View style={isSeen() ? styles.containerSeen : styles.containerUnseen}>
        <View style={styles.itemPicContainer}>
          <Image
            style={styles.itemPic}
            source={{
              uri: uploadsUrl + item.file.thumbnails?.w160,
            }}
          />
          <View style={styles.messageBox}>
            <Text style={styles.title}>
              {description.title + ' - ' + item.owner.username}
            </Text>
            <Text numberOfLines={1} style={styles.message}>
              {comment}
            </Text>
          </View>
        </View>
        <Text style={styles.time}>{timeformat}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerSeen: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F2F0F0',
    marginHorizontal: 20,
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    position: 'relative',
  },
  containerUnseen: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#A7EDAD',
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
  singleChatGroup: PropTypes.object,
  navigation: PropTypes.object,
};

export default ChatListItem;
