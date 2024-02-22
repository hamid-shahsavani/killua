import { TProduct } from '@/types/product';
import { slice } from 'killua-beta';

export const cartSlice = slice({
  key: 'cart',
  defaultClient: [] as TProduct[],
  selectors: {
    cartIsEmpty: value => Boolean(!value.length),
    isItemInCart: (value, payload: number) =>
      value.some(product => product.id === payload),
    totalCartPrice: value =>
      value.reduce((acc, product) => acc + product.price, 0),
    totalCartCount: value => value.length
  },
  reducers: {
    addToCart: (value, payload: TProduct) => [...value, payload],
    removeFromCart: (value, payload: number) => [
      ...value.filter(product => product.id !== payload)
    ],
    clearCart: () => []
  }
});
