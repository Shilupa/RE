import React from 'react'
import {Controller, useForm} from 'react-hook-form';
import { SafeAreaView } from 'react-native';
import FormInput from './formComponent/FormInput';

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {username: '', password: ''},
  });
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
    </SafeAreaView>
  )
}

export default LoginForm

