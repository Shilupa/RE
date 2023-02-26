import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import MessageListItem from './MessageListItem';

const MessageList = ({navigation}) => {
  const {filteredMedia} = useMedia();
  return (
    <FlatList
      data={filteredMedia}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <MessageListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

MessageList.propTypes = {
  navigation: PropTypes.object,
};

export default MessageList;
