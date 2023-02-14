import {Platform, StyleSheet, SafeAreaView, View, Image} from 'react-native';
import PropTypes from 'prop-types';
import {Tab, TabView, Text, Button} from '@rneui/themed';
import {useState} from 'react';

const Profile = ({navigation}) => {
  const [index, setIndex] = useState(0);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userProfile}>
        <Image
          style={styles.image}
          source={{
            uri: 'https://placekitten.com/g/200/300',
          }}
        ></Image>
        <Text style={{textAlign: 'center', fontSize: 18}}>User name </Text>
        <Text style={{textAlign: 'center', fontSize: 12}}>Email </Text>
        <Button
          containerStyle={{
            width: '40%',
            marginHorizontal: 50,
            marginVertical: 10,
            alignSelf: 'center',
          }}
          type="solid"
          size="md"
          color={'#4CBB17'}
          radius={6}
          title={'Edit Profile'}
        ></Button>
      </View>
      <Tab
        value={index}
        onChange={(e) => setIndex(e)}
        indicatorStyle={{
          backgroundColor: 'black',
          height: 3,
        }}
      >
        <Tab.Item
          title="Your Listings ()"
          titleStyle={{fontSize: 12, color: 'black'}}
        />
        <Tab.Item
          title="Your Favourites ()"
          titleStyle={{fontSize: 12, color: 'black'}}
        />
      </Tab>
      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item
          style={{backgroundColor: 'blue', width: '100%'}}
        ></TabView.Item>
        <TabView.Item
          style={{backgroundColor: 'green', width: '100%'}}
        ></TabView.Item>
      </TabView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  userProfile: {
    width: '100%',
    flexDirection: 'column',
    alignSelf: 'center',
  },
  image: {
    resizeMode: 'cover',
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
