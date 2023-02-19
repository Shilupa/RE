import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  ScrollView,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {primaryColour} from '../utils/variables';
import {Icon} from '@rneui/themed';

const Login = ({navigation}) => {
  const {toggleForm, setToggleForm} = useContext(MainContext);

  return (
    <TouchableOpacity
      onPress={() => Keyboard.dismiss()}
      style={{flex: 1}}
      activeOpacity={1}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.titleBar}>
          <Icon
            size={30}
            style={styles.title}
            onPress={() => {
              navigation.navigate('Home');
            }}
            name="home"
            color="black"
          />
        </View>
        <ScrollView>
          {toggleForm ? (
            <LoginForm navigation={navigation} />
          ) : (
            <RegisterForm />
          )}
          <View style={styles.signInView}>
            <Text style={styles.accountText}>
              {toggleForm
                ? "You don't have an account yet?"
                : 'You already have an account. '}
            </Text>
            <Text
              style={styles.signInText}
              onPress={() => {
                setToggleForm(!toggleForm);
              }}
            >
              {toggleForm ? '  Sign Up' : '  Sign In'}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  signInView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInText: {
    color: primaryColour,
    fontWeight: '400',
  },
  titleBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: '15%',
    marginHorizontal: '5%',
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
