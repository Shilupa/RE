import {Platform, StyleSheet, SafeAreaView, View} from 'react-native';
import PropTypes from 'prop-types';
import ChatList from '../components/ChatList';
import {Divider, Text} from '@rneui/themed';

import {StatusBar} from 'react-native';
import {appId, baseUrl, primaryColour} from '../utils/variables';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {useComments, useMedia} from '../hooks/ApiHooks';

const Chats = ({navigation}) => {
  const {user, token} = useContext(MainContext);
  const {getCommentsByUser, getCommentsByFileId} = useComments();
  const {mediaArray} = useMedia();
  const [allComments, setAllComments] = useState([]);
  const [allMedia, setAllMedia] = useState([]);

  setAllMedia(mediaArray);

  console.log('mediaArray from chat: ', allMedia[0].file_id);

  /* const getMessageOfUser = async () => {
    const response = await getCommentsByUser(token);
    console.log('getMessageOfUser: ', response.reverse());
  }; */

  const loadAllComments = async () => {
    try {
      // const fileResponse = await getCommentsByFileId(6200);

      const comments = await Promise.all(
        mediaArray.map(async () => {
          // console.log(file.file_id);
          const fileResponse = await getCommentsByFileId(6200);
          return await fileResponse.json();
        })
      );

      setAllComments(comments);
      console.log('All Comments: ', allComments);
    } catch (error) {
      console.error('Load comments', error.message);
    }
  };

  useEffect(() => {
    loadAllComments();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Chats</Text>
      </View>
      <Divider />

      <ChatList navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },

  titleBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },

  title: {
    marginVertical: 25,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
});

Chats.propTypes = {
  navigation: PropTypes.object,
};

export default Chats;
