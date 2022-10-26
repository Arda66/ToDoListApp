import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ASYNC STORAGE EKLE GELİNCE
const App = () => {
  const [List, setList] = useState([]);
  const [Task, setTask] = useState('');
  const [isDeleted, setisDeleted] = useState(false);
  const [currIndex, setcurrIndex] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('TaskList')
      .then(data => {
        data != null && setList(JSON.parse(data));
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  const renderItem = ({item, index}) => {
    return (
      <View style={styles.ItemWrapper}>
        <Text
          style={[
            {maxWidth: '90%', color: 'black', letterSpacing: 0.2},
            isDeleted === true &&
              index == currIndex && {
                textDecorationLine: 'line-through',
              },
          ]}>
          {index + 1}-) {item}
        </Text>
        <TouchableOpacity
          onPress={() => {
            DeleteItem(item, index);
          }}>
          <MaterialCommunityIcon name="delete" size={30} color="red" />
        </TouchableOpacity>
      </View>
    );
  };

  const DeleteItem = (item, index) => {
    Alert.alert(
      'Are you sure you want to delete this item?',
      `Task : ${item} `,
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            setcurrIndex(index);
            setisDeleted(true);
            setTimeout(async () => {
              let temp = [...List];
              temp.splice(index, 1);
              setList(temp);
              setcurrIndex(null);
              await AsyncStorage.setItem('TaskList', JSON.stringify(temp));
            }, 500);
          },
        },
      ],
      {cancelable: false},
    );
  };
  const AddTask = async () => {
    if (Task.trim() != 0 && Task.length > 0) {
      if (List.includes(Task)) {
        Alert.alert(
          'This task is already added.',
          'Please add different task.',
        );
      } else {
        setList([...List, Task.trim()]);
        setTask('');
        await AsyncStorage.setItem(
          'TaskList',
          JSON.stringify([...List, Task.trim()]),
        );
      }
    } else
      Alert.alert('Please write your task first !', 'Then press add Button.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback
        style={{flex: 1}}
        onPress={() => {
          Keyboard.dismiss();
        }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          {/* Title */}
          <View style={styles.textWrapper}>
            <Text style={styles.title}>Today's Task</Text>
          </View>
          {/* To Do List */}
          <View style={styles.ListWrapper}>
            <FlatList data={List} renderItem={renderItem} />
          </View>
          {/* Adding Tasks Part */}
          <View style={styles.ButtonWrapper}>
            <TextInput
              style={styles.TextInput}
              value={Task}
              onChangeText={text => setTask(text)}
              placeholder="Write your tasks here..."
              placeholderTextColor={'gray'}
            />
            <TouchableOpacity style={styles.Button} onPress={AddTask}>
              <Text style={styles.ButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e6eb',
  },
  textWrapper: {
    marginTop: 50,
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    fontFamily: 'Montserrat-SemiBold',
    color: '#2471b5',
  },
  ListWrapper: {
    marginTop: 40,
    paddingHorizontal: 20,
    flex: 1,
  },
  ButtonWrapper: {
    flexDirection: 'row',
    flex: 0.15,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 55,
    paddingTop: 25,
  },
  Button: {
    backgroundColor: '#86afd9',
    width: 100,
    height: 45,
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
  TextInput: {
    borderColor: '#355bde',
    borderWidth: 2,
    color: 'black',
    borderRadius: 20,
    width: 200,
    height: 45,
    padding: 10,
  },
  ItemWrapper: {
    flexDirection: 'row',
    Width: '50%',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 20,
    borderColor: '#667abd',
    borderWidth: 2,
    marginVertical: 15,
    backgroundColor: '#fff',
  },
});

export default App;