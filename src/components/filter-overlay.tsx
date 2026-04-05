
'use client';

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useAppContext } from "@/context/AppContext";

type Filters = Record<string, string[]>;

interface FilterOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const filterConfig = {
  menu: [
    {
      id: 'attributes',
      title: 'Dietary',
      options: [
        { id: 'vegan', label: 'Vegan' },
        { id: 'vegetarian', label: 'Vegetarian' },
        { id: 'gluten-free', label: 'Gluten-Free' },
        { id: 'nut-free', label: 'Nut-Free' },
      ],
    },
    {
      id: 'drinkType',
      title: 'Drink Type',
      options: ['Hoppy', 'Sour', 'Dark', 'Light', 'Red Wine', 'White Wine', 'Whiskey', 'Cocktail', 'Soft Drink', 'Non-Alcoholic'].map(o => ({id: o, label: o})),
    },
  ],
  marketplace: [
    {
      id: 'category',
      title: 'Category',
      options: ['Electronics', 'Apparel', 'Home & Kitchen', 'Books'].map(o => ({id: o, label: o})),
    },
    {
      id: 'attributes',
      title: 'Deals & Features',
      options: [
        { id: 'new-arrival', label: 'New Arrival' },
        { id: 'best-seller', label: 'Best Seller' },
        { id: 'on-sale', label: 'On Sale' },
      ]
    }
  ],
  travel: [
    {
      id: 'category',
      title: 'Category',
      options: ['Dining', 'Entertainment', 'Tours', 'Shopping'].map(o => ({id: o, label: o})),
    },
    {
      id: 'attributes',
      title: 'Details',
      options: [
        { id: 'family-friendly', label: 'Family-Friendly' },
        { id: 'reservations-req', label: 'Reservations Required' },
        { id: 'fine-dining', label: 'Fine Dining' },
        { id: 'limited-time', label: 'Limited Time Offer' },
      ]
    }
  ]
};

export default function FilterOverlay({ open, onOpenChange, filters, setFilters }: FilterOverlayProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  const { appMode } = useAppContext();

  useEffect(() => {
    // The sheet needs a container to render into, to stay within the mobile frame
    setContainer(document.getElementById('mobile-app-frame'));
  }, []);

  const handleFilterChange = (groupId: string, optionId: string) => {
    setFilters(prevFilters => {
        const currentGroupValues = prevFilters[groupId] || [];
        const newGroupValues = currentGroupValues.includes(optionId)
            ? currentGroupValues.filter(id => id !== optionId)
            : [...currentGroupValues, optionId];
        
        return {
            ...prevFilters,
            [groupId]: newGroupValues,
        };
    });
  };

  const clearFilters = () => {
    setFilters({});
  }

  const currentFilterGroups = appMode ? filterConfig[appMode] : [];
  const defaultOpenAccordions = currentFilterGroups.map(g => g.id);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent container={container} side="bottom" className="rounded-t-2xl max-h-[80%] flex flex-col">
        <SheetHeader className="shrink-0">
          <SheetTitle className="font-headline">Filter</SheetTitle>
          <SheetDescription>
            Refine your search.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow">
          <div className="p-4">
            <Accordion type="multiple" defaultValue={defaultOpenAccordions}>
              {currentFilterGroups.map(group => (
                 <AccordionItem value={group.id} key={group.id}>
                    <AccordionTrigger className="text-lg font-semibold">{group.title}</AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        {group.options.map(option => (
                          <div key={option.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${group.id}-${option.id}`}
                              checked={(filters[group.id] || []).includes(option.id)}
                              onCheckedChange={() => handleFilterChange(group.id, option.id)}
                            />
                            <Label htmlFor={`${group.id}-${option.id}`}>{option.label}</Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollArea>
        <SheetFooter className="sm:justify-between gap-2 flex-row pt-4 border-t shrink-0">
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
            <Button onClick={() => onOpenChange(false)}>Apply</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
