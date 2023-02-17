import {Platform, StyleSheet, SafeAreaView, View, Alert} from 'react-native';
import PropTypes from 'prop-types';
import {Icon, Text} from '@rneui/themed';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {primaryColour} from '../utils/variables';

const Search = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);

  const logOut = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Yes',
        onPress: () => {
          setIsLoggedIn(false);
        },
      },
      {text: 'No'},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Discover</Text>
        <Icon
          style={styles.logOut}
          onPress={logOut}
          name="power-settings-new"
          color="red"
        />
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
