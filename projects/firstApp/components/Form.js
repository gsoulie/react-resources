import { TextInput, View, Button, Modal, StyleSheet, Image } from 'react-native';
import { useState } from 'react';

export const InputForm = (props) => {
    const [username, setUsername] = useState('');   // gestion du state avec react

    function changeInputValue(e) { setUsername(e); }    // mémoriser valeur dans le state

    function submitValue() {
        props.addItemEvent(username);
        setUsername('');    // effacer le champ de saisie
    }

    return (
    <Modal visible={props.visible} animationType="slide">
        <View style={local.inputContainer}>
            <Image source={require('../assets/images/logo.png')} style={local.image}></Image>
            <TextInput
                style={[local.input]}
                placeholder='Please enter a username'
                value={username}
                onChangeText={changeInputValue}
                placeholderTextColor="#590FB7" />
                
                <View style={local.buttonContainer}>
                    {/* <Button title="Let's Go !!" onPress={() => submitValue(username)}></Button> */}
                    <View style={local.button}>
                        <Button title="Cancel" onPress={props.closeModal} color="#FF0076"></Button>
                    </View>
                    <View style={local.button}>
                        <Button title="Let's Go !!" onPress={submitValue} color="#590FB7"></Button>
                    </View>
                </View>
        </View>
    </Modal>
    );
}

const local = StyleSheet.create({
     inputContainer: {
        flex: 1,
        padding: 20,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#311b6b'
    },
     input: {
        padding: 5,
        paddingLeft: 10,
        borderColor: "#e4d0ff",
        backgroundColor: '#e4d0ff',
        marginBottom: 8,
        borderWidth: 1,
        width: '100%',
        color: '#120438',
        borderRadius: 10,
        letterSpacing: 2
        
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    button: {
        margin: 8,
        width: "40%"
    },
    image: {
        height: 180,
        width: 180,
        margin: 20,
        marginBottom: 60
    }
})
