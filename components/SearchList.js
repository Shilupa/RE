import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import SearchListItem from './SearchListItem';

const SearchList = ({navigation, search}) => {
  const {mediaArray} = useMedia();
  return (
    <FlatList
      horizontal={false}
      numColumns={2}
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => {
        if (search === '') {
          return <SearchListItem navigation={navigation} singleMedia={item} />;
        }
        if (
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase())
        ) {
          return <SearchListItem navigation={navigation} singleMedia={item} />;
        }
      }}
    />
  );
};

SearchList.propTypes = {
  navigation: PropTypes.object,
  search: PropTypes.any,
};

export default SearchList;
