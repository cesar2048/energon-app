import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Depends from '../lib/depends';

class IntroScreen extends React.Component {
    constructor(props, ...args) {
        super(props, ...args);
        this.navigation = props.navigation;
        this.isNavigated = false;
    }
    onScanSuccess(connectionInfo) {
        if (!this.isNavigated) {
            this.navigation.push('Recording', connectionInfo);
        } else {
            alert('Aborting second navigation to Recording');
        }
    }
    render() {
        const ScanCamera = Depends.get('qrScan');

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
        minHeight: 400,
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
