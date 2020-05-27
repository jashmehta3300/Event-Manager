import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  demo: {
    width: '100%',
    maxWidth: 900,
    marginLeft: 280,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function BookingsPage() {
  const classes = useStyles();

  const [Data, setData] = React.useState([]);

  React.useEffect(() => {
    const requestBody = {
      query: `
          query {
            bookings {
              _id
             createdAt
             event {
               _id
               title
               price
             }
            }
          }
        `,
    };

    const word = 'Bearer ';
    const tokenFinal = word.concat(`${localStorage.getItem('token')}`);

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: tokenFinal,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then((resData) => {
        const bookings = resData.data.bookings;
        setData(bookings);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const cancelEvent = (id) => {
    const r = window.confirm('Do you want to cancel this event?');
    if (r === true) {
      const loggedIn = localStorage.getItem('token');
      if (loggedIn) {
        const requestBody = {
          query: `
          mutation{
            cancelBooking(bookingId: "${id}"){
              _id
            }
          }
        `,
        };

        const word = 'Bearer ';
        const tokenFinal = word.concat(`${localStorage.getItem('token')}`);

        fetch('http://localhost:5000/graphql', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json',
            Authorization: tokenFinal,
          },
        })
          .then((res) => {
            if (res.status !== 200 && res.status !== 201) {
              throw new Error('Failed!');
            }
            return res.json();
          })
          .then((resData) => {
            console.log(resData)
            let id = resData.event_id;
            const newData = Data.filter((item) => {
              return item._id !== id;
            });
            setData(newData);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        throw new Error('You are not logged in :(');
      }
    }
  };

  return (
    <div className={classes.root}>
      <h1 style={{ color: '#3f51b5', marginLeft: '600px' }}>Booked Events</h1>

      <List className={classes.demo}>
        {Data.map((event) => {
          return (
            <React.Fragment key={event.event._id}>
              <ListItem style={{ padding: '40px' }}>
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: '#3f51b5' }}>
                    <CloseIcon onClick={cancelEvent.bind(this, event.event._id)} />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={event.event.title}
                  secondary={event.event.price.toString().concat(' Rupees')}
                />
              </ListItem>
              <Divider variant="inset" component="li" />
            </React.Fragment>
          );
        })}
      </List>
    </div>
  );
}
