import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {useMedia} from '../../hooks/ApiHooks';
import ProductList from './ProductList';

// Main View populates the Home component of the app
const MainView = ({navigation, category}) => {
  const {mediaArray} = useMedia();
  // Filtering media by category
  const filteredMedia = mediaArray.filter((media) => media.title === category);
  return (
    <FlatList
      data={category === '' ? mediaArray : filteredMedia}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ProductList navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

MainView.propTypes = {
  navigation: PropTypes.object,
  category: PropTypes.string,
};

export default MainView;
