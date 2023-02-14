import React from 'react';
import {Card, Button, Input} from '@rneui/themed';
import PropTypes from 'prop-types';
import {SafeAreaView, StyleSheet, TextInput} from 'react-native';

const FormInput = (props) => {
  return (
    <SafeAreaView>
      <Input
        inputContainerStyle={{borderBottomWidth: 0}}
        style={styles.input}
        placeholder={props.placeholder}
        onBlur={props.onBlur}
        label={props.label}
        onChangeText={props.onChange}
        value={props.value}
        autoCapitalize={props.autoCapitalize}
        errorMessage={props.error}
        secureTextEntry={props.secureTextEntry}
        labelStyle={{fontSize: 10, paddingLeft: 10, marginTop: 10}}
        multiline={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#e5e5e5',
    borderRadius: 10,
    paddingLeft: 20,
    fontFamily: '',
    height: 50,
  },
});

FormInput.propTypes = {
  props: PropTypes.object,
};

export default FormInput;
