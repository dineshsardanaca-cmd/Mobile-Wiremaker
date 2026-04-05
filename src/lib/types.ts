

export type DrinkType = 'Hoppy' | 'Sour' | 'Dark' | 'Light' | 'Red Wine' | 'White Wine' | 'Whiskey' | 'Cocktail' | 'Soft Drink' | 'Non-Alcoholic';
export type ProductCategory = 'Electronics' | 'Books' | 'Home & Kitchen' | 'Apparel';
export type CouponCategory = 'Dining' | 'Entertainment' | 'Tours' | 'Shopping';

// New generic Attribute type
export interface Attribute {
  id: string;
  label: string;
  icon: string;
}

// New types for modifications
export interface ModificationOption {
  id: string;
  name: string;
  price: number;
}

export interface ModificationGroup {
  id: string;
  title: string;
  type: 'single' | 'multiple'; // 'single' for radio buttons, 'multiple' for checkboxes
  options: ModificationOption[];
}

export interface Review {
  rating: number;
  comment: string;
  author: string;
}

export interface StoreInfo {
  name: string;
  logoImageId: string;
  heroImageId: string;
  homeTabLabel: string;
}


export interface BaseMenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'food' | 'beverage' | 'product' | 'coupon';
}

export interface FoodItem extends BaseMenuItem {
  type: 'food';
  category: 'Appetizers' | 'Mains' | 'Desserts' | 'Sides';
  calories?: number;
  attributes?: Attribute[]; // Replaced allergens with generic attributes
  imageId: string;
  modifications?: ModificationGroup[]; // Add modifications here
  averageRating?: number;
  reviews?: Review[];
  relatedItemIds?: string[];
}

export interface BeverageItem extends BaseMenuItem {
  type: 'beverage';
  category: 'Beers' | 'Wines' | 'Scotch & Whiskey' | 'Soft Drinks' | 'Cocktails' | 'Non-Alcoholic Drinks';
  abv: number;
  ibu?: number;
  pourSize: string; // e.g., "16oz", "750ml"
  origin: string; // Brewery or region
  tastingNotes: string[];
  drinkType: DrinkType[];
  attributes?: Attribute[]; // Add attributes to beverages
  averageRating?: number;
  reviews?: Review[];
  relatedItemIds?: string[];
}

export interface ProductItem extends BaseMenuItem {
    type: 'product';
    category: ProductCategory;
    attributes?: Attribute[];
    imageId: string;
    modifications?: ModificationGroup[];
    averageRating?: number;
    reviews?: Review[];
    relatedItemIds?: string[];
}

export interface CouponItem extends BaseMenuItem {
    type: 'coupon';
    category: CouponCategory;
    venue: string;
    terms: string;
    attributes?: Attribute[];
    imageId: string;
    qrCodeImageId: string;
    averageRating?: number; // rating of the venue
    reviews?: Review[];
    relatedItemIds?: string[];
}


export type MenuItem = FoodItem | BeverageItem | ProductItem | CouponItem;

// New type for items in the cart
export interface CartItem {
    id: string; // A unique ID for the cart item instance, e.g., using Date.now()
    item: MenuItem;
    quantity: number;
    selectedModifications: ModificationOption[];
    lineItemPrice: number;
}
