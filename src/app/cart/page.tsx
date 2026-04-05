
'use client';

import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Mail, MinusCircle, PlusCircle, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Link from 'next/link';
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';
import type { CouponItem } from '@/lib/types';
import { useMemo } from 'react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const hasPaidItems = useMemo(() => cartItems.some(item => item.item.price > 0), [cartItems]);
  const hasCoupons = useMemo(() => cartItems.some(item => item.item.type === 'coupon'), [cartItems]);

  const handleCheckout = () => {
    if (hasCoupons && !hasPaidItems) {
        toast({
            title: "Deals Emailed!",
            description: "Your selected coupons have been sent to your email.",
        });
    } else {
        toast({
            title: "Order Placed!",
            description: "Thank you for your order. It is being prepared.",
        });
    }
    clearCart();
    router.push('/');
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-4">
        <ShoppingCart className="w-24 h-24 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/">Start Ordering</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <h1 className="font-headline text-4xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4 mb-6">
        {cartItems.map(cartItem => {
          const imageId = (cartItem.item as any).imageId;
          const image = PlaceHolderImages.find(p => p.id === imageId);
          const imageUrl = image?.imageUrl ?? "https://picsum.photos/seed/default/200/200";
          const imageHint = image?.imageHint ?? "menu item";

          return (
            <div key={cartItem.id} className="flex items-center gap-4 bg-card p-3 rounded-lg shadow-sm">
                {(cartItem.item.type === 'food' || cartItem.item.type === 'product' || cartItem.item.type === 'coupon') && (
                     <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                        <Image src={imageUrl} alt={cartItem.item.name} fill className="object-cover" data-ai-hint={imageHint} sizes="80px" />
                    </div>
                )}
                <div className="flex-grow">
                    <h3 className="font-bold">{cartItem.item.name}</h3>
                    {cartItem.item.type === 'coupon' && <p className="text-sm text-muted-foreground">{(cartItem.item as CouponItem).venue}</p>}

                    {cartItem.selectedModifications && cartItem.selectedModifications.length > 0 && cartItem.selectedModifications.map(mod => (
                        <p key={mod.id} className="text-sm text-muted-foreground">+ {mod.name} (${mod.price.toFixed(2)})</p>
                    ))}
                    
                    {cartItem.item.type !== 'coupon' && (
                        <div className="flex items-center gap-3 mt-2">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(cartItem.id, cartItem.quantity - 1)}>
                                <MinusCircle className="h-5 w-5" />
                            </Button>
                            <span className="font-bold">{cartItem.quantity}</span>
                             <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(cartItem.id, cartItem.quantity + 1)}>
                                <PlusCircle className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-end">
                    <p className="font-bold text-lg">{cartItem.item.price > 0 ? `$${cartItem.lineItemPrice.toFixed(2)}` : 'Free'}</p>
                     <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeFromCart(cartItem.id)}>
                        <Trash2 className="h-5 w-5" />
                    </Button>
                </div>
            </div>
          )
        })}
      </div>
      <div className="space-y-2 border-t pt-4">
        {hasPaidItems && (
            <>
                <div className="flex justify-between text-lg">
                    <span>Subtotal</span>
                    <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg text-muted-foreground">
                    <span>Taxes & Fees</span>
                    <span>$...</span>
                </div>
            </>
        )}
        <div className="flex justify-between text-2xl font-bold pt-2">
            <span>Total</span>
            <span>${totalPrice.toFixed(2)}</span>
        </div>
      </div>
      <Button size="lg" className="w-full mt-6" onClick={handleCheckout}>
        {hasCoupons && !hasPaidItems ? (
            <>
                <Mail className="mr-2 h-5 w-5" />
                Email My Deals
            </>
        ) : 'Place Order'}
      </Button>
    </div>
  );
}
