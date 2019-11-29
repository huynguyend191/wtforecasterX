import React, {Component} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
// import WeatherForecast from './src/components/WeatherForecast';
import MainNavigation from './src/components/MainNavigation';
import LinearGradient from 'react-native-linear-gradient';
import { GoogleSignin } from 'react-native-google-signin';


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
  componentDidMount() {
    this.changeColor();
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

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});


export default App;
