"use client"
import { useState } from 'react';
import { Upload, Download, FileJson, FileSpreadsheet, AlertCircle, CheckCircle, FileUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter } from "next/navigation";

const TimetableProcessor = () => {
    const [jsonInput, setJsonInput] = useState('');
    const [processedData, setProcessedData] = useState(null);
    const [error, setError] = useState('');
    const [stats, setStats] = useState(null);
    const [uploadMode, setUploadMode] = useState('upload');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentRoom, setCurrentRoom] = useState('A-2');
    const [pageData, setPageData] = useState(null);
    const router = useRouter();

    const isDisabled =false
   

    const handleClick = () => {
    if (isDisabled) return;

    // Save data in localStorage
    localStorage.setItem("processedData", JSON.stringify(processedData));
    localStorage.setItem("pageData", JSON.stringify(pageData));
    localStorage.setItem("roomTitles", JSON.stringify(roomTitles));
    localStorage.setItem("totalPages", stats.totalPages);

    // Navigate to verify page
    router.push("/verify");
  };

    const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    const roomTitles = [
        'A-2', 'A-3', 'A-10', 'A-6', 'B-5', 'B-6', 'C-5', 'C-6',
        'N-1', 'N-2', 'N-3', 'N-4', 'N-5', 'N-6', 'N-7', 'N-8',
        'N-9', 'N-10', 'N-11', 'N-12', 'N-13', 'N-14', 'N-15', 'N-16',
        'N-17', 'N-21', 'N-22', 'N-23', 'N-24', 'N-25-A', 'N-25-B',
        'N-18-A', 'N-18-B', 'N-19-A', 'N-19-B', 'D-8', 'D-9', 'D-10',
        'D-12', 'D-110', 'D-111', 'D-117', 'D-119', 'D-2', 'D-3', 'D-5',
        'D-6', 'D-11', 'D-13', 'D-14', 'D-15', 'D-106', 'D-107', 'D-109',
        'D-112', 'D-113', 'D-115', 'D-116', 'D-118', 'D-114',
        'O-1', 'O-2', 'O-3', 'O-4', 'K1-Lab'
    ];

    const processTimeSlot = (timeStr) => {
        if (!timeStr || timeStr.trim() === '') return null;

        // Extract slot number and time
        // Format can be "1\n8:309:00" or "237:308:00" or "9\n12:301:00"
        const withNewline = timeStr.match(/^(\d+)\n(\d{1,2}):(\d{2})(\d{1,2}):(\d{2})$/);
        const withoutNewline = timeStr.match(/^(\d+)(\d{1,2}):(\d{2})(\d{1,2}):(\d{2})$/);
        let match = withNewline || withoutNewline;

        if (match) {
            const slotNumber = parseInt(match[1]);
            const startHour = parseInt(match[2]);
            const startMin = match[3];

            // Convert to 24-hour format
            // If slot number > 12, add 12 hours for PM time
            let finalStartHour = startHour;

            if (slotNumber > 9) {
                finalStartHour = startHour + 12;

                // Handle wraparound (if hour goes beyond 24)
                if (finalStartHour >= 24) finalStartHour -= 24;
            }

            const formattedStart = `${String(finalStartHour).padStart(2, '0')}:${startMin}`;

            return formattedStart;
        }

        return null;
    };

    const extractRoomFromCell = (cellContent) => {
        if (!cellContent || cellContent.trim() === '') return null;

        // Extract room/class information from cell content
        const lines = cellContent.split('\n').filter(line => line.trim() !== '');
        if (cellContent.length > 0) {
            return cellContent;
        }
        return null;
    };

    const processTimetable = () => {
        try {
            setError('');
            const data = JSON.parse(jsonInput);

            if (!data.pageTables || !Array.isArray(data.pageTables)) {
                throw new Error('Invalid JSON structure: pageTables not found');
            }

            const allResults = [];
            const pageResults = {};
            let totalOccupied = 0;
            let totalFree = 0;

            data.pageTables.forEach((pageTable, pageIndex) => {
                const tables = pageTable.tables;
                const merges = pageTable.merges || {};
                const mergeAlias = pageTable.merge_alias || {};
                const pageNum = pageTable.page || (pageIndex + 1);
                const room = roomTitles[pageTable.page];

                console.log("room", room);
                console.log(pageTable)

                if (!tables || !Array.isArray(tables)) return;

                const headerRow = tables[tables.length - 1];

                const dayColumns = {};
                headerRow.forEach((cell, idx) => {
                    if (daysOfWeek.includes(cell)) {
                        dayColumns[cell] = idx;
                    }
                });

                const timeSlots = [];
                for (let rowIdx = 0; rowIdx < tables.length - 1; rowIdx++) {
                    const row = tables[rowIdx];
                    const timeSlot = processTimeSlot(row[0]);
                    if (timeSlot) {
                        timeSlots.push({ rowIdx, timeSlot });
                    }
                }

                const pageData = [];

                timeSlots.forEach(({ rowIdx, timeSlot }) => {
                    daysOfWeek.forEach(day => {
                        const colIdx = dayColumns[day];
                        if (colIdx === undefined) return;

                        const cellKey = `${rowIdx}-${colIdx}`;
                        let cellContent = '';

                        if (mergeAlias[cellKey]) {
                            const masterKey = mergeAlias[cellKey];
                            const [masterRow, masterCol] = masterKey.split('-').map(Number);
                            cellContent = tables[masterRow][masterCol];
                        } else {
                            cellContent = tables[rowIdx][colIdx];
                        }

                        const roomData = extractRoomFromCell(cellContent);
                        const occupied = roomData !== null;

                        if (occupied) totalOccupied++;
                        else totalFree++;

                        const rowData = {
                            room: roomData || 'Available',
                            day: day,
                            time: timeSlot,
                            occupied: occupied,
                            page: pageNum,
                            roomTitle: room

                        };

                        allResults.push(rowData);
                        pageData.push(rowData);
                    });
                });

                pageData.sort((a, b) => {
                    const timeCompare = a.time.localeCompare(b.time);
                    if (timeCompare !== 0) return timeCompare;
                    return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
                });

                pageResults[pageNum] = pageData;
            });

            allResults.sort((a, b) => {
                const pageCompare = a.page - b.page;
                if (pageCompare !== 0) return pageCompare;
                const timeCompare = a.time.localeCompare(b.time);
                if (timeCompare !== 0) return timeCompare;
                return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
            });

            setProcessedData(allResults);
            setPageData(pageResults);
            setCurrentPage(1);
            setCurrentRoom(1);

            setStats({
                total: allResults.length,
                occupied: totalOccupied,
                free: totalFree,
                totalPages: Object.keys(pageResults).length
            });

        } catch (err) {
            setError(`Error processing JSON: ${err.message}`);
            setProcessedData(null);
            setPageData(null);
            setStats(null);
            console.error(err);
        }
    };

    const handlePDFUpload = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError('');
        setProcessedData(null);

        if (file.type !== 'application/pdf') {
            setError('Please upload a PDF file');
            event.target.value = '';
            return;
        }

        try {
            setError('📤 Uploading PDF to backend...');

            const formData = new FormData();
            formData.append('pdf', file);

            const response = await fetch('https://time-table-extractor.vercel.app/api/extract-pdf', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Failed to extract PDF');
            }

            setError('✅ PDF extracted successfully! Processing data...');
            setJsonInput(JSON.stringify(result.data, null, 2));

            setTimeout(() => {
                const data = result.data;

                if (!data.pageTables || !Array.isArray(data.pageTables)) {
                    throw new Error('Invalid JSON structure: pageTables not found');
                }

                const allResults = [];
                const pageResults = {};
                let totalOccupied = 0;
                let totalFree = 0;

                data.pageTables.forEach((pageTable, pageIndex) => {
                    const tables = pageTable.tables;
                    const mergeAlias = pageTable.merge_alias || {};
                    const pageNum = pageTable.page || (pageIndex + 1);
                    const room = roomTitles[pageTable.page - 1];

                    console.log(room);
                    console.log(pageTable);
                    if (!tables || !Array.isArray(tables)) return;

                    const headerRow = tables[tables.length - 1];
                    const dayColumns = {};
                    headerRow.forEach((cell, idx) => {
                        if (daysOfWeek.includes(cell)) {
                            dayColumns[cell] = idx;
                        }
                    });

                    const timeSlots = [];
                    for (let rowIdx = 0; rowIdx < tables.length - 1; rowIdx++) {
                        const row = tables[rowIdx];
                        const timeSlot = processTimeSlot(row[0]);
                        if (timeSlot) {
                            timeSlots.push({ rowIdx, timeSlot });
                        }
                    }

                    const pageData = [];

                    timeSlots.forEach(({ rowIdx, timeSlot }) => {
                        daysOfWeek.forEach(day => {
                            const colIdx = dayColumns[day];
                            if (colIdx === undefined) return;

                            const cellKey = `${rowIdx}-${colIdx}`;
                            let cellContent = '';

                            if (mergeAlias[cellKey]) {
                                const masterKey = mergeAlias[cellKey];
                                const [masterRow, masterCol] = masterKey.split('-').map(Number);
                                cellContent = tables[masterRow][masterCol];
                            } else {
                                cellContent = tables[rowIdx][colIdx];
                            }

                            const roomData = extractRoomFromCell(cellContent);
                            const occupied = roomData !== null;

                            if (occupied) totalOccupied++;
                            else totalFree++;

                            const rowData = {
                                room: roomData || 'Available',
                                day: day,
                                time: timeSlot,
                                occupied: occupied,
                                page: pageNum,
                                roomTitle: room,
                            };

                            allResults.push(rowData);
                            pageData.push(rowData);
                        });
                    });

                    pageData.sort((a, b) => {
                        const timeCompare = a.time.localeCompare(b.time);
                        if (timeCompare !== 0) return timeCompare;
                        return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
                    });
                    console.log(pageData[currentPage])
                    pageResults[pageNum] = pageData;
                });

                allResults.sort((a, b) => {
                    const pageCompare = a.page - b.page;
                    if (pageCompare !== 0) return pageCompare;
                    const timeCompare = a.time.localeCompare(b.time);
                    if (timeCompare !== 0) return timeCompare;
                    return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
                });

                setProcessedData(allResults);
                setPageData(pageResults);
                console.log(pageResults);
                setCurrentPage(1);
                setCurrentRoom('A-2');
                setStats({
                    total: allResults.length,
                    occupied: totalOccupied,
                    free: totalFree,
                    totalPages: Object.keys(pageResults).length
                });
                setError('');
            }, 500);

        } catch (err) {
            setError(`❌ Error: ${err.message}. Make sure the backend server is running on http://localhost:3001`);
        }

        event.target.value = '';
    };

    const downloadJSON = () => {
        if (!processedData) return;

        // Reformat before export
        const exportData = processedData.map(row => ({
            room: row.roomTitle,   // use roomTitle instead of row.room
            day: row.day,
            time: row.time,
            occupied: row.occupied,
        }));

        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'timetable_processed.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const downloadCSV = () => {
        if (!processedData) return;

        // Reformat before export
        const exportData = processedData.map(row => ({
            room: row.roomTitle,
            day: row.day,
            time: row.time,
            occupied: row.occupied,
        }));

        const headers = Object.keys(exportData[0]); // ["room","day","time","occupied"]
        const csvRows = [headers.join(',')];

        exportData.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            });
            csvRows.push(values.join(','));
        });

        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'timetable_processed.csv';
        link.click();
        URL.revokeObjectURL(url);
    };



    const loadSampleData = () => {
        setJsonInput(JSON.stringify({
            "pageTables": [
                {
                    "page": 1,
                    "tables": [
                        ["1\n8:309:00", "", "SP24-BCS-B\nComputer Networks\nCS-Imran", "", "", "", ""],
                        ["2\n9:009:30", "", "", "", "FA22-BCS-B\nCompiler\nCS-Gul", "", ""],
                        ["", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
                    ],
                    "merge_alias": {}
                },
                {
                    "page": 2,
                    "tables": [
                        ["13\n2:303:00", "FA23-CHE-A\nMass Transfer", "", "", "", "", ""],
                        ["14\n3:003:30", "", "", "FA24-BCS-A\nData Science", "", "", ""],
                        ["", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
                    ],
                    "merge_alias": {}
                }
            ]
        }, null, 2));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <FileJson className="w-8 h-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-800">Timetable Processor</h1>
                        <button
                            onClick={handleClick}
                            disabled={isDisabled}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${isDisabled
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-green-600 text-white hover:bg-green-700"
                                }`}
                        >
                            Go to Verification
                        </button>
                    </div>

                    <div className="mb-6 flex gap-4">
                        <button
                            onClick={() => setUploadMode('json')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${uploadMode === 'json'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Paste JSON
                        </button>
                        <button
                            onClick={() => setUploadMode('pdf')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${uploadMode === 'pdf'
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            Upload PDF
                        </button>
                    </div>

                    {uploadMode === 'pdf' && (
                        <div className="mb-6">
                            <div className="border-4 border-dashed border-indigo-300 rounded-lg p-8 text-center bg-indigo-50">
                                <FileUp className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload PDF Timetable</h3>
                                <p className="text-sm text-gray-600 mb-4">
                                    Upload your PDF and process it with pdf-table-extractor
                                </p>
                                <label className="inline-block">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handlePDFUpload}
                                        className="hidden"
                                    />
                                    <span className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer inline-flex items-center gap-2">
                                        <Upload className="w-5 h-5" />
                                        Choose PDF File
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    {uploadMode === 'json' && (
                        <>
                            <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                                <h3 className="font-semibold text-blue-900 mb-2">Time Format Guide:</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>• Format: <code className="bg-blue-100 px-2 py-1 rounded">SLOT_NUMBER\nSTART_TIME:END_TIME</code></li>
                                    <li>• Slots 1-12: AM (8:30 AM - 2:00 PM)</li>
                                    <li>• Slots 13-24: PM (2:30 PM - 8:00 AM next day)</li>
                                </ul>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Paste your timetable JSON here:
                                </label>
                                <textarea
                                    className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg font-mono text-sm focus:border-indigo-500 focus:outline-none"
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    placeholder="Paste your JSON data here..."
                                />
                            </div>

                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={processTimetable}
                                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                                >
                                    <Upload className="w-5 h-5" />
                                    Process Timetable
                                </button>
                                <button
                                    onClick={loadSampleData}
                                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                                >
                                    Load Sample Data
                                </button>
                            </div>
                        </>
                    )}

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-500" />
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        </div>
                    )}

                    {stats && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                            <div className="flex items-center gap-2 mb-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <p className="text-green-700 font-semibold">Processing Complete!</p>
                            </div>
                            <div className="grid grid-cols-4 gap-4 mt-3">
                                <div className="bg-white p-3 rounded">
                                    <p className="text-sm text-gray-600">Total Slots</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                </div>
                                <div className="bg-white p-3 rounded">
                                    <p className="text-sm text-gray-600">Occupied</p>
                                    <p className="text-2xl font-bold text-indigo-600">{stats.occupied}</p>
                                </div>
                                <div className="bg-white p-3 rounded">
                                    <p className="text-sm text-gray-600">Available</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.free}</p>
                                </div>
                                <div className="bg-white p-3 rounded">
                                    <p className="text-sm text-gray-600">Total Pages</p>
                                    <p className="text-2xl font-bold text-purple-600">{stats.totalPages}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {processedData && pageData && (
                        <div className="space-y-4">
                            <div className="flex gap-4">
                                <button
                                    onClick={downloadJSON}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                                >
                                    <FileJson className="w-5 h-5" />
                                    Download JSON
                                </button>
                                <button
                                    onClick={downloadCSV}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                                >
                                    <FileSpreadsheet className="w-5 h-5" />
                                    Download CSV
                                </button>
                            </div>

                            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border-2 border-indigo-200">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${currentPage === 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    Previous
                                </button>

                                <div className="flex items-center gap-3 bg-white px-6 py-2 rounded-lg shadow-sm">
                                    <span className="text-gray-700 font-bold text-lg">
                                        Page <span className="text-indigo-600">{currentPage}</span> of <span className="text-purple-600">{stats.totalPages}</span>
                                    </span>

                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(stats.totalPages, prev + 1))}
                                    disabled={currentPage === stats.totalPages}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${currentPage === stats.totalPages
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                        }`}
                                >
                                    Next
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="border-2 border-gray-200 rounded-lg overflow-hidden shadow-lg">
                                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 border-b-2 border-gray-200">
                                    <h3 className="font-bold text-white text-lg">Timetable Preview - Page {currentPage} Room {pageData[currentPage][0]?.roomTitle || "Unknown"}</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse text-xs">
                                        <thead>
                                            <tr className="bg-indigo-600 text-white">
                                                <th className="border border-gray-300 px-3 py-2 text-sm font-semibold sticky left-0 bg-indigo-600 z-10">Day</th>
                                                {(() => {
                                                    const currentPageData = pageData[currentPage] || [];
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
                                                const currentPageData = pageData[currentPage] || [];
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
                                                                    className={`border border-gray-300 px-2 py-2 ${isOccupied ? 'bg-red-50' : 'bg-green-50'
                                                                        }`}
                                                                >
                                                                    {isOccupied ? (
                                                                        <div className="font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis" title={cell.room}>
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
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TimetableProcessor;