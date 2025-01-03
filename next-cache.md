[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Gestion du cache

![nextjs-cache](https://github.com/user-attachments/assets/35b535d4-ab65-404a-9e18-7117d16b2bbc)

![nextjs-cache-doc](https://github.com/user-attachments/assets/6b8b9f33-e4a0-4105-8cbb-fd302091c259)

Par défaut, NextJS fait de la mise en cache agressive, c'est à dire qu'il pré-rend les pages et ne les mets plus à jour par la suite. 
Si le cas se présente, il faut alors dire à NextJS que certaines pages / composants doivent être re-rendus lorsque les données changent.

> Il est important de noter que la version 14 fait de la mise en cache plus aggressive que dans la version 15

## Request Memoization

Nextjs mémorise les requêtes **identiques** (2 requêtes pointant la même ressource mais avec des paramètres de header différents ne sont pas considérées comme identiques) et réutilisera la réponse partout dans l'application pour un même appel.


