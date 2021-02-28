import React from 'react'
import {
    TouchableOpacity,
    View,
    Text,
    Button,
    StyleSheet
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

async function alertIfRemoteNotificationsDisabledAsync() {
    const { status, ...rest } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== 'granted') {
        alert('Hey! You might want to enable notifications for my app, they are good...' + JSON.stringify(rest));
    }
}

const uploadFile = async (path, url) => {
    const data = new FormData();
    const name = path.substr(path.lastIndexOf('/') + 1);
    alert("name " + name);
    data.append('theFile', {
        type: 'video/mp4',
        uri: path,
        name,
    });

    let res = await fetch(url, {
        method: 'post',
        body: data,
        heders: {
            'Content-Type': 'multipart/form-data'
        }
    });
    
    let response = await res.json();
    alert(JSON.stringify(response));
};

class HandlerServer {
    constructor(host, controller) {
        this.host = host;
        this.started = false;
        this.controller = controller;
    }

    start() {
        if (this.started) {
            return;
        }

        this.started = true;
        this.ws = new WebSocket(`ws://${this.host}/path`);
        this.ws.onopen = () => {
            // alert('connected to server');
        }
        this.ws.onmessage = (e) => {
            if (e.data == 'Start recording') {
                this.controller.startRecording();
            } else if (e.data == 'Stop recording') {
                this.controller.stopRecording();
            } else {
                alert(`Unknown message: ${e.data}`);
            }
        }
        this.ws.onerror = (e) => {
            alert(`Ws:Error, ${e.message}`);
        }
    }
}

const toggleCamType = (type) => {
    return (type === Camera.Constants.Type.back)
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
};


class CameraView extends React.Component {
    constructor(props, ...rest) {
        super(props, ...rest);
        this.state = {
            mode: 'stopped',
            hasPermission: false,
        }
        
        const { connectionInfo } = props;
        
        this.camRef = React.createRef();
        this.serverHost = `${connectionInfo.addresses[0]}:8080`;
        this.srv = new HandlerServer(this.serverHost, this);
    }

    componentDidMount() {
        const fn = async () => {
            const { status } = await Camera.requestPermissionsAsync();
            await alertIfRemoteNotificationsDisabledAsync();
            this.setState({
                hasPermission: status === 'granted',
            });
        }
        fn();
        this.srv.start();
    }

    startRecording() {
        const options = {
            quality: '1080p',
        };
        this.camRef.recordAsync(options).then(data => {
            const targetUrl = `http://${this.serverHost}/upload`;
            alert('uploading file to: ' + targetUrl + ', file: ' + JSON.stringify(data, null, 4));
            uploadFile(data.uri, targetUrl);
        }).catch(err => {
            alert(JSON.stringify(err, null, 4));
        });
        this.setState({ mode: 'recording' });
    }

    stopRecording() {
        this.camRef.stopRecording();
        this.setState({ mode: 'stopped' });
    }

    toggleRecording() {
        const { mode } = this.state;
        if (mode === 'stopped') {
            this.startRecording();
        }
        if (mode === 'recording') {
            this.stopRecording();
        }
    }

    render() {
        const type = Camera.Constants.Type.back;
        const { hasPermission, mode } = this.state;

        if (hasPermission === null) {
            return <Text>Fallo al consultar permisos</Text>;
        }
        if (hasPermission === false) {
            return <Text>No se concedió permiso para usar la cámara</Text>;
        }
        
        return (
            <View style={styles.container}>
                <Camera
                    style={styles.camera}
                    type={type}
                    ref={(ref) => this.camRef = ref}
                >
                    <View
                        style={styles.cameraInsideContainer}>
                        <TouchableOpacity
                            style={styles.flipButton}
                            onPress={() => {this.toggleRecording()}}>
                            <Text style={styles.flipButtonText}> Grabar </Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
                {null && <View style={{ flex: 1 }}>
                    <Button onPress={() => this.toggleRecording()} title={mode === 'stopped' ? 'Grabar' : 'Detener'} />
                </View>}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderColor: '#0F0',
        borderWidth: 1
    },
    camera: {
        // flex: 1,
        width: '100%',
        height: '100%'
    },
    cameraInsideContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'row',
    },
    flipButton: {
        flex: 0.3,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    flipButtonText: {
        fontSize: 18,
        marginBottom: 10,
        color: 'white'
    }
});


export default CameraView;
