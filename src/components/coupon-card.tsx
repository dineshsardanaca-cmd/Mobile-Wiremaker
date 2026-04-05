
'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { CouponItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AttributeIcons from './allergen-icons';
import { Button } from './ui/button';
import { Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CouponCardProps {
  item: CouponItem;
}

export default function CouponCard({ item }: CouponCardProps) {
  const image = PlaceHolderImages.find(p => p.id === item.imageId);
  const imageUrl = image?.imageUrl ?? "https://picsum.photos/seed/default/600/400";
  const imageHint = image?.imageHint ?? "coupon image";
  const { addToCart } = useCart();

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item, 1, []);
  };


  return (
    <div className="group w-full relative">
        <Link href={`/coupon/${item.id}`} className="block w-full py-4">
            <div className="flex items-start gap-4">
                <div className="flex-grow">
                    <p className="text-sm font-semibold text-primary">{item.venue}</p>
                    <h3 className="font-headline text-lg font-bold leading-tight pr-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                     {item.attributes && item.attributes.length > 0 && (
                        <AttributeIcons attributes={item.attributes} className="mt-2" />
                    )}
                </div>
                <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                        src={imageUrl}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover rounded-md"
                        data-ai-hint={imageHint}
                    />
                    <Button 
                        size="icon" 
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-md"
                        onClick={handleAddClick}
                        aria-label={`Add ${item.name} to cart`}
                        >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Link>
    </div>
  );
}
