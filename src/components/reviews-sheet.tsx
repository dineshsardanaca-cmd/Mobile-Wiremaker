
'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { Review } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import StarRating from "./star-rating";

interface ReviewsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviews?: Review[];
  itemName: string;
}

export default function ReviewsSheet({ open, onOpenChange, reviews = [], itemName }: ReviewsSheetProps) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // The sheet needs a container to render into, to stay within the mobile frame
    setContainer(document.getElementById('mobile-app-frame'));
  }, []);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent container={container} side="bottom" className="rounded-t-2xl max-h-[80%] flex flex-col">
        <SheetHeader className="shrink-0 text-left">
          <SheetTitle className="font-headline">Reviews for {itemName}</SheetTitle>
          <SheetDescription>
            See what other customers are saying.
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="flex-grow">
          <div className="p-4 space-y-6">
            {reviews.length > 0 ? reviews.map((review, index) => (
              <div key={index} className="border-b border-border pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold">{review.author}</p>
                    <StarRating rating={review.rating} starClassName="h-4 w-4" />
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            )) : (
              <p className="text-muted-foreground text-center py-8">No reviews yet.</p>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
