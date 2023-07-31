# Exemple de gestion basique de formulaire

Ces deux exemples présentent 2 solutions de gestion de validation des champs d'un formulaire.

* Le premier exemple **SimpleInput** utilise la validation basée sur un custom hook utilisant des states (un pour la valeur et un pour la notion de champ "touched")
* Le second exemple **BasicForm** reprend le premier exemple en refactorisant le custom hook pour qu'il utilise un *useReducer* au lieu des *useState*

Les custom hooks présentés sont génériques et peuvent être améliorés ou réutilisés tels quels
