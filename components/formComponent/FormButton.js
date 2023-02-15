import {Button} from '@rneui/themed';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {primaryColour} from '../../utils/variables';

const FormButton = (props) => {
  return (
    <SafeAreaView>
      <Button
        buttonStyle={styles.buttonStyle}
        titleStyle={styles.titleStyle}
        containerStyle={styles.containerStyle}
        title={props.text}
        onPress={props.handleSubmit(props.submit)}
      />
    </SafeAreaView>
  );
};

FormButton.propTypes = {
  text: PropTypes.string,

  submit: PropTypes.object,
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: primaryColour,
    borderRadius: 25,
    height: 50,
  },

  titleStyle: {fontWeight: '100', fontSize: 20},

  containerStyle: {
    marginHorizontal: '10%',
    marginVertical: 10,
  },
});

export default FormButton;
