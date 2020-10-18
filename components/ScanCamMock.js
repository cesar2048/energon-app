import React from 'react';
import { StyleSheet, TouchableHighlight, View } from 'react-native';

export default function ScanCamera({
    onScanSuccess,
}) {
    return (
        <TouchableHighlight onPress={onScanSuccess}>
            <View style={styles.camera}>
            </View>
        </TouchableHighlight>
    );
}

const styles = StyleSheet.create({
    camera: {
        backgroundColor: '#4CDAFB',
        width: '100%',
        height: '100%'
    },
});
