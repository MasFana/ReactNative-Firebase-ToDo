import { StatusBar } from 'expo-status-bar';
import './global.css'

import { View, Text, TextInput, Button, ScrollView, Modal, ActivityIndicator, Alert } from "react-native";
import { db, collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, updateDoc } from "./firebase";
import { useEffect, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [currentTodoId, setCurrentTodoId] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editInput, setEditInput] = useState("");
  const [loading, setLoading] = useState(false);
  // Mengambil data todo dari Firestore
  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTodos(snapshot.docs.map((doc) => ({ id: doc.id, timestamp: doc.data().timestamp.toDate(), text: doc.data().text })));
    });
    setLoading(false);

    return unsubscribe;
  }, []);

  // Fungsi untuk menambah todo baru
  const addTodo = async () => {
    if (input.trim()) {
      await addDoc(collection(db, "todos"), {
        text: input,
        timestamp: new Date(),
      });
      setInput("");
    }
  };

  // Fungsi untuk menghapus todo
  const deleteTodo = async (id) => {
    Alert.alert(
      'Yakin ingin menghapus?',
      'Tindakan ini tidak bisa dibatalkan.',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: async () => {
            await deleteDoc(doc(db, "todos", id));
          }
        }
      ]
    );
  };

  // Fungsi untuk membuka popup edit
  const openEditModal = (id, text) => {
    setEditInput(text);
    setCurrentTodoId(id);
    setEditModalVisible(true);
  };

  // Fungsi untuk menyimpan perubahan saat edit
  const saveEdit = async () => {
    if (editInput.trim()) {
      await updateDoc(doc(db, "todos", currentTodoId), {
        text: editInput,
      });
      setEditModalVisible(false);
      setEditInput("");
      setCurrentTodoId(null);
      setEditModalVisible(false);
    }
  };

  // Fungsi untuk membatalkan edit
  const cancelEdit = () => {
    setEditModalVisible(false);
    setEditInput("");
    setCurrentTodoId(null);
  };

  return (
    <SafeAreaView className='flex-1 p-2 pt-6'>
      <StatusBar style='auto' />

      <Text className='font-bold text-3xl text-center mb-4'>Fana's Todo</Text>
      <TextInput
        className='flex-wrap border border-gray-500 p-2 mb-2 rounded-sm'
        placeholder="Tambah tugas baru..."
        value={input}
        onChangeText={(text) => setInput(text)}
      />
      <Button title="Tambah" onPress={addTodo} />

      <ScrollView className='flex-1 mt-2'>
        {todos.map((item) => (
          <View key={item.id} className='py-2 mt-1 flex-row border-b border-gray-300'>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, flexWrap: 'wrap' }}>{item.text}</Text>
              <Text style={{ fontSize: 12, color: 'gray' }}>{item.timestamp.toString()}</Text>
            </View>
            <View className='content-center'>
              <View className='ml-auto flex-row gap-2'>
                <Button title="Edit" onPress={() => openEditModal(item.id, item.text)} />
                <Button title="Hapus" onPress={() => deleteTodo(item.id)} />
              </View>
            </View>
          </View>
        ))}
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
      </ScrollView>

      {/* Modal untuk Edit Todo */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={cancelEdit}
      >
        <View className='h-full justify-center items-center px-4'>
          <View className='w-full border bg-white border-gray-300 p-4 rounded-sm shadow-lg'>
            <Text className='font-bold text-2xl text-center mb-2'>Edit Tugas</Text>
            <TextInput
              className='flex-wrap border border-gray-300 p-2 mb-2 w-full rounded-sm'
              placeholder="Edit tugas..."
              value={editInput}
              onChangeText={(text) => setEditInput(text)}
            />
            <View className='flex-row mt-4 ml-auto gap-2'>
              <Button title='Cancel' onPress={cancelEdit} />
              <Button title='Save' onPress={saveEdit} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
}
