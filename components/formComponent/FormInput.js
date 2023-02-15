import React from 'react';
import {Input} from '@rneui/themed';
import PropTypes from 'prop-types';

import {SafeAreaView, StyleSheet} from 'react-native';
import {inputBackground, primaryColourDark} from '../../utils/variables';

const FormInput = (props) => {
  return (
    <SafeAreaView>
      <Input
        inputContainerStyle={styles.inputContainerStyle}
        labelStyle={styles.labelStyle}
        inputStyle={styles.inputStyle}
        errorStyle={styles.errorStyle}
        placeholder={props.placeholder}
        onBlur={props.onBlur}
        label={props.label}
        onChangeText={props.onChange}
        value={props.value}
        autoCapitalize={props.autoCapitalize}
        errorMessage={props.error}
        secureTextEntry={props.secureTextEntry}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Styling of input box itself
  inputStyle: {
    backgroundColor: inputBackground,
    borderRadius: 8,
    paddingLeft: 20,
    fontSize: 16,
  },

  // Text on top of input box
  labelStyle: {
    paddingStart: 16,
    fontWeight: '100',
    fontSize: 12,
    color: primaryColourDark,
    marginBottom: -7,
    zIndex: 1,
  },

  // disable underline in the input box
  inputContainerStyle: {
    borderBottomWidth: 0,
  },

  // error text in the input box
  errorStyle: {
    marginTop: -3,
  },
});

FormInput.propTypes = {
  placeholder: PropTypes.string,
  onBlur: PropTypes.object,
  label: PropTypes.string,
  onChange: PropTypes.object,
  value: PropTypes.object,
  autoCapitalize: PropTypes.object,
  error: PropTypes.string,
  secureTextEntry: PropTypes.object,
};

export default FormInput;
