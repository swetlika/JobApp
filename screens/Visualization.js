import { random, range } from "lodash";
import React, { Component } from "react";
import { List, ListItem, SearchBar } from "react-native-elements";

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
  Platform,
  ScrollView,
  RefreshControl
} from 'react-native';
import Svg from "react-native-svg";
import {
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryStack,
  VictoryCandlestick,
  VictoryErrorBar,
  VictoryBar,
  VictoryLine,
  VictoryArea,
  VictoryScatter,
  VictoryTooltip,
  VictoryZoomContainer,
  VictoryVoronoiContainer,
  VictorySelectionContainer,
  VictoryTheme,
  VictoryBrushContainer,
  VictoryPie,
  createContainer
} from "victory-native";


//get visualization data from a repositoruuy
export default class Visualization extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,
      y: this.getYFunction(),
      style: this.getStyles(),
      transitionData: this.getTransitionData(),
      randomData: this.generateRandomData(),
      staticRandomData: this.generateRandomData(15),
      data: this.getData(),
      info: [],
      words: {},
      applications: [],
      refreshing: false,
    };
  }

  //update the list by parsing the values in async storage 
  async _updateList() {
    let response = await AsyncStorage.getItem('applications'); 
    let apps = await JSON.parse(response) || []; 
    this.setState({
      applications: apps
    });
    console.log(this.state.applications);
  }

  //refreshes page when applications data is updated
  _onRefresh() {
    this.setState({refreshing: true});
    this._updateList().then(() => {
      this.setState({refreshing: false});
    });
  }

  //got the frequencies of the members of the list by using a dictionary
  getFrequency() {
    var freq = {};
    for (var i=0; i<this.state.applications.length;i++) {
        var character = this.state.applications[i];
        for (var key in character) {
          if (key == "status") {
            if (freq[character[key]]) {
               freq[character[key]]++;
            } 
            else {
               freq[character[key]] = 1;
            }
          }
        }
    }
    var retList = []
    for (var key in freq) {
    // check if the property/key is defined in the object itself, not in parent
      if (freq.hasOwnProperty(key)) {           
        retList.push({x: key, y: freq[key]})
      }
    }
    console.log(retList);
    return retList;
  }

  getYFunction() {
    const n = random(2, 7);
    return (data) => Math.exp(-n * data.x) * Math.sin(2 * n * Math.PI * data.x);
  }

  generateRandomData(points = 6) {
    return range(1, points + 1).map((i) => ({x: i, y: i + random(-1, 2)}));
  }

  getData() {
    return range(1, 10).map((i) => ({x: i, y: random(1, 10)}));
  }

  getStyles() {
    const colors = [
      "red", "orange", "magenta",
      "gold", "blue", "purple"
    ];
    return {
      stroke: colors[random(0, 5)],
      strokeWidth: random(1, 5)
    };
  }

  getTransitionData() {
    const n = random(4, 10);
    return range(n).map((i) => {
      return {
        x: i,
        y: random(2, 10)
      };
    });
  }

  changeScroll(scrollEnabled) {
    this.setState({scrollEnabled});
  }

  updateDemoData() {
    this.setState({
      y: this.getYFunction(),
      style: this.getStyles(),
      transitionData: this.getTransitionData(),
      randomData: this.generateRandomData(),
      data: this.getData()
    });
  }

  componentDidMount() {
    this._updateList();
    setInterval(this.updateDemoData.bind(this), 3000);
  }

  render(){
    return (
    <ScrollView backgroundColor = "white"
        contentContainerStyle={{backgroundColor : '#ffffff'}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
    >
          
      <View style={styles.container2}>
        <Text style={styles.description}>
          Analytics on User Profile
        </Text>
        
        <VictoryPie
        height={200} width={400}
          colorScale={'warm'}
            innerRadius={100}
            domainPadding={40}
            data={this.getFrequency()}
        />

      </View>
      </ScrollView>
    )
  }

};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#e1d7cd",
    justifyContent: "center",
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 50
  },
  container2: {
    marginTop: 20,
    flex: 1,
    backgroundColor: "white",
    paddingTop: 50
  },
  text: {
    fontSize: 18,
    fontFamily: (Platform.OS === "ios") ? "Menlo" : "monospace",
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 20
  },
  heading: {
    fontSize: 27,
    fontFamily: (Platform.OS === "ios") ? "Menlo" : "monospace",
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 30
  },
  description: {
    marginBottom: 27,
    fontSize: 15,
    textAlign: 'center',
    color: '#656565',
  },
  image: {
    width: 200,
    height: 200,
  }
});