import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ScanCamera from '../components/ScanCamMock';

class IntroScreen extends React.Component {
    onScanSuccess() {
        alert('naviagte to capture screen');
    }
    render() {
        return (
            <View
                style={styles.container}
            >
                <Text style={styles.title1}>Captura el video</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#24232B',
        alignItems: 'center',
        padding: 20
    },
});

export default IntroScreen;
