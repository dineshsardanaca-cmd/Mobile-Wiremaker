
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/AppContext';
import { useMemo } from 'react';
import { menuData, marketplaceData, couponData } from '@/lib/data';

export default function BottomNavBar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { appMode, resetHomePage } = useAppContext();

  const homeTabLabel = useMemo(() => {
    if (!appMode) return 'Home';
    if (appMode === 'marketplace') {
      return marketplaceData.storeInfo.homeTabLabel;
    }
    if (appMode === 'travel') {
      return couponData.storeInfo.homeTabLabel;
    }
    // Default to menu
    return menuData.storeInfo.homeTabLabel;
  }, [appMode]);

  const navItems = [
    { href: '/', label: homeTabLabel, icon: Home },
    { href: '/cart', label: 'Cart', icon: ShoppingCart },
    { href: '/account', label: 'Account', icon: User },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-16 bg-card border-t border-border w-full z-10">
       <div className="grid h-full grid-cols-3">
        {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = (href === '/' && pathname === href) || (href !== '/' && pathname.startsWith(href));
            const classNames = cn(
                "flex flex-col items-center justify-center text-sm font-medium transition-colors",
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            );

            return (
                <Link 
                  key={href} 
                  href={href} 
                  className={classNames} 
                  onClick={href === '/' && pathname === '/' ? resetHomePage : undefined}
                >
                    <div className="relative">
                        <Icon className="h-6 w-6" />
                        {label === 'Cart' && totalItems > 0 && (
                            <Badge variant="destructive" className="absolute -top-2 -right-3 h-5 w-5 justify-center rounded-full p-0">
                                {totalItems}
                            </Badge>
                        )}
                    </div>
                    <span>{label}</span>
                </Link>
            )
        })}
       </div>
    </div>
  );
}
