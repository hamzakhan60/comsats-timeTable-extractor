"use client"
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, RefreshCw, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';

const TimetableVerification = () => {
    const [processedData, setProcessedData] = useState(null);
    const [pageData, setPageData] = useState(null);
    const [pageNames, setPageNames] = useState(null);
    const [totalPages, setTotalPages] = useState(0);
    const [randomPages, setRandomPages] = useState([]);
    const [currentVerificationIndex, setCurrentVerificationIndex] = useState(0);
    const [verificationResults, setVerificationResults] = useState({});
    const [showSummary, setShowSummary] = useState(false);

    const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

    // Generate random pages on mount or when requested
    const generateRandomPages = (count = 12) => {
        if (!totalPages || totalPages === 0) return;

        const pageCount = Math.min(count, totalPages);
        const pages = new Set();

        while (pages.size < pageCount) {
            const randomPage = Math.floor(Math.random() * totalPages) + 1;
            pages.add(randomPage);
        }

        const sortedPages = Array.from(pages).sort((a, b) => a - b);
        setRandomPages(sortedPages);
        setCurrentVerificationIndex(0);
        setVerificationResults({});
        setShowSummary(false);
    };

    useEffect(() => {
        try {
            const storedProcessedData = localStorage.getItem("processedData");
            const storedPageData = localStorage.getItem("pageData");
            const storedPageNames = localStorage.getItem("pageNames");
            const storedTotalPages = localStorage.getItem("totalPages");

            if (storedProcessedData && storedPageData) {
                setProcessedData(JSON.parse(storedProcessedData));
                setPageData(JSON.parse(storedPageData));
                setPageNames(JSON.parse(storedPageNames));
                setTotalPages(parseInt(storedTotalPages, 10));
            }
        } catch (err) {
            console.error("Error loading verification data:", err);
        }
    }, []);


    const currentPage = randomPages[currentVerificationIndex];
    const currentPageData = pageData?.[currentPage] || [];

    const markAsCorrect = () => {
        setVerificationResults(prev => ({
            ...prev,
            [currentPage]: { status: 'correct', timestamp: new Date().toISOString() }
        }));
        goToNext();
    };

    const markAsIncorrect = () => {
        setVerificationResults(prev => ({
            ...prev,
            [currentPage]: { status: 'incorrect', timestamp: new Date().toISOString() }
        }));
        goToNext();
    };

    const goToNext = () => {
        if (currentVerificationIndex < randomPages.length - 1) {
            setCurrentVerificationIndex(prev => prev + 1);
        } else {
            setShowSummary(true);
        }
    };

    const goToPrevious = () => {
        if (currentVerificationIndex > 0) {
            setCurrentVerificationIndex(prev => prev - 1);
            setShowSummary(false);
        }
    };

    const completedCount = Object.keys(verificationResults).length;
    const correctCount = Object.values(verificationResults).filter(r => r.status === 'correct').length;
    const incorrectCount = Object.values(verificationResults).filter(r => r.status === 'incorrect').length;
    const accuracy = completedCount > 0 ? ((correctCount / completedCount) * 100).toFixed(1) : 0;

    if (!processedData || !pageData) {
        return (
            <div className="p-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                    <p className="text-yellow-800 font-semibold">Please process timetable data first to enable verification.</p>
                </div>
            </div>
        );
    }

    if (showSummary) {
        return (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border-2 border-green-300">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Verification Summary</h2>

                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-white p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600 mb-1">Total Verified</p>
                            <p className="text-3xl font-bold text-gray-800">{completedCount}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600 mb-1">Correct</p>
                            <p className="text-3xl font-bold text-green-600">{correctCount}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600 mb-1">Incorrect</p>
                            <p className="text-3xl font-bold text-red-600">{incorrectCount}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <p className="text-sm text-gray-600 mb-1">Accuracy</p>
                            <p className="text-3xl font-bold text-indigo-600">{accuracy}%</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow mb-4">
                        <h3 className="font-semibold text-gray-700 mb-3">Verification Details</h3>
                        <div className="space-y-2">
                            {randomPages.map(page => {
                                const result = verificationResults[page];
                                const pageName = pageNames?.[page] || `Page ${page}`;
                                return (
                                    <div key={page} className="flex items-center justify-between p-2 border-b">
                                        <span className="font-medium">{pageName}</span>
                                        {result ? (
                                            <span className={`flex items-center gap-2 ${result.status === 'correct' ? 'text-green-600' : 'text-red-600'}`}>
                                                {result.status === 'correct' ? (
                                                    <>
                                                        <CheckCircle className="w-5 h-5" />
                                                        Correct
                                                    </>
                                                ) : (
                                                    <>
                                                        <XCircle className="w-5 h-5" />
                                                        Incorrect
                                                    </>
                                                )}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">Not verified</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowSummary(false)}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Review Verifications
                        </button>
                        <button
                            onClick={() => generateRandomPages()}
                            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                            <RefreshCw className="w-5 h-5" />
                            Start New Verification
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border-2 border-purple-300">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Manual Verification</h2>
                        <p className="text-gray-600">Compare parsed data with your original PDF to verify accuracy</p>
                    </div>
                    <button
                        onClick={() => generateRandomPages()}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
                    >
                        <RefreshCw className="w-4 h-4" />
                        New Random Set
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress: {completedCount} / {randomPages.length}</span>
                        <span>Page {currentVerificationIndex + 1} of {randomPages.length}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                            className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${(completedCount / randomPages.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Current Page Display */}
            <div className="bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
                    <h3 className="font-bold text-white text-xl">
                        Verifying: {pageNames?.[currentPage] || `Page ${currentPage}`}
                    </h3>
                    <p className="text-indigo-100 text-sm mt-1">
                        Compare this table with {pageNames?.[currentPage] || `page ${currentPage}`} in your PDF
                    </p>
                </div>

                <div className="p-4 bg-amber-50 border-b-2 border-amber-200">
                    <p className="text-amber-800 font-medium">
                        📋 Open your PDF to {pageNames?.[currentPage] || `page ${currentPage}`} and verify each cell matches the table below
                    </p>
                </div>

                {/* Timetable */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-xs">
                        <thead>
                            <tr className="bg-indigo-600 text-white">
                                <th className="border border-gray-300 px-3 py-2 text-sm font-semibold sticky left-0 bg-indigo-600 z-10">Day</th>
                                {(() => {
                                    const timeSlots = [...new Set(currentPageData.map(row => row.time))];
                                    timeSlots.sort((a, b) => {
                                        const [aHour, aMin] = a.split(':').map(Number);
                                        const [bHour, bMin] = b.split(':').map(Number);
                                        if (aHour !== bHour) return aHour - bHour;
                                        return aMin - bMin;
                                    });

                                    return timeSlots.map(time => (
                                        <th key={time} className="border border-gray-300 px-2 py-2 font-semibold">{time}</th>
                                    ));
                                })()}
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const timeSlots = [...new Set(currentPageData.map(row => row.time))];
                                timeSlots.sort((a, b) => {
                                    const [aHour, aMin] = a.split(':').map(Number);
                                    const [bHour, bMin] = b.split(':').map(Number);
                                    if (aHour !== bHour) return aHour - bHour;
                                    return aMin - bMin;
                                });

                                const dayTimeMap = {};
                                daysOfWeek.forEach(day => {
                                    dayTimeMap[day] = {};
                                });

                                currentPageData.forEach(row => {
                                    if (!dayTimeMap[row.day]) {
                                        dayTimeMap[row.day] = {};
                                    }
                                    dayTimeMap[row.day][row.time] = row;
                                });

                                return daysOfWeek.map((day, idx) => (
                                    <tr key={day} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="border border-gray-300 px-3 py-2 text-sm font-semibold text-indigo-700 sticky left-0 bg-inherit z-10">
                                            {day}
                                        </td>
                                        {timeSlots.map(time => {
                                            const cell = dayTimeMap[day][time];
                                            const isOccupied = cell && cell.occupied;
                                            return (
                                                <td
                                                    key={time}
                                                    className={`border border-gray-300 px-2 py-2 ${isOccupied ? 'bg-blue-50' : 'bg-gray-50'
                                                        }`}
                                                >
                                                    {isOccupied ? (
                                                        <div className="font-medium text-gray-800 text-xs whitespace-pre-wrap" title={cell.room}>
                                                            {cell.room}
                                                        </div>
                                                    ) : (
                                                        <div className="text-gray-400 text-center">-</div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ));
                            })()}
                        </tbody>
                    </table>
                </div>

                {/* Verification Buttons */}
                <div className="bg-gray-50 p-6 border-t-2 border-gray-200">
                    <p className="text-gray-700 font-semibold mb-4 text-center">
                        Does this match {pageNames?.[currentPage] || `page ${currentPage}`} in your PDF?
                    </p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={goToPrevious}
                            disabled={currentVerificationIndex === 0}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${currentVerificationIndex === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-600 text-white hover:bg-gray-700'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Previous
                        </button>

                        <button
                            onClick={markAsIncorrect}
                            className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg"
                        >
                            <XCircle className="w-5 h-5" />
                            No, Incorrect
                        </button>

                        <button
                            onClick={markAsCorrect}
                            className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-lg"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Yes, Correct
                        </button>

                        <button
                            onClick={goToNext}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                        >
                            Skip
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Verified Correct</p>
                    <p className="text-2xl font-bold text-green-600">{correctCount}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200">
                    <p className="text-sm text-gray-600 mb-1">Verified Incorrect</p>
                    <p className="text-2xl font-bold text-red-600">{incorrectCount}</p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-200">
                    <p className="text-sm text-gray-600 mb-1">Current Accuracy</p>
                    <p className="text-2xl font-bold text-indigo-600">{accuracy}%</p>
                </div>
            </div>
        </div>
    );
};

export default TimetableVerification;