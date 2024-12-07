// EventList.js
import React from 'react';
import { Card, CardContent, CardActions, Button, Typography } from '@mui/material';
import moment from 'moment';

function EventList({ events = [], onEdit, onDelete }) {
  return (
    <div className="event-list">
      {events.length === 0 ? (
        <Typography>No upcoming events available</Typography>
      ) : (
        events.map((event, index) => (
          <Card key={index} className="event-card">
            <CardContent>
              <Typography variant="h6">{event.title}</Typography>
              <Typography>
                Date: {moment(event.start).format('YYYY-MM-DD')}
              </Typography>
              <Typography>
                Time: {moment(event.start).format('HH:mm')}
              </Typography>
              <Typography>Description: {event.description}</Typography>
              {event.link && (
                <Typography>
                  Link: <a href={event.link} target="_blank" rel="noopener noreferrer">{event.link}</a>
                </Typography>
              )}
            </CardContent>
            <CardActions>
              <Button size="small" color="primary" onClick={() => onEdit(index)}>
                Edit
              </Button>
              <Button size="small" color="secondary" onClick={() => onDelete(index)}>
                Delete
              </Button>
            </CardActions>
          </Card>
        ))
      )}
    </div>
  );
}

export default EventList;