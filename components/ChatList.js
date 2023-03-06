import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import ChatListItem from './ChatListItem';

const ChatList = ({navigation, chatGroupList}) => {
  return (
    <FlatList
      data={chatGroupList}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ChatListItem navigation={navigation} singleChatGroup={item} />
      )}
    />
  );
};

ChatList.propTypes = {
  navigation: PropTypes.object,
  chatGroupList: PropTypes.array,
};

export default ChatList;
