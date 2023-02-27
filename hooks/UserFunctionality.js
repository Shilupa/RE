import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useFavourite} from './ApiHooks';

const userFavourites = (fileId) => {
  const {
    updateFavourite,
    setUpdateFavourite,
    token,
  } = useContext(MainContext);
  const [favourites, setFavourites] = useState([]);
  const {getFavouritesByFileId, postFavourite, deleteFavourite} =
    useFavourite();

    /**
     * Gets user favourite by file id as an array of length 1
     * If file is not favourite of user then length of arrat is 0
     */
  const getFavouriteList = async () => {
    try {
      const response = await getFavouritesByFileId(fileId);
      setFavourites(response);
    } catch (error) {
      console.log('Product details [getFavourites]', error);
    }
  };

  /**
   * Adds file as favourite for user
   */
  const addFavourite = async (fileId) => {
    console.log('add', fileId);
    try {
      const res = await postFavourite(fileId, token);
      setUpdateFavourite(!updateFavourite);
      setUpdate(!update);
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log('addFavourite: ', error);
    }
  };

  /**
   * Deletes file from favourite of user
   */
  const removeFavourite = async (fileId) => {
    try {
      const res = await deleteFavourite(fileId, token);
      setUpdateFavourite(!updateFavourite);
      setUpdate(!update);
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log('removeFavourite: ', error);
    }
  };

  useEffect(() => {
    getFavouriteList();
  }, [updateFavourite]);

  return {favourites, addFavourite, removeFavourite};
};

export {userFavourites};
