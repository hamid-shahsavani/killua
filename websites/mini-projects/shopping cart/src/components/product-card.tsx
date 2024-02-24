import { TProduct } from '@/types/product';
import { useKillua } from 'killua';
import { cartSlice } from '@/slices/cart';

export default function ProductCard(props: TProduct): JSX.Element {
  // check if item is in cart / add to cart / remove from cart
  const localStorageCart = useKillua(cartSlice);

  return (
    <div className="overflow-hidden border-gradient">
      <div className="bg-black space-y-3 rounded-xl h-full">
        {/* image */}
        <img src={props.img} alt={props.title} className="rounded-xl" />
        {/* title, price */}
        <div className="px-3 flex justify-between items-center">
          <p className="font-bold text-lg">{props.title}</p>
          <p className="text-lg font-medium text-gray-200">${props.price}</p>
        </div>
        {/* add to cart || remove from cart */}
        <div className="px-3 pb-3">
          {localStorageCart.selectors.isItemInCart(props.id) ? (
            <button
              onClick={() => localStorageCart.reducers.removeFromCart(props.id)}
              className="bg-red-500/90 btn-animation w-full text-white py-3 font-medium rounded-md"
            >
              Remove from Cart
            </button>
          ) : (
            <button
              onClick={() => localStorageCart.reducers.addToCart(props)}
              className="bg-green-500/90 btn-animation font-medium w-full py-3 text-white rounded-md"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
