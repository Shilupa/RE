import {Platform, StyleSheet, SafeAreaView, View} from 'react-native';
import PropTypes from 'prop-types';
import {Card, Icon, SearchBar, Tab, TabView, Text} from '@rneui/themed';
import {primaryColour} from '../utils/variables';
import {useContext, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import SearchList from '../components/SearchList';

const Search = ({navigation}) => {
  const [searchIndex, setSearchIndex] = useState(0);
  const {isLoggedIn} = useContext(MainContext);
  const [search, setSearch] = useState('');

  const updateSearch = (search) => {
    setSearch(search);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Discover</Text>
        {!isLoggedIn && (
          <Icon
            size={30}
            style={styles.logOut}
            onPress={() => navigation.navigate('Login')}
            name="login"
            color="Green"
          />
        )}
      </View>
      <View style={{marginBottom: 10}}>
        <Tab
          value={searchIndex}
          scrollable={true}
          onChange={(e) => {
            setSearchIndex(e);
          }}
          indicatorStyle={{
            backgroundColor: 'green',
            height: 3,
          }}
        >
          <Tab.Item title="All" titleStyle={{fontSize: 12, color: 'black'}} />
          <Tab.Item
            title="Furniture"
            titleStyle={{fontSize: 12, color: 'black'}}
          />
          <Tab.Item
            title="Clothing"
            titleStyle={{fontSize: 12, color: 'black'}}
          />
          <Tab.Item
            title="Electronic Device"
            titleStyle={{fontSize: 12, color: 'black'}}
          />
        </Tab>
      </View>

      <View style={{alignItems: 'center'}}>
        <SearchBar
          lightTheme={true}
          round={true}
          showCancel={true}
          containerStyle={{
            width: '95%',
            backgroundColor: 'white',
            borderBottomWidth: 0,
            borderTopWidth: 0,
          }}
          inputContainerStyle={{borderRadius: 30, backgroundColor: '#F2F0F0'}}
          placeholder="Search"
          onChangeText={updateSearch}
          value={search}
        />
      </View>

      <Card.Divider />
      <TabView
        value={searchIndex}
        onChange={setSearchIndex}
        animationType="spring"
      >
        <TabView.Item style={{width: '100%'}}>
          <SearchList navigation={navigation} />
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

  titleBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginTop: 25,
    marginBottom: 15,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
  logOut: {
    marginTop: 25,
    marginBottom: 15,
    marginHorizontal: 25,
    color: primaryColour,
  },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
