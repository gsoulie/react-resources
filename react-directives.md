
[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Directives structurelles

## for

La directive *for* est différente de ce qu'on peut trouver sous Angular, Vue... Elle prend en paramètre une liste de donnée ````data={dataset}```` ainsi qu'une fonction qui va retourner le rendu ````renderItem={(item) => { return (...) }}````

````jsx
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
````

## if

````jsx
<View style={css.container}>
      <Button title='Add new user' color="#5e0acc" onPress={showModal}></Button>
      
      {
        modalIsVisible && <InputForm addItemEvent={addNewItem}></InputForm>
      }
</View>
````
