import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import MessageListItem from './MessageListItem';

const MessageList = ({
  navigation,
  singleItem,
  senderAvatar,
  receiverAvatar,
}) => {
  singleItem ? singleItem.reverse() : singleItem;
  /*   reversedMedia?
  let reversedMedia = singleItem;
  reversedMedia.reverse(); */
  return (
    <FlatList
      inverted
      data={singleItem}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <MessageListItem
          navigation={navigation}
          singleMedia={item}
          senderAvatar={senderAvatar}
          receiverAvatar={receiverAvatar}
        />
      )}
    />
  );
};

MessageList.propTypes = {
  navigation: PropTypes.object,
  singleItem: PropTypes.array,
  senderAvatar: PropTypes.string,
  receiverAvatar: PropTypes.string,
};

export default MessageList;
