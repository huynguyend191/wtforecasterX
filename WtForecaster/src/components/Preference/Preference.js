import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, AsyncStorage, ScrollView} from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingIcon from 'react-native-vector-icons/FontAwesome5';
import { connect } from 'react-redux';
import { changeTempUnit, changeSpeedUnit, changeTimeFormat, changeTheme } from '../../store/actions';
import SwitchSelector from "react-native-switch-selector";
import darkTheme from '../../utils/constants';

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
        alert('Error connection, please try again');
      // play services not available or outdated
      } else {
        alert('Error connection, please try again');
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
  changeTheme = async (value) => {
    try {
      let theme = value === 'on' ? 'dark' : 'light';
      this.props.changeTheme(theme);
      await AsyncStorage.setItem("theme", theme);
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    let styles = this.props.theme == 'light' ? lightStyles : darkStyles;
    let iconColor = this.props.theme === "light" ? '#263144' : darkTheme.textColor;

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
    ];
    const darkOptions = [
      {label: 'OFF', value: 'off'},
      {label: 'ON', value: 'on'}
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
        <ScrollView showsVerticalScrollIndicator={false}>

        {userProfile}
        <View style={styles.settingTextContainer}>
          <WeatherIcon name="settings" size={17} color={iconColor} />
          <Text style={styles.setting}>SETTINGS</Text>
        </View>    
        <View style={styles.settingContent}>
          <View style={styles.settingDisplay}>
            <WeatherIcon name="thermometer" size={19} color={iconColor} />
            <Text style={styles.settingLabel}>Temperature Unit</Text>
          </View>
        
          <SwitchSelector
            onPress={value => this.changeTemperatureUnit(value)}
            initial={this.props.tempUnit === 'C' ? 0 : 1}
            borderRadius={2}
            buttonColor={'#51b374'}
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
            <WeatherIcon name="speedometer" size={19} color={iconColor} />
            <Text style={styles.settingLabel}>Wind Speed Unit</Text>
          </View>
          <SwitchSelector
            onPress={value => this.changeWindSpeedUnit(value)}
            borderRadius={2}
            buttonColor={'#51b374'}
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
            <WeatherIcon name="timer" size={19} color={iconColor} />
            <Text style={styles.settingLabel}>Time Format</Text>
          </View>

          <SwitchSelector
            onPress={value => this.changeTimeFormat(value)}
            borderRadius={2}
            initial={this.props.timeFormat === '24h' ? 0 : 1}
            buttonColor={'#51b374'}
            animationDuration={50}
            hasPadding={false}
            height={25}
            options={timeFormats}
            selectedColor={"#fff"}
            textColor={"#000"}
            style={styles.switchContainer}
          />
        </View>
          <View style={styles.settingContent}>
            <View style={styles.settingDisplay}>
              <SettingIcon name="moon" size={19} color={iconColor} />
              <Text style={styles.settingLabel}>Dark Theme</Text>
            </View>

            <SwitchSelector
              onPress={value => this.changeTheme(value)}
              borderRadius={2}
              initial={this.props.theme === 'light' ? 0 : 1}
              buttonColor={'#51b374'}
              animationDuration={50}
              hasPadding={false}
              height={25}
              options={darkOptions}
              selectedColor={"#fff"}
              textColor={"#000"}
              style={styles.switchContainer}
            />
          </View>
        <View style={styles.aboutContainer}>
          <WeatherIcon name="information-outline" size={17} color={iconColor} />
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

const lightStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18
  },
  userContainer: {
    padding: 5,
    backgroundColor: 'white',
    height: 160,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginBottom: 20,
    marginTop: 40,
    elevation: 5,
    marginHorizontal: 5,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    padding: 20
  },
  avatar: {
    width: '42%',
    height: '100%',
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 10,
  },
  email: {
    fontSize: 12,
    color: '#263144',
    width: '100%',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#263144'
  },
  setting: {
    textAlign: 'center',
    color: '#263144',
    fontSize: 16,
    marginLeft: 4
  },  
  settingContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',  
    alignItems: 'center',
    paddingTop: 20
  },
  settingLabel: {
    color: '#263144',
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
    borderTopColor: '#ced4e7',
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
    borderTopColor: '#ced4e7',
    borderTopWidth: 1,
    paddingTop: 15,
    marginTop: 20
  },
  aboutText: {
    color: '#263144',
    fontSize: 16,
    marginLeft: 3
  },
  signOut: {
    width: '100%',
    backgroundColor: '#ff5253',
    height: 32,
    borderRadius: 5,
    justifyContent: 'center'
  },
  signOutText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  aboutContentContainer: {
    marginTop: 10,
    justifyContent: 'center',
  },
  aboutContent: {
    color: '#263144',
    marginBottom: 5
  },
  switchContainer: {
    marginLeft: 5, 
    width: '28%',
  }
});
const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18
  },
  userContainer: {
    padding: 5,
    backgroundColor: darkTheme.cardColor,
    height: 160,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginBottom: 20,
    marginTop: 40,
    elevation: 5,
    marginHorizontal: 5,
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
    height: '100%',
    padding: 20
  },
  avatar: {
    width: '42%',
    height: '100%',
    marginRight: 5,
    marginLeft: 5,
    borderRadius: 10,
  },
  email: {
    fontSize: 12,
    color: darkTheme.textColor,
    width: '100%',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: darkTheme.textColor
  },
  setting: {
    textAlign: 'center',
    color: darkTheme.textColor,
    fontSize: 16,
    marginLeft: 4
  },
  settingContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20
  },
  settingLabel: {
    color: darkTheme.textColor,
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
    borderTopColor: '#ced4e7',
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
    borderTopColor: '#ced4e7',
    borderTopWidth: 1,
    paddingTop: 15,
    marginTop: 20
  },
  aboutText: {
    color: darkTheme.textColor,
    fontSize: 16,
    marginLeft: 3
  },
  signOut: {
    width: '100%',
    backgroundColor: '#ff5253',
    height: 32,
    borderRadius: 5,
    justifyContent: 'center'
  },
  signOutText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  aboutContentContainer: {
    marginTop: 10,
    justifyContent: 'center',
  },
  aboutContent: {
    color: darkTheme.textColor,
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
    changeTimeFormat: (format) => dispatch(changeTimeFormat(format)),
    changeTheme: (theme) => dispatch(changeTheme(theme))
  }
}

const mapStateToProps = state => {
  return {
    tempUnit: state.weatherReducer.tempUnit,
    speedUnit: state.weatherReducer.speedUnit,
    timeFormat: state.weatherReducer.timeFormat,
    theme: state.weatherReducer.theme
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Preference);
