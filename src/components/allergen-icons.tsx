

import { Carrot, Leaf, Flame, Sparkles, Star, Percent, Users, CalendarClock, Timer, Grape } from 'lucide-react';
import type { Attribute } from '@/lib/types';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { GlutenFreeIcon, NutFreeIcon, SpicyIcon } from './custom-icons';

interface AttributeIconsProps {
  attributes: Attribute[];
  className?: string;
}

const iconMap: Record<string, { icon: React.ElementType; label: string; className: string }> = {
  // Food Attributes
  Vegan: { icon: Leaf, label: 'Vegan', className: 'text-green-600' },
  Vegetarian: { icon: Carrot, label: 'Vegetarian', className: 'text-orange-600' },
  GlutenFree: { icon: GlutenFreeIcon, label: 'Gluten-Free', className: 'text-yellow-600' },
  NutFree: { icon: NutFreeIcon, label: 'Nut-Free', className: 'text-amber-800' },
  Spicy: { icon: SpicyIcon, label: 'Spicy', className: 'text-red-600' },
  // Marketplace Attributes
  Sparkles: { icon: Sparkles, label: 'New Arrival', className: 'text-blue-500' },
  Star: { icon: Star, label: 'Best Seller', className: 'text-yellow-500 fill-yellow-400' },
  Percent: { icon: Percent, label: 'On Sale', className: 'text-red-500' },
  // Coupon Attributes
  FamilyFriendly: { icon: Users, label: 'Family-Friendly', className: 'text-sky-500' },
  ReservationsRequired: { icon: CalendarClock, label: 'Reservations Required', className: 'text-orange-500' },
  LimitedTime: { icon: Timer, label: 'Limited Time Offer', className: 'text-red-500' },
  FineDining: { icon: Grape, label: 'Fine Dining', className: 'text-purple-500' },

};

export default function AttributeIcons({ attributes, className }: AttributeIconsProps) {
  if (!attributes || attributes.length === 0) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className={`flex items-center gap-1.5 ${className}`}>
        {attributes.map((attribute) => {
          const IconComponent = iconMap[attribute.icon];
          if (!IconComponent) return null;
          const { icon: Icon, className: iconClassName, label } = IconComponent;
          return (
            <Tooltip key={attribute.id}>
              <TooltipTrigger>
                <Icon className={`h-4 w-4 ${iconClassName}`} />
              </TooltipTrigger>
              <TooltipContent>
                <p>{attribute.label || label}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
