import React, {Component} from 'react';
import {StyleSheet, Text, View, Switch, TouchableOpacity, Image} from 'react-native';
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin';
import WeatherIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { changeUnit } from '../../store/actions';

class Preference extends Component {
  state = {
    fahrenheit: false,
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
  
  toggleSwitch = (value) => {
    this.setState({fahrenheit: value});
    if (value) {
      this.props.changeUnit('us');
    } else {
      this.props.changeUnit('si');
    }
  }
  render() {
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
        {userProfile}
        <View style={styles.settingTextContainer}>
          <WeatherIcon name="settings" size={17} color="white" />
          <Text style={styles.setting}>SETTINGS</Text>
        </View>    
        <View style={styles.settingContent}>
          <View style={styles.settingDisplay}>
            <WeatherIcon name="thermometer" size={19} color="white" />
            <Text style={styles.settingLabel}>{this.state.fahrenheit ? 'Fahrenheit' : 'Celcius'}</Text>
          </View>
          <Switch
            onValueChange={this.toggleSwitch}
            value={this.state.fahrenheit}
            trackColor={{true: '#44329B'}}
            thumbColor='white'
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
            <Text style={styles.aboutContent}>Platform: Powered by React Native</Text>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 5
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
    marginLeft: 3
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
    paddingTop: 20,
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
  }
});

const mapDispatchToProps = dispatch => {
  return {
    changeUnit: (unit) => dispatch(changeUnit(unit))
  }
}


export default connect(null, mapDispatchToProps)(Preference);
