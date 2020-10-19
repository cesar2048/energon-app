import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScanCamera from '../components/ScanCamMock';

class IntroScreen extends React.Component {
    constructor(props, ...args) {
        super(props, ...args);
        this.navigation = props.navigation;
    }
    onScanSuccess() {
        // alert('naviagte to capture screen');
        this.navigation.push('Profile');
    }
    render() {
        return (
            <View
                style={styles.container}
            >
                <Text style={styles.title1}>Energon</Text>
                <View style={styles.experiment}>
                    <ScanCamera style={styles.qrReader} onScanSuccess={(...a) => this.onScanSuccess(...a)} />
                </View>
                <View>
                    <Text style={styles.instructions}>Abre Audacity-Energon y haz click en el boton [conectar]
                    y escanea el código QR aqui</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    experiment: {
        width: 250,
        height: 250,
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#24232B',
        alignItems: 'center',
        padding: 20
    },
    title1: {
        color: '#DDD',
        fontSize: 30,
        marginTop: 10,
        marginBottom: 10
    },
    instructions: {
        color: '#FFF',
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center'
    }
});

export default IntroScreen;
