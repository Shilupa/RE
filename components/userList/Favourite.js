import {FlatList} from 'react-native';
import {useFavourite, useMedia} from '../../hooks/ApiHooks';
import PropTypes from 'prop-types';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../../contexts/MainContext';
import UserList from './UserList';

const Favourite = ({navigation}) => {
  const {getFavouritesByUser} = useFavourite();
  const [favouriteList, setFavouriteList] = useState([]);
  const {update, updateFavourite, token} = useContext(MainContext);
  const {mediaArray} = useMedia();

  // Fetching user favourite list
  const fetchFavourite = async () => {
    try {
      const favouritesResponse = await getFavouritesByUser(token);

      const media = mediaArray.filter((a) =>
        favouritesResponse.some((b) => b.file_id === a.file_id)
      );
      setFavouriteList(media);
    } catch (error) {
      console.error('fetchFavourite error', error.message);
    }
  };

  useEffect(() => {
    fetchFavourite();
  }, [update, updateFavourite, token, mediaArray]);

  return (
    <FlatList
      horizontal={false}
      numColumns={3}
      data={favouriteList}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <UserList navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

Favourite.propTypes = {
  navigation: PropTypes.object,
};

export default Favourite;
