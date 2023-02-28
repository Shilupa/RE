import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import SearchListItem from './SearchListItem';
import {categoryList} from '../utils/variables';

const SearchList = ({navigation, search, category}) => {
  const {mediaArray} = useMedia();
  const filteredMedia = mediaArray.filter((media) => media.title === category);
  return (
    <FlatList
      horizontal={false}
      numColumns={2}
      data={category === '' ? mediaArray : filteredMedia}
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
  category: PropTypes.string,
};

export default SearchList;
