import React from 'react';
import { Check, CircleCheck, Clock, MapPin, PiggyBank, Plus } from 'lucide-react';
import Button from './Button';
import Image from 'next/image';

export default function VeterinaryHero() {
    return (
        <section className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Main Heading */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-font-family-sans font-title text-center mb-4 sm:mb-5 md:mb-6 text-title leading-tight px-2">
                    Die beste Praxissoftware für Tierärzte 2025
                </h1>

                {/* Subtitle */}
                <div className='text-center text-description mb-6 sm:mb-7 md:mb-8 font-description mx-auto text-base sm:text-lg md:text-xl lg:text-2xl px-2'>
                    <p className="mb-1">Erfahren Sie, worauf es bei der Auswahl der passenden Software für Tierärzte und</p>
                    <p className="mb-1">Tierärztinnen ankommt – oder springen Sie direkt zum Vergleich der</p>
                    <p>Praxisinformationssysteme 2025 in der Schweiz, Österreich und Deutschland.</p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-8 sm:mb-9 md:mb-10 px-4">
                    <Button 
                        text="zum Vergleich" 
                        style="btn-primary" 
                        customStyle="px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-base sm:text-lg md:text-xl font-normal" 
                    />
                    <Button 
                        text="Beratung" 
                        style="btn-secondary" 
                        customStyle="px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 text-base sm:text-lg md:text-xl font-normal" 
                    />
                </div>

                {/* Feature Pills */}
                <div className="flex flex-wrap justify-center font-font-family-sans font-description gap-2 sm:gap-2.5 mb-8 sm:mb-10 md:mb-12 px-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-background px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full">
                        <div className="bg-dark-gray rounded-full p-0.5 sm:p-1 flex items-center justify-center flex-shrink-0">
                            <Check className="text-white w-3 h-3 sm:w-3.5 sm:h-3.5" strokeWidth={3} />
                        </div>
                        <span className="text-xs sm:text-sm text-dark-gray whitespace-nowrap">umfassende Übersicht</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-background px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full">
                        <div className="rounded-full p-0.5 sm:p-1 flex items-center justify-center flex-shrink-0">
                            <PiggyBank className="w-4 h-4 sm:w-5 sm:h-5 text-dark-gray" strokeWidth={2} />
                        </div>
                        <span className="text-xs sm:text-sm text-dark-gray whitespace-nowrap">Erstberatung kostenlos</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-gray-background px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full">
                        <div className="bg-dark-gray rounded-md flex items-center justify-center p-0.5 sm:p-1 flex-shrink-0">
                            <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" strokeWidth={3} />
                        </div>
                        <span className="text-xs sm:text-sm text-dark-gray whitespace-nowrap">aus der Schweiz</span>
                    </div>
                </div>

                {/* Illustration Section */}
                <div className="w-full px-2 sm:px-4 md:px-0">
                    <Image
                        src="/tsVergleich.png"
                        alt="Treuhand Vergleich"
                        width={1200}
                        height={800}
                        className="w-full h-auto rounded-lg"
                    />
                </div>

            </div>
        </section>
    );
}