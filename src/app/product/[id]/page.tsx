
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { getProductItemById, getMenuItemById } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, MinusCircle, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AttributeIcons from "@/components/allergen-icons";
import { useCart } from '@/context/CartContext';
import type { ModificationGroup, ModificationOption } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import StarRating from '@/components/star-rating';
import ReviewsSheet from '@/components/reviews-sheet';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import PairingCard from '@/components/pairing-card';

export default function ProductDetailPage() {
    const params = useParams();
    const item = getProductItemById(params.id as string);
    const { addToCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [selectedModifications, setSelectedModifications] = useState<ModificationOption[]>([]);
    const [isReviewsOpen, setIsReviewsOpen] = useState(false);

    if (!item) {
        notFound();
    }
    
    const { id, name, description: itemDescription, price, attributes, imageId, modifications, averageRating, reviews, relatedItemIds } = item;

    const image = PlaceHolderImages.find(p => p.id === imageId);
    const imageUrl = image?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400';
    const imageHint = image?.imageHint || 'product image';
    const description = itemDescription;


    const handleModificationChange = (group: ModificationGroup, option: ModificationOption) => {
        setSelectedModifications(prev => {
            // First, remove any options from the same group if it's a 'single' select type
            const otherOptionsFromGroup = prev.filter(mod => 
                !group.options.some(opt => opt.id === mod.id)
            );
            
            if (group.type === 'single') {
                 return [...otherOptionsFromGroup, option];
            } else { // 'multiple'
                const isAlreadySelected = prev.some(mod => mod.id === option.id);
                if (isAlreadySelected) {
                    return prev.filter(mod => mod.id !== option.id);
                } else {
                    return [...prev, option];
                }
            }
        });
    };

    const calculateCurrentPrice = () => {
        const modsPrice = selectedModifications.reduce((sum, mod) => sum + mod.price, 0);
        return (price + modsPrice) * quantity;
    };

    const handleAddToCart = () => {
        addToCart(item, quantity, selectedModifications);
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
                    <div className="relative aspect-square w-full min-h-[300px] rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={imageUrl}
                            alt={name}
                            fill
                            className="object-cover"
                            data-ai-hint={imageHint}
                            sizes="100vw"
                        />
                    </div>
                    <div className="flex flex-col justify-center">
                        <h1 className="font-headline text-4xl font-bold mb-2">{name}</h1>
                        {averageRating && reviews && reviews.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <StarRating rating={averageRating} />
                                <Button variant="link" className="p-0 h-auto text-muted-foreground" onClick={() => setIsReviewsOpen(true)}>
                                    ({reviews.length} reviews)
                                </Button>
                            </div>
                        )}
                        <p className="text-lg text-muted-foreground mb-6">{description}</p>
                        
                        {attributes && attributes.length > 0 && (
                            <div className="mb-6">
                                <h4 className="font-headline text-lg font-semibold mb-3">Details</h4>
                                <AttributeIcons attributes={attributes} />
                            </div>
                        )}
                        
                        {modifications && modifications.length > 0 && (
                            <div className="space-y-6 mb-6">
                                {modifications.map(group => (
                                    <div key={group.id}>
                                        <h4 className="font-headline text-lg font-semibold mb-3">{group.title}</h4>
                                        <div className="space-y-3">
                                            {group.type === 'multiple' && group.options.map(option => (
                                                <div key={option.id} className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`${group.id}-${option.id}`}
                                                            onCheckedChange={() => handleModificationChange(group, option)}
                                                            checked={selectedModifications.some(mod => mod.id === option.id)}
                                                        />
                                                        <Label htmlFor={`${group.id}-${option.id}`}>{option.name}</Label>
                                                    </div>
                                                    <span className="text-muted-foreground">+${option.price.toFixed(2)}</span>
                                                </div>
                                            ))}
                                            {group.type === 'single' && (
                                                <RadioGroup onValueChange={(value) => {
                                                    const selectedOption = group.options.find(o => o.id === value);
                                                    if (selectedOption) {
                                                        handleModificationChange(group, selectedOption);
                                                    }
                                                }}>
                                                    {group.options.map(option => (
                                                        <div key={option.id} className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value={option.id} id={`${group.id}-${option.id}`} />
                                                                <Label htmlFor={`${group.id}-${option.id}`}>{option.name}</Label>
                                                            </div>
                                                            <span className="text-muted-foreground">+${option.price.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

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
                                <h3 className="font-headline text-2xl font-bold mb-4">Related Products</h3>
                                <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
                                    {relatedItemIds.map(relatedId => {
                                        const relatedItem = getMenuItemById(relatedId);
                                        if (!relatedItem) return null;
                                        return <PairingCard key={relatedId} item={relatedItem} />;
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
