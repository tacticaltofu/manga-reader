import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Grid, Typography, Box,
  Card, CardContent, CardMedia, CardActionArea
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core/styles';
import axios from '../config/axios';

const getShortDescription = (description) => {
  const cutoff = 150;
  // const split = description.split(/\[.+?\]/)[0];
  const split = description.replace(/\[.*?\]/g, '');
  if (split.length <= cutoff) {
    return split;
  } else {
    return split.slice(0, cutoff) + '...';
  }
};

const getShortAuthors = (author, artist) => {
  const cutoff = 30
  const authors = Array.from(new Set(author.concat(artist))).join(', ');
  if (authors.length <= cutoff) {
    return authors;
  } else {
    return authors.slice(0, cutoff) + '...';
  }
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: 300,
    width: '100%'
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    minWidth: 150,
    [theme.breakpoints.only('xs')]: {
      minWidth: 50
    },
    [theme.breakpoints.only('sm')]: {
      minWidth: 100
    }
  }
}));

const SearchPage = () => {
  const classes = useStyles();
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(useLocation().search);
  const searchQuery = query.get('q')
  useEffect(() => {
    const searchManga = async () => {
      const response = await axios.get('http://localhost:5000/manga/search', {
        params: { q: searchQuery }
      });
      setResults(response.data);

    };
    searchManga();
  }, [searchQuery]);

  const resultsToDisplay = results.map((result) => (
    <Grid key={result.id} item xs={12} sm={6} lg={4} xl={3}>
      <Card className={classes.root} elevation={10}>
        <CardActionArea>
          <Link to={`/manga/${result.id}`}>
            <CardMedia
              component="img"
              height={300}
              className={classes.cover}
              image={result.mainCover}
              title={`Cover for ${result.title}`}
            />
          </Link>
        </CardActionArea>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Link 
              to={`/manga/${result.id}`}
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <Typography component="h6" variant="h6">
                {result.title}
              </Typography>
            </Link>
            <Rating value={result.rating.bayesian / 2} precision={0.5} readOnly />
            <Typography>
              {result.views} views
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {getShortAuthors(result.author, result.artist)}
            </Typography>
            <Typography variant="body2">
              {getShortDescription(result.description) || 'No synopsis available.'}
            </Typography>
          </CardContent>
        </div>
      </Card>
    </Grid>
  ))

  return (
    <>
      {results.length > 0 ? (
        <Box m={2}>
          <Grid
            container
            spacing={2}
            m={2}
          >
            {/* <Grid item xs="auto" sm={1} md={4} /> */}
            {resultsToDisplay}
            {/* <Grid item xs="auto" sm={1} md={4} /> */}
          </Grid>
        </Box>
      ) : (
          <div style={{ textAlign: 'center' }}>
            {searchQuery ? 'There are no results for the search.' : 'No query, no results.'}
          </div>
        )}
    </>
  );
};

export default SearchPage;