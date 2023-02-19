import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';

import PropTypes from 'prop-types';
import SearchListItem from './SearchListItem';

const SearchList = ({navigation}) => {
  const {mediaArray} = useMedia();
  return (
    <FlatList
      horizontal={false}
      numColumns={2}
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <SearchListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

SearchList.propTypes = {
  navigation: PropTypes.object,
};

export default SearchList;
