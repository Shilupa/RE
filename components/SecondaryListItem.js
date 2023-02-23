import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {useFavourite} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';

const SecondaryListItem = ({singleMedia, navigation}) => {
  const {getFavouritesByUser} = useFavourite();
  const {token} = useContext(MainContext);
  const [favourites, setFavourites] = useState();
  const item = singleMedia;

  const fetchFavourite = async () => {
    const favourites = await getFavouritesByUser(token);
    setFavourites(favourites);
  };
  console.log(favourites);

  useEffect(() => {
    fetchFavourite();
  }, []);

  return (
    <View style={styles.column}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Single', item);
          console.log('secListItem:', item);
        }}
      >
        <Image
          style={styles.image}
          source={{uri: uploadsUrl + item.thumbnails?.w160}}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    backgroundColor: '#FAFBFB',
    margin: 4.5,
    borderRadius: 6,
    minWidth: '31%',
  },
  image: {
    flex: 1,
    aspectRatio: 1.2,
    minHeight: 50,
    borderRadius: 5,
    resizeMode: 'cover',
  },
});

SecondaryListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default SecondaryListItem;
