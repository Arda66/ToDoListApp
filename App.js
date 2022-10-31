import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import EditTask from './components/screen/EditTask';
import {useNavigation} from '@react-navigation/native';

const App = () => {
  const [List, setList] = useState([]);
  const [Task, setTask] = useState('');
  const [isDeleted, setisDeleted] = useState(false);
  const [currIndex, setcurrIndex] = useState(null);
  const Stack = createNativeStackNavigator();
  global.temp_Activeness = false;
  useEffect(() => {
    AsyncStorage.getItem('TaskList')
      .then(data => {
        data != null && setList(JSON.parse(data));
      })
      .catch(err => {
        console.log(err);
      });
    console.log('main useEffect');
  }, []);

  const renderItem = ({item, index}) => {
    {
      return Task.length == 0 ? (
        <View style={styles.ItemWrapper}>
          <Text
            style={[
              {maxWidth: '75%', color: 'black', letterSpacing: 0.2},
              isDeleted === true &&
                index == currIndex && {
                  textDecorationLine: 'line-through',
                },
            ]}>
            {index + 1}-) {item}
          </Text>
          <TouchableOpacity
            style={{position: 'absolute', left: '80%'}}
            onPress={() => {
              navigation.navigate('EditTask', {
                Task: item,
                index: index,
                NewList: List,
              });
            }}>
            {console.log('re-render Item')}
            <AntDesignIcon name="edit" size={30} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              DeleteItem(item, index);
            }}>
            <MaterialCommunityIcon name="delete" size={30} color="red" />
          </TouchableOpacity>
        </View>
      ) : null;
    }
  };

  const DeleteItem = (item, index) => {
    Alert.alert(
      'Are you sure you want to delete this task?',
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
    console.log('Task : ', Task);
    if (Task.trim() != 0 && Task.length > 0) {
      if (List.includes(Task)) {
        Alert.alert(
          'This task is already added.',
          'Please add different task.',
        );
        setTask('');
        Keyboard.dismiss();
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
    Keyboard.dismiss();
  };

  // const TextInputArea = ({Task, changeText}) => {
  //   return (
  //     <TextInput
  //       style={styles.TextInput}
  //       value={Task}
  //       onChangeText={text => changeText}
  //       placeholder="Write your tasks here..."
  //       placeholderTextColor={'gray'}
  //     />
  //   );
  // };
  const searchInput = React.useRef(null);

  const MainMenu = ({route}) => {
    useEffect(() => {
      if (route.params != undefined && temp_Activeness == true) {
        AsyncStorage.getItem('TaskList')
          .then(data => {
            data != null && setList(JSON.parse(data));
          })
          .catch(err => {
            console.log(err);
          });
        console.log('MainMenu useEffect');
        temp_Activeness = false;
      }
    }, [route.params]);

    useEffect(() => {
      if (Task.length != 0) searchInput?.current?.focus();
    }, [Task]);

    global.navigation = useNavigation();
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
              {console.log('re-render main#####')}
            </View>
            {/* Adding Tasks Part */}
            <View style={styles.ButtonWrapper}>
              <TextInput
                ref={searchInput}
                style={styles.TextInput}
                value={Task}
                onChangeText={text => setTask(text)}
                placeholder="Write your tasks here..."
                placeholderTextColor={'gray'}
              />
              {/* <TextInputArea Task={Task} changeText={text => setTask(text)} /> */}
              {/* {TextInputArea(Task, text => setTask(text))} */}
              <TouchableOpacity style={styles.Button} onPress={AddTask}>
                <Text style={styles.ButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  };
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainMenu"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="MainMenu" component={MainMenu} />
        <Stack.Screen name="EditTask" component={EditTask} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e6eb',
  },
  textWrapper: {
    marginTop: 30,
    alignItems: 'center',
    top: 10,
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
