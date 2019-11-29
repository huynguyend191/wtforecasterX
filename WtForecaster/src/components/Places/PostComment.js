import React, {Component} from 'react';
import {StyleSheet, Text, View, Button, TextInput, ActivityIndicator} from 'react-native';
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
        alert('Something went wrong, please try again');
      // play services not available or outdated
      } else {
        alert('Something went wrong, please try again');
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
    let submit = <ActivityIndicator size="large" color="#4c5bd5"  />
    if (!this.state.isSubmitting) {
      submit = (
        <View style={styles.submit}>
            <Button 
              title="SUBMIT" 
              color="#4c5bd5" 
              onPress={this.submit}
              disabled={!this.state.comment.trim().length > 0}
              />
          </View>
      )
    }
    let commentSection = (
      <View>
        <Text style={{marginBottom: 10}}>Sign in with Google to comment!</Text>
        <Button 
          onPress={this.signIn} title="Sign In" 
          disabled={this.state.signInLoading} 
          color="#4c5bd5" 
        />
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
            size={25}
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
    height: 200,
    width: 300,
    marginHorizontal: 10, 
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  input: {
    marginTop: 3,
    backgroundColor: 'white',
    borderRadius: 5,
    width: 280,
    borderWidth: 1
  },
  placeName: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 3
  },
  submit: {
    marginTop: 5,
    width: 100,
    alignSelf: 'center'
  }
});


export default PostComment;
