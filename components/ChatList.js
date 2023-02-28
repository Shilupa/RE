import {FlatList} from 'react-native';
import {useComments, useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import ChatListItem from './ChatListItem';
import {categoryList} from '../utils/variables';

const ChatList = ({navigation, allComments}) => {
  const {mediaArray} = useMedia();

  // console.log('All Comments in ChatList: ', item);
  // console.log('MediaArray: ', mediaArray);

  return (
    <FlatList
      data={allComments}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ChatListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

ChatList.propTypes = {
  navigation: PropTypes.object,
  allComments: PropTypes.array,
};

export default ChatList;
