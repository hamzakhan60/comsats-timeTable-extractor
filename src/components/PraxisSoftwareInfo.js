import React from 'react';
import Button from './Button';

const PraxisSoftwareInfo = () => {
    return (
        <div className="max-w-5xl mx-auto py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
            {/* Main Content Text */}
            <div className="text-left leading-[145%] text-description mb-6 sm:mb-7 md:mb-8 font-description mx-auto text-base sm:text-lg md:text-xl lg:text-2xl">
                <p className="mb-4 sm:mb-5 md:mb-6">
                    Die Wahl der richtigen Praxissoftware ist für Tierärztinnen und Tierärzte entscheidend, um 
                    den Praxisalltag effizient zu organisieren und eine hochwertige Versorgung der Tiere 
                    sicherzustellen. Moderne Lösungen bieten Funktionen wie Terminplanung, Patientenverwaltung, 
                    Abrechnung und Lagerverwaltung, die den Arbeitsaufwand deutlich reduzieren. Darüber hinaus 
                    ermöglichen viele Systeme die Integration externer Dienste wie Labore oder Röntgenarchive.
                </p>
                <p>
                    Mit der passenden Software lassen sich nicht nur Zeit und Kosten sparen, sondern auch die 
                    Zufriedenheit von Team und Tierbesitzern steigern.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5  sm:flex-row ">
                <Button 
                    text="zurück zum Verlgeichsportal" 
                    style="btn-primary" 
                    customStyle="text-sm sm:text-[15px] md:text-[16px] px-3 sm:px-4"  
                />
                <Button 
                    text="Anleitung" 
                    style="btn-secondary" 
                    customStyle="text-sm sm:text-[15px] md:text-[16px] px-3 sm:px-4"
                />
                <Button 
                    text="Entscheidungskriterien" 
                    style="btn-secondary" 
                    customStyle="text-sm sm:text-[15px] md:text-[16px] px-3 sm:px-4"
                />
            </div>
        </div>
    );
};

export default PraxisSoftwareInfo;