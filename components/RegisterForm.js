import {Card} from '@rneui/themed';
import React, {useContext} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native';
import {MainContext} from '../contexts/MainContext';
import {useUser} from '../hooks/ApiHooks';
import {primaryColour} from '../utils/variables';
import FormButton from './formComponent/FormButton';
import FormInput from './formComponent/FormInput';
import LeafSvg from './LeafSvg';
import {
  useFonts,
  PlayfairDisplay_600SemiBold,
} from '@expo-google-fonts/playfair-display';

const RegisterForm = () => {
  const {postUser, checkUsername} = useUser();
  const {toggleForm, setToggleForm} = useContext(MainContext);
  let [fontsLoaded] = useFonts({
    PlayfairDisplay_600SemiBold,
  });

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

  // Resets form on successful Account creation
  const resetForm = () => {
    reset(
      {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        full_name: '',
      },
      {
        keepErrors: true,
        keepDirty: true,
      }
    );
  };

  // Alert message to display on screen if user is able or unable to created Account
  const alertMessage = (result) => {
    console.log(result);
    let message = '';
    let notify = '';

    /**
     * Checking if message contains word 'error'
     * Depending upong message contains user gets notification message
     */
    result.includes('error')
      ? ((message = 'Something went wrong'),
        (notify = 'Could not create account!'))
      : ((message = result), (notify = 'Welcome!'));

    Alert.alert(notify, message, [
      {
        text: 'OK',
        onPress: () => {
          console.log('OK Pressed');
          setToggleForm(true);
        },
      },
    ]);
  };

  // Submits form
  const register = async (formData) => {
    delete formData.confirmPassword;
    try {
      const registerResult = await postUser(formData);
      resetForm();
      alertMessage(registerResult.message);
    } catch (error) {
      alertMessage(error.message);
    }
  };

  const checkUser = async (username) => {
    try {
      const userAvailable = await checkUsername(username);
      console.log('checkUser', userAvailable);
      return userAvailable || 'Username is already taken';
    } catch (error) {
      console.error('checkUser', error.message);
    }
  };

  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <LeafSvg />
          <Card.Title style={styles.welcomeText}>
            Create Your Account
          </Card.Title>
        </View>

        <View style={styles.inputView}>
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This is required'},
              minLength: {
                value: 3,
                message: 'Username min length is 3 characters.',
              },
              validate: checkUser,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                style={styles.FormInput}
                label="Username *"
                onBlur={onBlur}
                onChange={onChange}
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
                message: 'min 5 chars, needs one number, one capital letter',
              },
              pattern: {
                value: /(?=.*\p{Lu})(?=.*[0-9]).{5,}/u,
                message: 'min 5 chars, one number, one uppercase letter',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                label="Password *"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                secureTextEntry={true}
                error={errors.password && errors.password.message}
              />
            )}
            name="password"
          />
          <Controller
            control={control}
            rules={{
              validate: (value) => {
                if (value === getValues('password')) {
                  return true;
                } else {
                  return 'passwords must match';
                }
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                label="Confirm password *"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                secureTextEntry={true}
                error={errors.confirmPassword && errors.confirmPassword.message}
              />
            )}
            name="confirmPassword"
          />
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'email is required'},
              pattern: {
                value: /^[a-z0-9.-]{1,64}@[a-z0-9.-]{3,64}/i,
                message: 'Must be a valid email',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                label="Email *"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                error={errors.email && errors.email.message}
              />
            )}
            name="email"
          />
          <Controller
            control={control}
            rules={{minLength: {value: 3, message: 'must be at least 3 chars'}}}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                label="Full name"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                autoCapitalize="words"
                error={errors.full_name && errors.full_name.message}
              />
            )}
            name="full_name"
          />
        </View>
        <View style={styles.buttonView}>
          <FormButton
            text="Sign Up"
            submit={register}
            handleSubmit={handleSubmit}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

  logoContainer: {
    marginTop: '10%',
    alignItems: 'center',
  },

  // Welcome Back text
  welcomeText: {
    color: primaryColour,
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'PlayfairDisplay_600SemiBold',
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
  },
});

export default RegisterForm;
