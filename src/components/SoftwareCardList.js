"use client"
import React, { useState, useEffect } from 'react';
import { Star, Minus, Plus, CheckCheck, X } from 'lucide-react';
import Image from 'next/image';
import Button from './Button';
import { getAllSoftwareWithReviews } from '@/lib/api'

const SoftwareCardList = () => {
    const [expandedCards, setExpandedCards] = useState([]);
    const [softwareData, setSoftware] = useState([])
    const [selectedClients, setSelectedClients] = useState(['All']);
    const [selectedCountries, setSelectedCountries] = useState(['All']);

    useEffect(() => {
        const fetchData = async () => {
            const softwareList = await getAllSoftwareWithReviews()
            console.log("software", softwareList)
            setSoftware(softwareList)
        }
        fetchData()
    }, [])

    const filteredSoftware = softwareData.filter((software) => {
        // --- Client Filter ---
        const matchesClient =
            selectedClients.includes("All") ||
            software.clients_installation.some((client) => {
                if (selectedClients.includes("Windows OS") && client.includes("Windows")) return true;
                if (selectedClients.includes("Mac OS") && client.includes("Mac")) return true;
                if (selectedClients.includes("Web basiert") && client.includes("Web")) return true;
                if (selectedClients.includes("Mobile App") && (client.includes("iOS") || client.includes("Android"))) return true;
                return false;
            });

        // --- Country Filter ---
        const matchesCountry =
            selectedCountries.includes("All") ||
            software.land.some((country) => {
                if (selectedCountries.includes("Schweiz") && country === "CH") return true;
                if (selectedCountries.includes("Deutschland") && country === "DE") return true;
                if (selectedCountries.includes("Österreich") && country === "AT") return true;
                return false;
            });

        return matchesClient && matchesCountry;
    });

    const clientOptions = [
        { id: 'all', label: 'All', value: 'All' },
        { id: 'web', label: 'Web basiert', value: 'Web basiert' },
        { id: 'windows', label: 'Windows OS', value: 'Windows OS' },
        { id: 'mac', label: 'Mac OS', value: 'Mac OS' },
        { id: 'mobile', label: 'Mobile App', value: 'Mobile App' }
    ];

    const countryOptions = [
        { id: 'all', label: 'All', value: 'All' },
        { id: 'schweiz', label: 'Schweiz', value: 'Schweiz' },
        { id: 'deutschland', label: 'Deutschland', value: 'Deutschland' },
        { id: 'osterreich', label: 'Österreich', value: 'Österreich' }
    ];

    const toggleClient = (value) => {
        if (value === 'All') {
            setSelectedClients(['All']);
        } else {
            setSelectedClients(prev => {
                const filtered = prev.filter(item => item !== 'All');
                if (filtered.includes(value)) {
                    const newSelection = filtered.filter(item => item !== value);
                    return newSelection.length === 0 ? ['All'] : newSelection;
                } else {
                    return [...filtered, value];
                }
            });
        }
    };

    const toggleCountry = (value) => {
        if (value === 'All') {
            setSelectedCountries(['All']);
        } else {
            setSelectedCountries(prev => {
                const filtered = prev.filter(item => item !== 'All');
                if (filtered.includes(value)) {
                    const newSelection = filtered.filter(item => item !== value);
                    return newSelection.length === 0 ? ['All'] : newSelection;
                } else {
                    return [...filtered, value];
                }
            });
        }
    };

    const getResultsCount = () => {
        return filteredSoftware.length ? filteredSoftware.length : 0;
    };


    const toggleCard = (cardId) => {
        setExpandedCards(prev =>
            prev.includes(cardId)
                ? prev.filter(id => id !== cardId)
                : [...prev, cardId]
        );
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-secondary text-secondary" />);
        }
        if (hasHalfStar) {
            stars.push(<Star key="half" className="w-4 h-4 sm:w-5 sm:h-5 fill-secondary text-pink-500" style={{ clipPath: 'inset(0 50% 0 0)' }} strokeWidth={0.75} />);
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<Star key={`empty-${i}`} fill='#93939F' className="w-4 h-4 sm:w-5 sm:h-5 text-empty-star" />);
        }
        return stars;
    };

    return (
        <div className="max-w-5xl mx-auto py-4 sm:py-6 md:py-8 px-4 sm:px-6 lg:px-8 space-y-3 sm:space-y-4">

            {/* Title */}
            <h1 className="font-title text-2xl sm:text-3xl md:text-4xl  text-title mb-6 sm:mb-8 md:mb-10">
                Softwarevergleich: Tiermedizin
            </h1>
            <div className=' bg-card rounded-2xl p-6'>
                {/* Filter Section 1 - Client */}
                <div className="mb-2">
                    <h3 className="text-xl font-title sm:text-lg text-card-title sm:mb-4">
                        Mit welchem Client möchten Sie die Software aufrufen?
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {clientOptions.map((option) => (
                            <span
                                key={option.id}
                                onClick={() => toggleClient(option.value)}
                                className={` px-2 py-1 rounded-sm text-xs font-medium flex items-center gap-1.5 sm:gap-2 cursor-pointer 
        ${selectedClients.includes(option.value)
                                        ? "bg-primary text-white"
                                        : "bg-feature-bg text-feature hover:bg-primary/90 hover:text-white"
                                    }`}
                            >
                                {/* Icon logic */}
                                <CheckCheck
                                    size={14}
                                    className="sm:w-4 sm:h-4 flex-shrink-0"
                                    strokeWidth={3}
                                />
                                {/* Label */}
                                <span className="whitespace-nowrap">{option.label}</span>
                                {/* Remove X when selected (except "all") */}
                                {selectedClients.includes(option.value) && option.id !== "all" && (
                                    <X className="w-3.5 h-3.5 ml-0.5" strokeWidth={2.5} />
                                )}
                            </span>
                        ))}
                    </div>

                </div>

                {/* Filter Section 2 - Country */}
                <div className="mb-4 sm:mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-3 ">
                        <div>
                            <h3 className="text-xl font-title sm:text-lg text-card-title ">
                                Für welches Land suchen Sie eine Praxissoftware?
                            </h3>

                            <div className="flex flex-wrap gap-2">
                                {countryOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => toggleCountry(option.value)}
                                        className={` px-2 py-1 rounded-sm text-xs font-medium flex items-center gap-1.5 sm:gap-2 cursor-pointer 
        ${selectedCountries.includes(option.value)
                                                ? "bg-secondary text-white"
                                                : "bg-feature2-bg text-secondary hover:bg-secondary/90 hover:text-white"
                                            }`}
                                    >
                                        {/* Icon logic */}
                                        <CheckCheck
                                            size={14}
                                            className="sm:w-4 sm:h-4 flex-shrink-0"
                                            strokeWidth={3}
                                        />
                                        <span>{option.label}</span>
                                        {selectedCountries.includes(option.value) && option.id !== 'all' && (
                                            <X className="w-3.5 h-3.5 ml-0.5" strokeWidth={2.5} />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                            {getResultsCount()} Resultate verfügbar
                        </span>
                    </div>
                </div>

            </div>
            {filteredSoftware?.length > 0 && (
                filteredSoftware.map((software) => {
                    const isExpanded = expandedCards.includes(software.id)

                    return (
                        <div key={software.id} className="bg-card rounded-xl sm:rounded-2xl shadow-sm">
                            {/* Card Header */}
                            <div className="flex items-start justify-between p-4 sm:p-5 md:p-6">
                                <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                    {/* Logo */}
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={software.logo_url}
                                            alt={software.name}
                                            width={77}
                                            height={55}
                                            className="w-12 h-auto sm:w-16 md:w-[77px]"
                                        />
                                    </div>

                                    {/* Title and Rating */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg sm:text-xl md:text-[24px] font-semibold font-font-family-display text-primary mb-1 sm:mb-2 truncate">
                                            {software.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                            <div className="flex space-x-0.5 sm:space-x-1.25 items-center">
                                                {renderStars(software.rating)}
                                            </div>
                                            <span className="text-sm sm:text-base font-description text-dark-gray whitespace-nowrap">
                                                {software.rating} (4)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Toggle Button */}
                                <button
                                    onClick={() => toggleCard(software.id)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 flex-shrink-0 ml-2"
                                >
                                    {isExpanded ? (
                                        <Minus className="w-5 h-5 sm:w-6 sm:h-6" />
                                    ) : (
                                        <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                                    )}
                                </button>
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                                <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 space-y-4 sm:space-y-5 md:space-y-6">
                                    {/* Description Section */}
                                    <div>
                                        <h4 className="text-lg sm:text-[20px] font-title text-card-title mb-2 sm:mb-3">Beschreibung</h4>
                                        <p className="text-sm sm:text-base text-dark-gray leading-relaxed mb-3 sm:mb-4">
                                            {software.kurzbeschreibung}
                                        </p>
                                        <div className="flex gap-3">
                                            <Button text="Besuchen" style="btn-primary" />
                                            <Button text="Zur Webseite" style="btn-tertiary" />
                                        </div>
                                    </div>

                                    {/* Features Section */}
                                    <div className='border-y border-light-gray'>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 my-6 sm:my-8 md:my-10">
                                            {/* Features Tags */}
                                            <div className='mt-3 sm:mt-5'>
                                                <h4 className="text-lg sm:text-[20px] font-title text-card-title mb-2 sm:mb-3">Eigenschaften</h4>
                                                <div className="flex flex-wrap gap-1.5 sm:gap-2 content-start">
                                                    {software.eigenschaften.map((feature, index) => (
                                                        <span
                                                            key={index}
                                                            className="bg-feature-bg text-feature px-2 py-1 rounded-sm text-xs font-medium flex items-center gap-1.5 sm:gap-2"
                                                        >
                                                            <CheckCheck size={14} className="sm:w-4 sm:h-4 flex-shrink-0" strokeWidth={3} />
                                                            <span className="whitespace-nowrap">{feature}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Screenshot */}
                                            <div className="w-full max-w-[480px] aspect-[480/241] relative overflow-hidden rounded-lg mx-auto lg:mx-0">
                                                <Image
                                                    src={software.screenshot_url}
                                                    alt={`Screenshot`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reviews Section */}
                                    <div>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 sm:mb-4">
                                            <h4 className="text-lg sm:text-[20px] font-title text-card-title">
                                                Kundenbewertungen ({software.bewertungen.length})
                                            </h4>
                                            <Button text="Bewerten" style="btn-primary" />
                                        </div>
                                        <div className="space-y-3 sm:space-y-4 w-full lg:w-[90%]">
                                            {software.bewertungen.map((review) => (
                                                <div key={review.id} className="pt-3 sm:pt-4">
                                                    <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 mb-2">
                                                        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                                                            {renderStars(review.bewertung)}
                                                        </div>
                                                        <div className='flex flex-col w-full'>
                                                            <span className="text-base sm:text-lg md:text-[20px] font-title text-card-title break-words">
                                                                {review.vorname_nachname}
                                                                {review.created_on}
                                                            </span>
                                                            <p className="text-sm sm:text-base text-dark-gray leading-relaxed break-words">
                                                                {review.erfahrung}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default SoftwareCardList;