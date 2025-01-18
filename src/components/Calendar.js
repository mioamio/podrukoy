import React, { useState } from 'react';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="calendar">
      <h2>Календарь</h2>
      <div className="dates">
        {[1, 2, 3, 4, 5].map((day) => (
          <div key={day} onClick={() => handleDateClick(day)}>
            {day}
          </div>
        ))}
      </div>
      {selectedDate && <p>Выбрана дата: {selectedDate}</p>}
    </div>
  );
};

export default Calendar;
