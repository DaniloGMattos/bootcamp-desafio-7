import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface CartState {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}
interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
}
interface CartContext {
  products: CartState[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [cart, setCart] = useState<CartState[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const products = await AsyncStorage.getItem('@GoMarket:products');
      if (products) {
        setCart([...JSON.parse(products)]);
      }
      // MEU ERRO!
      // const parsedProducts: Product[] = [];
      // const cartAsyncStoragekeys = await AsyncStorage.getAllKeys();
      // const [unparsedProducts] = await AsyncStorage.multiGet(
      //   cartAsyncStoragekeys,
      // );
      // if (unparsedProducts[1]) {
      //   parsedProducts.push(JSON.parse(unparsedProducts[1]));
      //   setProducts(parsedProducts);
      // }
    }
    loadProducts();
  }, []);

  const addToCart = useCallback(
    async (cartProduct: Product) => {
      // TODO ADD A NEW ITEM TO THE CART

      const productExists = cart.find(product => product.id === cartProduct.id);
      const quantity = productExists ? productExists.quantity + 1 : 1;
      if (productExists) {
        setCart(
          cart.map(product =>
            product.id === cartProduct.id
              ? { ...cartProduct, quantity }
              : product,
          ),
        );
      } else {
        setCart([...cart, { ...cartProduct, quantity }]);
      }
      await AsyncStorage.setItem('@GoMarket:products', JSON.stringify(cart));

      // MEU ERRO
      // const newProduct: Product = {
      //   id: product.id,
      //   title: product.title,
      //   image_url: product.image_url,
      //   price: product.price,
      //   quantity: product.quantity + 1,
      // };
      // const cartAsyncStoragKeys = await AsyncStorage.getAllKeys();
      // if (
      //   !(cartAsyncStoragKeys.indexOf(`@GoMarketPlace:${newProduct.id}`) > -1)
      // ) {
      //   await AsyncStorage.setItem(
      //     `@GoMarketPlace:${newProduct.id}`,
      //     JSON.stringify(newProduct),
      //   );
      //   setProducts([...products, newProduct]);
      // } else {
      //   const otherProducts = products.filter(
      //     existingProduct => existingProduct.id !== product.id,
      //   );
      //   await AsyncStorage.setItem(
      //     `@GoMarketPlace:${newProduct.id}`,
      //     JSON.stringify(newProduct),
      //   );
      //   setProducts([...otherProducts, newProduct]);
      // }
    },
    [cart],
  );
  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      setCart(
        cart.map(product =>
          product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product,
        ),
      );
      await AsyncStorage.setItem('@GoMarket:products', JSON.stringify(cart));
    },
    [cart],
  );
  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      setCart(
        cart.map(product =>
          product.id === id
            ? { ...product, quantity: product.quantity - 1 }
            : product,
        ),
      );
      await AsyncStorage.setItem('@GoMarket:products', JSON.stringify(cart));
    },
    [cart],
  );
  const products = cart;
  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
