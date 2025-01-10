[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

Gestion des cookies

# Règle code serveur

Lorsque depuis du code serveur, on appelle du code serveur, il arrive que l'on perde les cookies. 

Une des solutions peut être de transmettre les cookies en paramètres


## Session active

Tester si une session est active

*cookie.service.ts*
````typescript
export const sessionIsActive = (): boolean => {
  try {
    const cookieStore = cookies();
    const tokenCookie = cookieStore.get(CustomKeys.token);
    return tokenCookie ? true : false;
  } catch (e) {
    return false;
  }
};
````

*page.tsx*
````typescript
export default async function Page({ }: {}) {
  if (sessionIsActive()) {
    // On le renvoi vers le dashboard
    return redirect(routes.pages.market);
  }
  
  return (
    <AuthWrapper>
      <LoginForm />
    </AuthWrapper>
  );
}
````
