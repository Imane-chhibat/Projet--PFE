import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DynamicCalendarProps {
  busyDates?: string[];
  pendingDates?: string[];
  editable?: boolean;
  selectedDates?: Date[];
  onDateClick?: (date: Date) => void;
  selectionMode?: boolean;
  onSelectDate?: (date: Date) => void;
  selectedDate?: Date | null;
}

const DynamicCalendar: React.FC<DynamicCalendarProps> = ({
  busyDates = [],
  pendingDates = [],
  editable = false,
  selectedDates = [],
  onDateClick,
  selectionMode = false,
  onSelectDate,
  selectedDate = null,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday=0 to 6, Monday=1 to 0
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Prevent timezone issues by setting time to noon for ISO string
  const getISODate = (date: Date): string => {
    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
    return d.toISOString().split('T')[0];
  };

  const isBlocked = (date: Date): boolean => {
    const iso = getISODate(date);
    return busyDates.includes(iso);
  };

  const isPending = (date: Date): boolean => {
    const iso = getISODate(date);
    return pendingDates.includes(iso);
  };

  const isPast = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isSelected = (date: Date): boolean => {
    if (selectionMode && selectedDate) {
      return date.toDateString() === selectedDate.toDateString();
    }
    if (editable && selectedDates) {
      return selectedDates.some((d) => d.toDateString() === date.toDateString());
    }
    return false;
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleDayClick = (date: Date) => {
    if (isPast(date)) return;

    if (selectionMode) {
      if (isBlocked(date) || isPending(date)) return;
      if (onSelectDate) onSelectDate(date);
    } else if (editable) {
      if (onDateClick) onDateClick(date);
    }
  };

  const renderCells = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const cells = [];
    const totalCells = 42; // 6 rows * 7 days

    for (let i = 0; i < totalCells; i++) {
      if (i < firstDay || i >= firstDay + daysInMonth) {
        // Empty cell
        cells.push(<div key={`empty-${i}`} className="w-9 h-9 invisible"></div>);
      } else {
        const dayNumber = i - firstDay + 1;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNumber);
        
        const past = isPast(date);
        const blocked = isBlocked(date);
        const pending = isPending(date);
        const selected = isSelected(date);
        const today = isToday(date);

        // Determine classes based on state and mode
        let cellClasses = "w-9 h-9 rounded-lg text-xs flex items-center justify-center transition-all border border-transparent ";
        let dot = null;

        if (past) {
          cellClasses += "text-gray-300 cursor-not-allowed bg-gray-50 ";
        } else if (blocked && (!editable || !selected)) { 
          cellClasses += "bg-red-50 text-red-500 cursor-not-allowed border-red-200 relative ";
          dot = <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>;
        } else if (pending && (!editable || !selected)) {
          cellClasses += "bg-yellow-50 text-yellow-600 cursor-not-allowed border-yellow-300 relative ";
          dot = <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>;
        } else if (selected && selectionMode) {
          cellClasses += "bg-[#603A2A] text-white font-bold ring-2 ring-[#CDB58E] ";
        } else if (selected && editable) {
          cellClasses += "bg-orange-100 text-orange-700 border-orange-300 ";
        } else if (selectionMode) {
          cellClasses += "hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-200 cursor-pointer ";
        } else if (editable) {
          cellClasses += "hover:bg-[#F5EDE0] cursor-pointer ";
        }

        if (today) {
          cellClasses += "underline font-bold text-[#603A2A] ";
        }

        const title = blocked ? "Jour occupé" : pending ? "En attente" : "";

        cells.push(
          <div
            key={dayNumber}
            className={cellClasses}
            onClick={() => handleDayClick(date)}
            title={title}
          >
            {dayNumber}
            {dot}
          </div>
        );
      }
    }
    return cells;
  };

  const monthYearString = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  const capitalizedMonthYear = monthYearString.charAt(0).toUpperCase() + monthYearString.slice(1);

  return (
    <div className="bg-white border border-[#CDB58E]/20 rounded-xl p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-[#F5EDE0] rounded-lg transition-colors text-[#603A2A]"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="font-bold text-[#2A1B15]">{capitalizedMonthYear}</h3>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-[#F5EDE0] rounded-lg transition-colors text-[#603A2A]"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((day) => (
          <div key={day} className="w-9 h-9 flex items-center justify-center text-xs font-semibold text-[#8E887F]">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderCells()}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-[#8E887F] border-t border-[#CDB58E]/20 pt-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full inline-block"></span>
          <span>Occupé</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full inline-block"></span>
          <span>En attente</span>
        </div>
        {editable && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-orange-400 rounded-full inline-block"></span>
            <span>Sélectionné</span>
          </div>
        )}
        {selectionMode && (
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full inline-block"></span>
            <span>Disponible</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicCalendar;
