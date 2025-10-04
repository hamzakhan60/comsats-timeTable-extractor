"use client"
import React, { useState } from 'react';
import { Upload, Download, FileJson, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';

const TimetableProcessor = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [processedData, setProcessedData] = useState(null);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const processTimeSlot = (timeStr) => {
    if (!timeStr || timeStr.trim() === '') return null;
    
    // Extract slot number and time
    // Format can be "1\n8:309:00" or "237:308:00" or "9\n12:301:00"
    const withNewline = timeStr.match(/^(\d+)\n(\d{1,2}):(\d{2})(\d{1,2}):(\d{2})$/);
    const withoutNewline = timeStr.match(/^(\d+)(\d{1,2}):(\d{2})(\d{1,2}):(\d{2})$/);
    console.log("withNewLine",withNewline);
    console.log("withoutNewLine",withoutNewline);
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

      const results = [];
      let occupiedCount = 0;
      let freeCount = 0;

      data.pageTables.forEach(pageTable => {
        const tables = pageTable.tables;
        const merges = pageTable.merges || {};
        const mergeAlias = pageTable.merge_alias || {};
        
        if (!tables || !Array.isArray(tables)) return;

        // The last row contains day headers
        const headerRow = tables[tables.length - 1];
        
        // Find day column indices
        const dayColumns = {};
        headerRow.forEach((cell, idx) => {
          if (daysOfWeek.includes(cell)) {
            dayColumns[cell] = idx;
          }
        });

        // Build a map of all time slots from all rows
        const timeSlots = [];
        for (let rowIdx = 0; rowIdx < tables.length - 1; rowIdx++) {
          const row = tables[rowIdx];
          const timeSlot = processTimeSlot(row[0]);
          if (timeSlot) {
            timeSlots.push({ rowIdx, timeSlot });
          }
        }

        // Process each time slot for each day
        timeSlots.forEach(({ rowIdx, timeSlot }) => {
          daysOfWeek.forEach(day => {
            const colIdx = dayColumns[day];
            if (colIdx === undefined) return;

            // Check if this cell is part of a merge
            const cellKey = `${rowIdx}-${colIdx}`;
            let cellContent = '';
            
            // Check if this cell is an alias (part of a merged cell)
            if (mergeAlias[cellKey]) {
              const masterKey = mergeAlias[cellKey];
              const [masterRow, masterCol] = masterKey.split('-').map(Number);
              cellContent = tables[masterRow][masterCol];
            } else {
              // Use the cell's own content
              cellContent = tables[rowIdx][colIdx];
            }

            const room = extractRoomFromCell(cellContent);
            const occupied = room !== null;

            if (occupied) occupiedCount++;
            else freeCount++;

            results.push({
              room: room || 'Available',
              day: day,
              time: timeSlot,
              occupied: occupied
            });
          });
        });
      });

      // Sort by time and day
      results.sort((a, b) => {
        const timeCompare = a.time.localeCompare(b.time);
        if (timeCompare !== 0) return timeCompare;
        return daysOfWeek.indexOf(a.day) - daysOfWeek.indexOf(b.day);
      });

      setProcessedData(results);
      setStats({
        total: results.length,
        occupied: occupiedCount,
        free: freeCount
      });

    } catch (err) {
      setError(`Error processing JSON: ${err.message}`);
      setProcessedData(null);
      setStats(null);
      console.error(err);
    }
  };

  const downloadJSON = () => {
    if (!processedData) return;

    const dataStr = JSON.stringify(processedData, null, 2);
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

    const headers = ['room', 'day', 'time', 'occupied'];
    const csvRows = [headers.join(',')];

    processedData.forEach(row => {
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
            ["18:309:00", "", "SP24-BCS-B\nComputer Networks\nCS-Imran", "", "", "", ""],
            ["237:308:00", "", "", "", "FA22-BCS-B\nCompiler\nCS-Gul", "", "", ""],
            ["", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"]
          ]
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
            <h1 className="text-3xl font-bold text-gray-800">Timetable JSON Processor</h1>
          </div>

          <div className="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">Time Format Guide:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Format: <code className="bg-blue-100 px-2 py-1 rounded">SLOT_NUMBER:START_TIME:END_TIME</code></li>
              <li>• Slots 1-12: AM (8:30 AM - 2:00 PM)</li>
              <li>• Slots 13-24: PM (2:30 PM - 8:00 AM next day)</li>
              <li>• Example: <code className="bg-blue-100 px-2 py-1 rounded">237:308:00</code> → Slot 23, 7:30 PM → <strong>19:30</strong></li>
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
              <div className="grid grid-cols-3 gap-4 mt-3">
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
              </div>
            </div>
          )}

          {processedData && (
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

              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-3 border-b-2 border-gray-200">
                  <h3 className="font-semibold text-gray-700">Timetable Preview</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-indigo-600 text-white">
                        <th className="border border-gray-300 px-3 py-2 text-sm font-semibold">Day</th>
                        {(() => {
                          // Get unique time slots and sort them
                          const timeSlots = [...new Set(processedData.map(row => row.time))];
                          timeSlots.sort((a, b) => {
                            const [aHour, aMin] = a.split(':').map(Number);
                            const [bHour, bMin] = b.split(':').map(Number);
                            if (aHour !== bHour) return aHour - bHour;
                            return aMin - bMin;
                          });
                          
                          return timeSlots.map(time => (
                            <th key={time} className="border border-gray-300 px-2 py-2 text-xs font-semibold">{time}</th>
                          ));
                        })()}
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        // Get unique time slots and sort them
                        const timeSlots = [...new Set(processedData.map(row => row.time))];
                        timeSlots.sort((a, b) => {
                          const [aHour, aMin] = a.split(':').map(Number);
                          const [bHour, bMin] = b.split(':').map(Number);
                          if (aHour !== bHour) return aHour - bHour;
                          return aMin - bMin;
                        });

                        // Group data by day and time
                        const dayTimeMap = {};
                        daysOfWeek.forEach(day => {
                          dayTimeMap[day] = {};
                        });
                        
                        processedData.forEach(row => {
                          if (!dayTimeMap[row.day]) {
                            dayTimeMap[row.day] = {};
                          }
                          dayTimeMap[row.day][row.time] = row;
                        });

                        return daysOfWeek.map((day, idx) => (
                          <tr key={day} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="border border-gray-300 px-3 py-2 text-sm font-semibold text-indigo-700">
                              {day}
                            </td>
                            {timeSlots.map(time => {
                              const cell = dayTimeMap[day][time];
                              const isOccupied = cell && cell.occupied;
                              return (
                                <td 
                                  key={time} 
                                  className={`border border-gray-300 px-2 py-2 text-xs ${
                                    isOccupied ? 'bg-red-50' : 'bg-green-50'
                                  }`}
                                >
                                  {isOccupied ? (
                                    <div className="font-medium text-gray-800">
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