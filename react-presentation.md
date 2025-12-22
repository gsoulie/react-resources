[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development)    

# Next

````
npx create-next-app@latest --typescript myApp

√ Would you like to use ESLint? ... Yes
√ Would you like to use React Compiler? ... Yes // Améliore la performance en optimisant automatiquement le rendu des composants
√ Would you like to use Tailwind CSS? ... No
√ Would you like to use `src/` directory? ... No
√ Would you like to use App Router? (recommended) ... Yes // Sinon ne génère pas le rép app mais un rép pages à la place
√ Would you like to customize the default import alias (@/*)? ... No

npm run dev
````


* [Nouveautés NextJS](https://github.com/gsoulie/react-resources/blob/master/next-news.md)    
* [Udemy : NextJS The Complete Guide](https://github.com/gsoulie/react-resources/blob/main/next-udemy-complete-guide.md)     

* [Généralités](https://github.com/gsoulie/react-resources/blob/master/next-generalites.md)
  * [react-bootstrap classes display](https://getbootstrap.com/docs/5.1/utilities/flex/)
  * Stack recommandées
  * Librairies UI     
  * authentification
  * Bonnes pratiques
  * Suspense    
* [Gestion du cache et revalidation](https://github.com/gsoulie/react-resources/blob/master/next-cache.md)
* [Navigation](https://github.com/gsoulie/react-resources/blob/master/next-routing.md)
* [middleware et interceptor](https://github.com/gsoulie/react-resources/blob/master/next-middleware.md)    
* [Pré-render et Apis](https://github.com/gsoulie/react-resources/blob/master/next-render.md)
  * getStaticProps
  * getServerSideProps
  * getStaticPaths
  * CRUD Firebase
* [SEO](https://github.com/gsoulie/react-resources/blob/master/next-seo.md)     
* [api](https://github.com/gsoulie/react-resources/blob/master/next-api.md)     
* [SVG](https://github.com/gsoulie/react-resources/blob/master/next-svg.md)
* [SWR](https://github.com/gsoulie/react-resources/blob/master/next-swr.md)
* [Http](https://github.com/gsoulie/react-resources/blob/master/next-http.md)
  * Interceptor     
  * Middleware
  * Tanstack react-query
* [Gestion des erreurs](https://github.com/gsoulie/react-resources/blob/master/next-error.md)      
* [Page not-found](https://github.com/gsoulie/react-resources/blob/master/next-not-found.md)
* [Checkbox](https://github.com/gsoulie/react-resources/blob/master/next-checkbox.md)
* [Images](https://github.com/gsoulie/react-resources/blob/master/next-images.md)
* [Composant table avec tri sur colonne](https://github.com/gsoulie/react-resources/blob/main/next-server-page-best-practices/react-custom-table-with-sorting/Contacts.tsx)
* [Formulaires - ReactForm et Yup](https://github.com/gsoulie/react-resources/blob/master/next-forms.md)
* [Gestion des cookies](https://github.com/gsoulie/react-resources/blob/master/next-cookies.md)
* [Server actions](https://github.com/gsoulie/react-resources/blob/master/next-server-action.md)
* Composants
  * [Bouton panier avec popover au survol](https://github.com/gsoulie/react-resources/tree/main/react-cart-popover)
  * [Segment bouton](https://github.com/gsoulie/react-resources/blob/master/react-segment-button.md)           
* CMS headless : (https://strapi.io/)

<details>
  <summary>Détection mobile formfactor</summary>

````typescript
import { Box, useMediaQuery } from '@mui/material';
import { theme } from '@/theme/theme';
import Toolbar from './Toolbar';

const Layout = ({ children }) => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
     {!isMobile && <Toolbar />}
};
````
 
</details>

# React

*Création d'un projet*
````
npm create vite@latest
npm i
npm i sass
npm i react-router-dom
````

* [Généralités](https://github.com/gsoulie/react-resources/blob/master/react-generalites.md)    
  * Principes     
  * ViteJS    
  * props    
  * StrictMode    
  * Sass    
  * Généricité    
  * Tips     
  * Framework UI    
  * Variables d'environnement     
  * Déploiement
  * Icons     
  * Services
  * Définir le titre des pages     
* [Infinite scroll](https://www.youtube.com/watch?v=R1FG54FY-18&ab_channel=Joshtriedcoding)     
* [Redux](https://github.com/gsoulie/react-resources/blob/master/react-redux.md)     
* [Hooks](https://github.com/gsoulie/react-resources/blob/master/react-hooks.md)    
* [Forms](https://github.com/gsoulie/react-resources/blob/master/react-forms.md)    
* [Http](https://github.com/gsoulie/react-resources/blob/master/react-http.md)     
* [Firebase](https://github.com/gsoulie/react-resources/blob/master/react-firebase.md)     
* [Routing](https://github.com/gsoulie/react-resources/blob/master/react-routing.md)     
* [Local Storage](https://github.com/gsoulie/react-resources/blob/master/react-localstorage.md)     
* [Charts avec Nivo](https://github.com/gsoulie/react-resources/blob/master/react-chart.md)     
* [Rendering en dehors de la div root avec React Portal](https://www.youtube.com/watch?v=LyLa7dU5tp8&ab_channel=WebDevSimplified)
* [Authentification simple et Routage](https://github.com/gsoulie/react-resources/tree/main/projects/authentication-example)     
* [i18n](https://github.com/gsoulie/react-resources/blob/master/react-i18n.md)
* [Tests](https://github.com/gsoulie/react-resources/blob/master/react-test.md)
* [SVG](https://github.com/gsoulie/react-resources/blob/master/react-svg.md)
* [Components custom](https://github.com/gsoulie/react-resources/tree/main/react-components)     

# React Native

* [Généralités et présentation](https://github.com/gsoulie/react-resources/blob/master/react-concept.md)       
* [Directives structurelles](https://github.com/gsoulie/react-resources/blob/master/react-directives.md)     
* Composants
  * [Pressable](https://github.com/gsoulie/react-resources/blob/master/react-native-pressable.md)     
  * [Listes - ScrollView et FlatList](https://github.com/gsoulie/react-resources/blob/master/react-native-list.md)      
  * [StatusBar (expo)](https://github.com/gsoulie/react-resources/blob/master/react-native-statusbar.md)    
* [Projet example](https://github.com/gsoulie/react-resources/tree/main/projects/firstApp)     
