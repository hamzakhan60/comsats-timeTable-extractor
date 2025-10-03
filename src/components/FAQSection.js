"use client"
import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const FAQSection = () => {
    const [expandedItems, setExpandedItems] = useState([]);

    const faqData = [
        {
            id: 1,
            question: "Wie hoch sind die einmaligen und wiederkehrenden Kosten?",
            answer: "Die Kosten variieren je nach Anbieter und Funktionsumfang. Einmalige Kosten können Setup-Gebühren und Schulungen umfassen, während wiederkehrende Kosten monatliche oder jährliche Lizenzgebühren beinhalten."
        },
        {
            id: 2,
            question: "Sind alle notwendigen Funktionen dabei?",
            answer: "Die meisten modernen Praxissoftware-Lösungen bieten umfassende Funktionen wie Terminplanung, Patientenverwaltung, Abrechnung und Dokumentation. Es ist wichtig, Ihre spezifischen Anforderungen mit den verfügbaren Funktionen abzugleichen."
        },
        {
            id: 3,
            question: "Welche Infrastruktur ist für den Betrieb notwendig?",
            answer: "Cloud-basierte Lösungen benötigen lediglich eine stabile Internetverbindung und moderne Browser. Lokale Installationen erfordern Server, Arbeitsplatzrechner und entsprechende Netzwerkinfrastruktur."
        },
        {
            id: 4,
            question: "Skaliert die Software?",
            answer: "Die meisten modernen Praxissoftware-Systeme sind skalierbar und können mit Ihrer Praxis wachsen. Sie können zusätzliche Benutzer, Standorte und Funktionen nach Bedarf hinzufügen."
        },
        {
            id: 5,
            question: "Sind die notwendigen Integrationen vorhanden?",
            answer: "Moderne Praxissoftware bietet in der Regel Schnittstellen zu Laboren, Röntgenarchiven, Buchhaltungssystemen und anderen wichtigen Diensten. Prüfen Sie die verfügbaren Integrationen vor der Entscheidung."
        }
    ];

    const toggleItem = (itemId) => {
        setExpandedItems(prev => 
            prev.includes(itemId) 
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    return (
        <div className="max-w-5xl mx-auto py-6 sm:py-8 md:py-10 lg:py-12 px-4 sm:px-6 lg:px-8">
            {/* Main Title */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-title mb-6 sm:mb-7 md:mb-8 pb-3 sm:pb-4">
                Was muss ich bei der Wahl der Praxissoftware beachten?
            </h2>

            {/* FAQ Items */}
            <div className="space-y-3 sm:space-y-4">
                {faqData.map((faq, index) => {
                    const isExpanded = expandedItems.includes(faq.id);
                    const isLast = index === faqData.length - 1;

                    return (
                        <div 
                            key={faq.id} 
                            className={`bg-card rounded-lg p-4 sm:p-5 md:p-6 ${isLast ? '' : ''}`}
                        >
                            <button
                                onClick={() => toggleItem(faq.id)}
                                className="w-full flex items-start sm:items-center justify-between text-left transition-colors gap-3 sm:gap-4"
                            >
                                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-faq text-[#000000] pr-2 sm:pr-4 md:pr-8 leading-snug sm:leading-normal">
                                    {faq.question}
                                </span>
                                <span className="flex-shrink-0 text-secondary cursor-pointer mt-0.5 sm:mt-0">
                                    {isExpanded ? (
                                        <Minus className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                                    ) : (
                                        <Plus className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={2} />
                                    )}
                                </span>
                            </button>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="pb-1 pt-3 sm:pt-4 md:pt-5 pr-2 sm:pr-6 md:pr-12">
                                    <p className="text-description font-description text-sm sm:text-base md:text-lg leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FAQSection;