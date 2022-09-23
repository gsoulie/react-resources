
[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Listes

## ScrollView et FlatList

Il existe différents types de liste sous React Native.

````ScrollView```` n'est pas adapté pour les listes contenant beaucoup de données. En effet, *ScrollView* réalise le rendu de tous les items même s'ils ne sont pas visibles à l'écran.

Pour les longues listes de données, il est recommandé d'utiliser les ````FlatList```` qui font du lazy-loading

**A savoir** : FlatList détecte si le dataset contient une propriété 'key'. Si c'est le cas il l'utilise comme clé pour identifier chaque élément.

Dans le cas contraire il suffit d'ajouter une propriété ````keyExtractor```` pour indiquer à React quel champs il doit utiliser en tant que *key*

````html
 <FlatList
              data={dataList}
              keyExtractor={(item, index) =>{ return item.id }}
````
