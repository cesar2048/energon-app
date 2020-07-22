import React, { useState, useEffect, useRef } from 'react'
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

const URL = 'http://192.168.2.72:8080/upload';

const uploadFile = async (path) => {
    const data = new FormData();
    // data.append('name', 'theFile');
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
    
    let response = await res.text();
    if (response.status === 1) {
        alert(response.data);
    } else {
        alert('Error')
    }
};

const CameraView = () => {
    let camRef = useRef(null);
    const [hasPermission, setHasPermission] = useState(null);
    const [mode, setMode] = useState('stopped');
    const [type, setType] = useState(Camera.Constants.Type.back);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            setHasPermission(status === 'granted');
            await alertIfRemoteNotificationsDisabledAsync();
        })();
    }, []);


    if (hasPermission === null) {
        return <Text>No se nada</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    const record = () => {
        if (mode === 'stopped') {
            camRef.recordAsync().then(data => {
                alert(JSON.stringify(data, null, 4));
                uploadFile(data.uri);
            }).catch(err => {
                alert(JSON.stringify(err, null, 4));
            });
            setMode('recording');
        }
        if (mode === 'recording') {
            camRef.stopRecording();
            setMode('stopped');
        }
    };

    return (
        <View style={{ flex: 1, borderColor: '#0F0', borderWidth: 1 }}>
            <Camera style={{ flex: 15 }} type={type} ref={(ref) => camRef = ref} >
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
                <Button onPress={record} title={mode === 'stopped' ? 'Grabar' : 'Detener'} />
            </View>
        </View>
    )
}

export default CameraView;
