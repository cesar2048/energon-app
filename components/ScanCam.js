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
        this.flip = true;
    }
    componentDidMount() {
        this.onResumeCamera();
    }
    onResumeCamera() {
        this.logError('Resume');
        this.camRef.resumePreview();
    }
    onLimpiar() {
        this.logError('Pause')
        this.camRef.pausePreview();
    }
    componentDidUpdate() {
        if (this.flip) {
            this.logError('did update');
        }
        this.flip = !this.flip;
    }
    logError(msg) {
        const log = (this.state.log || '') + msg + '\n';
        this.setState({ log });
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
                    onMountError={() => this.logError('mount error')}
                >
                    <View style={{flex: 1}}>
                        <TouchableOpacity
                                style={{
                                    flex: 0.1,
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                }}
                                onPress={() => this.onResumeCamera()}>
                            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Tap to unpause </Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
                <Text>{log}</Text>
                <Button onPress={() => this.onResumeCamera()} title="Action"></Button>
                <Button onPress={() => this.onLimpiar()} title="limpiar"></Button>
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