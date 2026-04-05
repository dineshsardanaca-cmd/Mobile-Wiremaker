
'use client';

import Link from 'next/link';
import { getCouponItemById, getMenuItemById } from "@/lib/data";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import AttributeIcons from "@/components/allergen-icons";
import StarRating from '@/components/star-rating';
import ReviewsSheet from '@/components/reviews-sheet';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import PairingCard from '@/components/pairing-card';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/context/CartContext';

export default function CouponDetailPage() {
    const params = useParams();
    const item = getCouponItemById(params.id as string);
    const [isReviewsOpen, setIsReviewsOpen] = useState(false);
    const { addToCart } = useCart();

    if (!item) {
        notFound();
    }
    
    const { id, name, description, venue, attributes, imageId, qrCodeImageId, terms, averageRating, reviews, relatedItemIds } = item;

    const image = PlaceHolderImages.find(p => p.id === imageId);
    const imageUrl = image?.imageUrl || 'https://picsum.photos/seed/placeholder/600/400';
    const imageHint = image?.imageHint || 'coupon image';

    const qrCodeImage = PlaceHolderImages.find(p => p.id === qrCodeImageId);
    const qrCodeUrl = qrCodeImage?.imageUrl || 'https://picsum.photos/seed/qrcode/300/300';
    const qrCodeHint = qrCodeImage?.imageHint || 'qr code';

    const handleAddToCart = () => {
        addToCart(item, 1, []);
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
                    <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-lg">
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
                        <p className="text-md font-semibold text-primary">{venue}</p>
                        <h1 className="font-headline text-4xl font-bold mb-2">{name}</h1>
                        {averageRating && reviews && reviews.length > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <StarRating rating={averageRating} />
                                <Button variant="link" className="p-0 h-auto text-muted-foreground" onClick={() => setIsReviewsOpen(true)}>
                                    ({reviews.length} reviews for {venue})
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
                        
                        <Button size="lg" className="w-full mb-6" onClick={handleAddToCart}>
                            Add Deal to Cart
                        </Button>

                        <Card className="my-6 bg-accent/50">
                            <CardHeader>
                                <CardTitle className="text-center font-headline text-2xl">Your Coupon Code</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col items-center gap-4">
                                <div className="relative aspect-square w-48 h-48 rounded-lg overflow-hidden border-4 border-card">
                                    <Image 
                                        src={qrCodeUrl} 
                                        alt="QR Code" 
                                        fill
                                        sizes="192px"
                                        className="object-cover"
                                        data-ai-hint={qrCodeHint}
                                    />
                                </div>
                                <p className="text-muted-foreground text-center text-sm">Show this code to the merchant to redeem your offer.</p>
                            </CardContent>
                        </Card>

                        <div className="mb-6 prose prose-sm max-w-none text-muted-foreground">
                            <h4 className="font-headline text-lg font-semibold mb-2 text-foreground">Terms & Conditions</h4>
                           <p>{terms}</p>
                        </div>


                        {relatedItemIds && relatedItemIds.length > 0 && (
                            <div className="mt-12">
                                <h3 className="font-headline text-2xl font-bold mb-4">You Might Also Like</h3>
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
                {reviews && <ReviewsSheet open={isReviewsOpen} onOpenChange={setIsReviewsOpen} reviews={reviews} itemName={venue} />}
            </div>
        </div>
    );
}
