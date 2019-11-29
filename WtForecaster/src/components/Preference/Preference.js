import React, {Component} from 'react';
import {StyleSheet, Text, View, Switch, Button, Image} from 'react-native';
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
          color={GoogleSigninButton.Color.Light}
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
            <View>
              <Text style={styles.username}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>
          <Button title="Sign out" onPress={this.signOut} color='#44329B' />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        {userProfile}
        <Text style={styles.setting}>SETTINGS</Text>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 10
  },
  userContainer: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    height: 200,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 35,
    justifyContent: 'space-between'
  },
  avatar: {
    width: 90,
    height: 90,
    marginRight: 10,
    borderRadius: 10,
    borderColor: 'blue',
    borderWidth: 1
  },
  email: {
    textAlign: 'center'
  },
  username: {
    textAlign: 'center',
    fontSize: 20
  },
  setting: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
  settingContent: {
    borderTopColor: 'white',
    borderTopWidth: 1,
    marginTop: 20,
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
  }
});

const mapDispatchToProps = dispatch => {
  return {
    changeUnit: (unit) => dispatch(changeUnit(unit))
  }
}


export default connect(null, mapDispatchToProps)(Preference);
