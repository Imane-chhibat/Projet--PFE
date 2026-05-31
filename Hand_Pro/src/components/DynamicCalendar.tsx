import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DynamicCalendarProps {
  busyDates?: string[]; // Array of date strings in YYYY-MM-DD format
  onDateClick?: (date: Date) => void;
  editable?: boolean;
  selectedDates?: Date[];
}

export default function DynamicCalendar({ 
  busyDates = [], 
  onDateClick, 
  editable = false,
  selectedDates = []
}: DynamicCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    // Adjust to make Monday the first day (0 = Monday, 6 = Sunday)
    let startDay = firstDay.getDay();
    startDay = startDay === 0 ? 6 : startDay - 1;
    
    const days: Date[] = [];
    
    // Add empty days for the offset
    for (let i = 0; i < startDay; i++) {
      days.push(new Date(year, month, -startDay + i + 1));
    }
    
    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    
    // Add days from next month to complete the grid (optional)
    const remainingDays = 42 - days.length; // 6 rows x 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push(new Date(year, month + 1, day));
    }
    
    setCalendarDays(days);
  };

  const isBusy = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return busyDates.includes(dateStr);
  };

  const isSelected = (date: Date) => {
    return selectedDates.some(d => 
      d.toDateString() === date.toDateString()
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    if (!editable || !isCurrentMonth(date) || isBusy(date)) return;
    if (onDateClick) {
      onDateClick(date);
    }
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-[#CDB58E]/20 space-y-4">
      {/* Header with month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePreviousMonth}
          className="p-2 hover:bg-[#F5EDE0] rounded-lg transition-colors"
        >
          <ChevronLeft size={20} className="text-[#603A2A]" />
        </button>
        <h3 className="font-display font-bold text-lg text-[#2A1B15]">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-[#F5EDE0] rounded-lg transition-colors"
        >
          <ChevronRight size={20} className="text-[#603A2A]" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {dayNames.map(day => (
          <div key={day} className="py-2 text-xs font-bold text-[#CDB58E] uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {calendarDays.map((date, index) => {
          const isCurrent = isCurrentMonth(date);
          const busy = isBusy(date);
          const selected = isSelected(date);
          
          return (
            <button
              key={index}
              onClick={() => handleDateClick(date)}
              disabled={!editable || !isCurrent || busy}
              className={`p-2 sm:p-3 rounded-lg border transition-all text-center flex flex-col items-center justify-center ${
                !isCurrent
                  ? 'text-gray-300 bg-gray-50 border-gray-100'
                  : busy
                    ? 'bg-gray-100 text-gray-400 border-gray-200 line-through opacity-60 cursor-not-allowed'
                    : selected
                      ? 'bg-[#603A2A] text-white border-[#603A2A]'
                      : 'bg-[#F5EDE0]/40 text-[#2A1B15] border-[#CDB58E]/40 font-bold shadow-xs hover:bg-[#CDB58E] hover:text-[#2A1B15]'
              } ${editable && isCurrent && !busy ? 'cursor-pointer' : ''}`}
              title={busy ? 'Occupé' : isCurrent ? 'Libre' : ''}
            >
              <span className="text-sm block">{date.getDate()}</span>
              {isCurrent && !busy && (
                <span className="text-[8px] text-[#603A2A] block font-sans">
                  {selected ? 'Sélectionné' : 'Dispo'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs pt-2 border-t border-[#F5EDE0]">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-[#F5EDE0] border border-[#CDB58E]" />
          Libre
        </span>
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded bg-gray-100 border border-gray-300 line-through" />
          Occupé
        </span>
        {editable && (
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-[#603A2A] border border-[#603A2A]" />
            Sélectionné
          </span>
        )}
      </div>
    </div>
  );
}
