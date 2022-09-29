
[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Preassable

Indiquer à React Native qu'un élément est clickable en utilisant un composant de type **Pressable** ou **Touchable**

````import { Pressable, Touchable } from 'react-native';````

Il suffit ensuite d'encadrer l'élément souhaité dans une balise ````<Pressable>````

````jsx
<View style={local.item}>
  <Pressable
	android_ripple={{ color: '#dddddd'}}
	onPress={props.onDeleteItem.bind(this, props.id)}
	style={({pressed}) => pressed && StyleSheet.iOsPressedItem}
  >
	<Text style={local.itemText}>{props.item.id} - {props.item.username}</Text>
  </Pressable>
</View>
````
