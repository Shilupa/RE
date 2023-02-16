import {FlatList} from 'react-native';
import {useMedia} from '../hooks/ApiHooks';
import SecondaryListItem from './SecondaryListItem';
import PropTypes from 'prop-types';

const SecondaryList = ({navigation}) => {
  const {mediaArray} = useMedia();
  return (
    <FlatList
      horizontal={false}
      numColumns={2}
      data={mediaArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <SecondaryListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};

SecondaryList.propTypes = {
  navigation: PropTypes.object,
};

export default SecondaryList;