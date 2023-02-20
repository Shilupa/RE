import {Button, Card} from '@rneui/themed';
import React, {useContext, useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Alert, Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import FormButton from '../components/formComponent/FormButton';
import FormInput from '../components/formComponent/FormInput';
import {MainContext} from '../contexts/MainContext';
import {useTag, useUser} from '../hooks/ApiHooks';
import {primaryColour, uploadsUrl} from '../utils/variables';

const EditProfile = () => {
  const {getFilesByTag} = useTag();
  const [avatar, setAvatar] = useState();
  const {isLoggedIn, user, token} = useContext(MainContext);
  const {updateUser, checkUsername} = useUser();

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
      setAvatar(avatarArray.pop().filename);
    } catch (error) {
      console.error('user avatar fetch failed', error.message);
    }
  };

  const editProfile = async (formData) => {
    delete formData.confirmPassword;
    try {
      const response = await updateUser(formData, token);
      console.log(response);
      resetForm();
    } catch (error) {
      console.log(error);
    }
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

  useEffect(() => {
    loadAvatar();
    reset({username: user.username, email: user.email});
  }, [isLoggedIn]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <View style={styles.userProfile}>
        <Image
          style={styles.avatar}
          source={{
            uri: uploadsUrl + avatar,
          }}
        ></Image>
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
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
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
    color: primaryColour,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: '12%',
    alignSelf: 'center',
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
