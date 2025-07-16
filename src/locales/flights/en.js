export default {
  title: 'My Flights',
  addFlight: 'Add Flight',
  editFlight: 'Edit Flight',
  newFlight: 'New Flight',
  noFlights: 'You don\'t have any registered flights yet',
  form: {
    title: 'Title',
    date: 'Date',
    drone: 'Select a drone',
    location: 'Location',
    duration: 'Duration (seconds)',
    batteryUsed: 'Batteries Used',
    weather: 'Weather',
    notes: 'Notes',
    image: 'Flight Image',
    visibility: {
      followers: 'Visible to followers',
      public: 'Public'
    },
    spot: 'Spot',
    urlVideo: 'Link to youtube',
    sections: {
      media: 'Image',
      basic: 'Basic Information',
      privacy: 'Privacy'
    }
  },
  validation: {
    title: 'Title is required',
    date: 'Date is required',
    location: 'Location is required',
    duration: 'Duration is required',
    batteryUsed: 'Number of batteries is required',
    droneId: 'Drone is required',
    image: 'Error uploading flight image'
  },
  details: {
    drone: 'Drone',
    date: 'Date',
    batteryUsed: 'Battery used',
    likes: 'Likes',
    weather: 'Weather',
    notes: 'Notes',
    visibility: 'Visibility',
    location: 'Location',
    duration: 'duration',
    batteries: 'batteries',
    notSpecified: 'Not specified',
    viewDrone: 'View drone details'
  },
  delete: {
    title: 'Delete Flight',
    confirmation: 'Are you sure you want to delete the flight "{title}"? This action cannot be undone.'
  }
}