import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import SearchListItem from './SearchListItem';
import {categoryList} from '../utils/variables';
import {useRating} from '../hooks/ApiHooks';
import {useEffect, useState} from 'react';

const SearchList = ({navigation, search, category, selectedSortOption}) => {
  const {mediaArray} = useMedia();
  const {getRatingsByFileId} = useRating();
  const [mediaWithLike, setMediaWithLike] = useState();

  const combine = async () => {
    try {
      const mediaWithLikeCount = await Promise.all(
        mediaArray.map(async (media) => {
          const ratingResponse = await getRatingsByFileId(media.file_id);
          console.log('ratingResponse', ratingResponse);
          // console.log('findLikesCount', findLikesCount);

          const likes = ratingResponse.filter(
            (singleRating) => singleRating.rating === 1
          ).length;
          console.log('Likes', likes);

          media.likeNumber = await likes;
          return media;
        })
      );
      console.log('mediaWithLikeCount', mediaWithLikeCount);
      setMediaWithLike(mediaWithLikeCount);
    } catch (error) {
      console.error('combine', error.message);
    }
  };

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
  // console.log('sort', sortedMedia);

  useEffect(() => {
    combine();
  }, []);

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
