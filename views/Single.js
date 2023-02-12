import React from 'react';
import {uploadsUrl} from '../utils/variables';
import PropTypes from 'prop-types';
import {Card, Icon} from '@rneui/themed';
import {StyleSheet, View, Text, Image} from 'react-native';

const Single = ({route}) => {
  console.log(route.params);
  const {
    title,
    description,
    filename,
    /* time_added: timeAdded,
    user_id: userId, */
  } = route.params;
  return (
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
          source={{uri: uploadsUrl + filename}}
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
  );
};

const styles = StyleSheet.create({
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
};

export default Single;
