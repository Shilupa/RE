import {Icon} from '@rneui/themed';
import React, {useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import PropTypes from 'prop-types';
import {
  Alert,
  Image,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FormButton from '../components/formComponent/FormButton';
import FormInput from '../components/formComponent/FormInput';
import {MainContext} from '../contexts/MainContext';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {primaryColour, uploadsUrl, vh} from '../utils/variables';
import * as ImagePicker from 'expo-image-picker';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditProfile = ({navigation}) => {
  const assetImage = Image.resolveAssetSource(
    require('../assets/avatar.png')
  ).uri;
  const [image, setImage] = useState();
  const {getFilesByTag, postTag} = useTag(assetImage);
  const {postMedia} = useMedia();
  const [avatar, setAvatar] = useState(assetImage);
  const {isLoggedIn, user, token, updateUser, setUpdateUser} =
    useContext(MainContext);
  const {checkUsername, putUser} = useUser();
  const avatarTag = `avatar_${user.user_id}`;

  /**
   * Fetching and storing user avatar from database if avatar exists
   */
  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      // Checking if user has added avatar previously
      if (avatarArray.length > 0) {
        setAvatar(uploadsUrl + avatarArray.pop().filename);
      }
    } catch (error) {
      console.error('user avatar fetch failed', error.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(result.assets[0]);
      setAvatar(result.assets[0].uri);
    }
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      email: '',
      // full_name: '',
    },
    mode: 'onBlur',
  });

  const editProfile = async (data) => {
    const formData = new FormData();
    delete data.confirmPassword;
    /**
     * Checks if user selects the image for avatar
     */
    if (image !== undefined) {
      /**
       * Fetching data from picked image
       */
      const filename = image.uri.split('/').pop();
      let fileExt = filename.split('.').pop();

      if (fileExt === 'jpg') fileExt = 'jpeg';
      const mimeType = image.type + '/' + fileExt;

      formData.append('file', {
        uri: image.uri,
        name: filename,
        type: mimeType,
      });
    }

    try {
      /**
       * Checks if user selects the image for avatar
       * If user does not select image then no media will be posted to database
       */
      if (image !== undefined) {
        /**
         * Posting media to data base
         */
        const mediaResponse = await postMedia(formData, token);
        console.log('media', mediaResponse);
        if (mediaResponse) {
          const tag = {
            file_id: mediaResponse.file_id,
            tag: avatarTag,
          };
          /**
           * Posting user avatar
           */
          await postTag(tag, token);
        }
      }
      // Posting user data
      const userResponse = await putUser(data, token);
      /**
       * if user response is success then new user data is stored
       */
      if (userResponse) {
        delete data.password;
        // adding user id to form data
        data.user_id = user.user_id;
        // Storing data to async storage after editing data
        await AsyncStorage.setItem('user', JSON.stringify(data));
        setUpdateUser(updateUser + 1);
        Alert.alert('Profile Details', 'Updated successfully.', [
          {
            text: 'Ok',
            onPress: () => {
              navigation.navigate('Profile');
            },
          },
        ]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkUser = async (username) => {
    try {
      if (username !== user.username) {
        const userAvailable = await checkUsername(username);
        return userAvailable || 'Username is already taken';
      }
    } catch (error) {
      console.error('checkUser', error.message);
    }
  };

  useEffect(() => {
    loadAvatar();
    reset({username: user.username, email: user.email});
  }, [isLoggedIn]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => Keyboard.dismiss()} activeOpacity={1}>
        <View style={styles.titleBar}>
          <Icon
            onPress={() => {
              navigation.goBack();
            }}
            style={styles.back}
            name="arrow-back"
            color="black"
          />
          <Text style={styles.title}>Modify Item</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            style={styles.avatar}
            source={{uri: avatar}}
            onPress={editProfile}
          />
          <FontAwesomeIcon
            style={styles.camera}
            name="camera"
            onPress={pickImage}
            size={25}
          />
        </View>

        <ScrollView style={styles.inputView}>
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This is required'},
              minLength: {
                value: 3,
                message: 'Username min length is 3 characters.',
              },
              validate: checkUser,
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                style={styles.FormInput}
                label="Username *"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                autoCapitalize="none"
                error={errors.username && errors.username.message}
              />
            )}
            name="username"
          />
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'min 5 chars, needs one number, one capital letter',
              },
              pattern: {
                value: /(?=.*\p{Lu})(?=.*[0-9]).{5,}/u,
                message: 'min 5 chars, one number, one uppercase letter',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                label="Password *"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                secureTextEntry={true}
                error={errors.password && errors.password.message}
              />
            )}
            name="password"
          />
          <Controller
            control={control}
            rules={{
              validate: (value) => {
                if (value === getValues('password')) {
                  return true;
                } else {
                  return 'passwords must match';
                }
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                label="Confirm password *"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                secureTextEntry={true}
                error={errors.confirmPassword && errors.confirmPassword.message}
              />
            )}
            name="confirmPassword"
          />
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'email is required'},
              pattern: {
                value: /^[a-z0-9.-]{1,64}@[a-z0-9.-]{3,64}/i,
                message: 'Must be a valid email',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                label="Email *"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                error={errors.email && errors.email.message}
              />
            )}
            name="email"
          />
          <View style={styles.buttonView}>
            <FormButton
              text="Save changes"
              submit={editProfile}
              handleSubmit={handleSubmit}
            />
          </View>
        </ScrollView>
      </TouchableOpacity>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    marginVertical: 25,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },

  back: {
    marginVertical: 25,
    marginHorizontal: 25,
    color: primaryColour,
  },

  imageContainer: {
    position: 'relative',
    width: 150,
    height: 150,
    alignSelf: 'center',
  },

  camera: {
    position: 'absolute',
    color: primaryColour,
    bottom: 5,
    right: 5,
  },

  avatar: {
    resizeMode: 'cover',
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
  },

  inputView: {
    marginTop: '5%',
    width: '85%',
    alignSelf: 'center',
    marginBottom: 40 * vh,
  },

  // View for Sign in button
  buttonView: {
    marginTop: '2%',
    width: '100%',
  },
});

EditProfile.propTypes = {
  navigation: PropTypes.object,
};

export default EditProfile;
