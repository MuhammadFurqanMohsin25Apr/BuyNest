export const FREE_SHIPPING_OVER = 5000; // $50.00 in cents
export const FLAT_SHIPPING = 499;       // $4.99

export function calcTotals(subtotal) {
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_OVER ? 0 : FLAT_SHIPPING;
  return { subtotal, shipping, total: subtotal + shipping };
}