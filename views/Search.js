import {
  Platform,
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
} from 'react-native';
import PropTypes from 'prop-types';
import {Card, Icon, SearchBar, Tab, TabView, Text} from '@rneui/themed';
import {categoryList, primaryColour} from '../utils/variables';
import {useContext, useState} from 'react';
import {MainContext} from '../contexts/MainContext';
import SearchList from '../components/SearchList';
import MainView from '../components/product/MainView';

const Search = ({navigation}) => {
  const [searchIndex, setSearchIndex] = useState(0);
  const {isLoggedIn, user} = useContext(MainContext);
  const [search, setSearch] = useState('');

  const updateSearch = (search) => {
    setSearch(search);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleBar}>
        <Text style={styles.title}>Discover</Text>
        {!isLoggedIn && (
          <Text
            style={styles.logIn}
            onPress={() => navigation.navigate('Login')}
          >
            Sign In
          </Text>
        )}
        {/* {!isLoggedIn ? (
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
            title="Electronics"
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
          <SearchList
            navigation={navigation}
            search={search}
            setSearch={setSearch}
            category={''}
          />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'none', width: '100%'}}>
          <SearchList
            navigation={navigation}
            search={search}
            setSearch={setSearch}
            category={categoryList[1]}
          />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'none', width: '100%'}}>
          <SearchList
            navigation={navigation}
            search={search}
            setSearch={setSearch}
            category={categoryList[0]}
          />
        </TabView.Item>
        <TabView.Item style={{backgroundColor: 'none', width: '100%'}}>
          <SearchList
            navigation={navigation}
            search={search}
            setSearch={setSearch}
            category={categoryList[2]}
          />
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
    marginTop: 25,
    marginBottom: 15,
    marginHorizontal: 25,
    fontSize: 25,
    fontWeight: 'bold',
    color: primaryColour,
  },
  logIn: {
    marginTop: 25,
    marginBottom: 15,
    marginHorizontal: 25,
    color: primaryColour,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

Search.propTypes = {
  navigation: PropTypes.object,
};

export default Search;
