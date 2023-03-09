import {FlatList} from 'react-native';
import {useMedia} from '../../hooks/ApiHooks';
import PropTypes from 'prop-types';
import UserList from './UserList';

// My list is used to display the media uploaded by the user in theri profile page
const MyList = ({navigation, userId}) => {
  const {mediaArray} = useMedia(true, userId);
  return (
    <FlatList
      horizontal={false}
      numColumns={3}
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <UserList navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

MyList.propTypes = {
  navigation: PropTypes.object,
  userId: PropTypes.any,
};

export default MyList;
