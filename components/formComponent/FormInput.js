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
        multiline={props.multiline}
        numberOfLines={props.numberOfLines}
        rightIcon={props.rightIcon}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // Styling of input box itself
  inputStyle: {
    textAlign: 'left',
    textAlignVertical: 'top',
  },

  // Text on top of input box
  labelStyle: {
    paddingStart: 16,
    fontWeight: '300',
    fontSize: 12,
    fontStyle: 'bold',
    color: primaryColourDark,
    marginBottom: -7,
    zIndex: 1,
  },

  // disable underline in the input box
  inputContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: inputBackground,
    borderRadius: 8,
    paddingHorizontal: 20,
    fontSize: 16,
    paddingTop: 6,
  },

  // error text in the input box
  errorStyle: {
    marginTop: -3,
  },
});

FormInput.propTypes = {
  placeholder: PropTypes.string,
  onBlur: PropTypes.func,
  label: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
  autoCapitalize: PropTypes.string,
  error: PropTypes.string,
  secureTextEntry: PropTypes.bool,
  numberOfLines: PropTypes.number,
  rightIcon: PropTypes.any,
  multiline: PropTypes.bool,
};

export default FormInput;
