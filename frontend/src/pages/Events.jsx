import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
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

export default function EventPage(props) {
  const classes = useStyles();

  const [Data, setData] = React.useState([]);

  React.useEffect(() => {
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `,
    };

    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        setData(events)
      })
      .catch(err => {
        console.log(err);
      });
  },[])

  const bookEvent = (id) => {
    console.log(Data)
    const r = window.confirm("Do you want to book this event?");
    if(r === true){
      const loggedIn = localStorage.getItem('token');
      if(loggedIn){
          const requestBody = {
            query: `
          mutation{
            bookEvent(eventId: "${id}"){
              _id
              createdAt
              event{
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
              let id = resData.data.bookEvent.event._id;
              const newData= Data.filter((item) => {
                return item._id !== id
              })
              setData(newData);
            })
            .catch((err) => {
              console.log(err);
            });
      }
      else{
        props.history.push('/auth');
      }
    }
    else{
        props.history.push("/events")
    }
  }

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        disableElevation
        href="/create/event"
        style={{ marginTop: '30px', marginLeft: '700px', marginBottom: '60px' }}
      >
        Add Event
      </Button>

      <List className={classes.demo}>
        {Data.map((event) => {
            return (
              <React.Fragment key={event._id}>
                <ListItem style={{ padding: '40px' }}>
                  <ListItemAvatar>
                    <Avatar style={{ backgroundColor: '#3f51b5' }}>
                      <AddIcon onClick={bookEvent.bind(this, event._id)} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={event.title}
                    secondary={event.description}
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