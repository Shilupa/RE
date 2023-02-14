import React from 'react';
import {Input} from '@rneui/themed';
import PropTypes from 'prop-types';

import {SafeAreaView, StyleSheet, TextInput} from 'react-native';
import {inputBackground, primaryColour} from '../../utils/variables';
import {useFonts} from 'expo-font';

const FormInput = (props) => {
  const [recycleFonts] = useFonts({
    Montserrat: require('../../assets/fonts/Montserrat-Regular.ttf'),
  });

  return (
    <SafeAreaView>
      <Input
        inputContainerStyle={{borderBottomWidth: 0, width: '70%'}}
        labelStyle={styles.label}
        inputStyle={styles.input}
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
  input: {
    backgroundColor: inputBackground,
    borderRadius: 0,
    paddingLeft: 20,
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },
  label: {
    paddingStart: 16,
    fontWeight: '100',
    fontSize: 12,
    color: primaryColour,
    marginBottom: -3,
  },
});

FormInput.propTypes = {
  props: PropTypes.object,
};

export default FormInput;
