import React from 'react'
import {
    TouchableOpacity,
    View,
    Text,
    Button,
    StyleSheet
} from 'react-native';
import { Camera } from 'expo-camera';
// import * as Permissions from 'expo-permissions';

/*async function alertIfRemoteNotificationsDisabledAsync() {
    const { status, ...rest } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    if (status !== 'granted') {
        alert('Hey! You might want to enable notifications for my app, they are good...' + JSON.stringify(rest));
    }
}
*/
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
    
    let response = await res.text();
    return response;
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
        this.ws.onclose= () => {
            this.controller.onServerDisconnected();
        }
        this.ws.onerror = (e) => {
            this.controller.onServerDisconnected();
            // alert(`Ws:Error, ${e.message}`);
        }
    }
}

const Modes = {
    STOPPED: 'stopped',
    RECORDING: 'recording',
    UPLOADING: 'uploading',
    INVALID: 'invalid',
}

class CameraView extends React.Component {
    constructor(props, ...rest) {
        super(props, ...rest);
        this.state = {
            mode: Modes.STOPPED,
            hasPermission: false,
            statusText: '',
        }
        
        const { connectionInfo } = props;
        
        this.serverHost = `${connectionInfo.addresses[0]}:8080`;
        this.camRef = React.createRef();
        this.srv = new HandlerServer(this.serverHost, this);
    }

    componentDidMount() {
        const fn = async () => {
            const { status } = await Camera.requestPermissionsAsync();
            const hasPermission = (status === 'granted');

            // await alertIfRemoteNotificationsDisabledAsync();
            this.setState({ hasPermission });
        }
        fn();
        
        this.srv.start();
    }

    startRecording() {
        const options = {
            quality: '1080p',
        };
        this.camRef.recordAsync(options)
        .then(data => {
            const targetUrl = `http://${this.serverHost}/upload`;
            this.setState({ mode: Modes.UPLOADING, statusText:  `Uploading file to server... ${JSON.stringify(data)}`})
            return uploadFile(data.uri, targetUrl);
        }).then(result => {
            this.setState({ mode: Modes.STOPPED, statusText:  '' });
        }).catch(err => {
            throw err;
        });

        this.setState({ mode: Modes.RECORDING });
    }

    stopRecording() {
        this.camRef.stopRecording();
        this.setState({ mode: Modes.STOPPED });
    }

    toggleRecording() {
        const { mode } = this.state;
        if (mode === Modes.STOPPED) {
            this.startRecording();
        }
        if (mode === Modes.RECORDING) {
            this.stopRecording();
        }
    }

    onServerDisconnected() {
        const { mode } = this.state;
        if (mode != Modes.INVALID) {
            this.setState({
                mode: Modes.INVALID
            }, function() {
                const { onDisconnect } = this.props;
                if (typeof onDisconnect === 'function') {
                    onDisconnect();
                }
            });
        }
    }

    render() {
        const type = Camera.Constants.Type.back;
        const { hasPermission, mode, statusText } = this.state;

        if (hasPermission === null) {
            return <Text>Fallo al consultar permisos</Text>;
        }
        if (hasPermission === false) {
            return <Text>No se concedió permiso para usar la cámara</Text>;
        }
        if (mode === Modes.INVALID) {
            return <Text>Component invalid</Text>;
        }
        
        return (
            <View style={styles.container}>
                <Camera
                    style={styles.camera}
                    type={type}
                    ref={(ref) => this.camRef = ref}
                >
                    <View style={styles.cameraInsideContainer}>
                        <Text style={styles.statusText}>{statusText}</Text>
                        <Text style={styles.modeText}>{mode}</Text>
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
    statusText: {
        fontSize: 18,
        color: 'white'
    },
    modeText: {
        fontSize: 18,
        color: 'red'
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
