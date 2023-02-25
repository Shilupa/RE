import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {useMedia, useTag} from '../../hooks/ApiHooks';
import ProductList from './ProductList';
import {appId} from '../../utils/variables';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../../contexts/MainContext';

const ProductCategoryView = ({navigation, category}) => {
  const {getFilesByTag} = useTag();
  const {update} = useContext(MainContext);
  const [mediaArray, setMediaArray] = useState([]);

  const getMediaByCategory = async () => {
    try {
      const json = await useTag().getFilesByTag(`${appId}_${category}`);
      setMediaArray(mediaArray);
    } catch (error) {
      console.log('ProductCategoryView error message: ', error);
    }
  };
  /**
   * Sorting media files by time added
   * returns files in descending order by time
   */
  mediaArray.sort((a, b) => a.time_added < b.time_added);
  console.log('====================================');
  console.log('List', mediaArray.length);
  console.log('====================================');

  useEffect(() => {
    getMediaByCategory();
  }, [update]);

  return (
    <FlatList
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ProductList navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

roductCategoryView.propTypes = {
  navigation: PropTypes.object,
};

export default roductCategoryView;
