import React, { Component } from 'react';

//import the necessary modules and items
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
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Container, Header, Content, Card, CardItem, Thumbnail, Left, Body, Right, Form, Item, Label, Input} from 'native-base';


import jobs_data from '../config/recommendations_data.json';

export default class Recommendations extends Component {

  // constructor to set intitial values
  constructor(props) {
    super(props);
    this.state = {
      all_jobs : [],
      relevant_jobs : [],
      city : '',
      job : '',
    };
  }

  //get company data from async storage to keep track of applications
  getData() {
    AsyncStorage.setItem('all_jobs', JSON.stringify(jobs_data));
    this._initialUpdateList();
  }

  //update the list by parsing the values in async storage 
  async _initialUpdateList() {
    let response = await AsyncStorage.getItem('all_jobs'); 
    let jobs = await JSON.parse(response) || []; 
    this.setState({
      all_jobs: jobs
    });
    console.log(this.state.all_jobs);
  }

    //update the list by parsing the values in async storage 
  async _updateList() {
    let response = await AsyncStorage.getItem('relevant_jobs'); 
    let jobs = await JSON.parse(response) || []; 
    this.setState({
      relevant_jobs: jobs
    });
    console.log(this.state.relevant_jobs);
  }

 //update and get data when we're at the rendering stage
  componentDidMount() {
    this.getData();
    this._initialUpdateList();
  }

  _onJobTextChanged = (event) => {
    this.setState({ job: event.nativeEvent.text });
  };

  _onCityTextChanged = (event) => {
    this.setState({ city: event.nativeEvent.text });
  };

 _onSearchPressed = () => {
    this._onSearchObject(this.state.job, this.state.city);
    this._updateList();
  };

  _onSearchObject = (job,city) => {
    let i = 0;
    let ret = [];

    for (i in jobs_data) {
        if (jobs_data[i].location.includes(city)) {
            ret.push(jobs_data[i]);
        }
    }

    AsyncStorage.setItem('relevant_jobs', JSON.stringify(ret));
    this._updateList();
  }

  //UI of the Repository page 
  render() {
    return (
      <ScrollView 
        contentContainerStyle={{backgroundColor : '#ffffff'}}
      >
        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.companyString}
            onChange={this._onJobTextChanged}
            placeholder='Job'/>

          <TextInput
            style={styles.searchInput}
            value={this.state.statusString}
            onChange={this._onCityTextChanged}
            placeholder='City'/>
          <Button
            onPress={this._onSearchPressed}
            color='#48BBEC'
            title='Search'
          />
        </View>

        
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={this.state.relevant_jobs}
            renderItem={({ item }) => (
                <Card>
                  <CardItem>
              <Left>
                <Thumbnail source={{uri: `https://logo.clearbit.com/${item.company_name}.com`}} />
                <Body>
                  <Text>{item.company_name}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Left>
                  <Icon name="suitcase" 
                    color = '#517fa4'
                  />
                  <Text> Job Title: {item.job_title}</Text>
              </Left>
            </CardItem>
            <CardItem>
              <Left>
                  <Icon name="map" 
                    color = '#517fa4'
                  />
                  <Text> Location: {item.location}</Text>
              </Left>
            </CardItem>
            <CardItem>
              <Left>
                  <Text> Description: {item.summary}</Text>
              </Left>
            </CardItem>
                 </Card>
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
  container: {
    padding: 30,
    backgroundColor: 'white',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'stretch'
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