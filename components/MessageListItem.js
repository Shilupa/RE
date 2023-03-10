import {
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {vw} from '../utils/variables';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useComments} from '../hooks/ApiHooks';

// design of the message item that is displayed in the message list
const MessageListItem = ({
  navigation,
  singleMedia,
  senderAvatar,
  receiverAvatar,
}) => {
  const item = singleMedia;
  const {user, token, updateMessage, setUpdateMessage} =
    useContext(MainContext);
  const {deleteComment} = useComments();
  const sender = user.user_id === item.user_id ? false : true;
  const commentUploadTime = new Date(item.time_added);
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
      onLongPress={() => {
        Alert.alert('Delete', 'Are you sure you want to delete this message?', [
          {
            text: 'Yes',
            onPress: () => {
              if (item.user_id === user.user_id) {
                deleteComment(item.comment_id, token);
                setUpdateMessage(updateMessage + 1);
              } else {
                Alert.alert('Info', "You cannot delete other's message !", [
                  {text: 'Ok'},
                ]);
              }
            },
          },
          {text: 'No'},
        ]);
      }}
      activeOpacity={0.6}
    >
      <View style={sender ? styles.containerSender : styles.containerOwner}>
        <Image
          style={styles.avatar}
          source={{
            uri: sender ? senderAvatar : receiverAvatar,
          }}
        />

        <View style={sender ? styles.messageBoxSender : styles.messageBoxOwner}>
          <Text style={sender ? styles.messageSender : styles.messageOwner}>
            {item.comment}
          </Text>
          <Text style={sender ? styles.timeSender : styles.timeOwner}>
            {timeformat}
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
  senderAvatar: PropTypes.string,
  receiverAvatar: PropTypes.string,
};

export default MessageListItem;
