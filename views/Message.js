import {
  Platform,
  StyleSheet,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
} from 'react-native';
import PropTypes from 'prop-types';
import {Button, Divider, Icon, Image, Input, Text} from '@rneui/themed';
import {StatusBar} from 'react-native';
import {
  inputBackground,
  primaryColour,
  uploadsUrl,
  appId,
  messageId,
} from '../utils/variables';
import MessageList from '../components/MessageList';
import {Controller, useForm} from 'react-hook-form';
import {useContext, useEffect, useState} from 'react';
import {useComments, useMedia, useRating, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const Message = ({navigation, route}) => {
  const {file, owner} = route.params;
  const {user} = useContext(MainContext);

  // console.log('Route Params: ', route.params);

  const senderId = user.user_id === file.user_id ? owner.user_id : file.user_id;
  const userId = user.user_id;
  const fileId = file.file_id;

  const {title} = JSON.parse(file.description);
  const {postComment, getCommentsByFileId} = useComments();
  const {token, updateMessage, setUpdateMessage} = useContext(MainContext);
  const assetImage = Image.resolveAssetSource(
    require('../assets/avatar.png')
  ).uri;
  const commentImage = Image.resolveAssetSource(
    require('../assets/comment.png')
  ).uri;
  const {getFilesByTag} = useTag();
  const [senderAvatar, setSenderAvatar] = useState(assetImage);
  const [receiverAvatar, setReceiverAvatar] = useState(assetImage);
  const {postMedia, searchMedia} = useMedia();
  const {postRating, getRatingsByFileId, deleteRating} = useRating();
  const {postTag} = useTag();
  // const [chatGroupList, setChatGroupList] = useState();
  const [groupName, setGroupName] = useState();
  const [allMessage, setAllMessage] = useState();
  const [existChatGroup, setExistChatGroup] = useState(false);

  const {control, handleSubmit, reset} = useForm({
    defaultValues: {message: ''},
    mode: 'onBlur',
  });

  const sendAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + senderId);
      if (avatarArray.length > 0) {
        setSenderAvatar(uploadsUrl + avatarArray.pop().filename);
      }
    } catch (error) {
      console.error('sender Avatar fetch failed', error.message);
    }
  };

  // getting user avatar
  const receiveAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + userId);
      if (avatarArray.length > 0) {
        setReceiverAvatar(uploadsUrl + avatarArray.pop().filename);
      }
    } catch (error) {
      console.error('sender Avatar fetch failed', error.message);
    }
  };

  const loadAllMessage = async () => {
    try {
      if (groupName != undefined) {
        const searchResponse = await searchMedia(groupName, token);
        // console.log('groupName: ', groupName);

        if (searchResponse.length > 0) {
          const chatFileId = searchResponse[0].file_id;
          const commentResponse = await getCommentsByFileId(chatFileId);
          setAllMessage(commentResponse);

          const ratingResponse = await getRatingsByFileId(chatFileId);

          // console.log('ratingResponse from Message: ', ratingResponse);

          const id1 = groupName.split('_')[0].replace(messageId, '');
          const id2 = groupName.split('_')[1].replace(messageId, '');

          // console.log('Id1: ', id1);
          // console.log('Id2: ', id2);

          // console.log('UserId: ', userIdNumber);

          const otherId = id1 == userId ? id2 : id1;
          // console.log('OtherId: ', otherId);

          const userRating = ratingResponse.find(
            (singleRating) => singleRating.user_id == userId
          );
          // console.log('user rating: ', userRating ? userRating.rating : null);

          const otherRating = ratingResponse.find(
            (singleRating) => singleRating.user_id == otherId
          );

          // console.log('Otherrating: ', otherRating ? otherRating.rating : null);

          if (otherRating === undefined) {
            // do nothing
          } else if (otherRating === undefined && userRating === undefined) {
            // do nothing
          } else if (otherRating != undefined && userRating === undefined) {
            // Post rating same as other
            await postRating(chatFileId, otherRating.rating);
            // update message
            setUpdateMessage(updateMessage + 1);
          } else if (userRating.rating === 3 && otherRating.rating === 4) {
            // delete previous rating
            await deleteRating(chatFileId);
            // post same rating as other
            await postRating(chatFileId, otherRating.rating);
            // update the message
            setUpdateMessage(updateMessage + 1);
          } else if (userRating.rating === 4 && otherRating.rating === 5) {
            // delete previous rating
            await deleteRating(chatFileId);
            // post same rating as other
            await postRating(chatFileId, otherRating.rating);
            // update the message
            setUpdateMessage(updateMessage + 1);
          } else if (userRating.rating === 5 && otherRating.rating === 3) {
            // delete previous rating
            await deleteRating(chatFileId);
            // post same rating as other
            await postRating(chatFileId, otherRating.rating);
            // update the message
            setUpdateMessage(updateMessage + 1);
          }

          // set message is seen by the user

          /*  const isSeenData = JSON.parse(searchResponse[0].description);
          isSeenData[user.user_id] = true;
          const updatedData = {
            description: isSeenData,
          };
          console.log('updatedData: ', updatedData);
 */
          // putMedia(searchResponse[0].file_id, updatedData, token);
        }
      }
    } catch (error) {
      throw new Error('loadAllMessage error: ' + error.message);
    }
  };

  const searchSetGroupName = async () => {
    const name1 =
      senderId + messageId + '_' + userId + messageId + '_' + fileId;
    const name2 =
      userId + messageId + '_' + senderId + messageId + '_' + fileId;

    console.log('Name 1: ', name1);
    console.log('Name 2: ', name2);

    try {
      const response = await getFilesByTag(appId + messageId);

      if (response.filter((obj) => obj.title === name1).length > 0) {
        setGroupName(name1);
        setExistChatGroup(true);
      } else if (response.filter((obj) => obj.title === name2).length > 0) {
        setExistChatGroup(true);
        setGroupName(name2);
      } else {
        setGroupName(name2);
      }
    } catch (error) {
      throw new Error('searchSetGroupName error: ' + error.message);
    }
  };

  // console.log('Group Name: ', groupName);

  // console.log('All message', allMessage);

  const sendMessage = async (data) => {
    try {
      if (!existChatGroup) {
        console.log(
          'Create a media item with specificTag,  title and description'
        );

        console.log('group name', groupName);

        const formData = new FormData();

        formData.append('file', {
          uri: commentImage,
          name: 'commentFile',
          type: 'image/png',
        });

        formData.append('title', groupName);

        formData.append('description', '');

        console.log('form data object', formData);

        const result = await postMedia(formData, token);

        console.log('post media response: ', result);

        const appTag = {
          file_id: result.file_id,
          tag: appId + messageId,
        };
        await postTag(appTag, token);
      }

      console.log('Group Name: ', groupName);

      // find the file with title with chatGroupName
      const ChatGroupFile = await searchMedia(groupName, token);
      console.log('CHatGroup: ', ChatGroupFile);
      const chatFileId = ChatGroupFile[0].file_id;

      // post a comment / message
      const send = await postComment(token, chatFileId, data.message);

      console.log('message send', send);
      reset();

      // post and delete rating based on message

      const ratingResponse = await getRatingsByFileId(chatFileId);

      // console.log('ratingResponse from Message: ', ratingResponse);

      const id1 = groupName.split('_')[0].replace(messageId, '');
      const id2 = groupName.split('_')[1].replace(messageId, '');

      // console.log('Id1: ', id1);
      // console.log('Id2: ', id2);

      // console.log('UserId: ', userIdNumber);

      const otherId = id1 == userId ? id2 : id1;
      // console.log('OtherId: ', otherId);

      const userRating = ratingResponse.find(
        (singleRating) => singleRating.user_id == userId
      );
      console.log('user rating: ', userRating ? userRating.rating : null);

      const otherRating = ratingResponse.find(
        (singleRating) => singleRating.user_id == otherId
      );

      console.log('Otherrating: ', otherRating ? otherRating.rating : null);
      console.log('File Id', chatFileId);

      if (otherRating === undefined && userRating === undefined) {
        console.log('case 1');
        // post rating 3
        await postRating(chatFileId, 3);
      } else if (otherRating === undefined && userRating != undefined) {
        // do nothing
        console.log('case 2');
      } else if (otherRating != undefined && userRating === undefined) {
        // unlikely at this point but if happens then
        // Post rating same as other
        console.log('case 3');
        await postRating(chatFileId, otherRating.rating);
      } else if (otherRating.rating === 5) {
        console.log('case 4');
        // delete previous rating
        await deleteRating(chatFileId);
        // post same rating 3
        await postRating(chatFileId, 3);
      } else {
        console.log('case 5', otherRating.rating + 1);
        // delete previous rating
        await deleteRating(chatFileId);
        // post same rating as other +1
        const haha = await postRating(chatFileId, otherRating.rating + 1);
        console.log('Case 5 response', haha);
      }

      // post and delete rating ends here

      setUpdateMessage(updateMessage + 1);
    } catch (error) {
      throw new Error('sendMessage error: ' + error.message);
    }
  };

  // console.log('All message: ', allMessage);

  useEffect(() => {
    sendAvatar();
    receiveAvatar();
    searchSetGroupName();
  }, []);

  useEffect(() => {
    loadAllMessage();
  }, [groupName, updateMessage]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <View style={styles.backIcon}>
          <Button
            type="solid"
            buttonStyle={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" color="black" />
          </Button>

          {/*          <Icon
            onPress={() => {
              navigation.goBack();
            }}
            name="arrow-back"
            color="black"
          /> */}
        </View>
        <View style={styles.itemContainer}>
          <Image
            onPress={() => {
              navigation.navigate('ProductDetails', file);
            }}
            style={styles.itemPicture}
            source={{uri: uploadsUrl + file.filename}}
          />
          <Text style={styles.itemTitle}>{title}</Text>
        </View>
      </View>

      <Divider />
      <MessageList
        navigation={navigation}
        singleItem={allMessage}
        senderAvatar={senderAvatar}
        receiverAvatar={receiverAvatar}
      />
      <Divider />
      <KeyboardAvoidingView>
        <View style={styles.sendMessage}>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
              },
              minLength: {
                value: 1,
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                inputContainerStyle={styles.inputContainerStyle}
                inputStyle={styles.inputStyle}
                placeholder={'Message'}
                multiline={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="message"
          />
          <View style={styles.sendIcon}>
            <Button
              containerStyle={{
                width: 50,
                height: 30,
                borderRadius: 15,
              }}
              buttonStyle={{
                backgroundColor: primaryColour,
              }}
              titleStyle={{fontSize: 10}}
              title="Send"
              onPress={handleSubmit(sendMessage)}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
    alignItems: 'baseline',
    position: 'relative',
  },

  backIcon: {
    position: 'absolute',
    top: '30%',
    left: '10%',
  },

  backBtn: {
    borderRadius: 25,
    backgroundColor: '#81C784',
  },

  itemContainer: {
    alignItems: 'center',
  },

  itemPicture: {
    height: 100,
    width: 100,
    borderRadius: 50,
  },

  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  title: {
    marginVertical: 25,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },

  sendMessage: {
    width: '85%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    position: 'relative',
  },

  inputContainerStyle: {
    borderBottomWidth: 0,
    backgroundColor: inputBackground,
    borderRadius: 25,
    paddingHorizontal: 20,
    marginTop: 5,
  },

  inputStyle: {
    textAlign: 'left',
    textAlignVertical: 'center',
    fontSize: 14,
  },

  sendIcon: {
    position: 'absolute',
    right: -50,
    top: 10,
  },
});

Message.propTypes = {
  navigation: PropTypes.object,
  route: PropTypes.object,
};

export default Message;
