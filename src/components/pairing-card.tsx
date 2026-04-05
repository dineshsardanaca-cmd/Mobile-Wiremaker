

import Link from 'next/link';
import Image from 'next/image';
import type { MenuItem, FoodItem, BeverageItem, CouponItem } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Beer, Wine, GlassWater, Martini, CupSoda } from 'lucide-react';

interface PairingCardProps {
  item: MenuItem;
}

const getBeverageIcon = (item: BeverageItem) => {
    const iconProps = { className: "h-8 w-8 text-primary" };
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

export default function PairingCard({ item }: PairingCardProps) {
  const isFood = item.type === 'food';
  const isBeverage = item.type === 'beverage';
  const isCoupon = item.type === 'coupon';

  let imageUrl: string | undefined;
  let imageHint: string | undefined;

  if (isFood || isCoupon) {
    const image = PlaceHolderImages.find(p => p.id === (item as FoodItem | CouponItem).imageId);
    imageUrl = image?.imageUrl;
    imageHint = image?.imageHint;
  }
  
  const linkHref = `/${item.type}/${item.id}`;

  return (
    <Link href={linkHref} className="group block w-40 flex-shrink-0">
      <div className="flex flex-col h-full rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden transition-shadow hover:shadow-md">
        <div className="relative w-full aspect-square bg-accent flex items-center justify-center">
            {(isFood || isCoupon) && imageUrl ? (
                <Image
                    src={imageUrl}
                    alt={item.name}
                    fill
                    sizes="160px"
                    className="object-cover"
                    data-ai-hint={imageHint}
                />
            ) : (
                isBeverage && getBeverageIcon(item as BeverageItem)
            )}
        </div>
        <div className="p-3 flex-grow flex flex-col justify-between">
            <div>
              {isCoupon && <p className="text-xs font-semibold text-primary line-clamp-1">{(item as CouponItem).venue}</p>}
              <h4 className="font-semibold text-sm leading-tight line-clamp-2">{item.name}</h4>
            </div>
            {item.price > 0 && <p className="text-sm text-muted-foreground mt-1">${item.price.toFixed(2)}</p>}
        </div>
      </div>
    </Link>
  );
}
