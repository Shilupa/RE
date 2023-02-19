import React, {useContext} from 'react';
import {primaryColour, uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Card, Icon} from '@rneui/themed';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  SafeAreaView,
} from 'react-native';
import {MainContext} from '../contexts/MainContext';

const Single = ({navigation, route}) => {
  const {isLoggedIn} = useContext(MainContext);

  const {
    title,
    description,
    filename,
    /* time_added: timeAdded,
    user_id: userId, */
  } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Item</Text>
        {!isLoggedIn && (
          <Icon
            size={30}
            style={styles.logOut}
            onPress={() => navigation.navigate('Login')}
            name="login"
            color="Green"
          />
        )}
      </View>

      <View style={styles.column} elevation={5}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            style={{
              width: 50,
              height: 50,
              borderRadius: 400 / 2,
              resizeMode: 'contain',
              margin: 5,
            }}
            source={{uri: uploadsUrl + filename}} // TODO: change to avatar
          />
          <Text>Name</Text>
        </View>
        <Image style={styles.image} source={{uri: uploadsUrl + filename}} />
        <View style={styles.userInteraction}>
          <Icon name="thumb-up-off-alt" />
          <Icon name="thumb-down-off-alt" />
          <Icon name="chat" />
          <Icon name="favorite-border" />
        </View>
        <Card.Divider />
        <Text style={styles.listTitle}>{title}</Text>
        <Text style={{padding: 10}}>{description}</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  titleBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginVertical: 25,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
  logOut: {
    marginVertical: 25,
    marginHorizontal: 25,
    color: primaryColour,
  },
  column: {
    flexDirection: 'column',
    backgroundColor: '#FAFBFB',
    margin: 10,
    borderRadius: 6,
  },
  userInteraction: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  image: {
    margin: 10,
    resizeMode: 'cover',
    height: 300,
    borderRadius: 6,
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    padding: 10,
  },
});

Single.propTypes = {
  route: PropTypes.object,
  navigation: PropTypes.object,
};

export default Single;
