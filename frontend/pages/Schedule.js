import React, { useState, useEffect } from 'react';
import { Typography, Button, Modal, Box } from '@mui/material';
import moment from 'moment';
import './schedule.css';
import EventList from '../components/EventList';
import CalendarView from '../components/CalenderView';
import EventForm from '../components/EventForm';
import axios from 'axios';

function Schedule() {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    link: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/events`, { params: { userId } });
        const formattedEvents = response.data.map(event => ({
          ...event,
          start: new Date(`${event.date}T${event.time}`),
          end: new Date(`${event.date}T${event.time}`),
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [userId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setCurrentEvent({ ...currentEvent, [name]: value });
  }

  function handleSubmit() {
    const eventDateTime = new Date(`${currentEvent.date}T${currentEvent.time}`);
    const now = new Date();

    if (eventDateTime < now) {
      setError('Cannot select a past date and time.');
      return;
    }

    const isDuplicate = events.some(event =>
      event.date === currentEvent.date && event.time === currentEvent.time
    );
    if (isDuplicate) {
      setError('An event already exists at the same date and time.');
      return;
    }

    const eventData = {
      title: currentEvent.title,
      date: currentEvent.date,
      time: currentEvent.time,
      description: currentEvent.description,
      link: currentEvent.link,
      userId
    };

    setError('');

    if (isEditing) {
      axios.put(`http://localhost:3001/events/${currentEvent.id}`, eventData)
        .then(() => {
          setEvents(events.map(event =>
            event.id === currentEvent.id
              ? {
                  ...eventData,
                  id: currentEvent.id,
                  start: new Date(`${eventData.date}T${eventData.time}`),
                  end: new Date(`${eventData.date}T${eventData.time}`)
                }
              : event
          ));
          clearForm();
        })
        .catch(error => console.error('Error updating event:', error));
    } else {
      axios.post('http://localhost:3001/events', eventData)
        .then(response => {
          const newEvent = {
            ...eventData,
            id: response.data.id,
            start: new Date(`${eventData.date}T${eventData.time}`),
            end: new Date(`${eventData.date}T${eventData.time}`)
          };
          setEvents([...events, newEvent]);
          clearForm();
        })
        .catch(error => console.error('Error creating event:', error));
    }
  }

  function handleEdit(index) {
    const event = events[index];
    setCurrentEvent({
      id: event.id,
      title: event.title,
      date: moment(event.start).format('YYYY-MM-DD'),
      time: moment(event.start).format('HH:mm'),
      description: event.description,
      link: event.link,
      index,
    });
    setIsEditing(true);
    setOpenModal(true);
  }

  function handleDelete(index) {
    const eventId = events[index].id;
    axios.delete(`http://localhost:3001/events/${eventId}`)
      .then(() => {
        setEvents(events.filter((_, i) => i !== index));
        setSelectedEvent(null);
      })
      .catch(error => console.error('Error deleting event:', error));
  }

  function clearForm() {
    setCurrentEvent({ title: '', date: '', time: '', description: '', link: '' });
    setIsEditing(false);
    setOpenModal(false);
    setError('');
  }

  function getUpcomingEvents() {
    const now = new Date();
    return events
      .filter(event => new Date(event.start) >= now)
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, 4);
  }

  function handleSelectEvent(event) {
    setSelectedEvent(event);
  }

  return (
    <div className="schedule-container">
      <Typography variant="h4" gutterBottom>
        Manage Your Events
      </Typography>

      {error && <Typography color="error">{error}</Typography>}

      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        style={{ marginBottom: '20px' }}
      >
        Create New Event
      </Button>

      <EventList events={getUpcomingEvents()} onEdit={handleEdit} onDelete={handleDelete} />
      <CalendarView events={events.filter(event => new Date(event.start) >= new Date())} onSelectEvent={handleSelectEvent} />
      <EventForm
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleSubmit}
        currentEvent={currentEvent}
        handleChange={handleChange}
        isEditing={isEditing}
      />

      {selectedEvent && (
        <Modal open={Boolean(selectedEvent)} onClose={() => setSelectedEvent(null)}>
          <Box className="modal-box" sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
              {selectedEvent.title}
            </Typography>
            <Typography>Date: {moment(selectedEvent.start).format('YYYY-MM-DD')}</Typography>
            <Typography>Time: {moment(selectedEvent.start).format('HH:mm')}</Typography>
            <Typography>Description: {selectedEvent.description}</Typography>
            {selectedEvent.link && (
              <Typography>
                Link: <a href={selectedEvent.link} target="_blank" rel="noopener noreferrer">{selectedEvent.link}</a>
              </Typography>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleEdit(events.findIndex(event => event.id === selectedEvent.id))}
              style={{ marginTop: '10px' }}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleDelete(events.findIndex(event => event.id === selectedEvent.id))}
              style={{ marginTop: '10px', marginLeft: '10px' }}
            >
              Delete
            </Button>
          </Box>
        </Modal>
      )}
    </div>
  );
}

export default Schedule;