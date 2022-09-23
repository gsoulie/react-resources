import { View, Text, Pressable } from "react-native";
import { StyleSheet } from 'react-native';

// export const ResultItem = ({item, onDeleteItem}) => {
export const ResultItem = (props) => {
 
  return (
    <View style={local.item}>
      <Pressable
        android_ripple={{ color: '#dddddd'}}
        onPress={props.onDeleteItem.bind(this, props.id)}
        style={({pressed}) => pressed && StyleSheet.iOsPressedItem}
      >
        <Text style={local.itemText}>{props.item.id} - {props.item.username}</Text>
      </Pressable>
    </View>
  );
}

const local = StyleSheet.create({
  item: {   
    backgroundColor: "#5e0acc",
    margin: 8,
    borderRadius: 6,
  },
  itemText: {
    color: "#ffffff",
    padding: 10
  },
  iOsPressedItem: {
    opacity: 0.5
  }
})
