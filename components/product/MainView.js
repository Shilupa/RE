import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {useMedia} from '../../hooks/ApiHooks';
import ProductList from './ProductList';
import {categoryList} from '../../utils/variables';

const MainView = ({navigation}) => {
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
};

export default MainView;
