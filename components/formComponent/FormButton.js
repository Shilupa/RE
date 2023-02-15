import {Button} from '@rneui/themed';
import React from 'react';
import {SafeAreaView} from 'react-native';

const FormButton = (props) => {
  return (
    <SafeAreaView>
      <Button
        containerStyle={{
          width: '80%',
          height: 40,
          alignSelf: 'center',
        }}
        type="solid"
        size="md"
        color={'#4CBB17'}
        radius={6}
        title={props.text}
        onPress={props.handleSubmit(props.submit)}
      />
    </SafeAreaView>
  );
};

export default FormButton;
