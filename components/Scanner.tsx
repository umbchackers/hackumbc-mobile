import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Camera, useCodeScanner, useCameraPermission, useCameraDevice } from 'react-native-vision-camera'
import Modal from 'react-native-modal';

const windowWidth = Dimensions.get('window').width;

export default function Scanner({ onScanned }: { onScanned: (payload: string) => void }) {
    const [showModal, setShowModal] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const showCamera = () => {
        setShowModal(true);
        setCameraActive(true);
    }
    const hideCamera = () => {
        setShowModal(false);
        setCameraActive(false);
    }

    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back')!;
    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes) => {
            if (codes.length == 1) {
                const code = codes[0];
                console.log(code.value);
                onScanned(code.value ?? 'Empty payload');
            }
            else {
                console.log('Why tf are there multiple codes...?');
            }
            hideCamera();
        }
    });

    useEffect(() => {
        if (!hasPermission) {
            requestPermission();
        }
    }, []);

    return (
        <>
            {hasPermission && <TouchableOpacity style={styles.iconButtonSubmit} onPress={showCamera}>
                <Text>Scan</Text>
            </TouchableOpacity>}
            {!hasPermission && <Text>Camera requires permission to use</Text>}
            <Modal
                animationIn={"slideInUp"}
                isVisible={showModal}
                style={styles.cameraContainer}
                onModalHide={hideCamera}
            >
                {hasPermission && 
                <Camera 
                    style={styles.camera}
                    codeScanner={codeScanner} 
                    device={device}
                    isActive={cameraActive}
                    photo={true}
                    preview={true}
                    resizeMode={"cover"}
                />}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={hideCamera}
                >
                    <Text>Close</Text>
                </TouchableOpacity>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
    flex: 1
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
  cameraContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth,
    height: windowWidth,
    margin: 0,
  },
  camera: {
    position: 'relative',
    width: windowWidth - 50,
    height: windowWidth,
  },
  iconButtonSubmit: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#08a32f',
    borderRadius: 25,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  closeButton: {
    marginTop: 75,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: 100,
    backgroundColor: '#efefef',
    borderRadius: 25,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
});