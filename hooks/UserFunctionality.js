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

  const getFavouriteList = async () => {
    try {
      const response = await getFavouritesByFileId(fileId);
      setFavourites(response);
    } catch (error) {
      console.log('Product details [getFavourites]', error);
    }
  };

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
