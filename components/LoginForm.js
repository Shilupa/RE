import {StyleSheet, View} from 'react-native';
import React from 'react';
import {primaryColour} from '../utils/variables';
import LeafSvg from './LeafSvg';
import {Card} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import FormInput from './formComponent/FormInput';
import FormButton from './formComponent/FormButton';

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    mode: 'onBlur',
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LeafSvg />
        <Card.Title style={styles.welcomeText}>Welcome Back</Card.Title>
      </View>
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
              label={'Username'}
              value={value}
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
              secureTextEntry={true}
              error={errors.password && errors.password.message}
            />
          )}
          name="password"
        />
      </View>
      <View style={styles.buttonView}>
        <FormButton text="Sign In" handleSubmit={handleSubmit}></FormButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  logoContainer: {
    marginTop: '20%',
    alignItems: 'center',
  },

  // Welcome Back text
  welcomeText: {
    color: primaryColour,
    fontSize: 28,
    fontWeight: 'bold',
  },

  // view for input box area
  inputView: {
    marginTop: '10%',
    width: '85%',
  },

  // View for Sign in button
  buttonView: {
    marginTop: '10%',
    width: '100%',
  },
});

export default LoginForm;
