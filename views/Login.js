import {Platform, StyleSheet, SafeAreaView} from 'react-native';
import PropTypes from 'prop-types';

const Login = ({navigation}) => {
  return <SafeAreaView style={styles.container}></SafeAreaView>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
