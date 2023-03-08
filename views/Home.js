import {
  Platform,
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
} from 'react-native';
import PropTypes from 'prop-types';
import {Tab, TabView, Text, Card} from '@rneui/themed';
import {useContext, useEffect, useState} from 'react';
import {categoryList, primaryColour} from '../utils/variables';
import {MainContext} from '../contexts/MainContext';
import {useMedia, useTag} from '../hooks/ApiHooks';
import MainView from '../components/product/MainView';

const Home = ({navigation}) => {
  const [index, setIndex] = useState();
  const {isLoggedIn} = useContext(MainContext);

  console.log('Is logged in fromhome: ', isLoggedIn);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Home</Text>
        {!isLoggedIn && (
          <Text
            style={styles.logIn}
            onPress={() => navigation.navigate('Login')}
          >
            Sign In
          </Text>
        )}
        {/*         {!isLoggedIn ? (
          <Text
            style={styles.logIn}
            onPress={() => navigation.navigate('Login')}
          >
            Sign In
          </Text>
        ) : (
          <Text style={styles.logIn}>
            Hi {user !== null ? user.username : 'User'}!
          </Text>
        )} */}
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
          title="Electronics"
          titleStyle={{fontSize: 12, color: 'black'}}
          icon={{name: 'tv', type: 'ionicon', color: 'black'}}
        />
        <Tab.Item
          title="Miscellaneous"
          titleStyle={{fontSize: 12, color: 'black'}}
          icon={{name: 'apps', type: 'ionicon', color: 'black'}}
        />
      </Tab>
      <Card.Divider />
      <TabView value={index} onChange={setIndex} animationType="spring">
        <TabView.Item style={{width: '100%'}}>
          <MainView navigation={navigation} category={''} />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'none', width: '100%'}}>
          <MainView navigation={navigation} category={categoryList[1]} />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'none', width: '100%'}}>
          <MainView navigation={navigation} category={categoryList[0]} />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'none', width: '100%'}}>
          <MainView navigation={navigation} category={categoryList[2]} />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'none', width: '100%'}}>
          <MainView navigation={navigation} category={categoryList[3]} />
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
