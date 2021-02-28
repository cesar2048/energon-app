import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Depends from '../lib/depends';

const Modes = {
    WAITING: 'waiting',
    NAVIGATING: 'navigating',
    SCAN: 'scan'
}

// https://stackoverflow.com/questions/49829724/camera-freeze-how-to-reinitialise-camera-component#54400052
class IntroScreen extends React.Component {
    constructor(props, ...args) {
        super(props, ...args);
        this.navigation = props.navigation;
        this.isNavigated = false;
        this.state = {
            mode: Modes.WAITING,
            lineas: [],
        }
    }
    onScanSuccess(connectionInfo) {
        this.setState({
            lineas: this.state.lineas.concat(['scan success']),
            mode: Modes.NAVIGATING,
        }, function() {
            this.navigation.push('Recording', connectionInfo);
            this.setState({ mode: Modes.WAITING });
        });
    }
    onStartScan() {
        this.setState({ mode: 'scan' });
    }
    render() {
        const ScanCamera = Depends.get('qrScan');
        const { lineas, mode } = this.state;
        const showCam = (mode === 'scan');
        const askToConnect = (mode === Modes.WAITING);

        return (
            <View style={styles.container}>
                <Text style={styles.title1}>Energon</Text>
                <View style={styles.experiment}>
                    {showCam && <ScanCamera style={styles.qrReader} onScanSuccess={(...a) => this.onScanSuccess(...a)} />}
                    {askToConnect && <Button onPress={() => this.onStartScan()} title={'Conectar'} />}
                </View>
                <View>
                    <Text style={styles.instructions}>Abre Audacity-Energon y haz click en el boton [conectar]
                    y escanea el código QR aqui</Text>
                    <Text style={styles.instructions}>{lineas.join('')}</Text>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    experiment: {
        width: 300,
        height: 300*3/4,
        // flex: 1,
        // borderWidth: 1,
        // borderColor: '#8d8',
        // flexDirection: 'column',
        justifyContent: 'center'
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
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#24232B',
        alignItems: 'center',
        padding: 10
    },
});

export default IntroScreen;
