import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useFavourite, useRating} from './ApiHooks';

const userFavourites = (fileId) => {
  const {updateFavourite, setUpdateFavourite, token, update, setUpdate} =
    useContext(MainContext);
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
    try {
      await postFavourite(fileId, token);
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
      await deleteFavourite(fileId, token);
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

const userRatings = (fileId, userId) => {
  const {updateRating, setUpdateRating, token} = useContext(MainContext);
  const {getRatingsByFileId, postRating} = useRating();
  const [ratings, setRatings] = useState([]);
  let userLiked = false;
  const getAllRatings = async () => {
    try {
      const response = await getRatingsByFileId(fileId);
      setRatings(response);
    } catch (error) {
      console.log('Get All Ratings: ', error);
    }
    ratings.map((rating) => {
      if (rating.user_id === userId && rating.rating === 1) {
        userLiked = true;
        return;
      }
    });
  };

  const addRating = async () => {
    try {
      await postRating(singleMedia.file_id, token, 1);
      //setUserLikesIt(true);
      //getRatings();
      setUpdateRating(!updateRating);
    } catch (error) {
      // note: you cannot like same file multiple times
      onsole.log('Add Rating: ]', error);
    }
  };
  return {getAllRatings, userLiked};
};
export {userFavourites, userRatings};
