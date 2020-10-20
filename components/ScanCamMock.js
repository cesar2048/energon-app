import React from 'react';
import { StyleSheet, TouchableHighlight, View, Text } from 'react-native';

export default function ScanCamera({
    onScanSuccess,
}) {
    return (
        <TouchableHighlight onPress={onScanSuccess}>
            <View style={styles.camera}>
                <Text>Tap to simulte scanned complete</Text>
            </View>
        </TouchableHighlight>
    );
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
