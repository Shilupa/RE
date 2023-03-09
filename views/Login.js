import {
  Platform,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  ScrollView,
  View,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {primaryColour, vh} from '../utils/variables';
import {Card, Icon} from '@rneui/themed';
import {StatusBar} from 'react-native';
import LeafSvg from '../components/LeafSvg';

const Login = ({navigation}) => {
  const {toggleForm, setToggleForm} = useContext(MainContext);
  return (
    <SafeAreaView
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
            style={styles.icon}
            onPress={() => {
              navigation.navigate('Home');
            }}
            name="home"
            color={primaryColour}
          />
        </View>
        <View style={styles.logoContainer}>
          <LeafSvg />
          {toggleForm ? (
            <Card.Title style={styles.welcomeText}>Welcome Back</Card.Title>
          ) : (
            <Card.Title style={styles.welcomeText}>
              Create Your Account
            </Card.Title>
          )}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  signInView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountText: {
    fontWeight: '400',
    marginBottom: 10 * vh,
  },
  signInText: {
    color: primaryColour,
    fontWeight: '400',
    marginBottom: 10 * vh,
  },
  titleBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    marginTop: 5 * vh,
    marginHorizontal: '5%',
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
  logoContainer: {
    alignItems: 'center',
  },

  // Welcome Back text
  welcomeText: {
    color: primaryColour,
    fontSize: 28,
    fontWeight: 'bold',
  },
});

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
