import {Button} from '@rneui/themed';
import {ImageBackground, SafeAreaView, StatusBar} from 'react-native';
import {Platform, StyleSheet} from 'react-native';
import {View, Text} from 'react-native';
import {
  inputBackground,
  primaryColour,
  primaryColourDark,
  vh,
} from '../utils/variables';

const GoLogin = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.box}>
        <ImageBackground
          source={require('../assets/recycle.png')}
          style={styles.background}
        >
          <View style={styles.header}>
            <Text style={styles.h1}> RE </Text>
            <Text style={styles.h2}> Welcome to Re! </Text>
            <Text style={styles.p}>
              A platform for giving away second-hand items to those who need
              them. With RE, users can easily browse through a wide variety of
              pre-loved items such as clothing, books, electronics, and
              household goods, all of which are available for free.
            </Text>
          </View>
        </ImageBackground>
        <View>
          <Button buttonStyle={styles.button}> Login </Button>
          <Button buttonStyle={styles.button}> Sign Up </Button>
          <Button buttonStyle={styles.button}> Back </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  background: {
    opacity: 1,
  },
  header: {
    height: 30 * vh,
    justifyContent: 'space-between',
    padding: 10,
  },
  h1: {
    fontSize: 26,
    color: primaryColour,
  },
  h2: {
    fontSize: 20,
    color: primaryColour,
  },
  p: {
    color: '#808080',
  },
  button: {
    backgroundColor: primaryColour,
    borderRadius: 25,
    height: 50,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 5,
  },
  box: {
    height: 80 * vh,
    justifyContent: 'space-between',
  },
});

export default GoLogin;
