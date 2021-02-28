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
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#24232B',
        alignItems: 'center',
        // padding: 10
    },
});

export default IntroScreen;
