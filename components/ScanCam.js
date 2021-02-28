import React from 'react';
import { Camera } from 'expo-camera';
import { StyleSheet, TouchableOpacity, View, Text, Button } from 'react-native';

const QR_CODE = 256;

class ScanCamera extends React.Component {
    constructor(...args) {
        super(...args);
        this.camRef = React.createRef();
    }
    onBarCodeScanned({ type, data }) {
        if (type == QR_CODE) {
            const address = JSON.parse(data);
            this.props.onScanSuccess(address);
        }
    }
    render() {
        return (
            <Camera 
                ref={(ref) => this.camRef = ref} style={styles.camera}
                onBarCodeScanned={(...args) => this.onBarCodeScanned(...args)}
                onMountError={() => alert('mount error')}
            >
            </Camera>
        );
    }
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
});

export default ScanCamera;