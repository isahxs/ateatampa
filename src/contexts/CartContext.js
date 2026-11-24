import { createContext, useState } from 'react';

export const CartContext = createContext({});

const maxItemQuantity = 10;

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const addItem = (product, quantity = 1) => {
        if (!product?.id) {
            return;
        }

        const quantityToAdd = Math.max(1, Number(quantity) || 1);

        setCartItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === product.id);

            if (!existingItem) {
                return [
                    ...currentItems,
                    {
                        ...product,
                        quantity: Math.min(quantityToAdd, maxItemQuantity),
                    },
                ];
            }

            return currentItems.map((item) => {
                if (item.id !== product.id) {
                    return item;
                }

                return {
                    ...item,
                    quantity: Math.min(item.quantity + quantityToAdd, maxItemQuantity),
                };
            });
        });
    };

    const removeItem = (productId) => {
        setCartItems((currentItems) => currentItems.filter((item) => item.id !== productId));
    };

    const increaseItem = (productId) => {
        setCartItems((currentItems) =>
            currentItems.map((item) => {
                if (item.id !== productId) {
                    return item;
                }

                return {
                    ...item,
                    quantity: Math.min(item.quantity + 1, maxItemQuantity),
                };
            }),
        );
    };

    const decreaseItem = (productId) => {
        setCartItems((currentItems) =>
            currentItems
                .map((item) => {
                    if (item.id !== productId) {
                        return item;
                    }

                    return {
                        ...item,
                        quantity: item.quantity - 1,
                    };
                })
                .filter((item) => item.quantity > 0),
        );
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addItem,
                increaseItem,
                decreaseItem,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
