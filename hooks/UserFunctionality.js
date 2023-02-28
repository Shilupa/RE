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

const userRatings = (userId) => {
  const {updateRating, setUpdateRating} = useContext(MainContext);
  const {getAllRatings, postRating, deleteRating} = useRating();
  const likeValue = 1;
  const disLikeValue = 2;
  const [btnLikeDisable, setBtnLikeDisable] = useState(false);
  const [btnDisLikeDisable, setBtnDisLikeDisable] = useState(false);

  const getAllLikes = async () => {
    try {
      return await getAllRatings();
    } catch (error) {
      console.log('Get All Ratings: ', error);
    }
    //console.log('rating', ratings);
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

  // {"file_id": 6296, "rating": 1, "rating_id": 1245, "user_id": 2970}
  const addLike = async (file_id) => {
    try {
      const allLikes = await getAllRatings();
      const result = findFile(allLikes, file_id, disLikeValue);
      if (btnLikeDisable) {
        console.log('Do nothing');
        return;
      }
      if (result === undefined) {
        await postLike(file_id);
        setBtnLikeDisable(true);
        setBtnDisLikeDisable(false);
        setUpdateRating(!updateRating);
        console.log('add', await getAllRatings());
      } else {
        await deleteRating(file_id);
        await postLike(file_id);
        setBtnLikeDisable(true);
        setBtnDisLikeDisable(false);
        setUpdateRating(!updateRating);
        console.log('add', await getAllRatings());
      }
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log('Add Rating: ', error);
    }
  };

  const removeLike = async (file_id) => {
    try {
      const allLikes = await getAllRatings();
      const result = findFile(allLikes, file_id, likeValue);
      if (btnDisLikeDisable) {
        console.log('Do nothing');
        return;
      }
      if (result === undefined) {
        postDisLike(file_id);
        console.log('remove', await getAllRatings());
        setBtnDisLikeDisable(true);
        setBtnLikeDisable(false);
        setUpdateRating(!updateRating);
      } else {
        await deleteRating(file_id);
        await postDisLike(file_id);
        setBtnDisLikeDisable(true);
        setBtnLikeDisable(false);
        setUpdateRating(!updateRating);
        console.log('remove', await getAllRatings());
      }
    } catch (error) {
      // note: you cannot like same file multiple times
      console.log('Remove rating: ', error);
    }
  };

  const findFile = (allLikes, file_id, value) => {
    return allLikes.find(
      (like) =>
        like.user_id === userId &&
        like.file_id === file_id &&
        like.rating === value
    );
  };

  useEffect(() => {
    getAllLikes();
  }, [updateRating]);

  return {
    addLike,
    removeLike,
    findFile,
  };
};
export {userFavourites, userRatings};
