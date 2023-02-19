import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  Keyboard,
  Alert,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';
import {useCallback, useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import FormInput from '../components/formComponent/FormInput';
import FormButton from '../components/formComponent/FormButton';
import {useMedia, useTag, useUser} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import * as ImagePicker from 'expo-image-picker';
import {Image, Text, Icon} from '@rneui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {appId, primaryColour} from '../utils/variables';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const Upload = ({navigation}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [mediafile, setMediafile] = useState({});
  const [loading, setLoading] = useState(false);
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const {update, setUpdate} = useContext(MainContext);
  const {
    control,
    handleSubmit,
    formState: {errors},
    trigger,
    reset,
  } = useForm({
    defaultValues: {title: '', description: ''},
    mode: 'onChange',
  });
  const {getFilesByTag} = useTag();
  const {setIsLoggedIn, isLoggedIn, user, setUser} = useContext(MainContext);
  const [avatar, setAvatar] = useState();
  const [index, setIndex] = useState();

  console.log(isLoggedIn);
  if (!isLoggedIn) {
    navigation.navigate('Login');
  }

  const uploadFile = async (data) => {
    // create form data and post it
    setLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    const filename = mediafile.uri.split('/').pop();
    let fileExt = filename.split('.').pop();
    if (fileExt === 'jpg') fileExt = 'jpeg';
    const mimeType = mediafile.type + '/' + fileExt;
    formData.append('file', {
      uri: mediafile.uri,
      name: filename,
      type: mimeType,
    });
    console.log('form data', formData);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const result = await postMedia(formData, token);

      const appTag = {
        file_id: result.file_id,
        tag: appId,
      };
      const tagResult = await postTag(appTag, token);
      console.log('tag result', tagResult);

      Alert.alert('Uploaded', 'File id: ' + result.file_id, [
        {
          text: 'OK',
          onPress: () => {
            console.log('OK Pressed');
            // update 'update' state in context
            setUpdate(!update);
            // reset form
            // reset();
            // TODO: navigate to home
            navigation.navigate('Home');
          },
        },
      ]);
    } catch (error) {
      console.error('file upload failed', error);
    } finally {
      setLoading(false);
    }
  };
  const pickFile = async () => {
    try {
      // No permissions request is necessary for launching the image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
      });

      console.log(result);

      if (!result.canceled) {
        setMediafile(result.assets[0]);
        // validate form
        trigger();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setMediafile({});
    reset();
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        console.log('leaving');
        resetForm();
      };
    }, [])
  );

  // const category = [
  //   {
  //     label: 'Select a category',
  //     value: '',
  //   },
  //   {
  //     label: 'Clothing',
  //     value: 'Clothing',
  //   },
  //   {
  //     label: 'Furniture',
  //     value: 'Furniture',
  //   },
  //   {
  //     label: 'Misc',
  //     value: 'Misc',
  //   },
  // ];

  // const renderLabel = () => {
  //   return <Text style={[styles.label]}>Category</Text>;
  // };

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => Keyboard.dismiss()}
            activeOpacity={1}
          >
            <View style={styles.box}>
              <Image
                style={styles.image}
                source={{
                  uri:
                    mediafile.uri ||
                    'https://i0.wp.com/getstamped.co.uk/wp-content/uploads/WebsiteAssets/Placeholder.jpg',
                }}
                onPress={pickFile}
              />
            </View>
          </TouchableOpacity>
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'This is required'},
              minLength: {
                value: 3,
                message: 'min 3 characters.',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                placeholder="Enter a title for the item"
                label="Title"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                error={errors.title && errors.title.message}
              />
            )}
            name="title"
          />
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'min 5 characters',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <FormInput
                label="Description"
                placeholder="Enter a description for the item"
                onBlur={onBlur}
                onChange={onChange}
                value={value}
                error={errors.description && errors.description.message}
                numberOfLines={5}
              />
            )}
            name="description"
          />

          {/* <View style={styles.container}>
        {renderLabel()}
        <Dropdown
          style={[styles.dropdown]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={category}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select a category' : '...'}
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setValue(item.value);
            setIsFocus(false);
          }}
        />
      </View> */}
          <FormButton
            text="Upload Item"
            submit={uploadFile}
            handleSubmit={handleSubmit}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safearea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 16,
    flex: 1,
  },
  box: {
    marginTop: 10,
    width: '70%',
    alignSelf: 'center',
    borderColor: '#C0C0C0',
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 10,
  },
  image: {
    flex: 1,
    height: 200,
    borderRadius: 6,
    resizeMode: 'contain',
  },
  dropdown: {
    height: 50,
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    borderWidth: 0.5,
    paddingHorizontal: 8,
    borderColor: 'transparent',
    marginTop: 10,
  },
  label: {
    position: 'absolute',
    left: 16,
    top: 8,
    marginBottom: 10,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 10,
    color: 'grey',
  },
  placeholderStyle: {
    fontSize: 16,
    paddingLeft: 10,
    color: 'grey',
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  titleBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: '10%',
    marginHorizontal: '10%',
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
