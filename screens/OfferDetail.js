import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
  Image,
  NavigatorIOS,
  AppRegistry,
  FlatList,
  Avatar,
  Linking,
  AsyncStorage,
  ScrollView
} from 'react-native';
import { Tile, List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { Container, Header, Content, Card, CardItem, Thumbnail, Left, Body, Right, Form, Item, Label, Input, Button } from 'native-base';


import { applications } from '../config/data';

// blank page for now
// gets name when clicked from Offers page

const id = '231003';
const key = 'jGnfmzPpCnG';

export default class OfferDetail extends Component {
  
  // constructor to set intitial values
  constructor(props) {
    super(props);
    this.state = {
      offerdata : [],
      info : [],
      salaryText : '',
      salary: '',
      location: '',
      locationText: '',
      bonus: '',
      bonusText: '',
      benefits: '',
      benefitsText: '',
    };
  }

  async _initialUpdateList () { 
    let response = await AsyncStorage.getItem('offerdata'); 
    let offerdata = await JSON.parse(response) || []; 
    this.setState({
      offerdata: offerdata
    })
  }

  async _updateList () { 
    let response = await AsyncStorage.getItem('offers'); 
    let info = await JSON.parse(response) || []; 
    this.setState({
      info: info
    })
    console.log('info', this.state.info);
  }  

  async _updateSalary () {
    let response = await AsyncStorage.getItem('salary'); 
    let salary = await JSON.parse(response) || []; 
    let key = this.props.navigation.state.params.name;
    for (i in applications) {
      if (applications[i].name === key) {
            applications[i].salary = salary;
            break;
        }
    }
    AsyncStorage.setItem('offers', JSON.stringify(applications));
    this._updateList();
  }  

  async _updateLocation () {
    let response = await AsyncStorage.getItem('location'); 
    let location = await JSON.parse(response) || []; 
    let key = this.props.navigation.state.params.name;
    for (i in applications) {
      if (applications[i].name === key) {
            applications[i].location = location;
            break;
        }
    }
    AsyncStorage.setItem('offers', JSON.stringify(applications));
    this._updateList();
  } 

  async _updateBonus() {
    let response = await AsyncStorage.getItem('bonus'); 
    let bonus = await JSON.parse(response) || []; 
    let key = this.props.navigation.state.params.name;
    for (i in applications) {
      if (applications[i].name === key) {
            applications[i].bonus = bonus;
            break;
        }
    }
    AsyncStorage.setItem('offers', JSON.stringify(applications));
    this._updateList();
  } 

  async _updateBenefits () {
    let response = await AsyncStorage.getItem('benefits'); 
    let benefits = await JSON.parse(response) || []; 
    let key = this.props.navigation.state.params.name;
    for (i in applications) {
      if (applications[i].name === key) {
            applications[i].benefits = benefits;
            break;
        }
    }
    AsyncStorage.setItem('offers', JSON.stringify(applications));
    this._updateList();
  }

  //get information from the glassdoor api, and log the data in info
  fetchProfile(company) { 
    let url = `http://api.glassdoor.com/api/api.htm?t.p=${id}&t.k=${key}&userip=2602:306:bcca:8b0:e501:a09e:948e:5716&useragent=&format=json&v=1&action=employers&q=${company}`
    fetch(url)
      .then((res) => res.json() )
      .then((data) => {
        let obj = data.response.employers[0];
        AsyncStorage.setItem('offerdata', JSON.stringify(obj));
        this._initialUpdateList();
      })
      .catch((error) => console.log(error) )
  }

  _onSalaryTextChanged = (event) => {
    this.setState({ salaryText: event.nativeEvent.text});
  };

  _onSalaryUpdatePressed = () => {
    let obj = this.state.salaryText;
    AsyncStorage.setItem('salary', JSON.stringify(obj));
    this._updateSalary();
  };

  _onLocationTextChanged = (event) => {
    this.setState({ locationText: event.nativeEvent.text});
  };

  _onLocationUpdatePressed = () => {
    let obj = this.state.locationText;
    AsyncStorage.setItem('location', JSON.stringify(obj));
    this._updateLocation();
  };

  _onBonusTextChanged = (event) => {
    this.setState({ bonusText: event.nativeEvent.text});
  };

  _onBonusUpdatePressed = () => {
    let obj = this.state.bonusText;
    AsyncStorage.setItem('bonus', JSON.stringify(obj));
    this._updateBonus();
  };

  _onBenefitsTextChanged = (event) => {
    this.setState({ benefitsText: event.nativeEvent.text});
  };

  _onBenefitsUpdatePressed = () => {
    let obj = this.state.benefitsText;
    AsyncStorage.setItem('benefits', JSON.stringify(obj));
    this._updateBenefits();
  };


  //initial call to fetch data and set state, to be used when rendering UI
 componentDidMount() {
    this.fetchProfile(this.props.navigation.state.params.name);
    this._initialUpdateList();
    this._updateList();
  }

  render() {
    let data = [];
    let key = this.props.navigation.state.params.name;
    for (i in applications) {
      if (applications[i].name === key) {
            data = applications[i];
            break;
        }
    }

    return (
      <Container>
        <Container style = {{backgroundColor: 'white'}}>
          <Form style = {{backgroundColor: 'white'}}>
            <Item inlineLabel style = {styles.entryStyle}>
              <Label style={styles.textStyle}>Salary</Label>
              <Input 
                onChange={this._onSalaryTextChanged}
              />
              <Button transparent info style = {{paddingRight: 10}} onPress={this._onSalaryUpdatePressed}>
                <Text >Update</Text>
              </Button>
            </Item>
            <Item inlineLabel style = {styles.entryStyle}>
              <Label style = {styles.textStyle}>Bonus</Label>
              <Input 
                onChange={this._onBonusTextChanged}
              />              
              <Button transparent info style = {{paddingRight: 10}} onPress={this._onBonusUpdatePressed}>
                <Text >Update</Text>
              </Button>
            </Item>
            <Item inlineLabel style = {styles.entryStyle}>
              <Label style = {styles.textStyle}>Location</Label>
              <Input 
                onChange={this._onLocationTextChanged}
              />              
              <Button transparent info style = {{paddingRight: 10}} onPress={this._onLocationUpdatePressed}>
                <Text >Update</Text>
              </Button>
            </Item>
            <Item inlineLabel style = {styles.entryStyle}>
              <Label style = {styles.textStyle}>Benefits</Label>
              <Input 
                onChange={this._onBenefitsTextChanged}
              />              
              <Button transparent info style = {{paddingRight: 10}} onPress={this._onBenefitsUpdatePressed}>
                <Text >Update</Text>
              </Button>
            </Item>
          </Form>
          <Content>
            <CardItem>
              <Left>
                <Thumbnail source={{uri: this.state.offerdata.squareLogo}} />
                <Body>
                  <Text>{this.state.offerdata.name}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Left>
                  <Icon name="money" 
                    color = 'green'
                  />
                  <Text> Base Salary: {data.salary}</Text>
              </Left>
            </CardItem>
            <CardItem>
              <Left>
                  <Icon name="dollar" 
                    color = 'green'
                  />
                  <Text> Signing Bonus: {data.bonus}</Text>
              </Left>
            </CardItem>
            <CardItem>
              <Left>
                  <Icon name="map" 
                    color = '#517fa4'
                  />
                  <Text> Location: {data.location}</Text>
              </Left>
            </CardItem>
            <CardItem>
              <Left>
                  <Icon name="plus-circle" 
                    color = '#517fa4'
                  />
                  <Text> Benefits: {data.benefits}</Text>
              </Left>
            </CardItem>
        </Content>
        </Container>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#656565',
    marginTop: 65,
  },
  flowRight: {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'stretch',
},
searchInput: {
  height: 36,
  padding: 4,
  marginRight: 5,
  flexGrow: 1,
  fontSize: 18,
  borderWidth: 1,
  borderColor: '#48BBEC',
  borderRadius: 8,
  color: '#48BBEC',
},
 textStyle: {
  fontSize: 15
 },
 entryStyle: {
  backgroundColor: 'white'
 }
});
