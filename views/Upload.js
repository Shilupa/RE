import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
  Keyboard,
  Alert,
} from 'react-native';
import PropTypes from 'prop-types';
import {useCallback, useContext, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import FormInput from '../components/formComponent/FormInput';
import FormButton from '../components/formComponent/FormButton';
import {useMedia, useTag} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import * as ImagePicker from 'expo-image-picker';
import {Image, Text, Divider} from '@rneui/themed';
import {appId, categoryList, primaryColour, vh, vw} from '../utils/variables';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SelectList} from 'react-native-dropdown-select-list';

const Upload = ({navigation}) => {
  const {update, setUpdate, token} = useContext(MainContext);
  const [mediafile, setMediafile] = useState({});
  const [loading, setLoading] = useState(false);
  const {postMedia} = useMedia();
  const {postTag} = useTag();
  const [selectedCategory, setSelectedCategory] = useState();

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

  const uploadFile = async (data) => {
    let message = '';
    /**
     * Checking if mediafile object is empty
     * Checking if category is selected
     * Assigning alet message inaccordance with the situtation
     *
     */
    Object.keys(mediafile).length === 0
      ? (message = 'Image')
      : selectedCategory === undefined
      ? (message = 'Category')
      : '';

    // Alert message given if user does not select category or image
    if (selectedCategory === undefined || Object.keys(mediafile).length === 0) {
      Alert.alert('Please Select', message, [
        {
          text: 'OK',
        },
      ]);
    } else {
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

      try {
        const result = await postMedia(formData, token);

        const appTag = {
          file_id: result.file_id,
          tag: `${appId}_${selectedCategory}`,
        };
        await postTag(appTag, token);

        Alert.alert('Congratulations! ','File uploaded', [
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
        resetForm();
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Uploads</Text>
      </View>
      <Divider />

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
                autoCapitalize="none"
                multiline={false}
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
                autoCapitalize="none"
                multiline={true}
                numberOfLines={5}
              />
            )}
            name="description"
          />

          <SelectList
            setSelected={(val) => setSelectedCategory(val)}
            data={categoryList}
            save="value"
            inputStyles={{fontSize: 18, color: '#808080'}}
            boxStyles={{
              backgroundColor: '#F0F0F0',
              marginHorizontal: 2 * vw,
              marginTop: 0.5 * vh,
              marginBottom: 1 * vh,
            }}
          />

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
    resizeMode: 'cover',
  },
  dropdown: {
    height: 50,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    borderWidth: 0.5,
    paddingHorizontal: 8,
    borderColor: 'transparent',
    marginTop: 10,
  },
  categoryList: {
    fontSize: 100,
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
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

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
