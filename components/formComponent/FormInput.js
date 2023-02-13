import React from 'react';
import {Card, Button, Input} from '@rneui/themed';

import {SafeAreaView} from 'react-native';

const FormInput = (props) => {
  return (
    <SafeAreaView>
      <Input
        placeholder={props.placeholder}
        onBlur={props.onBlur}
        onChangeText={props.onChange}
        value={props.value}
        autoCapitalize={props.autoCapitalize}
        errorMessage={props.error}
        secureTextEntry={props.secureTextEntry}
      />
    </SafeAreaView>
  );
};

export default FormInput;
