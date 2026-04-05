
'use client'; // Required for onClick handlers and hooks

import Link from 'next/link';
import type { BeverageItem } from '@/lib/types';
import { Beer, Wine, GlassWater, Martini, CupSoda, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

interface BeverageCardProps {
  item: BeverageItem;
}

export default function BeverageCard({ item }: BeverageCardProps) {
  const getIcon = () => {
    const iconProps = { className: "h-12 w-12 text-primary" };
    switch(item.category) {
      case 'Beers': return <Beer {...iconProps} />;
      case 'Wines': return <Wine {...iconProps} />;
      case 'Cocktails': return <Martini {...iconProps} />;
      case 'Scotch & Whiskey': return <GlassWater {...iconProps} />;
      case 'Soft Drinks': return <CupSoda {...iconProps} />;
      case 'Non-Alcoholic Drinks': return <GlassWater {...iconProps} />;
      default: return <GlassWater {...iconProps} />;
    }
  }

  const { addToCart } = useCart();
  
  const handleAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item, 1, []);
  };

  return (
    <div className="group w-full relative">
        <Link href={`/beverage/${item.id}`} className="block w-full py-4">
            <div className="flex items-start gap-4">
                <div className="flex-grow">
                    <h3 className="font-headline text-lg font-bold leading-tight pr-2">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                        <p className="font-bold text-sm">${item.price.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">· {item.abv}% ABV</p>
                    </div>
                </div>
                <div className="relative w-24 h-24 flex-shrink-0 bg-accent rounded-md flex items-center justify-center">
                    {getIcon()}
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

