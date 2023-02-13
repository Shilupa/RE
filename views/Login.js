import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import Input from '../components/input';
import LoginForm from '../components/LoginForm';
import {Button, Card} from '@rneui/base';
import RegisterForm from '../components/RegisterForm';
import {useContext, useState} from 'react';
import {MainContext} from '../contexts/MainContext';

const Login = () => {
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
        <ScrollView>
        {toggleForm ? <LoginForm /> : <RegisterForm />}
        <Card>
          <Text>
            {toggleForm
              ? 'No account yet? Please register.'
              : 'Already have an account? Please login.'}
          </Text>
          <Button
            type="outline"
            title={toggleForm ? 'Go to register' : 'Go to login'}
            onPress={() => {
              setToggleForm(!toggleForm);
            }}
          />
        </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
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
