import { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography,
  Switch, InputBase, Box, Tooltip,
  IconButton
} from '@material-ui/core';
import { Menu as MenuIcon, Search as SearchIcon } from '@material-ui/icons';
import { fade, makeStyles } from '@material-ui/core/styles';
import { setTheme } from '../actions/settings';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4)
  },
  toolBar: {
    [theme.breakpoints.only('xs')]: {
      paddingLeft: 11,
      paddingRight: 11
    },
    paddingTop: 10,
    paddingBottom: 10
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(3),
    [theme.breakpoints.only('xs')]: {
      marginLeft: theme.spacing(0),
      marginRight: theme.spacing(0),
      flexGrow: 1
    }
  },
  searchIcon: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
    },
    width: '50vw'
  },
}))

const Header = ({ theme, setTheme }) => {
  const classes = useStyles();
  const [searchInput, setSearchInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false); 
  let history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    history.push(`/search?q=${encodeURIComponent(searchInput)}`)
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className={classes.toolBar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component="span"
            display={{ xs: 'none', sm: 'block' }}
            className={classes.title}
          >
            <Typography
              variant="h6"
              component={Link}
              to="/"
              style={{
                color: 'inherit',
                textDecoration: 'none'
              }}
            >
              Manga Reader
            </Typography>
          </Box>
          <div className={classes.search}>
            <form
              style={{ display: 'inline' }}
              onSubmit={handleSubmit}
            >
              <Tooltip title="Search" aria-label="search-button">
                <IconButton type="submit">
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                </IconButton>
              </Tooltip>
              <InputBase
                placeholder="Search..."
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput,
                }}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                inputProps={{ 'aria-label': 'search-input' }}
              />
            </form>
          </div>
          <Switch
            checked={theme === 'dark'}
            onChange={() => theme === 'light' ? setTheme('dark') : setTheme('light')}
          />
        </Toolbar>
      </AppBar>
    </div>
  );
};

const mapStateToProps = (state) => ({
  theme: state.settings.theme
});

const mapDispatchToProps = (dispatch) => ({
  setTheme: (theme) => dispatch(setTheme(theme))
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);