import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {SafeAreaView} from 'react-native';
import FormButton from './formComponent/FormButton';
import FormInput from './formComponent/FormInput';

const RegisterForm = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {username: '', password: ''},
  });

  const register = (formData) => {
    console.log('From RegisterForm', formData.username);
  };

  return (
    <SafeAreaView>
      <Controller
        control={control}
        rules={{required: {value: true, message: 'is required'}}}
        render={({field: {onChange, onBlur, value}}) => (
          <FormInput
            placeholder="Username"
            onBlur={onBlur}
            onChange={onChange}
            value={value}
            autoCapitalize="none"
            errors={errors}
          />
        )}
        name="username"
      />
      <FormButton
        text="Register"
        submit={register}
        handleSubmit={handleSubmit}
      />
    </SafeAreaView>
  );
};

export default RegisterForm;
