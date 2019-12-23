import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, AsyncStorage, ScrollView} from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { changeTempUnit, changeSpeedUnit, changeTimeFormat } from '../../store/actions';
import SwitchSelector from "react-native-switch-selector";

class Preference extends Component {
  state = {
    tempUnit: 'C',
    timeFormat: '24h',
    speedUnit: 'mph',
    user: null,
    signInLoading: false
  }
  
  signIn = async () => {
    this.setState({signInLoading: true})
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({
        user: userInfo,
        signInLoading: false
      })
    } catch (error) {
      this.setState({signInLoading: false})
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('Something went wrong, please try again');
      // play services not available or outdated
      } else {
        alert('Something went wrong, please try again');
        // some other error happened
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null }); 
    } catch (error) {
      alert('You are not signed in');
    }
  };

  getCurrentUser = async () => {
    this.setState({signInLoading: true})
    const currentUser = await GoogleSignin.getCurrentUser();
    this.setState({
      user: currentUser,
      signInLoading: false
    });
  };
  componentDidMount() {
    GoogleSignin.configure();
    this.getCurrentUser();
  }

  changeTemperatureUnit = async (value) => {
    this.setState({tempUnit: value});
    this.props.changeTempUnit(value)
    try {
      await AsyncStorage.setItem("tempUnit", value);
    } catch (error) {
      console.log(error);
    }
  }

  changeWindSpeedUnit = async (value) => {
    this.setState({windSpeed: value});
    this.props.changeSpeedUnit(value)
    try {
      await AsyncStorage.setItem("speedUnit", value);
    } catch (error) {
      console.log(error);
    }
  }
  changeTimeFormat = async (value) => {
    this.props.changeTimeFormat(value);
    try {
      await AsyncStorage.setItem("timeFormat", value);
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    const tempUnits = [
      { label: '°C', value: 'C' },
      { label: '°F', value: 'F'}
    ];
    const speedUnits = [
      {label: 'mph', value: 'mph'},
      {label: 'm/s', value: 'm/s'}
    ];
    const timeFormats = [
      {label: '24:00', value: '24h'},
      {label: 'AM', value: '12h'}
    ]
    let userProfile = (
      <View style={styles.userContainer}>
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={this.signIn}
          disabled={this.state.signInLoading} 
        />
      </View>
    )
    if (this.state.user) {
      const user = this.state.user.user;
      userProfile = (
        <View style={styles.userContainer}>
          <View style={styles.userInfo}>
            <Image source={{uri: user.photo}} style={styles.avatar} />
            <View style={styles.userNameArea}>
              <View>
                <Text style={styles.username}>{user.name}</Text>
                <View style={styles.email}>
                  <Text>{user.email}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.signOut} onPress={this.signOut}>
                <Text style={styles.signOutText}>SIGN OUT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <ScrollView>

        {userProfile}
        <View style={styles.settingTextContainer}>
          <WeatherIcon name="settings" size={17} color="white" />
          <Text style={styles.setting}>SETTINGS</Text>
        </View>    
        <View style={styles.settingContent}>
          <View style={styles.settingDisplay}>
            <WeatherIcon name="thermometer" size={19} color="white" />
            <Text style={styles.settingLabel}>Temperature Unit</Text>
          </View>
        
          <SwitchSelector
            onPress={value => this.changeTemperatureUnit(value)}
            initial={this.props.tempUnit === 'C' ? 0 : 1}
            borderRadius={2}
            buttonColor={'#54B374'}
            animationDuration={50}
            hasPadding={false}
            height={25}
            options={tempUnits}
            selectedColor={"#fff"}
            textColor={"#000"}
            style={styles.switchContainer}
          />
        </View>
        <View style={styles.settingContent}>
          <View style={styles.settingDisplay}>
            <WeatherIcon name="speedometer" size={19} color="white" />
            <Text style={styles.settingLabel}>Wind Speed Unit</Text>
          </View>
          <SwitchSelector
            onPress={value => this.changeWindSpeedUnit(value)}
            borderRadius={2}
            buttonColor={'#54B374'}
            initial={this.props.speedUnit === 'mph' ? 0 : 1}
            animationDuration={50}
            hasPadding={false}
            height={25}
            options={speedUnits}
            selectedColor={"#fff"}
            textColor={"#000"}
            style={styles.switchContainer}
          />
        </View>
        <View style={styles.settingContent}>
          <View style={styles.settingDisplay}>
            <WeatherIcon name="timer" size={19} color="white" />
            <Text style={styles.settingLabel}>Time Format</Text>
          </View>

          <SwitchSelector
            onPress={value => this.changeTimeFormat(value)}
            borderRadius={2}
            initial={this.props.timeFormat === '24h' ? 0 : 1}
            buttonColor={'#54B374'}
            animationDuration={50}
            hasPadding={false}
            height={25}
            options={timeFormats}
            selectedColor={"#fff"}
            textColor={"#000"}
            style={styles.switchContainer}
          />
        </View>
        <View style={styles.aboutContainer}>
          <WeatherIcon name="information-outline" size={17} color="white" />
          <Text style={styles.aboutText}>ABOUT</Text>
        </View>    
          <View style={styles.aboutContentContainer}>
            <Text style={styles.aboutContent}>Version: 1.9.1 Develop</Text>
            <Text style={styles.aboutContent}>Authors: Group 20 - UI Design 2019 Course</Text>
            <Text style={styles.aboutContent}>Weather Info: Powered by Dark Sky API</Text>
            <Text style={styles.aboutContent}>News Source: VOV.vn</Text>
          </View>
          </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 7
  },
  userContainer: {
    padding: 5,
    backgroundColor: 'white',
    height: 160,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%'
  },
  avatar: {
    width: '42%',
    height: '100%',
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 10,
    borderColor: 'blue',
    borderWidth: 1
  },
  email: {
    // textAlign: 'center'
    overflow: 'hidden'
  },
  username: {
    // textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  setting: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    marginLeft: 4
  },  
  settingContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',  
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 20
  },
  settingLabel: {
    color: 'white',
    fontSize: 16,
    marginLeft: 6
  },
  settingDisplay: {
    display: 'flex',
    flexDirection: 'row',
  },
  settingTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: 'white',
    borderTopWidth: 1,
    paddingTop: 20
  },
  userNameArea: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '58%',
  },
  aboutContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: 'white',
    borderTopWidth: 1,
    paddingTop: 15,
    marginTop: 20
  },
  aboutText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 3
  },
  signOut: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#44329B',
    height: 30,
    borderRadius: 5,
    justifyContent: 'center'
  },
  signOutText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  aboutContentContainer: {
    marginTop: 20,
    justifyContent: 'center',
    padding: 10,
    alignSelf: 'center'
  },
  aboutContent: {
    color: 'white',
    marginBottom: 5
  },
  switchContainer: {
    marginLeft: 5, 
    width: '28%',
  }
});

const mapDispatchToProps = dispatch => {
  return {
    changeTempUnit: (unit) => dispatch(changeTempUnit(unit)),
    changeSpeedUnit: (unit) => dispatch(changeSpeedUnit(unit)),
    changeTimeFormat: (format) => dispatch(changeTimeFormat(format))
  }
}

const mapStateToProps = state => {
  return {
    tempUnit: state.weatherReducer.tempUnit,
    speedUnit: state.weatherReducer.speedUnit,
    timeFormat: state.weatherReducer.timeFormat
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preference);
