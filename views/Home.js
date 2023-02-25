import {
  Platform,
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {Tab, TabView, Text, Card} from '@rneui/themed';
import {useContext, useEffect, useState} from 'react';
import {appId, categoryList, primaryColour} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import {useTag} from '../hooks/ApiHooks';

const Home = ({navigation}) => {
  const [index, setIndex] = useState();
  const {isLoggedIn, user, update} = useContext(MainContext);
  const {getFilesByTag} = useTag();
  const [category, setCategory] = useState([]);
  // let list = ['Clothing', 'Furniture'];

  /**
   * Fetching media by category
   * Adding category list(array list) one by one in useState array
   */
  const getFilesByCategory = () => {
    try {
      categoryList.forEach(async (category) => {
        const tagResponse = await getFilesByTag(`${appId}_${category}`);
        setCategory((category) => [...category, ...tagResponse]);
      });
    } catch (error) {
      console.log('Home error: ', error);
    }
  };

  // Removing duplicates from list [Just in case]
  const filteredMedia = category.reduce((acc, current) => {
    const media = acc.find((media) => media.file_id === current.file_id);
    return !media ? acc.concat([current]) : acc;
  }, []);

  console.log('media', filteredMedia);
  console.log('====================================');
  console.log('media', filteredMedia.length);
  console.log('====================================');

  useEffect(() => {
    getFilesByCategory();
  }, [update]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Home</Text>
        {!isLoggedIn ? (
          <Text
            style={styles.logIn}
            onPress={() => navigation.navigate('Login')}
          >
            Sign In
          </Text>
        ) : (
          <Text style={styles.logIn}>
            Hi {user !== null ? user.username : 'User'}!{' '}
          </Text>
        )}
      </View>

      <Tab
        value={index}
        scrollable={true}
        onChange={(e) => {
          setIndex(e);
        }}
        indicatorStyle={{
          backgroundColor: 'black',
          height: 3,
        }}
      >
        <Tab.Item
          title="All"
          titleStyle={{fontSize: 12, color: 'black'}}
          icon={{name: 'infinite', type: 'ionicon', color: 'black'}}
        />
        <Tab.Item
          title="Furniture"
          titleStyle={{fontSize: 12, color: 'black'}}
          icon={{name: 'bed', type: 'ionicon', color: 'black'}}
        />
        <Tab.Item
          title="Clothing"
          titleStyle={{fontSize: 12, color: 'black'}}
          icon={{name: 'shirt', type: 'ionicon', color: 'black'}}
        />
        <Tab.Item
          title="Electronic Device"
          titleStyle={{fontSize: 12, color: 'black'}}
          icon={{name: 'tv', type: 'ionicon', color: 'black'}}
        />
      </Tab>
      <Card.Divider />
      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{width: '100%'}}>
          <List navigation={navigation} />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'blue', width: '100%'}}>
          <Text h1>Furniture</Text>
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'green', width: '100%'}}>
          <Text h1>Clothing</Text>
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'red', width: '100%'}}>
          <Text h1>Electronic Device</Text>
        </TabView.Item>
      </TabView>
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

  logIn: {
    marginVertical: 25,
    marginHorizontal: 25,
    color: primaryColour,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
