import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Depends from '../lib/depends';

class IntroScreen extends React.Component {
    constructor(props, ... args) {
        super(props, ...args);
        this.navigation = props.navigation;
    }
    onScanSuccess() {
        alert('naviagte to capture screen');
    }
    onDisconnect() {
        this.navigation.pop();
        alert('Server disconnected');
    }
    render() {
        const ScanCamera = Depends.get('recCam');
        const { params:connectionInfo } = this.props.route;

        return (
            <View style={styles.container}>
                <ScanCamera
                    connectionInfo={connectionInfo}
                    onDisconnect={() => this.onDisconnect()}
                />
                <StatusBar hidden />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#24232B',
        alignItems: 'center',
        // padding: 10
    },
});

export default IntroScreen;
