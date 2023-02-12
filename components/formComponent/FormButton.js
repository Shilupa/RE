import {Button} from '@rneui/themed';
import React from 'react';
import {SafeAreaView} from 'react-native';

const FormButton = (props) => {
  return (
    <SafeAreaView>
      <Button
        type="outline"
        title={props.text}
        onPress={props.handleSubmit(props.submit)}
      />
    </SafeAreaView>
  );
};

export default FormButton;
