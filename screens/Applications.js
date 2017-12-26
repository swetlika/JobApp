import React, { Component } from 'react';
import Swipeout from 'react-native-swipeout';
import { Dropdown } from 'react-native-material-dropdown';
import SearchInput, { createFilter } from 'react-native-search-filter';

import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  RefreshControl,
  AsyncStorage,
} from 'react-native';

import { List, ListItem } from 'react-native-elements';
import { applications } from '../config/data';

// show list of current applied jobs
// can dynamically add/delete items and update status

var colorMatch = { 'Applied': '#E57373', 
          'Rejected': '#F06292',
          'On-Site Interview': '#BA68C8',
          'Coding Challenge': '#9575CD',
          'Phone Interview': '#7986CB',
          'Offer': '#64B5F6'
          };

export default class Applications extends Component {

  constructor(props) {
    super(props);
    this.state = {
      applications_data : [],
      companyString: '',
      statusString: '',
      refreshing: false,
      searchTerm: ''
    };
  }

  searchUpdated(term) {
    this.setState({ searchTerm: term })
  }

  //update and get data when we're at the rendering stage
  componentDidMount() {
    this.getData();
    this._updateList();
  }

  //update list when user changes/adds information to the list
  componentWillReceiveProps(applications) {
    this._updateList();
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this._updateList().then(() => {
      this.setState({refreshing: false});
    });
  }

  //go to the job details page 
  onLearnMore = (application) => {
    this.props.navigation.navigate('Details', { ...application });
  };


  //get company data from async storage to keep track of applications
  getData() {
    AsyncStorage.setItem('applications', JSON.stringify(applications));
    this._updateList();
  }

  _onAddPressed = () => {
    this.onAddObject(this.state.companyString, this.state.statusString)
  };

  //check whether the company is there and if it isnt, update the values in storage
  onAddObject = (key,value) => {
    let found = false;
    let i = 0;
    for (i in applications) {
        if (applications[i].name === key) {
            found = true;
            applications[i].status = value;
            break;
        }
    }

    if (found) {
      AsyncStorage.setItem('applications', JSON.stringify(applications));
    }

    if (!found) {
        applications.push({name: key, status: value});
        AsyncStorage.setItem('applications', JSON.stringify(applications));
    }

    this._updateList();
  }

  //delete object from async storage and udpate the list 
  onDeleteObject = (key) => {
    let i = 0;
    for (i in applications) {
        if (applications[i].name === key) {
            applications.splice(i,1);
            break;
        }
    }

    AsyncStorage.setItem('applications', JSON.stringify(applications));
    this._updateList();
  }

  //update the list by parsing the values in async storage 
  async _updateList() {
    let response = await AsyncStorage.getItem('applications'); 
    let applications = await JSON.parse(response) || []; 
    this.setState({
      applications_data: applications
    });
    console.log(this.state.applications_data);
  }

  _onCompanyTextChanged = (event) => {
    this.setState({ companyString: event.nativeEvent.text });
  };

  _onStatusTextChanged = (event) => {
    this.setState({ statusString: event.nativeEvent.text });
  };


  render() {
    let data = [{
      value: 'Applied',
    }, {
      value: 'Offer',
    }, {
      value: 'On-Site Interview',
    }, {
      value: 'Phone Interview'
    }, {
      value: 'Coding Challenge'
    }, {
      value: 'Rejected'
    }

    ];    

    return (
      <ScrollView 
        contentContainerStyle={{backgroundColor : '#ffffff'}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      >


        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.companyString}
            onChange={this._onCompanyTextChanged}
            placeholder='Company'/>

          <TextInput
            style={styles.searchInput}
            value={this.state.statusString}
            onChange={this._onStatusTextChanged}
            placeholder='Status'/>
          <Button
            onPress={this._onAddPressed}
            color='#48BBEC'
            title='Add/Update'
          />
        </View>

        
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={this.state.applications_data}
            renderItem={({ item }) => (
            <Swipeout right={[{
      text: 'Delete',
      backgroundColor: 'red',
      underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
      onPress: () => { this.onDeleteObject(item.name)}
    }]}
        backgroundColor= 'transparent'
    >

              <ListItem
                //leftIcon={{ name: 'close', style: { color: 'red' } }}
                //leftIconOnPress={() => this.onDeleteObject(item.name)}
                roundAvatar
                title={item.name}
                avatar = {{uri: `https://logo.clearbit.com/${item.name}.com`}}
                //subtitle={item.status}
                onPress={() => this.onLearnMore(item)}
                containerStyle={{ borderBottomWidth: 0 }}
                badge={{value: item.status, textStyle: { color: 'white' }, containerStyle: { backgroundColor: colorMatch[item.status]}}}
              />
              </Swipeout>
            )}
            keyExtractor={(item, index) => index}
          />
        </List>
        
      </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  searchInput: {
    height: 40,
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    flexGrow: 1,
    fontSize: 14,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 2,
    color: '#48BBEC',
  },
});