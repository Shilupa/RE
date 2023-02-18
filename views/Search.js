import {Platform, StyleSheet, SafeAreaView, View} from 'react-native';
import PropTypes from 'prop-types';
import {Icon, Text} from '@rneui/themed';

import {primaryColour} from '../utils/variables';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';

const Search = ({navigation}) => {
  const {isLoggedIn} = useContext(MainContext);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Discover</Text>
        {!isLoggedIn && (
          <Icon
            size={30}
            style={styles.logOut}
            onPress={() => navigation.navigate('Login')}
            name="login"
            color="Green"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },

  titleBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginVertical: 25,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
  logOut: {
    marginVertical: 25,
    marginHorizontal: 25,
    color: primaryColour,
  },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
