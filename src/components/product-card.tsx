
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ProductItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import AttributeIcons from './allergen-icons';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  item: ProductItem;
}

export default function ProductCard({ item }: ProductCardProps) {
  const image = PlaceHolderImages.find(p => p.id === item.imageId);
  const imageUrl = image?.imageUrl ?? "https://picsum.photos/seed/default/600/400";
  const imageHint = image?.imageHint ?? "product image";

  const { addToCart } = useCart();
  const router = useRouter();

  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.modifications && item.modifications.length > 0) {
      router.push(`/product/${item.id}`);
    } else {
      addToCart(item, 1, []);
    }
  };

  return (
    <div className="group w-full relative">
        <Link href={`/product/${item.id}`} className="block w-full py-4">
            <div className="flex items-start gap-4">
                <div className="flex-grow">
                    <h3 className="font-headline text-lg font-bold leading-tight pr-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="font-bold text-sm">${item.price.toFixed(2)}</p>
                    </div>
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
