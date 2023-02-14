import {
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import FormInput from '../components/formComponent/FormInput';
import {Dropdown} from 'react-native-element-dropdown';
import FormButton from '../components/formComponent/FormButton';

const Upload = ({navigation}) => {
  const category = [
    {
      label: 'Select a category',
      value: '',
    },
    {
      label: 'Clothing',
      value: 'Clothing',
    },
    {
      label: 'Furniture',
      value: 'Furniture',
    },
    {
      label: 'Misc',
      value: 'Misc',
    },
  ];
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {title: '', description: ''},
    mode: 'onChange',
  });
  return (
    <ScrollView>
      <TouchableOpacity>
        <View style={styles.box}>
          <Image
            style={styles.image}
            source={{
              uri: 'https://placekitten.com/g/200/300',
            }}
          ></Image>
        </View>
      </TouchableOpacity>
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'is required',
          },
          minLength: {
            value: 3,
            message: 'Title min length is 3 characters.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <FormInput
            placeholder="Enter a title for the item"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.title && errors.title.message}
            label="Title"
          />
        )}
        name="title"
      ></Controller>
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'is required',
          },
          minLength: {
            value: 3,
            message: 'Title min length is 3 characters.',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <FormInput
            placeholder="Enter a description for the item"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.description && errors.description.message}
            label="Description"
          />
        )}
        name="title"
      ></Controller>
      <View style={styles.container}>
        <Dropdown
          style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={category}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? 'Select a category' : '...'}
          searchPlaceholder="Search..."
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item) => {
            setValue(item.value);
            setIsFocus(false);
          }}
        />
      </View>
      <FormButton text="Publish" submit={Upload} handleSubmit={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  box: {
    marginTop: 10,
    width: '80%',
    alignSelf: 'center',
  },
  image: {
    flex: 1,
    minHeight: 300,
    borderRadius: 6,
  },
  input: {
    width: '90%',
    alignSelf: 'center',
    margin: 10,
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
  },
  dropdown: {
    height: 50,
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: '#e5e5e5',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

Upload.propTypes = {
  navigation: PropTypes.object,
};

export default Upload;
