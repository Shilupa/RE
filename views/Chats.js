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
  const {filteredMedia} = useMedia();
  const [allComments, setAllComments] = useState([]);
  const [allMedia, setAllMedia] = useState([]);

  /* const getMessageOfUser = async () => {
    const response = await getCommentsByUser(token);
    console.log('getMessageOfUser: ', response.reverse());
  }; */

  // const mediaArray = [{file_id: 6200}, {file_id: 6200}, {file_id: 6200}];

  /*   const loadAllComments = async () => {
    let list = [];
    try {
      const elem = mediaArray.forEach(async (element) => {
        if (element != undefined) {
          // console.log('Testing array: ', element.file_id);
          const response = await getCommentsByFileId(element.file_id);
          list = list.concat(response);
          return list;
        }
      });
      console.log('All list: ', elem);
    } catch (error) {
      console.error('Load comments error', error.message);
    }
  }; */

  const loadAllComments = async () => {
    let list = [];
    try {
      const elem = await Promise.all(
        filteredMedia.forEach(async (element) => {
          if (element != undefined) {
            // console.log('Testing array: ', element.file_id);
            const response = await getCommentsByFileId(element.file_id);
            list = list.concat(response);
            return list;
          }
        })
      );

      console.log('All list: ', elem);
    } catch (error) {
      console.error('Load comments error', error.message);
    }
  };

  /* const comments = await Promise.all(
        mediaArray.map(async (file) => {
          const fileResponse = await getCommentsByFileId(file.file_id);
          return await fileResponse.json();
        })
      ); */

  useEffect(() => {
    loadAllComments();
  });

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
