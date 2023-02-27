import {FlatList} from 'react-native';
import {useComments, useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import ChatListItem from './ChatListItem';
import {categoryList} from '../utils/variables';

const ChatList = ({navigation}) => {
  const {filteredMedia} = useMedia(false, categoryList);

  // console.log('All files: ', filteredMedia);

  return (
    <FlatList
      data={filteredMedia}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ChatListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

ChatList.propTypes = {
  navigation: PropTypes.object,
};

export default ChatList;
