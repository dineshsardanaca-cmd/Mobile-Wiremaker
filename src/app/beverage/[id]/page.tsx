
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getBeverageItemById, getMenuItemById } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Beer, GlassWater, Wine, Percent, Martini, CupSoda, MinusCircle, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from '@/context/CartContext';
import StarRating from '@/components/star-rating';
import ReviewsSheet from '@/components/reviews-sheet';
import PairingCard from '@/components/pairing-card';

export default function BeverageDetailPage() {
    const params = useParams();
    const item = getBeverageItemById(params.id as string);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [isReviewsOpen, setIsReviewsOpen] = useState(false);
    
    if (!item) {
        notFound();
    }
    
    const { id, name, description, price, category, abv, ibu, origin, pourSize, tastingNotes, averageRating, reviews, relatedItemIds } = item;

    const getIcon = () => {
        switch(category) {
            case 'Beers': return <Beer className="h-16 w-16 text-primary" />;
            case 'Wines': return <Wine className="h-16 w-16 text-primary" />;
            case 'Cocktails': return <Martini className="h-16 w-16 text-primary" />;
            case 'Scotch & Whiskey': return <GlassWater className="h-16 w-16 text-primary" />;
            case 'Soft Drinks': return <CupSoda className="h-16 w-16 text-primary" />;
            case 'Non-Alcoholic Drinks': return <GlassWater className="h-16 w-16 text-primary" />;
            default: return <GlassWater className="h-16 w-16 text-primary" />;
        }
    }

    const calculateCurrentPrice = () => {
        return price * quantity;
    };

    const handleAddToCart = () => {
        addToCart(item, quantity, []); // No modifications for beverages for now
    };

    return (
        <div>
            <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
                <div className="px-4 py-2">
                    <Link href={`/#${id}`}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="px-4 py-8">
                <div className="grid grid-cols-1 gap-8">
                    <div className="relative aspect-square w-full min-h-[300px] rounded-lg overflow-hidden shadow-lg bg-accent flex items-center justify-center">
                        {getIcon()}
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="font-headline text-4xl font-bold mb-2">{name}</h1>
                        {averageRating && reviews && reviews.length > 0 && (
                            <div className="flex items-center gap-2 mb-2">
                                <StarRating rating={averageRating} />
                                <Button variant="link" className="p-0 h-auto text-muted-foreground" onClick={() => setIsReviewsOpen(true)}>
                                    ({reviews.length} reviews)
                                </Button>
                            </div>
                        )}
                        <p className="text-md text-muted-foreground mb-4">{origin}</p>
                        <p className="text-lg text-muted-foreground mb-6">{description}</p>
                        
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-md mb-6">
                            <div className="flex items-center gap-2">
                                <Percent className="h-5 w-5 text-muted-foreground" />
                                <strong>ABV:</strong> {abv.toFixed(1)}%
                            </div>
                            {ibu != null && (
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-xs text-muted-foreground">IBU</span>
                                    <strong>IBU:</strong> {ibu}
                                </div>
                            )}
                            <div className="flex items-center gap-2 col-span-2">
                                <GlassWater className="h-5 w-5 text-muted-foreground" />
                                <strong>Pour:</strong> {pourSize}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h4 className="font-headline text-lg font-semibold mb-3">Tasting Notes</h4>
                            <div className="flex flex-wrap gap-2">
                                {tastingNotes.map(note => (
                                    <Badge key={note} variant="secondary">{note}</Badge>
                                ))}
                            </div>
                        </div>
                        
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <Button variant="outline" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                                <MinusCircle />
                            </Button>
                            <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                            <Button variant="outline" size="icon" onClick={() => setQuantity(q => q + 1)}>
                                <PlusCircle />
                            </Button>
                        </div>

                        <Button size="lg" className="w-full" onClick={handleAddToCart}>
                            Add {quantity} to Cart - ${calculateCurrentPrice().toFixed(2)}
                        </Button>

                        {relatedItemIds && relatedItemIds.length > 0 && (
                            <div className="mt-12">
                                <h3 className="font-headline text-2xl font-bold mb-4">Pairs Well With</h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                                    {relatedItemIds.map(pairingId => {
                                        const pairingItem = getMenuItemById(pairingId);
                                        if (!pairingItem) return null;
                                        return <PairingCard key={pairingId} item={pairingItem} />;
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {reviews && <ReviewsSheet open={isReviewsOpen} onOpenChange={setIsReviewsOpen} reviews={reviews} itemName={name} />}
            </div>
        </div>
    );
}
