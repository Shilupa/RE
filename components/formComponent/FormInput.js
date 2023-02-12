import React from 'react';
import {Card, Button, Input} from '@rneui/themed';

import {SafeAreaView} from 'react-native';

const FormInput = (props) => {
  console.log(props);
  return (
    <SafeAreaView>
      <Input
        placeholder={props.placeholder}
        onBlur={props.onBlur}
        onChangeText={props.onChange}
        value={props.value}
        autoCapitalize={props.autoCapitalize}
        errorMessage={props.errors.username && props.errors.username.message}
      />
    </SafeAreaView>
  );
};

export default FormInput;
