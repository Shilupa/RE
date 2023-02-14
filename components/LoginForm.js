import {Image, StyleSheet, View} from 'react-native';
import React from 'react';
import {Svg} from 'react-native-svg';

const LoginForm = () => {
  return (
    <View>
      <Svg
        width="80"
        height="80"
        source={require('../assets/leafIcon.svg')}
      ></Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    backgroundColor: 'blue',
  },
  logo: {
    height: 200,
    width: 200,
  },
});

export default LoginForm;
