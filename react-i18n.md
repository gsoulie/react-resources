[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# i18n

## Installation

````
npm install i18next react-i18next i18next-browser-languagedetector
````

## Configuration

Créer un fichier *i18n.js* dans le projet

*i18n.js*

````typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          menu: {
            title: 'My great App !',
            welcome: 'Welcome to my very cool app !'
          },
		  product: {
			title: 'Product page'
		  }
        }
      },
      fr: {
        translation: {
          menu: {
            title: 'Ma super application !',
            welcome: 'Bienvenue sur ma super appli !'
          },
		  product: {
			title: 'Page produit'
		  }
        }
      }
    }
  });

export default i18n;
````

*main.tsx*

````typescript

import ReactDOM from 'react-dom/client'
import './index.scss'
import { routes } from './app-routing'
import { RouterProvider } from 'react-router-dom';

import './shared/i18n';	// <-- import i18n


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
<RouterProvider router={router} />
)

````

## Utilisation

*Menu.tsx*

````typescript
import { useTranslation, Trans } from 'react-i18next';


// Facultatif : utilisation d'un switch pour les langues
const lngs = {
  en: { nativeName: 'English' },
  fr: { nativeName: 'French' }
};

export const Menu = () => {

  const { t, i18n } = useTranslation();

	return (
    <>  
	  <div>
	  <!-- BOUTON SWITCH LANGUE -->
	  {Object.keys(lngs).map((lng) => (
		<button 
		key={lng} 
		style={{ fontWeight: i18n.resolvedLanguage === lng ? 'bold' : 'normal' }} 
		type="submit" 
		onClick={() => i18n.changeLanguage(lng)}>
		  {lngs[lng].nativeName}
		</button>
	  ))}
	  </div>
	  
	  <h1>{t('menu.title')}</h1>
	  
	  <!-- autre écriture -->
	  <Trans i18nKey="menu.title"></Trans>
	</>
}
````
