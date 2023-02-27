import {FlatList} from 'react-native';
import {useMedia} from '../../hooks/ApiHooks';
import PropTypes from 'prop-types';
import UserList from './UserList';

const MyList = ({navigation}) => {
  const {mediaArray} = useMedia(true);
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
  categoryList: PropTypes.object,
};

export default MyList;
