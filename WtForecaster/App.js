import React, {Component} from 'react';
import {StyleSheet, AsyncStorage} from 'react-native';
// import WeatherForecast from './src/components/WeatherForecast';
import MainNavigation from './src/components/MainNavigation';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleSignin } from 'react-native-google-signin';
import { connect } from 'react-redux';
import { initConfig } from './src/store/actions';

class App extends Component {
  state = {
    backgroundColor: ['#44329B', '#4c9dd5', '#4ac2d2']
  }
  changeColor = () => {
    const currentHour = new Date(Date.now()).getHours();
    if (currentHour > 18 || currentHour < 5) {
      this.setState({
        backgroundColor: ['#36287c', '#454879', '#567AAC']
      })
    }
  }
  initConfig = async () => {
    let config = {};
    try {
      config.tempUnit = await AsyncStorage.getItem("tempUnit");
      config.speedUnit = await AsyncStorage.getItem("speedUnit");
      config.timeFormat = await AsyncStorage.getItem("timeFormat");
      if (!config.tempUnit) config.tempUnit = 'si';
      if (!config.speedUnit) config.speedUnit = 'mph';
      if (!config.timeFormat) config.timeFormat = '24h';
      this.props.initConfig(config);
    } catch (error) {
      console.log(error);
    }
  }
  componentDidMount() {
    this.changeColor();
    this.initConfig();
    console.disableYellowBox = true;
    GoogleSignin.configure({
      webClientId: '195557048661-j5v9p9ji2o5q0sr5nomob3gihi9m05qa.apps.googleusercontent.com'
    })
  } 

  render() {
    return (
      <LinearGradient colors={this.state.backgroundColor} style={styles.container}>
        <MainNavigation />
      </LinearGradient>
    );
  }
}
const mapDispatchToProps = dispatch => {
  return {
    initConfig: (config) => dispatch(initConfig(config))
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});


export default connect(null, mapDispatchToProps)(App);
