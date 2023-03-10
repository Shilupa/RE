import React from 'react';
import {Image, SafeAreaView, StyleSheet} from 'react-native';
import LottieView from 'lottie-react-native';
import {vh, vw} from '../utils/variables';

const CoverPage = () => {
  const assetImage = 'https://users.metropolia.fi/~surajr/recycle.png';

  return (
    <SafeAreaView style={{}}>
      <Image style={styles.image} source={{uri: assetImage}} />
      <LottieView
        source={require('../lottie/recycle.json')}
        style={{
          width: 10 * vw,
          height: 30 * vh,
          alignSelf: 'center',
        }}
        autoPlay
        loop={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 60 * vh,
    width: 100 * vw,
  },
});

export default CoverPage;
