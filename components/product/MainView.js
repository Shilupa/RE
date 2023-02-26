import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {useMedia} from '../../hooks/ApiHooks';
import ProductList from './ProductList';

const MainView = ({navigation, categoryList}) => {
  const {filteredMedia} = useMedia(false, categoryList);

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
  categoryList: PropTypes.object,
};

export default MainView;
