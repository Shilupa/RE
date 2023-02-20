import {SafeAreaView, StyleSheet, View} from 'react-native';
import React, {useContext, useState} from 'react';
import {primaryColour} from '../utils/variables';
import LeafSvg from './LeafSvg';
import {Card, Icon} from '@rneui/themed';
import PropTypes from 'prop-types';
import {Controller, useForm} from 'react-hook-form';
import FormInput from './formComponent/FormInput';
import {MainContext} from '../contexts/MainContext';
import {useAuthentication} from '../hooks/ApiHooks';
import FormButton from './formComponent/FormButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Main LoinForm function
const LoginForm = ({navigation}) => {
  const {setIsLoggedIn} = useContext(MainContext);
  const {postLogin} = useAuthentication();

  // password visibility Icon press
  const [shown, setShown] = useState(true);
  const togglePassword = () => {
    setShown(!shown);
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: 'bibekShrestha',
      password: 'examplepass',
    },
    mode: 'onBlur',
  });

  const logIn = async (loginData) => {
    console.log('Login button pressed', loginData);

    try {
      const loginResult = await postLogin(loginData);
      console.log('logIn', loginResult);
      // Saving token and user data to async storage
      await AsyncStorage.setItem('userToken', loginResult.token);
      await AsyncStorage.setItem('user', JSON.stringify(loginResult.user));
      setIsLoggedIn(true);
      navigation.navigate('Home');
    } catch (error) {
      console.error('logIn', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputView}>
        <Controller
          control={control}
          rules={{
            required: {value: true, message: 'username is required.'},
            minLength: {
              value: 3,
              message: 'min length is 3 char.',
            },
            // validate: checkUser,
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              onBlur={onBlur}
              onChange={onChange}
              multiline={false}
              label={'Username'}
              value={value}
              secureTextEntry={false}
              autoCapitalize="none"
              error={errors.username && errors.username.message}
            />
          )}
          name="username"
        />
        <Controller
          control={control}
          rules={{
            required: {
              value: true,
              message: 'password is required.',
            },
          }}
          render={({field: {onChange, onBlur, value}}) => (
            <FormInput
              label={'Password'}
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              autoCapitalize="none"
              multiline={false}
              rightIcon={
                <Icon
                  onPress={togglePassword}
                  name={shown ? 'visibility' : 'visibility-off'}
                  size={20}
                />
              }
              secureTextEntry={shown}
              error={errors.password && errors.password.message}
            />
          )}
          name="password"
        />
      </View>
      <View style={styles.buttonView}>
        <FormButton
          text="Sign In"
          submit={logIn}
          handleSubmit={handleSubmit}
        ></FormButton>
      </View>
    </SafeAreaView>
  );
};

LoginForm.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  // view for input box area
  inputView: {
    marginTop: '5%',
    width: '85%',
  },

  // View for Sign in button
  buttonView: {
    marginTop: '5%',
    width: '100%',
    marginBottom: 5,
  },
});

export default LoginForm;
