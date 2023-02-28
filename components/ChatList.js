import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import ChatListItem from './ChatListItem';

const ChatList = ({navigation, allComments}) => {
  // console.log('All Comments in ChatList: ', item);
  // console.log('MediaArray: ', mediaArray);

  return (
    <FlatList
      data={allComments}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ChatListItem navigation={navigation} singleComment={item} />
      )}
    />
  );
};

ChatList.propTypes = {
  navigation: PropTypes.object,
  allComments: PropTypes.array,
};

export default ChatList;
