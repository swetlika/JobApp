import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Root, Tabs } from '../config/router';


import { ScrollView, 
    Text, 
    TextInput, 
    View, 
    Button, 
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    KeyboardAvoidingView,
    Alert,
    AsyncStorage,
} from 'react-native';

import { users } from '../config/users';


export default class LoginPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            logged_in: false,
            current_users: [],
        };
    }

    //update and get data when we're at the rendering stage
    componentDidMount() {
        this.getData();
        this._updateList();
    }

    //get users data from async storage to verify login/registration
    getData() {
        AsyncStorage.setItem('users', JSON.stringify(users));
        this._updateList();
    }

    //update the list by parsing the values in async storage 
    async _updateList() {
        let response = await AsyncStorage.getItem('users'); 
        let users = await JSON.parse(response) || []; 
        this.setState({
            current_users: users
        });
        console.log(this.state.current_users);
    }

    checkLogin() {
        
        this._updateList();
        let current_users = this.state.current_users;
        console.log(this.state.username);
        console.log(this.state.password);
        let i = 0;
        let authenticated = false;
        for (i in current_users) {
            console.log(current_users[i].username);
            if (current_users[i].username === this.state.username) {
                console.log("Usernames match!");
                if (current_users[i].password === this.state.password) {
                    console.log("Passwords match!");
                    authenticated = true;
                }
                break;
            }
        }

        if (authenticated) {
            console.log("You're authenticated!");
            this.onLogin(this.state.logged_in);
        }
        else if (this.state.username == "" || this.state.password == "") {
            Alert.alert(
                'Please enter a username and/or password.'
            )
        }
        else {
            Alert.alert(
                'Invalid username or password.'
            )
        }
    }

    //go to the main app
    onLogin() {
        this.props.navigation.navigate('Main');
    }

    //check whether the company is there and if it isnt, update the values in storage
    onRegister() {
        let found = false;
        let i = 0;
        for (i in users) {
            if (users[i].username === this.state.username) {
                found = true;
                users[i].password = this.state.password;
                break;
            }
        }

        if (found) {
          AsyncStorage.setItem('users', JSON.stringify(users));
        }

        if (!found) {
            users.push({username: this.state.username, password: this.state.password});
            AsyncStorage.setItem('users', JSON.stringify(users));
        }

        this._updateList();
    }


    render() {
        return (
            <KeyboardAvoidingView behavior = "padding" style={styles.container}>
             <View style={styles.formContainer}>
            <View style = {styles.container}>
            <StatusBar
                barStyle = "light-content"
            />
                <TextInput 
                    placeholder='Username' 
                    autoCapitalize='none' 
                    autoCorrect={false} 
                    autoFocus={true} 
                    keyboardType='email-address' 
                    value={this.state.username} 
                    style = {styles.input}
                    onChangeText={(text) => this.setState({ username: text })} />
                <TextInput 
                    placeholder='Password' 
                    autoCapitalize='none' 
                    autoCorrect={false} 
                    secureTextEntry={true} 
                    value={this.state.password}
                    style = {styles.input} 
                    onChangeText={(text) => this.setState({ password: text })} />

                 <TouchableOpacity 
                        onPress={() => this.checkLogin()}
                        style = {styles.buttonContainer}>
                    <Text style={styles.buttonText}>LOGIN</Text>

                 </TouchableOpacity>

                 <TouchableOpacity 
                        onPress={() => this.onRegister()}
                        style = {styles.buttonContainer}>
                    <Text style={styles.buttonText}>REGISTER</Text>

                 </TouchableOpacity>

            </View>
            </View>
            </KeyboardAvoidingView>

        );
    }
}


const styles = StyleSheet.create({
    container:{
        padding: 20
    },
    input:{
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginBottom: 10,
        color: "black",
        paddingHorizontal: 10
    },
    buttonContainer:{
        backgroundColor: '#2980b9',
        paddingVertical: 15
    },
    buttonText:{
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700'
    },
    container2: {
        flex: 1,
        backgroundColor: '#3498db'
    },
    logoContainer: {
        alignItems: 'center',
        flexGrow: 1,
        justifyContent: 'center'
    },
    logo:{
        width:200,
        height:200
    }

});