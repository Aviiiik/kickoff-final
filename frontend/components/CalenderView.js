import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

function CalendarView({ events, onSelectEvent }) {
  return (
    <div className="calendar-view">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor={(event) => (
          <>
            <strong>{event.title}</strong>
            {event.link && (
              <a href={event.link} target="_blank" rel="noopener noreferrer">
                {' '} - Link
              </a>
            )}
          </>
        )}
        style={{ height: 500 }}
        views={['month', 'week', 'day']}
        defaultView="month"
        popup
        onSelectEvent={onSelectEvent}  // Handle event click
      />
    </div>
  );
}

export default CalendarView;