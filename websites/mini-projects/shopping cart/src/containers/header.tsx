import { cartSlice } from '@/slices/cart';
import { useKillua } from 'killua-beta';
import { useState } from 'react';
import ModalYourCart from './modal-your-cart';

export default function Header() {
  // get total cart items
  const localStorageCart = useKillua(cartSlice);

  // show/hide modal your cart
  const [isOpenModalYourCart, setIsOpenModalYourCart] =
    useState<boolean>(false);

  return (
    <>
      <ModalYourCart
        isOpen={isOpenModalYourCart}
        onClose={(): void => setIsOpenModalYourCart(false)}
      />
      <header className="bg-black pt-5 container flex items-center justify-between">
        {/* logo */}
        <a
          className="font-bold text-3xl"
          href="https://github.com/sys113/killua"
        >
          KILLUA
        </a>
        {/* show cart items / cart items count */}
        <div className="relative">
          <button
            onClick={(): void => setIsOpenModalYourCart(true)}
            className="bg-green-500/90 btn-animation font-medium px-5 py-2.5 text-white rounded-md w-fit"
          >
            Your Cart
          </button>
          <span className="bg-green-500/90 text-sm text-white font-medium rounded-full flex justify-center items-center w-7 h-7 border-black border-2 absolute -top-2 -right-2">
            {localStorageCart.selectors.totalCartCount()}
          </span>
        </div>
      </header>
    </>
  );
}
