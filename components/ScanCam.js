import React from 'react';
import { Camera } from 'expo-camera';
import { StyleSheet, Text } from 'react-native';
import * as Permissions from 'expo-permissions';

const QR_CODE = 256;

async function alertIfRemoteNotificationsDisabledAsync() {
    const { status, ...rest } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== 'granted') {
        alert('Hey! You might want to enable notifications for my app, they are good...' + JSON.stringify(rest));
    }
}

class ScanCamera extends React.Component {
    constructor(...args) {
        super(...args);
        this.camRef = React.createRef();
        this.state = {
            hasCamPermission: false,
        }
    }
    componentDidMount() {
        const fn = async () => {
            const { status } = await Camera.requestPermissionsAsync();
            const hasCamPermission = (status === 'granted');

            await alertIfRemoteNotificationsDisabledAsync();
            this.setState({ hasCamPermission });
        }
        fn();
    }
    onBarCodeScanned({ type, data }) {
        if (type == QR_CODE) {
            try {
                const address = JSON.parse(data);
                this.props.onScanSuccess(address);
            } catch(err) {
                alert(`ScanCam error: ${err}`);
            }
        }
    }
    render() {
        const { hasCamPermission } = this.state;

        if (!hasCamPermission) {
            return <Text>No se concedió permiso para usar la cámara</Text>;
        }
        return (
            <Camera 
                ref={(ref) => this.camRef = ref}
                style={styles.camera}
                onBarCodeScanned={(...args) => this.onBarCodeScanned(...args)}
                onMountError={() => alert('mount error')}
            />
        );
    }
}

const styles = StyleSheet.create({
    camera: {
        flex: 1,
    },
});

export default ScanCamera;