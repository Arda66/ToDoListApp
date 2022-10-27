import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
const EditTask = ({route}) => {
  const {Task, index, NewList} = route.params;
  const [EditedTask, setEditedTask] = useState(Task);

  const ApplyPressed = async () => {
    if (EditedTask.trim().length > 0 && EditedTask != Task) {
      if (NewList.includes(EditedTask))
        Alert.alert('Task Already Exists', 'Please Enter a New Task');
      else {
        NewList[index] = EditedTask.trim();
        await AsyncStorage.setItem('TaskList', JSON.stringify(NewList));
        ToastAndroid.show('Task Edited successfully!', ToastAndroid.SHORT);
        temp_Activeness = true;
        navigation.navigate('MainMenu', {NewList: NewList});
      }
    } else Alert.alert('Error!', 'Task can not be empty or same!');
  };
  const CancelPressed = () => {
    ToastAndroid.show('Task edit cancelled!', ToastAndroid.SHORT);
    navigation.navigate('MainMenu');
  };
  return (
    <View style={{flex: 1}}>
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <View style={{flex: 1, padding: 15, marginTop: 80}}>
            <Text
              style={{
                color: 'blue',
                fontWeight: 'bold',
                fontSize: 21,
                textAlign: 'center',
                bottom: 40,
              }}>
              Edit The Task then press the Button!
            </Text>
            <TextInput
              style={{
                borderColor: '#355bde',
                borderWidth: 2,
                color: 'black',
                borderRadius: 20,
                padding: 10,
                maxHeight: '50%',
                lineHeight: 30,
              }}
              placeholder="Edit your tasks here..."
              placeholderTextColor={'gray'}
              multiline={true}
              value={EditedTask}
              onChangeText={text => setEditedTask(text)}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: 40,
              }}>
              <TouchableOpacity
                style={styles.Button}
                onPress={() => {
                  ApplyPressed();
                }}>
                <FontAwesome5Icon name="check" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.Button}
                onPress={() => {
                  CancelPressed();
                }}>
                <FontAwesomeIcon name="times" size={30} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  Button: {
    backgroundColor: '#86afd9',
    width: 100,
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6392c2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonText: {
    fontWeight: 'bold',
    color: 'white',
    fontSize: 20,
  },
});

export default EditTask;
