import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import SearchListItem from './SearchListItem';
import {categoryList} from '../utils/variables';
import { userRatings } from '../hooks/UserFunctionality';
import { useContext } from 'react';
import { MainContext } from '../contexts/MainContext';

const SearchList = ({navigation, search, category, selectedSortOption}) => {

  const {user, token} = useContext(MainContext);
  const {mediaArray} = useMedia();
  const {likeCount} = userRatings()
  // sort mediaArray based on selectedSortOption, default
  const sortedMedia = mediaArray
    .map((media) => ({
      ...media,
      parsedDescription: JSON.parse(media.description),
    }))
    .slice()
    .sort((a, b) => {
      const titleA = a.parsedDescription.title.toLowerCase();
      const titleB = b.parsedDescription.title.toLowerCase();

      if (selectedSortOption === 'Oldest') {
        return new Date(a.time_added) - new Date(b.time_added);
      } else if (selectedSortOption === 'Newest') {
        return new Date(b.time_added) - new Date(a.time_added);
      } else if (selectedSortOption === 'titleAsc') {
        return titleA.localeCompare(titleB);
      } else if (selectedSortOption === 'titleDesc') {
        return titleB.localeCompare(titleA);
      } else {
        // no sort option selected
        return 0;
      }
    });

  const filteredMedia = sortedMedia.filter((media) => media.title === category);
   console.log('sort', sortedMedia);
  return (
    <FlatList
      horizontal={false}
      numColumns={2}
      data={category === '' ? sortedMedia : filteredMedia}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => {
        if (search === '') {
          return <SearchListItem navigation={navigation} singleMedia={item} />;
        }
        if (
          JSON.parse(item.description)
            .title.toLowerCase()
            .includes(search.toLowerCase()) ||
          JSON.parse(item.description)
            .detail.toLowerCase()
            .includes(search.toLowerCase())
        ) {
          return <SearchListItem navigation={navigation} singleMedia={item} />;
        }
      }}
    />
  );
};

SearchList.propTypes = {
  navigation: PropTypes.object,
  search: PropTypes.string,
  category: PropTypes.string,
  selectedSortOption: PropTypes.string,
};

export default SearchList;
