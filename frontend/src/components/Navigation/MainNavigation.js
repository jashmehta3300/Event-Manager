import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function MainNavigation(props) {
  const classes = useStyles();
  const logoutUser = () => {
    localStorage.clear();
    window.location.reload()
  }
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Event-Manager
          </Typography>
          <Link to="/events" style={{ textDecoration: 'none', color: 'white' }}>
            <Button color="inherit">Events</Button>
          </Link>
          <Link
            to="/bookings"
            style={{ textDecoration: 'none', color: 'white' }}
          >
            <Button color="inherit">Bookings</Button>
          </Link>
          {localStorage.getItem('token') ? (
            <Link to="/auth" style={{ textDecoration: 'none', color: 'white' }}>
              <Button color="inherit" onClick={logoutUser}>Logout</Button>
            </Link>
          ) : (
            <Link to="/auth" style={{ textDecoration: 'none', color: 'white' }}>
              <Button color="inherit">Login</Button>
            </Link>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
