import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {uploadsUrl} from '../utils/variables';
import {useFavourite, useRating, useTag} from './ApiHooks';
import {Image} from 'react-native';

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
    console.log('Add favourite:', fileId);
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

const userRatings = (userId, fileId) => {
  const {updateRating, setUpdateRating, update, token} =
    useContext(MainContext);
  const {getAllRatings, postRating, deleteRating, getRatingsByFileId} =
    useRating();
  // Rating 1 for user like and Rating 2 for user dislike
  const likeValue = 1;
  const disLikeValue = 2;
  const [btnLikeDisable, setBtnLikeDisable] = useState();
  const [btnDisLikeDisable, setBtnDisLikeDisable] = useState();
  const [likeCount, setLikeCount] = useState(0);
  const [disLikeCount, setDisLikeCount] = useState(0);

  const getAllLikes = async () => {
    if (token !== null) {
      try {
        const allLikes = await getAllRatings();
        const getLikesByFileId = await getRatingsByFileId(fileId);
        /**
         * Checking if media is  already liked or disliked by user
         * If media is already liked/disliked findFile returns media object
         * If media is not already liked/disliked findFile returns undefined
         * Depending on findfile return like and disblike buttons are disabled
         */
        setBtnLikeDisable(findFile(allLikes, fileId, likeValue, userId));
        setBtnDisLikeDisable(findFile(allLikes, fileId, disLikeValue, userId));

        // Fetching total count of likes for a file as an array
        const countLike = getLikesByFileId.filter(
          (like) => like.rating === likeValue
        );
        // Fetching total count of dislikes for a file as an array
        const countDislike = getLikesByFileId.filter(
          (like) => like.rating === disLikeValue
        );
        // Sets total like counts for a media
        setLikeCount(countLike.length);
        // Sets total dislike counts for a media
        setDisLikeCount(countDislike.length);
      } catch (error) {
        console.log('Get All Likes: ', error);
      }
    }
  };

  // Posts user like having rating value 1
  const postLike = async (file_id) => {
    try {
      return await postRating(file_id, likeValue);
    } catch (error) {
      console.log('Post Like: ', error);
    }
  };

  // Post user likes having rating value 2
  const postDisLike = async (file_id) => {
    try {
      return await postRating(file_id, disLikeValue);
    } catch (error) {
      console.log('Post Like: ', error);
    }
  };

  /**
   * Removes file having rating 2 if exists
   * Adds file with rating  value 1
   */
  const addLike = async (file_id) => {
    try {
      const allLikes = await getAllRatings();
      /**
       * Checking if media is alredy disliked
       * If it is disliked then findFile returns media object else returns undefined
       */
      const result = findFile(allLikes, file_id, disLikeValue, userId);
      if (btnLikeDisable !== undefined) {
        console.log('Do nothing');
        return;
      }
      if (result === undefined) {
        // Adds media having rating 1
        await postLike(file_id);
        setUpdateRating(!updateRating);
      } else {
        // Deletes media having rating 2
        await deleteRating(file_id);
        // Adds media having rating 1
        await postLike(file_id);
        setUpdateRating(!updateRating);
      }
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log('Add Rating: ', error);
    }
  };

  /**
   * Removes file having rating 1 if exists
   * Adds file with rating  value 2
   */
  const addDisLike = async (file_id) => {
    try {
      const allLikes = await getAllRatings();
      /**
       * Checking if media is alredy disliked
       * If it is liked then findFile returns media object else returns undefined
       */
      const result = findFile(allLikes, file_id, likeValue, userId);
      if (btnDisLikeDisable !== undefined) {
        console.log('Do nothing');
        return;
      }
      if (result === undefined) {
        postDisLike(file_id);
        setUpdateRating(!updateRating);
      } else {
        // Deleting media having rating 1
        await deleteRating(file_id);
        // Adding media having rating 2
        await postDisLike(file_id);
        setUpdateRating(!updateRating);
      }
    } catch (error) {
      // note: you cannot un-like same file multiple times
      console.log('Remove rating: ', error);
    }
  };

  /**
   * Finds file in total array of ratins having given values
   * retuns file object if found else retuns undefined
   **/
  const findFile = (allLikes, file_id, value, user_id) => {
    return allLikes.find(
      (like) =>
        like.file_id === file_id &&
        like.rating === value &&
        like.user_id === user_id
    );
  };

  useEffect(() => {
    getAllLikes();
  }, [update, updateRating, token]);

  return {
    addLike,
    addDisLike,
    findFile,
    btnLikeDisable,
    btnDisLikeDisable,
    likeCount,
    disLikeCount,
  };
};

export {userFavourites, userRatings};
