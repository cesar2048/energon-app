import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Depends from '../lib/depends';

class IntroScreen extends React.Component {
    onScanSuccess() {
        alert('naviagte to capture screen');
    }
    render() {
        const ScanCamera = Depends.get('recCam');
        const { params:connectionInfo } = this.props.route;

        return (
            <View style={styles.container}>
                <ScanCamera connectionInfo={connectionInfo} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        borderColor: '#24232B',
        borderWidth: 1,
        width: '100%',
        height: '100%'
    },
});

export default IntroScreen;
