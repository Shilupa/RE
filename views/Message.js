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
import {useComments, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';

const Message = ({navigation, route}) => {
  const {chatGroup, file} = route.params;
  // console.log('chatGroup, ', chatGroup);
  const {title} = JSON.parse(file.description);
  const {postComment} = useComments();
  const {token, updateMessage, setUpdateMessage} = useContext(MainContext);
  const assetImage = Image.resolveAssetSource(
    require('../assets/avatar.png')
  ).uri;
  const {getFilesByTag} = useTag();
  const [senderAvatar, setSenderAvatar] = useState(assetImage);
  const [receiverAvatar, setReceiverAvatar] = useState(assetImage);

  const {control, handleSubmit, reset} = useForm({
    defaultValues: {message: ''},
    mode: 'onBlur',
  });

  // getting sender Avatar
  /*   const sendAvatar = async () => {
    try {
      const response = await loadUserAvatar(chatGroup[0].senderId);
      console.log('senderAvatar response: ', response);
      setSenderAvatar(senderAvatar);
    } catch (error) {
      throw new Error('senderAvatar error, ' + error.message);
    }
  }; */

  const sendAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(
        'avatar_' + chatGroup[0].senderId
      );
      if (avatarArray.length > 0) {
        setSenderAvatar(uploadsUrl + avatarArray.pop().filename);
      }
    } catch (error) {
      console.error('sender Avatar fetch failed', error.message);
    }
  };

  // getting receiver Avatar
  const receiveAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag(
        'avatar_' + chatGroup[0].receiverId
      );
      if (avatarArray.length > 0) {
        setReceiverAvatar(uploadsUrl + avatarArray.pop().filename);
      }
    } catch (error) {
      console.error('sender Avatar fetch failed', error.message);
    }
  };

  /*   const receiveAvatar = async () => {
    try {
      const response = await loadUserAvatar(chatGroup[0].receiverId);
      console.log('receiverAvatar response: ', response);
      setReceiverAvatar(receiverAvatar);
    } catch (error) {
      throw new Error('receiverAvatar error, ' + error.message);
    }
  }; */

  const uploadMessage = async (existChatGroup, chatGroupName) => {
    try {
      if (!existChatGroup) {
        console.log(
          'Create a media item with specificTag,  title and description'
        );

        const formData = new FormData();
        // find the media item and post the comment

        formData.append('file', {
          uri: mediafile.uri,
          name: filename,
          type: mimeType,
        });
        formData.append('title', 'SenderReceiverFile');

        const result = await postMedia(formData, token);

        const appTag = {
          file_id: result.file_id,
          tag: appId + messageId,
        };
        await postTag(appTag, token);
      }
    } catch (error) {
      console.error('file upload failed', error);
    }
  };

  const sendMessage = async (data) => {
    /* console.log('Click unsucessfull');
    console.log('Send clicked');
    console.log('Sender Id:', user.user_id);
    console.log('Receiver Id', file.user_id);
    console.log('data: ', data.message); */

    const commentObj = {
      message: data.message,
      receiverId: file.user_id,
    };

    console.log('commentObject: ', commentObj);
    try {
      const send = await postComment(
        token,
        file.file_id,
        JSON.stringify(commentObj)
      );
      console.log('Loading', send);
      reset();
      setUpdateMessage(!updateMessage);
    } catch (error) {
      throw new Error('sendMessage error, ' + error.message);
    }
  };

  useEffect(() => {
    sendAvatar();
    receiveAvatar();
  }, []);

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
        singleItem={chatGroup}
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
