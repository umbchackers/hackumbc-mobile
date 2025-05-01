import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { createApi } from '../../lib/api';
import { User } from '@/types/User';
import Modal from 'react-native-modal';
import NfcManager, { Ndef, NfcTech } from 'react-native-nfc-manager';

export default function ScanScreen() {
  const { idToken } = useAuth();
  const api = createApi(idToken);

  const [email, setEmail] = useState('');
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isNfcModalVisible, setIsNfcModalVisible] = useState(false);
  const [isNfcDialogVisible, setIsNfcDialogVisible] = useState(false);
  const [isSuccessDialogVisible, setIsSuccessDialogVisible] = useState(false);
  const [isFailureDialogVisible, setIsFailureDialogVisible] = useState(false);
  const [isCheckedDialogVisible, setIsCheckedDialogVisible] = useState(false);
  const [isServerFailureDialogVisible, setIsServerFailureDialogVisible] = useState(false);

  const hideNfcDialog = () => {setIsNfcDialogVisible(false);}
  const hideSuccessDialog = () => {setIsSuccessDialogVisible(false);}
  const hideFailureDialog = () => {setIsFailureDialogVisible(false);}
  const hideCheckedDialog = () => {setIsCheckedDialogVisible(false);}
  const hideServerFailureDialog = () => {setIsServerFailureDialogVisible(false);}

  const handleLookup = async () => {
    setLoading(true);
    setError(null);
    setUserInfo(null);

    try {
      const response = await api.post<{ body: string }>('/admin/users', { email }, false);
      setUserInfo(JSON.parse(response.body));

    } catch (err) {
      console.error('Lookup failed', err);
      setError('User not found or error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const assignNfc = async () => {
    let result = false;
      if (Platform.OS !== 'ios') {
        setIsNfcModalVisible(true);
      }
    
      try {
        await NfcManager.requestTechnology(NfcTech.Ndef);
    
        const bytes = Ndef.encodeMessage([Ndef.textRecord(email)]);
        setIsNfcDialogVisible(true);
        setShowModal(true);
    
        if (bytes) {
          await NfcManager.ndefHandler.writeNdefMessage(bytes);

          result = true;
        }
        result = true;
        
      } catch (err: any | null) {
        console.log(err?.message);
      } finally {
        await stopNfcScan();
      }
    
      return result;
  }

  const stopNfcScan = async () => {
    try {
      NfcManager.cancelTechnologyRequest();
    }
    catch(err) {}
    finally {
      setIsNfcModalVisible(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan - Get User Info</Text>

      <TextInput
        placeholder="Enter user email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <Button
        title={loading ? 'Looking up...' : 'Lookup User'}
        onPress={handleLookup}
        disabled={loading || email.length === 0}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      {userInfo && (
        <View style={styles.userInfo}>
          <Text style={styles.userText}>Name: {userInfo.full_name}</Text>
          <Text style={styles.userText}>Age: {userInfo.age}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.iconButtonSubmit} onPress={assignNfc}>
          <Text>Assign NFC</Text>
        </TouchableOpacity>
      <Modal
          animationIn={"slideInUp"}
          isVisible={showModal}
          onModalWillHide={() => setShowModal(false)}
        >
        <View>
          <View>
            <Text>"{email}" has been written to the NFC successfully!</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        animationIn={"slideInUp"}
        isVisible={showModal}
        onModalWillHide={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>"{email}" has been written to the NFC successfully!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isNfcDialogVisible}
        onBackdropPress={hideNfcDialog}
      >
        <View style={styles.NfcDialogContainer}>
          <Text style={styles.NfcDialogText}>Scanned {email}</Text>
          <Button title="Close" onPress={hideNfcDialog} />
        </View>
      </Modal>
      <Modal
        isVisible={isSuccessDialogVisible}
        onBackdropPress={hideSuccessDialog}
      >
        <View style={styles.successDialogContainer}>
          <Text style={styles.successDialogText}> {"Successfully Scanned \n\n"}{email} </Text>
        </View>
      </Modal>
      <Modal
        isVisible={isFailureDialogVisible}
        onBackdropPress={hideFailureDialog}
      >
        <View style={styles.failureDialogContainer}>
          <Text style={styles.failureDialogText}>User {email} {"\n\n Not Found"}</Text>
        </View>
      </Modal>
      <Modal
        isVisible={isCheckedDialogVisible}
        onBackdropPress={hideCheckedDialog}
      >
        <View style={styles.failureDialogContainer}>
          <Text style={styles.failureDialogText}>User {email} {"\n\n Already Checked In\n\n"}</Text>
        </View>
      </Modal>

      <Modal
        isVisible={isServerFailureDialogVisible}
        onBackdropPress={hideServerFailureDialog}
      >
        <View style={styles.failureDialogContainer}>
          <Text style={styles.failureDialogText}>Server Error:{"\n"}{errorMsg}</Text>
        </View>
      </Modal>
      <Modal
          animationIn={"slideInUp"}
          isVisible={isNfcModalVisible}
          onModalWillHide={stopNfcScan}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Waiting for NFC...</Text>
              <TouchableOpacity
                onPress={stopNfcScan}
              >
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 15,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  userInfo: {
    marginTop: 20,
  },
  userText: {
    fontSize: 18,
    marginBottom: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
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
  NfcDialogContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  NfcDialogText: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  successDialogContainer: {
    backgroundColor: 'rgba(0, 75, 0, 0.7)',
    borderRadius: 10,
    paddingTop: 30,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successDialogText: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  failureDialogContainer: {
    backgroundColor: 'rgba(75, 0, 0, 0.7)',
    borderRadius: 10,
    paddingTop: 30,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  failureDialogText: {
    fontSize: 25,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
});