import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl, vw} from '../utils/variables';
/* import {useFavourite} from '../hooks/ApiHooks';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext'; */

const SecondaryListItem = ({singleMedia, navigation}) => {
  /*   const {getFavouritesByUser} = useFavourite();
  const {token} = useContext(MainContext);
  const [favourites, setFavourites] = useState(); */
  const item = singleMedia;

  /*   const fetchFavourite = async () => {
    const favourites = await getFavouritesByUser(token);
    setFavourites(favourites);
  };

  useEffect(() => {
    fetchFavourite();
  }, []);
 */
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Single', item);
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
  container: {
    backgroundColor: '#FAFBFB',
    margin: 4.5,
    borderRadius: 6,
    minWidth: 31 * vw,
  },
  image: {
    flex: 1,
    aspectRatio: 1.2,
    width: 31 * vw,
    borderRadius: 5,
    resizeMode: 'cover',
  },
});

SecondaryListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default SecondaryListItem;
