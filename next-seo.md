[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# SEO

## Static metadata

````typescript
export const metadata: Metadata = {
  title: "All meals",
  description: "Browse all meals",
  url: '',
  siteName: ''
};
````

## Dynamic metadata

Définir des metadatas pour une page dynamique (ex: *app/meal/[id]/page.tsx*)

````typescript
/**
 * Ajouter des metadata dynamiques
 */
export const generateMetadata = async ({ params }: { params: any }) => {
  const { id } = await params;

  const meal = getMeal(id) as Meal;

  if (!meal) {
    notFound();
  }

  return {
    title: meal.title,
    description: meal.summary,
  };
};
````

*autre exemple*

````typescript
export const generateMetadata = async () => {
  const posts = await getPosts();

  if (!posts) {
    notFound();
  }

  return {
    title: `Browse all our ${posts.length} posts`,
    description: 'Browse all our posts',
  };
};
````

## Rich snippets

*jsonLD.ts*
````typescript

// rich snippet for SEO on pages which call this component
const JsonLD = ({ seo }) => {

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': seo.type,
    name: seo.name,
    image: seo.image,
    description: seo.description,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default JsonLD;
````

*Utilisation Page.tsx*

````typescript
import JsonLD from '@/components/seo/jsonLD';

export default function Home() {
const seo = {
  type: 'Organization',
  name: 'Lorem Ipsum Dolor',
  description: 'Lorem Ipsum Dolor',
  image: ''
}

  return (
    <>
      <JsonLD seo={seo} />
      { ... }
    </>
  );
}
````
