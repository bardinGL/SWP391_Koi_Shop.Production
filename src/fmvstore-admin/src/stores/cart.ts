import { Product } from '@/types'
import { atomWithStorage } from 'jotai/utils'
import { getDefaultStore } from 'jotai'

type CartItem = {
  item: Product
  quantity: number
}

const cartAtom = atomWithStorage<CartItem[] | null>('cart', null)

const updateItemCart = (product: Product, quantity: number) => {
  const store = getDefaultStore()
  const cart = store.get(cartAtom)
  let newCart: CartItem[]

  if (cart) {
    const existingItem = cart.find((item) => item.item.id === product.id) //fix with id later
    if (existingItem) {
      newCart = cart.map((item) =>
        item.item.id === product.id ? { ...item, quantity: existingItem.quantity + quantity } : item
      )
    } else {
      newCart = [...cart, { item: product, quantity }]
    }

    if (quantity === 0) {
      //remove item from cart
      newCart = newCart.filter((item) => item.item.id !== product.id)
    }

    //check if quantity is 0, decrease quantity by 1 and check do not allow quantity to be less than 0
    if (quantity === -1 && existingItem?.quantity! > 0) {
      if (existingItem?.quantity! - 1 === 0) {
        return newCart
      }
    }
  } else {
    newCart = [{ item: product, quantity }]
  }

  store.set(cartAtom, newCart)
}

export { cartAtom, updateItemCart }
