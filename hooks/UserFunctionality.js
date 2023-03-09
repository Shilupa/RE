import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useFavourite, useRating} from './ApiHooks';
import * as ScreenOrientation from 'expo-screen-orientation';

/**
 * User can add or remove favourite
 * @param {*} fileId: clicked file Id
 * @return {*} functions and states
 */
const userFavourites = (fileId) => {
  const {updateFavourite, setUpdateFavourite, token, update, setUpdate, user} =
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
      setFavourites(response.filter((item) => item.user_id === user.user_id));
    } catch (error) {
      console.error('Product details [getFavourites]', error.message);
    }
  };

  /**
   * Adds file as favourite for user
   * @param {*} fileId: id of media file
   */
  const addFavourite = async (fileId) => {
    try {
      await postFavourite(fileId, token);
      setUpdateFavourite(!updateFavourite);
      setUpdate(!update);
    } catch (error) {
      // note: you cannot like same file multiple times
      console.error('addFavourite: ', error.message);
    }
  };

  /**
   * Deletes file from favourite of user
   * @param {*} fileId: id of media file
   */
  const removeFavourite = async (fileId) => {
    try {
      await deleteFavourite(fileId, token);
      setUpdateFavourite(!updateFavourite);
      setUpdate(!update);
    } catch (error) {
      // note: you cannot like same file multiple times
      console.error('removeFavourite: ', error.message);
    }
  };

  useEffect(() => {
    getFavouriteList();
  }, [updateFavourite]);

  return {favourites, addFavourite, removeFavourite};
};

/**
 * User can like, dislike media / can remove existing own like or dislike in media file
 * @param {*} userId: current user Id
 * @param {*} fileId: cliked file Id
 * @return {*}functions and states
 */
const userRatings = (userId, fileId) => {
  const {updateRating, setUpdateRating, update, token} =
    useContext(MainContext);
  const {getAllRatings, postRating, deleteRating, getRatingsByFileId} =
    useRating();
  // Rating 1 for user like and Rating 2 for user dislike
  const likeValue = 1;
  const disLikeValue = 2;
  const [btnLikeColor, setBtnLikeColor] = useState();
  const [btnDislikeColor, setBtnDislikeColor] = useState();
  const [likeCount, setLikeCount] = useState(0);
  const [disLikeCount, setDisLikeCount] = useState(0);

  /**
   * Fetches list of media having with ratings(likes/dislikes)
   * Counts total likes and dislikes of a file
   * Sets the color of like-thumb and dislike-thumb
   */
  const getAllLikes = async () => {
    if (token !== null) {
      try {
        const allLikes = await getAllRatings();
        const getLikesByFileId = await getRatingsByFileId(fileId);
        /**
         * Checking if media is  already liked or disliked by user
         * If media is already liked/disliked findFile returns media object
         * If media is not already liked/disliked findFile returns undefined
         * Depending on findfile return likeColor and dislikeColor are set
         */
        setBtnLikeColor(findFile(allLikes, fileId, likeValue, userId));
        setBtnDislikeColor(findFile(allLikes, fileId, disLikeValue, userId));

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
        console.error('Get All Likes: ', error.message);
      }
    }
  };

  // Posts user like having rating value 1
  const postLike = async (file_id) => {
    try {
      return await postRating(file_id, likeValue);
    } catch (error) {
      console.error('Post Like: ', error.message);
    }
  };

  // Post user likes having rating value 2
  const postDisLike = async (file_id) => {
    try {
      return await postRating(file_id, disLikeValue);
    } catch (error) {
      console.error('Post Like: ', error.message);
    }
  };

  /**
   * Removes own like if exists
   * Removes file having rating 2 if exists
   * Adds file with rating  value 1
   * @param {*} file_id: id of media which is clicked
   * @return {*} Nothing
   */
  const addLike = async (file_id) => {
    try {
      const allLikes = await getAllRatings();
      /**
       * Checking if media is alredy disliked
       * If it is disliked then findFile returns media object else returns undefined
       */
      const result = findFile(allLikes, file_id, disLikeValue, userId);
      // Deletes like rating if it already exists
      if (btnLikeColor !== undefined) {
        await deleteRating(file_id);
        setUpdateRating(!updateRating);
        return;
      }
      // Post initial media having rating 1
      if (result === undefined) {
        await postLike(file_id);
        setUpdateRating(!updateRating);
        return;
      }
      // Deletes media having rating 2
      await deleteRating(file_id);
      // Adds media having rating 1
      await postLike(file_id);
      setUpdateRating(!updateRating);
    } catch (error) {
      // note: you cannot like same file multiple times
      console.error('Add Rating: ', error.message);
    }
  };

  /**
   * Removes own dislike if exists
   * Removes file having rating 1 if exists
   * Adds file with rating  value 2
   * @param {*} file_id : id of media clicked
   * @return {*} Nothing
   */
  const addDisLike = async (file_id) => {
    try {
      const allLikes = await getAllRatings();
      /**
       * Checking if media is alredy disliked
       * If it is liked then findFile returns media object else returns undefined
       */
      const result = findFile(allLikes, file_id, likeValue, userId);
      // Deletes dislike rating if it already exists
      if (btnDislikeColor !== undefined) {
        await deleteRating(file_id);
        setUpdateRating(!updateRating);
        return;
      }
      // Post initial media having rating 2
      if (result === undefined) {
        postDisLike(file_id);
        setUpdateRating(!updateRating);
        return;
      }
      // Deleting media having rating 1
      await deleteRating(file_id);
      // Adding media having rating 2
      await postDisLike(file_id);
      setUpdateRating(!updateRating);
    } catch (error) {
      // note: you cannot un-like same file multiple times
      console.error('Remove rating: ', error.messag);
    }
  };

  /**
   *
   * Finds file in total array of ratins having given values
   * @param {*} allLikes: array of media files with ratings
   * @param {*} file_id: id of media file whose ratings ot be checked
   * @param {*} value: either rating 1 or rating 2
   * @param {*} user_id: current user
   * @return {*}file object if found else returns undefined
   */
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
    btnLikeColor,
    btnDislikeColor,
    likeCount,
    disLikeCount,
  };
};

const videoOrientation = ({video}) => {
  const unlock = async () => {
    try {
      await ScreenOrientation.unlockAsync();
    } catch (error) {
      console.error('unlock', error.message);
    }
  };

  const lock = async () => {
    try {
      await ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
    } catch (error) {
      console.error('lock', error.message);
    }
  };

  const showVideoInFullScreen = async () => {
    try {
      await video.current.presentFullscreenPlayer();
    } catch (error) {
      console.error('showVideoInFullScreen', error.message);
    }
  };

  useEffect(() => {
    unlock();

    const orientSub = ScreenOrientation.addOrientationChangeListener((evt) => {
      if (evt.orientationInfo.orientation > 2) {
        // show video in fullscreen
        if (video.current) showVideoInFullScreen();
      }
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListener(orientSub);
      lock();
    };
  }, []);
};

export {userFavourites, userRatings, videoOrientation};
