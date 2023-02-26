import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {useContext, useEffect, useState} from 'react';
import {useMedia} from '../../hooks/ApiHooks';
import ProductList from './ProductList';

const MainView = ({navigation}) => {
  const {filteredMedia} = useMedia();

  console.log('====================================');
  console.log('List', filteredMedia.length);
  console.log('====================================');
  return (
    <FlatList
      data={filteredMedia}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ProductList navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

MainView.propTypes = {
  navigation: PropTypes.object,
};

export default MainView;
