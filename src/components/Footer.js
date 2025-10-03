import React from 'react';
import { Check } from 'lucide-react';
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="bg-primary text-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-0 max-w-5xl mx-auto">
                    {/* Column 1 - Logo and Description */}
                    <div className="w-full lg:w-[403px] bg-light-blue rounded-2xl p-4 sm:p-5 md:p-6">
                        <div className="mb-4">
                            <Image
                                src="/logo.png"
                                alt="Unomed Logo"
                                width={150}
                                height={24}
                                className="h-5 sm:h-6 w-auto"
                            />
                            <p className="text-sm sm:text-base mt-2 text-white leading-relaxed mb-4 sm:mb-6">
                                Ihre #1 für sichere medizinische Kommunikation und Kollaboration.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 mb-6 sm:mb-8">
                            {/* App Store Button */}
                            <a
                                href="#"
                                className="flex items-center bg-white rounded-lg px-4 py-2 shadow hover:shadow-md transition w-[168px] max-w-[200px]"
                            >
                                <Image
                                    src="/apple_logo.png"
                                    alt="Apple Logo"
                                    width={50}
                                    height={50}
                                    className="w-12 h-12"
                                />
                                <div className="ml-3 leading-tight text-left">
                                    <p className="text-[10px] text-gray-500">Download on the</p>
                                    <p className="text-sm font-semibold text-gray-900">App Store</p>
                                </div>
                            </a>

                            {/* Google Play Button */}
                            <a
                                href="#"
                                className="flex items-center bg-white rounded-lg px-4 py-2 shadow hover:shadow-md transition  w-[168px] max-w-[200px]"
                            >
                                <Image
                                    src="/google_play_logo.png"
                                    alt="Google Play Logo"
                                    width={50}
                                    height={50}
                                    className="w-12 h-12"
                                />
                                <div className="ml-3 leading-tight text-left">
                                    <p className="text-[10px] text-gray-500">GET IT ON</p>
                                    <p className="text-sm font-semibold text-gray-900">Google Play</p>
                                </div>
                            </a>
                        </div>


                        {/* Features */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-white flex-shrink-0" />
                                <span className="text-sm">Sicher</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-white flex-shrink-0" />
                                <span className="text-sm">DSG-konform</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-white flex-shrink-0" />
                                <span className="text-sm">Made in Zurich</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2 - Links Section */}
                    <div className="w-full text-white py-6 sm:py-8 md:py-12">
                        {/* First Row - Produkt / Anwendungsfälle / Für wen? */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
                            {/* Column 1 - Produkt */}
                            <div>
                                <h3 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">Produkt</h3>
                                <ul className="space-y-1.5 sm:space-y-2 text-sm text-gray-300">
                                    <li className="hover:text-white transition-colors cursor-pointer">Funktionen</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Integrationen</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">App herunterladen</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Sicherheit & Datenschutz</li>
                                </ul>
                            </div>

                            {/* Column 2 - Anwendungsfälle */}
                            <div>
                                <h3 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">Anwendungsfälle</h3>
                                <ul className="space-y-1.5 sm:space-y-2 text-sm text-gray-300">
                                    <li className="hover:text-white transition-colors cursor-pointer">Medizinische Teamkommunikation</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Patientenfälle im Team besprechen</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">DICOM-Studien übermitteln</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Arztberichten diktieren</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Patienten sicher & digital einbinden</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Umfragen & PROMs einholen</li>
                                </ul>
                            </div>

                            {/* Column 3 - Für wen? */}
                            <div>
                                <h3 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">Für wen?</h3>
                                <ul className="space-y-1.5 sm:space-y-2 text-sm text-gray-300">
                                    <li className="hover:text-white transition-colors cursor-pointer">Ärzt:innen</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">MPAs</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Patient:innen</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Praxen & Gruppenpraxen</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Spitäler & Kliniken</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Berufsverbände</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Sportmedizin</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Zahnärzt:innen</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Tierärzt:innen</li>
                                </ul>
                            </div>
                        </div>

                        {/* Second Row - Resourcen / Unternehmen / Rechtliches */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                            {/* Column 1 - Resourcen */}
                            <div>
                                <h3 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">Resourcen</h3>
                                <ul className="space-y-1.5 sm:space-y-2 text-sm text-gray-300">
                                    <li className="hover:text-white transition-colors cursor-pointer">Magazin</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Case Studies</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Whitepapers</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Software Vergleich</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Software Beratung</li>
                                </ul>
                            </div>

                            {/* Column 2 - Unternehmen */}
                            <div>
                                <h3 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">Unternehmen</h3>
                                <ul className="space-y-1.5 sm:space-y-2 text-sm text-gray-300">
                                    <li className="hover:text-white transition-colors cursor-pointer">Über Unomed</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Kontakt</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Partner</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Werde Teil vom Team</li>
                                </ul>
                            </div>

                            {/* Column 3 - Rechtliches */}
                            <div>
                                <h3 className="font-bold mb-3 sm:mb-4 text-base sm:text-lg">Rechtliches</h3>
                                <ul className="space-y-1.5 sm:space-y-2 text-sm text-gray-300">
                                    <li className="hover:text-white transition-colors cursor-pointer">Impressum</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">Datenschutzerklärung</li>
                                    <li className="hover:text-white transition-colors cursor-pointer">AGB</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}