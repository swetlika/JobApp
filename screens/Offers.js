import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  FlatList,
  Button,
  AsyncStorage,
  RefreshControl,
} from 'react-native';

import { List, ListItem } from 'react-native-elements';

// if status in Applications page is changed to "Offer", will be added to this view
export default class Offers extends Component {

  constructor(props) {
    super(props);
    this.state = {
      offer_info : [],
      all_applications : [],
      refreshing: false,
    };
  }

  componentDidMount() {
    this.getApplicationsData();
    this.getData();
    this._updateList();
  }

  _onRefresh() {
    this.setState({refreshing: true});
    this.getApplicationsData();
    this.getData();
    this._updateList().then(() => {
      this.setState({refreshing: false});
    });
  }

  async getApplicationsData() {
    let response = await AsyncStorage.getItem('applications'); 
    let apps = await JSON.parse(response) || []; 
    this.setState({
      all_applications: apps
    });
  }

  getData() {
    let offers = [];

    let i = 0;
    for (i in this.state.all_applications) {
        if (this.state.all_applications[i].status === "Offer") {
            console.log(this.state.all_applications[i]);
            offers.push(this.state.all_applications[i]);
        }
    }
    AsyncStorage.setItem('offers', JSON.stringify(offers));
    this._updateList();
  }

  async _updateList() {
    let response = await AsyncStorage.getItem('offers'); 
    let offers = await JSON.parse(response) || []; 
    this.setState({
      offer_info: offers
    });
  }


  onLearnMore = (offer) => {
    this.props.navigation.navigate('Details', { ...offer });
  };

  render() {
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
        <List containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
          <FlatList
            data={this.state.offer_info}
            renderItem={({ item }) => (
              <ListItem
                roundAvatar
                title={item.name}
                avatar = {{uri: `https://logo.clearbit.com/${item.name}.com`}}
                onPress={() => this.onLearnMore(item)}
                containerStyle={{ borderBottomWidth: 0 }}
              />
            )}
            keyExtractor={(item, index) => index}
          />
        </List>
      </ScrollView>
    );
  }
}