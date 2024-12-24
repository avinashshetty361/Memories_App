import { makeStyles } from '@material-ui/core/styles';

export default makeStyles({
  media: {
    height: 30,
    paddingTop: '56.25%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backgroundBlendMode: 'darken',
    transition: 'background-color 0.5s ease, height 0.5s ease, padding 0.3s ease, transform 0.3s ease', // More transitions
    transform: 'scale(1)', // Initial scale
    '&:hover': { // Hover styles inside the same object
      transform: 'scale(1.1)', // Scale up the element
      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker background
      height: 60, // Increased height
      paddingTop: '60%', // Change padding
    },
  },
  
  border: {
    border: 'solid',
  },
  fullHeightCard: {
    height: '100%',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: '15px',
    height: '100%',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: '20px',
    left: '20px',
    color: 'white',
  },
  overlay2: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    color: 'white',
  },
  grid: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '20px',
  },
  title: {
    padding: '0 16px',
  },
  cardActions: {
    padding: '0 16px 8px 16px',
    display: 'flex',
    justifyContent: 'space-between',
  },
});