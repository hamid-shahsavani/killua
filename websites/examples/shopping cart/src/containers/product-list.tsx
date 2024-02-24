import ProductCard from "@/components/product-card";
import productsData from "@/resources/products-data";

export default function ProductList() {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 container my-5">
      {productsData.map((product) => (
        <ProductCard key={product.id} {...product} />
      ))}
    </section>
  );
}