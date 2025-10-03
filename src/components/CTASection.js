import React from 'react';
import Button from './Button';

const CTASection = () => {
    return (
        <div className='bg-dots min-h-[300px] sm:min-h-[360px] md:min-h-[400px] lg:h-[460px] flex justify-center items-center w-full px-4'>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 text-center">
                {/* Subtitle */}
                <p className="text-description font-description text-sm sm:text-base md:text-lg mb-3 sm:mb-4 px-2">
                    In der Basisversion kostenlos und ohne Aufschaltgebühren.
                </p>

                {/* Main Heading */}
                <h2 className="text-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-title leading-tight px-2">
                    Probiere Unomed jetzt aus
                </h2>

                {/* CTA Buttons */}
               <div className="flex flex-wrap items-center justify-center  mt-10 gap-4">
                    <Button 
                        text="Jetzt starten" 
                        style="btn-primary" 
                        customStyle="py-2.5 sm:py-3 px-5 sm:px-6 text-sm sm:text-base w-full  sm:w-auto"
                    />
                    <Button 
                        text="Demo vereinbaren" 
                        style="btn-secondary" 
                        customStyle="py-2.5 sm:py-3 px-5 sm:px-6 text-sm sm:text-base w-full sm:w-auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default CTASection;