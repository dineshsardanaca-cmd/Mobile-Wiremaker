

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppContext } from '@/context/AppContext';
import { ChefHat, Store, Ticket } from 'lucide-react';

export default function AppSelectionWizard() {
  const { appMode, setAppMode } = useAppContext();

  return (
    <Dialog open={!appMode}>
      <DialogContent className="sm:max-w-[425px]" hideCloseButton>
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl text-center">Welcome</DialogTitle>
          <DialogDescription className="text-center pt-2">
            Choose which application you would like to run.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          <Button variant="outline" size="lg" className="h-24 flex-col gap-2" onClick={() => setAppMode('menu')}>
            <ChefHat className="h-8 w-8" />
            Restaurant Menu
          </Button>
          <Button variant="outline" size="lg" className="h-24 flex-col gap-2" onClick={() => setAppMode('marketplace')}>
            <Store className="h-8 w-8" />
            Marketplace
          </Button>
          <Button variant="outline" size="lg" className="h-24 flex-col gap-2" onClick={() => setAppMode('travel')}>
            <Ticket className="h-8 w-8" />
            Travel Coupons
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
