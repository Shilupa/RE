import {Platform, StyleSheet, SafeAreaView, View} from 'react-native';
import PropTypes from 'prop-types';
import ChatList from '../components/ChatList';
import {Divider, Text} from '@rneui/themed';
import {StatusBar} from 'react-native';
import {appId, baseUrl, categoryList, primaryColour} from '../utils/variables';
import {useContext, useEffect, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import {loadMediaById, useComments, useMedia} from '../hooks/ApiHooks';

const Chats = ({navigation}) => {
  const {user, token} = useContext(MainContext);
  const {getCommentsByUser, getCommentsByFileId} = useComments();
  const {mediaArray} = useMedia();
  const [allComments, setAllComments] = useState([]);
  const [allMedia, setAllMedia] = useState([]);

  /* const getMessageOfUser = async () => {
    const response = await getCommentsByUser(token);
    console.log('getMessageOfUser: ', response.reverse());
  }; */

  // const mediaArray = [{file_id: 6200}, {file_id: 6200}, {file_id: 6200}];

  // getting one comment based on file id
  const loadCommentofFile = async () => {
    try {
      const response = await getCommentsByFileId(6274);
      console.log('loadCommentofFile: ', response);
    } catch (error) {
      console.error('loadCommentofFile error', error.message);
    }
  };

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

  /*   const getAllComment = async () => {
    const comments = await Promise.all(
      filteredMedia.map(async (media) => {
        const response = await getCommentsByFileId(media.file_id);

        return response;
      })
    );
    setAllComments(comments);
  }; */

  // console.log('All files: ', filteredMedia);

  const getAllComment = async () => {
    let list = [];

    for await (const media of mediaArray) {
      const response = await getCommentsByFileId(media.file_id);

      console.log('Respons e: ', response);

      if (response.length > 0) {
        list = list.concat(response);
        console.log('All Comment inside forEach: ', list);
      }
    }

    /*     filteredMedia.forOf(async (media) => {
      const response = await getCommentsByFileId(media.file_id);

      console.log('Response: ', response);

      if (response.length > 0) {
        list = list.concat(response);
        console.log('All Comment inside forEach: ', response);
      } */

    setAllComments(list);

    console.log('All Comment outside function: ', allComments);
  };
  // console.log('All Comment all outside function: ', allComments);

  /* const testObj = {message: 'When can I get this product?', receiverId: 2685};
  const stringObj = JSON.stringify(testObj);
  console.log('Stringyfy: ', stringObj); */

  /*   useEffect(() => {
    const interval = setInterval(() => {
      getAllComment();
    }, 10000);
    return () => clearInterval(interval);
  }, []); */

  useEffect(() => {
    // loadCommentofFile();
    getAllComment();
  }, []);

  /* const comments = await Promise.all(
        mediaArray.map(async (file) => {
          const fileResponse = await getCommentsByFileId(file.file_id);
          return await fileResponse.json();
        })
      ); */

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Chats</Text>
      </View>
      <Divider />
      {/* <Text>{allComments}</Text> */}
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
