import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import Weather from './Weather/Weather';
import News from './News/News';
import Places from './Places/Places';
import Preference from './Preference/Preference';
import {connect} from 'react-redux'

const MainNavigation = createBottomTabNavigator({
  Weather: Weather,
  Places: Places,
  News: News,
  Preference: Preference
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused, horizontal, tintColor }) => {
      const { routeName } = navigation.state;
      let IconComponent = Icon;
      let iconName;
      if (routeName === 'Weather') {
        iconName = `weather-partlycloudy`;
      } else if (routeName === 'News') {
        iconName = `newspaper`;
      } else if (routeName === 'Places') {
        iconName = 'map-marker'
      }
      else if (routeName === 'Preference') {
        iconName = 'account-settings'
      }
      return <IconComponent name={iconName} size={25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: '#007FFF',
    inactiveTintColor: '#263144',
  },
}
);

export default createAppContainer(MainNavigation);