import React, {Component} from 'react';
import {StyleSheet, AsyncStorage, View} from 'react-native';
// import WeatherForecast from './src/components/WeatherForecast';
import MainNavigation from './src/components/MainNavigation';
import { GoogleSignin } from 'react-native-google-signin';
import { connect } from 'react-redux';
import { initConfig } from './src/store/actions';
import DarkTheme from './src/utils/constants';
class App extends Component {
  initConfig = async () => {
    let config = {};
    try {
      config.tempUnit = await AsyncStorage.getItem("tempUnit");
      config.speedUnit = await AsyncStorage.getItem("speedUnit");
      config.timeFormat = await AsyncStorage.getItem("timeFormat");
      config.theme = await AsyncStorage.getItem("theme");
      if (!config.tempUnit) config.tempUnit = 'C';
      if (!config.speedUnit) config.speedUnit = 'mph';
      if (!config.timeFormat) config.timeFormat = '24h';
      if (!config.theme) config.theme = 'light';
      this.props.initConfig(config);
    } catch (error) {
      console.log(error);
    }
  }
  componentDidMount() {
    this.initConfig();
    console.disableYellowBox = true;
    GoogleSignin.configure({
      webClientId: '195557048661-j5v9p9ji2o5q0sr5nomob3gihi9m05qa.apps.googleusercontent.com'
    })
  } 

  render() {
    let styles = this.props.theme === "light" ? lightStyles : darkStyles;
    return (
      <View style={styles.container}>
        <MainNavigation />
      </View>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    initConfig: (config) => dispatch(initConfig(config))
  }
}

const mapStateToProps = state => {
  return {
    theme: state.weatherReducer.theme
  }
}
const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6f6'
  }
});
const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:  DarkTheme.backgroundColor
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
