import React from 'react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  demo: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function EventPage() {
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

    console.log(JSON.stringify(requestBody))

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
        console.log(events)
      })
      .catch(err => {
        console.log(err);
      });
  })

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
              <React.Fragment>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar>
                      <ImageIcon />
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