

'use client';

import * as React from 'react';
import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { Filter, Search } from 'lucide-react';

import { menuData, marketplaceData, couponData } from '@/lib/data';
import type { FoodItem, BeverageItem, MenuItem, ProductItem, CouponItem } from '@/lib/types';
import { Button } from '@/components/ui/button';
import FilterOverlay from '@/components/filter-overlay';
import FoodCard from '@/components/food-card';
import BeverageCard from '@/components/beverage-card';
import ProductCard from '@/components/product-card';
import CouponCard from '@/components/coupon-card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import CategoryNav from '@/components/category-nav';
import { useAppContext } from '@/context/AppContext';

type Filters = Record<string, string[]>;

export default function Home() {
  const { appMode, homePageResetKey } = useAppContext();
  const [filters, setFilters] = useState<Filters>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    if (homePageResetKey > 0) { // Avoid running on initial render
      setFilters({});
      setSearchQuery('');
      document.querySelector('#mobile-app-frame main')?.scrollTo(0, 0);
    }
  }, [homePageResetKey]);

  const { storeInfo, allItems, categoryOrder } = useMemo(() => {
    if (!appMode) {
      return { storeInfo: {name: '', logoImageId: '', heroImageId: ''}, allItems: [], categoryOrder: [] };
    }
    if (appMode === 'marketplace') {
      return { 
        storeInfo: marketplaceData.storeInfo, 
        allItems: marketplaceData.productItems,
        categoryOrder: ['Electronics', 'Apparel', 'Home & Kitchen', 'Books']
      };
    }
    if (appMode === 'travel') {
      return { 
        storeInfo: couponData.storeInfo, 
        allItems: couponData.couponItems,
        categoryOrder: ['Dining', 'Entertainment', 'Tours', 'Shopping']
      };
    }
    // Default to menu
    return { 
      storeInfo: menuData.storeInfo, 
      allItems: [...menuData.foodItems, ...menuData.beverageItems],
      categoryOrder: [
        'Appetizers', 'Mains', 'Desserts', 'Sides',
        'Beers', 'Wines', 'Cocktails', 'Scotch & Whiskey', 'Soft Drinks', 'Non-Alcoholic Drinks'
      ]
    };
  }, [appMode]);


  const filteredItems = useMemo(() => {
    if (!appMode) return [];

    let tempItems = allItems;

    // 1. Filter by search query
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      tempItems = tempItems.filter(item =>
        item.name.toLowerCase().includes(lowercasedQuery) ||
        (item.description && item.description.toLowerCase().includes(lowercasedQuery)) ||
        ('venue' in item && (item as CouponItem).venue.toLowerCase().includes(lowercasedQuery))
      );
    }

    // 2. Then, filter by selected filters
    const activeFilterGroups = Object.entries(filters).filter(([, values]) => values.length > 0);

    if (activeFilterGroups.length > 0) {
      tempItems = tempItems.filter(item => {
        // An OR condition across different filter groups. An item should appear if it matches ANY of the selected filter criteria.
        return activeFilterGroups.some(([groupKey, selectedValues]) => {
            if (selectedValues.length === 0) return false;

            if (groupKey === 'attributes') {
                const itemAttributes = (item as any).attributes;
                return selectedValues.some(val => itemAttributes?.some((attr: any) => attr.id === val));
            }
            if (groupKey === 'drinkType' && item.type === 'beverage') {
                return selectedValues.some(val => (item as BeverageItem).drinkType.includes(val as any));
            }
            if (groupKey === 'category') {
                return selectedValues.includes((item as any).category);
            }
            return false;
        });
      });
    }

    return tempItems;
  }, [allItems, filters, searchQuery, appMode]);

  const categorizedItems = useMemo(() => {
    if (!appMode) return [];

    const grouped = filteredItems.reduce((acc, item) => {
      const category = (item as any).category;
      (acc[category] = acc[category] || []).push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

    return Object.entries(grouped).sort(([catA], [catB]) => {
      const indexA = categoryOrder.indexOf(catA);
      const indexB = categoryOrder.indexOf(catB);
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  }, [filteredItems, categoryOrder, appMode]);
  
  const heroImage = PlaceHolderImages.find(p => p.id === storeInfo.heroImageId);
  const categories = useMemo(() => categorizedItems.map(([category]) => category), [categorizedItems]);

  const getSearchPlaceholder = () => {
    switch(appMode) {
      case 'menu': return "Search menu...";
      case 'marketplace': return "Search products...";
      case 'travel': return "Search coupons...";
      default: return "Search...";
    }
  }

  if (!appMode) {
      return <div className="h-full w-full bg-background"></div>; // Render nothing until mode is selected
  }

  return (
    <div className="flex-grow">
      <div className="relative h-48 w-full">
        {heroImage && (
            <Image
                src={heroImage.imageUrl}
                alt={`${storeInfo.name} hero image`}
                fill
                className="object-cover"
                data-ai-hint={heroImage.imageHint}
                sizes="100vw"
                priority
            />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute top-4 left-4 right-4 z-10">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-headline font-bold text-white">
                  {storeInfo.name}
                </h1>
                <Button variant="ghost" size="icon" onClick={() => setIsFilterOpen(true)} className="text-white bg-white/10 hover:bg-white/20">
                    <Filter className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </div>
      
      <div className="sticky top-0 z-20 bg-background p-4 border-b">
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
                placeholder={getSearchPlaceholder()}
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      <CategoryNav categories={categories} />

      <div className="p-4">
        <div className="space-y-8">
            {categorizedItems.length > 0 ? (
                categorizedItems.map(([category, items]) => (
                    <div key={category} id={category} className="scroll-mt-36">
                        <h2 className="font-headline text-2xl font-semibold mb-4 tracking-tight">{category}</h2>
                        <div className="divide-y divide-border -mt-4">
                            {items.map((item) => (
                                <div key={item.id} id={item.id} className="scroll-mt-36">
                                    {item.type === 'food' && <FoodCard item={item as FoodItem} />}
                                    {item.type === 'beverage' && <BeverageCard item={item as BeverageItem} />}
                                    {item.type === 'product' && <ProductCard item={item as ProductItem} />}
                                    {item.type === 'coupon' && <CouponCard item={item as CouponItem} />}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">No items match your search or filters.</p>
                </div>
            )}
        </div>
      </div>

      <FilterOverlay open={isFilterOpen} onOpenChange={setIsFilterOpen} filters={filters} setFilters={setFilters} />
    </div>
  );
}
