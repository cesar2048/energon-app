import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Button,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';

async function alertIfRemoteNotificationsDisabledAsync() {
    const { status, ...rest } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== 'granted') {
        alert('Hey! You might want to enable notifications for my app, they are good...' + JSON.stringify(rest));
    }
}

const URL = 'http://192.168.2.76:8080/upload';

const uploadFile = async (path) => {
    const data = new FormData();
    const name = path.substr(path.lastIndexOf('/') + 1);
    alert("name " + name);
    data.append('theFile', {
        type: 'video/mp4',
        uri: path,
        name,
    });

    let res = await fetch(URL, {
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
            alert('connected to server');
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


class CameraView extends React.Component {
    constructor(...args) {
        super(...args);
        this.state = {
            mode: 'stopped',
            hasPermission: false,
        }
        this.camRef = React.createRef();
        this.srv = new HandlerServer('192.168.2.76:8080', this);
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
            alert(JSON.stringify(data, null, 4));
            uploadFile(data.uri);
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
            return <Text>No se nada</Text>;
        }
        if (hasPermission === false) {
            return <Text>No access to camera</Text>;
        }
        
        return (
            <View style={{ flex: 1, borderColor: '#0F0', borderWidth: 1 }}>
                <Camera
                    style={{ flex: 1 }}
                    type={type}
                    ref={(ref) => this.camRef = ref}
                >
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            flexDirection: 'row',
                        }}>
                        <TouchableOpacity
                            style={{
                                flex: 0.1,
                                alignSelf: 'flex-end',
                                alignItems: 'center',
                            }}
                            onPress={() => {
                                setType(
                                    type === Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                );
                            }}>
                            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
                        </TouchableOpacity>
                    </View>
                </Camera>
                <View style={{ flex: 1 }}>
                    <Button onPress={() => this.toggleRecording()} title={mode === 'stopped' ? 'Grabar' : 'Detener'} />
                </View>
            </View>
        );
    }
}

export default CameraView;
