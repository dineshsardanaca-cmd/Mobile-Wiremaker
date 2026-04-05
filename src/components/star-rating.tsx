
'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  totalStars?: number;
  className?: string;
  starClassName?: string;
}

export default function StarRating({ rating, totalStars = 5, className, starClassName }: StarRatingProps) {
  const roundedRating = Math.ceil(rating);

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {[...Array(totalStars)].map((_, i) => (
        <Star 
            key={i} 
            className={cn(
                "h-5 w-5", 
                i < roundedRating ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted-foreground",
                starClassName
            )} 
        />
      ))}
    </div>
  );
}
