//import the necessary modules and items
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
  NavigatorIOS,
  AppRegistry,
  FlatList,
  Avatar,
  Linking,
  AsyncStorage,
} from 'react-native';

import { List, ListItem, SearchBar, Rating, Divider} from "react-native-elements";
import React, { Component } from "react";
import { Container, Header, Item, Input, Icon} from 'native-base';

const id = '231003';
const key = 'jGnfmzPpCnG';

export default class Temp extends Component {

  // constructor to set intitial values
  constructor(props) {
    super(props);
    this.state = {
      info : [],

    };
  }

  async _updateList () { 
    let response = await AsyncStorage.getItem('companydata'); 
    let companydata = await JSON.parse(response) || []; 
    this.setState({
      info: companydata
    })
  }    

  fetchProfile(company) { 
    let url = `http://api.glassdoor.com/api/api.htm?t.p=${id}&t.k=${key}&userip=2602:306:bcca:8b0:e501:a09e:948e:5716&useragent=&format=json&v=1&action=employers&q=${company}`
    fetch(url)
      .then((res) => res.json() )
      .then((data) => {
        let obj = data.response.employers[0];
        AsyncStorage.setItem('companydata', JSON.stringify(obj));
        this._updateList();
      })
      .catch((error) => console.log(error) )
  }

  //initial call to fetch data and set state, to be used when rendering UI
  componentDidMount() {
    this.fetchProfile('Google');
    this._updateList();
  }

  //UI of the Repository page 
  render() {
    var rating = parseInt(this.state.info.overallRating);
    return (
      <View style = {styles.container}>
        <Text
          style = {{ fontSize: 40, textAlign: 'center', color: 'darkgrey'}}
          onPress={() => Linking.openURL(this.state.info.website)}>
          {this.state.info.name}
        </Text>        
        <Image
            resizeMode="contain"
            style={{width: 200, height: 200, paddingTop: 50, paddingBottom: 50, alignSelf: 'center'}}
            source={{uri: this.state.info.squareLogo}}
          />
          <Rating
            showRating
            fractions={1}
            imageSize={20}
            readonly={true}
            startingValue={rating}
          />
        <Text>Rating Description: {this.state.info.ratingDescription}</Text>
        <Text>Culture and Values Rating: {this.state.info.cultureAndValuesRating}</Text>

      </View>
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