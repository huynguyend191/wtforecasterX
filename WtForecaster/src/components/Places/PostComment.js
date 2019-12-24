import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, TextInput, ActivityIndicator, TouchableOpacity} from 'react-native';
import { GoogleSignin } from 'react-native-google-signin';
import { AirbnbRating } from 'react-native-ratings';
import axios from '../../utils/axiosConfig';

class PostComment extends Component {
  state = {
    user: null,
    signInLoading: false,
    comment: "",
    rating: 0,
    isSubmitting: false
  }

  signIn = async () => {
    this.setState({signInLoading: true});
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({
        user: userInfo,
        signInLoading: false
      })
      this.props.setUser(userInfo);
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

  getCurrentUser = async () => {
    this.setState({signInLoading: true})
    const currentUser = await GoogleSignin.getCurrentUser();
    this.setState({
      user: currentUser,
      signInLoading: false
    });
    this.props.setUser(userInfo);
  };

  finishRating = (rating) => {
    this.setState({
      rating: rating
    })
  }

  submit = () => {
    this.setState({
      isSubmitting: true
    });
    const placeId = this.props.place._id;
    const username = this.state.user.user.name;
    const email = this.state.user.user.email;
    const rating = this.state.rating;
    const comment = this.state.comment
    axios.post(`/places/comments/${placeId}/${username}/${email}/${rating}`, {
      comment: comment
    }).then(result => {
      this.setState({
        isSubmitting: false,
        comment: "",
        rating: 0
      });
      this.props.onReload();
      this.props.onClose();
    }).catch(error => {
      alert('Submit failed')
      this.setState({
        isSubmitting: false
      });
    })
  }

  componentDidMount() {
    GoogleSignin.configure();
    this.getCurrentUser();
  }
  

  render() {
    let submit = <ActivityIndicator size="large" color='#263144'  />
    if (!this.state.isSubmitting) {
      submit = (
        <TouchableOpacity onPress={() => this.submit()} disabled={!this.state.comment.trim().length > 0}>
          <View style={styles.submit}>
            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>SUBMIT</Text>
          </View>
        </TouchableOpacity>
      )
    }
    let commentSection = (
      <View>
        <Text style={{marginBottom: 10, color: "#263144", fontSize: 16}}>Please sign in with Google to comment</Text>
        <TouchableOpacity onPress={this.signIn} disabled={this.state.signInLoading} >
          <View style={styles.signInButton}>
            <Text style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>SIGN IN</Text>
          </View>
        </TouchableOpacity>
        
      </View>
    )
    if (this.state.user) {
      commentSection = (
        <View>
          <Text style={styles.placeName}>{this.props.place.name}</Text>
          <AirbnbRating 
            showRating={false}
            defaultRating={this.state.rating}
            onFinishRating={this.finishRating}
            size={20}
          />
          <TextInput
            placeholder="Please write your review here..."
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => this.setState({comment: text})}
            value={this.state.comment}
            style={styles.input}
          />
          {submit}
        </View>
        
      )
    }
    return (
      <View style={styles.container}>
        {commentSection}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    width: 320,
    marginHorizontal: 10, 
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f6f6'
  },
  input: {
    marginTop: 3,
    backgroundColor: 'white',
    borderRadius: 10,
    width: 280,
    borderWidth: 1,
    borderColor: '#ced4e7',
    padding: 10,
    textAlignVertical: 'top'
  },
  placeName: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 3,
    color: '#263144',
    fontWeight: 'bold'
  },
  submit: {
    marginTop: 10,
    width: 280,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#51b374',
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center'
  },
  signInButton: {
    marginTop: 10,
    width: 280,
    alignSelf: 'center',
    borderRadius: 20,
    backgroundColor: '#516dff',
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    justifyContent: 'center'
  }
});


export default PostComment;
