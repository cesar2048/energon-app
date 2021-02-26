import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Depends from '../lib/depends';

// https://stackoverflow.com/questions/49829724/camera-freeze-how-to-reinitialise-camera-component#54400052

class IntroScreen extends React.Component {
    constructor(props, ...args) {
        super(props, ...args);
        this.navigation = props.navigation;
        this.isNavigated = false;
        this.state = {
            lineas: [],
            focusedScreen: true,
        }
    }
    componentDidMount() {
        const { navigation } = this.props;
        navigation.addListener('willFocus', () => {
            this.setState({ focusedScreen: true });
        });
        navigation.addListener('willBlur', () => {
            this.setState({ focusedScreen: false });
        });
    }
    onScanSuccess(connectionInfo) {
        /*if (!this.isNavigated) {
            this.navigation.push('Recording', connectionInfo);
        } else {
            alert('Aborting second navigation to Recording');
        }*/
        this.setState({
            lineas: this.state.lineas.concat(['scan success']),
            focusedScreen: false,
        }, function() {
            this.navigation.push('Recording', connectionInfo);
            /* this.setState({
                isScanning: true
            });*/
        });
    }
    toggle() {
        this.setState({
            focusedScreen: !this.state.focusedScreen,
        });
    }
    render() {
        const ScanCamera = Depends.get('qrScan');
        const { lineas, focusedScreen } = this.state;

        return (
            <View
                style={styles.container}
            >
                <Text style={styles.title1}>Energon</Text>
                <View style={styles.experiment}>
                    {focusedScreen && <ScanCamera style={styles.qrReader} onScanSuccess={(...a) => this.onScanSuccess(...a)} />}
                </View>
                <View>
                    <Button onPress={() => this.toggle()} title={'Intentalo'} />
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
        width: 250,
        minHeight: 300,
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
