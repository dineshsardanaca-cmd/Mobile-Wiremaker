

import type { FoodItem, BeverageItem, MenuItem, StoreInfo, ProductItem, CouponItem } from './types';
import menuDataJson from './menu-data.json';
import marketplaceDataJson from './marketplace-data.json';
import couponDataJson from './coupon-data.json';

// Menu Data
export const menuData = {
    storeInfo: menuDataJson.storeInfo as StoreInfo,
    foodItems: menuDataJson.foodItems as FoodItem[],
    beverageItems: menuDataJson.beverageItems as BeverageItem[],
};
menuData.foodItems.forEach(i => i.type = 'food');
menuData.beverageItems.forEach(i => i.type = 'beverage');


// Marketplace Data
export const marketplaceData = {
    storeInfo: marketplaceDataJson.storeInfo as StoreInfo,
    productItems: marketplaceDataJson.productItems as ProductItem[]
};
marketplaceData.productItems.forEach(i => i.type = 'product');


// Coupon Data
export const couponData = {
    storeInfo: couponDataJson.storeInfo as StoreInfo,
    couponItems: couponDataJson.couponItems as CouponItem[]
};
couponData.couponItems.forEach(i => i.type = 'coupon');


const allMenuItems: MenuItem[] = [...menuData.foodItems, ...menuData.beverageItems, ...marketplaceData.productItems, ...couponData.couponItems];

// Generic Getters
export function getMenuItemById(id: string): MenuItem | undefined {
  return allMenuItems.find((item) => item.id === id);
}

export function getFoodItemById(id: string): FoodItem | undefined {
    return menuData.foodItems.find((item) => item.id === id);
}

export function getBeverageItemById(id: string): BeverageItem | undefined {
    return menuData.beverageItems.find((item) => item.id === id);
}

export function getProductItemById(id: string): ProductItem | undefined {
    return marketplaceData.productItems.find((item) => item.id === id);
}

export function getCouponItemById(id: string): CouponItem | undefined {
    return couponData.couponItems.find((item) => item.id === id);
}
