
'use client';

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface CategoryNavProps {
    categories: string[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
    if (categories.length === 0) {
        return null;
    }
    
    return (
        <div className="sticky top-[4.5rem] z-20 bg-background/95 backdrop-blur-sm border-b">
             <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-2 p-3">
                    {categories.map(category => (
                        <Button asChild variant="ghost" key={category} className="rounded-full">
                            <a href={`#${category}`}>{category}</a>
                        </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}
