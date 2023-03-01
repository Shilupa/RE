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

const userRatings = (userId, fileId) => {
  const {updateRating, setUpdateRating, update, token} =
    useContext(MainContext);
  const {getAllRatings, postRating, deleteRating, getRatingsByFileId} =
    useRating();
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
        setBtnLikeDisable(findFile(allLikes, fileId, likeValue, userId));
        setBtnDisLikeDisable(findFile(allLikes, fileId, disLikeValue, userId));

        const countLike = getLikesByFileId.filter((obj) => obj.rating === 1);
        const countDislike = getLikesByFileId.filter((obj) => obj.rating === 2);
        //console.log('Likes', countLike.length, countDislike.length);
        //console.log('Likes', btnLikeDisable, btnDisLikeDisable);
        setLikeCount(countLike.length);
        setDisLikeCount(countDislike.length);
      } catch (error) {
        console.log('Get All Likes: ', error);
      }
    }
  };

  const postLike = async (file_id) => {
    try {
      return await postRating(file_id, likeValue);
    } catch (error) {
      console.log('Post Like: ', error);
    }
  };

  const postDisLike = async (file_id) => {
    try {
      return await postRating(file_id, disLikeValue);
    } catch (error) {
      console.log('Post Like: ', error);
    }
  };

  const addLike = async (file_id) => {
    try {
      const allLikes = await getAllRatings();
      const result = findFile(allLikes, file_id, disLikeValue, userId);
      if (btnLikeDisable !== undefined) {
        console.log('Do nothing');
        return;
      }
      if (result === undefined) {
        await postLike(file_id);
        setUpdateRating(!updateRating);
      } else {
        await deleteRating(file_id);
        await postLike(file_id);
        setUpdateRating(!updateRating);
      }
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log('Add Rating: ', error);
    }
  };

  const removeLike = async (file_id) => {
    try {
      const allLikes = await getAllRatings();
      const result = findFile(allLikes, file_id, likeValue, userId);
      if (btnDisLikeDisable !== undefined) {
        console.log('Do nothing');
        return;
      }
      if (result === undefined) {
        postDisLike(file_id);
        setUpdateRating(!updateRating);
      } else {
        await deleteRating(file_id);
        await postDisLike(file_id);
        setUpdateRating(!updateRating);
      }
    } catch (error) {
      // note: you cannot un-like same file multiple times
      console.log('Remove rating: ', error);
    }
  };

  const findFile = (allLikes, file_id, value, user_id) => {
    return allLikes.find(
      (like) =>
        like.file_id === file_id &&
        like.rating === value &&
        like.user_id === user_id
    );
  };

  const findCount = (allLikes, file_id, value) => {
    return allLikes.find(
      (like) => like.file_id === file_id && like.rating === value
    );
  };
  useEffect(() => {
    getAllLikes();
  }, [update, updateRating, token]);

  return {
    addLike,
    removeLike,
    findFile,
    btnLikeDisable,
    btnDisLikeDisable,
    likeCount,
    disLikeCount,
  };
};
export {userFavourites, userRatings};
