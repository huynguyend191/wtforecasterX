import { createMaterialTopTabNavigator } from 'react-navigation';
import Daily from './Daily/Daily';
import Current from './Current/Current';
import Hourly from './Hourly/Hourly';
import Multi from './Multi/Multi';

const Weather = createMaterialTopTabNavigator({
  Current: Current,
  Hourly: Hourly,
  Daily: Daily,
  Multi: Multi
},
{ 
  tabBarOptions: {
    style: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      height: 4,
    },
    indicatorStyle: {
      borderBottomColor: '#263144',
      borderBottomWidth: 4,
    },
    showLabel: false
}}
);

export default Weather;