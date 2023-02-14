import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {Svg} from 'react-native-svg';
import {primaryColour} from '../utils/variables';
import LeafSvg from './LeafSvg';
import {Card} from '@rneui/themed';
import {Controller, useForm} from 'react-hook-form';
import FormInput from './formComponent/FormInput';

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      full_name: '',
    },
    mode: 'onBlur',
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LeafSvg />
        <Card.Title style={styles.welcomeText}>Welcome Back</Card.Title>
      </View>

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
  );
};

export default LoginForm;

const styles = StyleSheet.create({
  text: {},
  logoContainer: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  welcomeText: {
    color: primaryColour,
    fontSize: 28,
    fontWeight: 'bold',
  },
});
