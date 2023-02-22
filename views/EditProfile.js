import {Icon} from '@rneui/themed';
import React, {useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Alert,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FormButton from '../components/formComponent/FormButton';
import FormInput from '../components/formComponent/FormInput';
import {MainContext} from '../contexts/MainContext';
import {useTag, useUser} from '../hooks/ApiHooks';
import {primaryColour} from '../utils/variables';
import * as ImagePicker from 'expo-image-picker';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const EditProfile = ({navigation}) => {
  const [image, setImage] = useState({});
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState();
  const {isLoggedIn, user, token} = useContext(MainContext);
  const {updateUser, checkUsername} = useUser();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0]);
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
      //full_name: '',
    },
    mode: 'onBlur',
  });

  const resetForm = () => {
    reset(
      {
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        //full_name: '',
      },
      {
        keepErrors: true,
        keepDirty: true,
      }
    );
  };

  const loadAvatar = async () => {
    try {
      const avatarArray = await getFilesByTag('avatar_' + user.user_id);
      console.log('Edit profile', avatarArray.filename);
      if (avatarArray.filename !== undefined) {
        setAvatar(avatarArray.pop().filename);
      }
    } catch (error) {
      console.error('user avatar fetch failed', error.message);
    }
  };

  const editProfile = async (data) => {
    const formData = new FormData();
    const filename = image.uri.split('/').pop();
    let fileExt = filename.split('.').pop();
    if (fileExt === 'jpg') fileExt = 'jpeg';
    const mimeType = image.type + '/' + fileExt;
    formData.append('file', {
      uri: image.uri,
      name: filename,
      type: mimeType,
    });
    console.log(data);
    console.log(formData._parts);
    /* try {
      const response = await updateUser(formData, token);
      console.log(response);
      resetForm();
      navigation.navigate('Profile');
    } catch (error) {
      console.log(error);
    } */
  };

  const checkUser = async (username) => {
    try {
      if (username !== user.username) {
        const userAvailable = await checkUsername(username);
        console.log('checkUser', userAvailable);
        return userAvailable || 'Username is already taken';
      }
    } catch (error) {
      console.error('checkUser', error.message);
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('Profile');
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
            style={styles.back}
            name="arrow-back"
            onPress={navigateToProfile}
          />
        </View>

        <View>
          <Text style={styles.title}>Edit Profile</Text>
        </View>
        <View style={{position: 'relative'}}>
          <Image
            style={styles.avatar}
            source={{
              uri: image.uri || 'https://placekitten.com/g/200/300',
            }}
            onPress={editProfile}
          />

          <FontAwesomeIcon
            style={styles.camera}
            name="camera"
            onPress={pickImage}
            size={20}
          />
        </View>

        <View style={styles.inputView}>
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
          {/* <Controller
            control={control}
            rules={{minLength: {value: 3, message: 'must be at least 3 chars'}}}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                label="Full name"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                autoCapitalize="words"
                error={errors.full_name && errors.full_name.message}
              />
            )}
            name="full_name"
          /> */}
        </View>
        <View style={styles.buttonView}>
          <FormButton
            text="Save changes"
            submit={editProfile}
            handleSubmit={handleSubmit}
          />
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // alignItems: 'center',
  },

  back: {
    marginBottom: '2%',
    marginVertical: 25,
    marginHorizontal: 25,
    fontSize: '22%',
    color: 'black',
  },

  camera: {
    position: 'absolute',
    marginHorizontal: '35%',
    marginVertical: '35%',
    left: '24%',
    color: primaryColour,
  },

  avatar: {
    resizeMode: 'cover',
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
  },

  //Title of the page
  title: {
    marginVertical: 10,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
    alignSelf: 'center',
  },

  titleBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  inputView: {
    marginTop: '5%',
    width: '85%',
    alignSelf: 'center',
  },

  // View for Sign in button
  buttonView: {
    marginTop: '2%',
    width: '100%',
  },
});

export default EditProfile;
