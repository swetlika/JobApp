import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import { Text,Tile, List, ListItem } from 'react-native-elements';

export default class CodingChallenges extends Component {
  render() {
    const name = this.props.navigation.state.name;

    return (
      <ScrollView>
        <Text>
          {name}
        </Text>
      </ScrollView>
    );
  }
}
