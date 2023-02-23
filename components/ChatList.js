import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import ChatListItem from './ChatListItem';

const ChatList = ({navigation}) => {
  const {mediaArray} = useMedia();
  return (
    <FlatList
      data={mediaArray}
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
