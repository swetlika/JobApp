import React from 'react';
import { TabNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Applications from '../screens/Applications';
import Offers from '../screens/Offers';
import Recommendations from '../screens/Recommendations';
import CompanyDetail from '../screens/CompanyDetail';
import OfferDetail from '../screens/OfferDetail';
import Visualization from '../screens/Visualization';
import LoginPage from '../screens/LoginPage';


export const ApplicationsStack = StackNavigator({
  Applications: {
    screen: Applications,
    navigationOptions: {
      title: 'Applications',
    },
  },
  Details: {
    screen: CompanyDetail,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.name}`,
    }),
  },
});

export const OffersStack = StackNavigator({
  Offers: {
    screen: Offers,
    navigationOptions: {
      title: 'Offers',
    },
  },
  Details: {
    screen: OfferDetail,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.name}`,
    }),
  },
});

export const RecommendationsStack = StackNavigator({
  Recommendations: {
    screen: Recommendations,
    navigationOptions: {
      title: 'Recommendations',
    },
  },
  Details: {
    screen: CompanyDetail,
    navigationOptions: ({ navigation }) => ({
      title: `${navigation.state.params.name}`,
    }),
  },
});

export const MainTabs = TabNavigator({
  Visualization: {
    screen: Visualization,
    navigationOptions: {
      tabBarLabel: 'Visualization',
      tabBarIcon: ({ tintColor }) => <Icon name="list" size={35} color={tintColor} />,
    },
  },
  Applications: {
    screen: ApplicationsStack,
    navigationOptions: {
      tabBarLabel: 'Applications',
      tabBarIcon: ({ tintColor }) => <Icon name="list" size={35} color={tintColor} />,
    },
  },
  Offers: {
    screen: OffersStack,
    navigationOptions: {
      tabBarLabel: 'Offers',
      tabBarIcon: ({ tintColor }) => <Icon name="list" size={35} color={tintColor} />,
    },
  },
  Recommendations: {
    screen: RecommendationsStack,
    navigationOptions: {
      tabBarLabel: 'Recommendations',
      tabBarIcon: ({ tintColor }) => <Icon name="search" size={35} color={tintColor} />,
    },
  },
});

export const LoginStack = StackNavigator({
  Login: {
    screen: LoginPage,
    navigationOptions: {
      title: 'Login',
    },
  },
  Main: {
    screen: MainTabs,
    navigationOptions: {
      title: 'Main',
    },
  },
});

export const Root = StackNavigator({
  Tabs: {
    screen: LoginStack,
  },
}, {
  mode: 'modal',
  headerMode: 'none',
});