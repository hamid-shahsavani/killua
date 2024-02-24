import { cartSlice } from '@/slices/cart';
import { useKillua } from 'killua';

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalYourCart(props: IProps): JSX.Element {
  const localStorageCart = useKillua(cartSlice);

  return (
    <section
      className={`fixed inset-0 z-50 flex h-screen w-screen items-center justify-center backdrop-blur-[2px] transition-all duration-500 ${
        props.isOpen ? 'visible bg-black/20' : 'invisible opacity-0'
      }`}
    >
      <div className="fixed inset-0" onClick={(): void => props.onClose()} />
      <div
        className={`flex w-fit items-center justify-center transition-all duration-300 ${
          props.isOpen
            ? 'visible scale-100 opacity-100'
            : 'invisible scale-75 lg:opacity-0'
        }`}
      >
        <div className="rounded-lg w-[350px] sm:w-[450px] mx-5 bg-gradient-to-r from-[#D931F7]/80 via-[#D931F7]/80 to-[#F3F731]/80 p-[1px]">
          <div className="relative flex flex-col gap-4 rounded-lg bg-black px-5 pt-5 pb-3">
            {/* head */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {/* title */}
                <p className="text-[17px] font-semibold">Your Cart</p>
                {/* close btn */}
                <button
                  onClick={(): void => props.onClose()}
                  className="btn-animation"
                >
                  <img src={'/icons/xmark.svg'} alt="close" />
                </button>
              </div>
            </div>
            {/* body */}
            <div>
              {localStorageCart.selectors.cartIsEmpty() ? (
                <div className="flex flex-col items-center gap-4 pb-4 pt-8">
                  <img
                    src={'/images/cart-is-empty.png'}
                    width={180}
                    alt="cart is empty"
                  />
                  <p className="text-xl font-medium">cart is empty!</p>
                </div>
              ) : (
                <div>
                  <ul className="flex flex-col gap-3 my-4 pr-2 overflow-y-auto">
                    {localStorageCart.get().map(item => (
                      <li
                        key={item.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex gap-3 items-center">
                          <img
                            className="bg-gray-500 rounded-lg"
                            src={item.img}
                            width={60}
                            height={60}
                            alt={item.title}
                          />
                          <div>
                            <p className="text-lg font-medium">{item.title}</p>
                            <p className="text-default-600">${item.price}</p>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            localStorageCart.reducers.removeFromCart(item.id)
                          }
                        >
                          <img
                            src={'/icons/trash.svg'}
                            alt="trash icon"
                            width={23}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="pb-2 pt-4 flex gap-4 border-t">
                    <div className="w-fit">
                      <p className="text-md whitespace-nowrap">
                        Total price: $
                        {localStorageCart.selectors.totalCartPrice()}
                      </p>
                      <p className="text-md whitespace-nowrap">
                        Total items:{' '}
                        {localStorageCart.selectors.totalCartCount()}
                      </p>
                    </div>
                    <button
                      onClick={() => localStorageCart.reducers.clearCart()}
                      className="font-semibold bg-red-500/90 rounded-lg w-full h-12"
                    >
                      Clear cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
