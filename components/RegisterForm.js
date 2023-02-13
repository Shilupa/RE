import {Card} from '@rneui/themed';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {SafeAreaView} from 'react-native';
import FormButton from './formComponent/FormButton';
import FormInput from './formComponent/FormInput';
import LeafSvg from './LeafSvg';

const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues
  } = useForm({
    defaultValues: {username: '', password: '', confirmPassword: '', email: '', fullName:''},
    mode: 'onBlur',
  });

  const register = (formData) => {
    console.log('This is my registation data', formData)
  };

/*   const checkUser = async (username) => {
    try {
      const userAvailable = await checkUsername(username);
      console.log('checkUser', userAvailable);
      return userAvailable || 'Username is already taken';
    } catch (error) {
      console.error('checkUser', error.message);
    }
  }; */

  return (
    <SafeAreaView>
      <Card>
      <LeafSvg/>
      <Card.Title style = {{color:'green', fontSize:28, fontWeight:'bold'}}>Create Your Account</Card.Title>
      <Controller
        control={control}
        rules={{required: {value: true, message: 'This is required'},
        minLength: {
          value: 3,
          message: 'Username min length is 3 characters.',
        },
       // validate: checkUser,
      }}
        render={({field: {onChange, onBlur, value}}) => (
          <FormInput
            placeholder="Username"
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
            message: 'min 5 characters, needs one number, one uppercase letter',
          },
          pattern: {
            value: /(?=.*\p{Lu})(?=.*[0-9]).{5,}/u,
            message: 'min 5 characters, needs one number, one uppercase letter',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <FormInput
            placeholder="Password"
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
            placeholder="Confirm password"
            onBlur={onBlur}
            onChange={onChange}
            value={value}
            secureTextEntry={true}
            error={
              errors.confirmPassword && errors.confirmPassword.message
            }
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
            placeholder="Email"
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
            placeholder="Full name"
            onBlur={onBlur}
            onChange={onChange}
            value={value}
            autoCapitalize="words"
            error={errors.fullName && errors.fullName.message}
          />
        )}
        name="fullName"
      />

      <FormButton text="Sign Up" submit={register} handleSubmit={handleSubmit} />
      </Card>
    </SafeAreaView>
  );
};

export default RegisterForm;
