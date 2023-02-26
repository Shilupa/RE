import {FlatList} from 'react-native';
import {useFavourite} from '../hooks/ApiHooks';
import FavouriteListItem from './FavouriteListItem';
import PropTypes from 'prop-types';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {loadMediaById} from '../hooks/ApiHooks';

const FavouriteList = ({navigation}) => {
  const {getFavouritesByUser} = useFavourite();
  const [favourites, setFavourites] = useState([]);
  const [favouriteList, setFavouriteList] = useState([]);
  const {update, updateFavourite, token} = useContext(MainContext);

  // Fetching user favourite list
  const fetchFavourite = async () => {
    try {
      const response = await getFavouritesByUser(token);
      setFavourites(response);
      console.log('Favourite: ', favourites);
    } catch (error) {
      throw new Error('fetchFavourite error, ' + error.message);
    }
  };

  // Mapping favourites
  const setList = async () => {
    try {
      const media = await Promise.all(
        favourites.map(async (favourite) => {
          const response = await loadMediaById(favourite.file_id);
          // console.log('set List from response:', response);
          return response;
        })
      );
      setFavouriteList(media);
      console.log('set List from favourite:', media);
    } catch (error) {
      throw new Error('setList error, ' + error.message);
    }
  };

  useEffect(() => {
    fetchFavourite();
  }, [update, updateFavourite]);

  useEffect(() => {
    setList();
  }, [update, favourites]);

  return (
    <FlatList
      horizontal={false}
      numColumns={3}
      data={favouriteList}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <FavouriteListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

FavouriteList.propTypes = {
  navigation: PropTypes.object,
};

export default FavouriteList;
