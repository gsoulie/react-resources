[< Back to Redux](https://github.com/gsoulie/react-resources/blob/master/react-redux.md)    

# Redux Toolkit

Ceci est un exemple très basique sur la gestion de state avec Redux Toolkit.

Le répertoire **store** contient un fichier *index.ts* contenant l'objet store global, lui même étant composé de 2 reducers présents dans les fichiers *auth-slice.tsx* et *counter-slice.tsx*.

L'application présente un composant *Counter* permettant d'incrémenter / décrémenter un compteur depuis le state Redux. Ensuite un composant *UserProfile* est affiché en fonction de la valeur *isAuthenticated* gérée par le reducer *authSlice.reducer*, de même que le contenu du composant *Header*
