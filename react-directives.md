
[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Directives structurelles

## for

## if

````jsx
<View style={css.container}>
      <Button title='Add new user' color="#5e0acc" onPress={showModal}></Button>
      
      {
        modalIsVisible && <InputForm addItemEvent={addNewItem}></InputForm>
      }
</View>
````
