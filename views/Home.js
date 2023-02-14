import {Platform, StyleSheet, SafeAreaView} from 'react-native';
import List from '../components/List';
import PropTypes from 'prop-types';
import {Tab, TabView, Text, Card} from '@rneui/themed';
import {useState} from 'react';

const Home = ({navigation}) => {
  const [index, setIndex] = useState(0);
  return (
    <SafeAreaView style={styles.container}>
      <Tab
        value={index}
        scrollable={true}
        onChange={(e) => setIndex(e)}
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
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
});

Home.propTypes = {
  navigation: PropTypes.object,
};

export default Home;
