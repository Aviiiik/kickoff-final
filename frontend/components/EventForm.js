import React from 'react';
import { TextField, Button, Typography, Modal, Box } from '@mui/material';

function EventForm({
  open,
  onClose,
  onSubmit,
  currentEvent,
  handleChange,
  isEditing,
}) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className="modal-box">
        <Typography variant="h5" gutterBottom>
          {isEditing ? 'Edit Event' : 'Create New Event'}
        </Typography>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            label="Title"
            name="title"
            value={currentEvent.title}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={currentEvent.date}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Time"
            name="time"
            type="time"
            value={currentEvent.time}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Description"
            name="description"
            value={currentEvent.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <TextField
            label="Event Link"
            name="link"
            value={currentEvent.link}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={onSubmit}
            style={{ marginTop: '10px' }}
          >
            {isEditing ? 'Update Event' : 'Create Event'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default EventForm;
