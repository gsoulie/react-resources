import "./Product.css";
import { ProductItem } from "./ProductItem";

export type ProductType = {
  id: string;
  title: string;
  description: string;
  price: number;
};

const DUMMY_PRODUCT: ProductType[] = [
  {
    id: "1",
    price: 6,
    title: "React, The complete guide",
    description: "The best book i have ever seen",
  },
  {
    id: "2",
    price: 13,
    title: "Angular vs react",
    description: "Which is the better of all times ?",
  },
];

export const Products = () => {
  return (
    <section className="products">
      <h2>Buy your favorite products</h2>
      <ul>
        {DUMMY_PRODUCT.map((p: ProductType) => (
          <ProductItem
            key={p.id}
            id={p.id}
            title={p.title}
            price={p.price}
            description={p.description}
          />
        ))}
      </ul>
    </section>
  );
};
