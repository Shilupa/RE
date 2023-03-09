import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import PropTypes from 'prop-types';
import SearchListItem from './SearchListItem';
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

          const dislike = ratingResponse.filter(
            (singleRating) => singleRating.rating === 2
          ).length;
          // console.log('Likes', likes);
          const likeDifference = (await likes) - dislike;

          console.log('likesDfference', media.file_id, likeDifference);
          media.likeDifference = (await likes) - dislike;
          return media;
        })
      );
      console.log('mediaWithLikeCount', mediaWithLikeCount);
      setMediaWithLike(mediaWithLikeCount);
    } catch (error) {
      console.error('combine', error.message);
    }
  };

  useEffect(() => {
    combine();
  }, []);

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
      } else if (selectedSortOption === 'Most-popular') {
        // no sort option selected
        return a.likeDifference - b.likeDifference;
      } else if (selectedSortOption === 'Least-popular') {
        // no sort option selected
        return b.likeDifference - a.likeDifference;
      } else {
        return 0;
      }
    });

  const filteredMedia = sortedMedia.filter((media) => media.title === category);
  // console.log('sort', sortedMedia);
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
