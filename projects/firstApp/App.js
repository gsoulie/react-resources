import { View, FlatList, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { css } from './styles';
import { InputForm } from './components/Form';
import { ResultItem } from './components/ResultItem';
import { useState } from 'react';

export default function App() {
  const [data, setData] = useState([]); // création du state
  const [modalIsVisible, setModalIsVisible] = useState(false);

  function showModal() {
    setModalIsVisible(true);
  }
  function hideModal() {
    setModalIsVisible(false);
  }
  function addNewItem(newData) {
    //setData([...data, newData]);  // pas la meilleure solution de mettre à jour le state
    setData(currentData => [...currentData, { id: Date.now(), username: newData }]);  // BONNE PRATIQUE pour mettre à jour le state. Utiliser une arrow function (qui contient ici currentData comme param et qui contient le state courant)
    hideModal();
  }
  function deleteUserHandler(id) {
    setData(currentData => currentData.filter(i => i.id !== id))
  }

  return (
    <>
    <StatusBar style='light'></StatusBar>
    <View style={css.container}>
      <Button title='Add new user' color="#590FB7" onPress={showModal}></Button>

      <InputForm
        addItemEvent={addNewItem}
        visible={modalIsVisible}
        closeModal={hideModal}>
      </InputForm>

      <View style={css.listContainer}>
        <FlatList
          data={data}
          keyExtractor={(item, index) => { return item.id }}
          renderItem={(itemData) => {
            return (
              <ResultItem
                item={itemData.item}
                id={itemData.item.id}
                onDeleteItem={deleteUserHandler}>              
              </ResultItem>
            )
          }}
        ></FlatList>
        {/* <ScrollView>      
            {dataList.map((user) =>
                <Text
                    style={local.item}
                    key={user.id}>
                    {user.id} - {user.username}
                </Text>)
            }
          </ScrollView> */}
      </View>
      </View>
    </>
  );
}
