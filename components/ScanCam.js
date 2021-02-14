import React from 'react';
import { Camera } from 'expo-camera';
import { StyleSheet, TouchableOpacity, View, Text, Button } from 'react-native';

const QR_CODE = 256;

class ScanCamera extends React.Component {
    constructor(...args) {
        super(...args);
        this.camRef = React.createRef();
        this.state = {
            log: '',
        }
    }
    onBarCodeScanned({ type, data }) {
        if (type == QR_CODE) {
            const address = JSON.parse(data);
            this.props.onScanSuccess(address);
        }
    }
    render() {
        const { log } = this.state;

        return (
            <View style={{ flex: 1}}>
                <Camera 
                    ref={(ref) => this.camRef = ref} style={{ flex: 1 }}
                    onBarCodeScanned={(...args) => this.onBarCodeScanned(...args)}
                    onMountError={() => alert('mount error')}
                >
                </Camera>
                <Text>{log}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    camera: {
        backgroundColor: '#4CDAFB',
        width: '100%',
        height: '100%',

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default ScanCamera;