import {FlatList} from 'react-native';
import {useMedia} from '../../hooks/ApiHooks';
import PropTypes from 'prop-types';
import UserList from './UserList';
import {categoryList} from '../../utils/variables';

const MyList = ({navigation}) => {
  const {filteredMedia} = useMedia(true, categoryList);
  return (
    <FlatList
      horizontal={false}
      numColumns={3}
      data={filteredMedia}
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
