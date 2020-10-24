import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import { useHistory } from "react-router-dom";
import { makeStyles, AppBar, Tab, Tabs, Typography, Box, Grid, Toolbar, Menu, MenuItem, IconButton} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import TokenChecker from '../helper/TokenChecker'
import MainTable from '../components/MainTable'
import OutLineGrid from '../components/OutLineGrid'
import Chart from '../components/Chart';
// import ClientsTable from '../components/ClientsTable';
import Clients from './Clients';
import Fundraisers from './Fundraisers';
import Source from './Source';
import Teams from './Teams';
import Donors from './Donors';
import Logo from '../static/logo.png'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>{children}</Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  logo: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  app: {
    right: 0,
  },
  top: {
    textAlign: "center"
  },
  square: {
    padding: theme.spacing(4),
    margin: theme.spacing(2),
    backgroundColor: "#5b9bd5",
    textAlign: "center",
    color: "white",
    borderRadius: "20px"
  },
  paper: {
   backgroundColor: "transparent"
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    paddingTop: theme.spacing(1)
  },
  rightBar: {
    display: "flex"
  }
}));

export default function Home() {
  const classes = useStyles();
  const history = useHistory();
  const [value, setValue] = useState(0);
  const [campId, setCampId] = useState(null)
  const [showMenu, setShowMenu] = useState(window.innerWidth);
  const [tabAnchorEl, setTabAnchorEl] = useState(null);
  const [accountAnchorEl, setAccountAnchorEl] = useState(null);
  const open = Boolean(accountAnchorEl);

  useEffect(() => {
    if(TokenChecker()) {
      window.addEventListener("resize", () => {
        setShowMenu(window.innerWidth )
      })
    }
  })

  const handleClick = (event) => {
    setTabAnchorEl(event.currentTarget);
  };

  const handleTabMenuClose = () => {
    setTabAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    console.log(newValue)
    setValue(newValue);
  };

  const menuTabChange = (value) => () => {
    console.log(value)
    setValue(value);
  }

  const campRowClick = (num, id) => {
    console.log(num, id)
    setValue(num);
    setCampId(id)
  }

  const handleAccountMenu = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountAnchorEl(null);
  };

  const handleAccountLogout = () => {
    localStorage.removeItem("token");
    history.push("/login")
  }

  const handleShowAccount = () => {

  }

  return (
    <div className={classes.root}>
       <AppBar position="static">
        <Toolbar>
          { showMenu < 1100 ? (<IconButton onClick={handleClick} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>) : null}
          <Menu
            id="simple-menu"
            anchorEl={tabAnchorEl}
            keepMounted
            open={Boolean(tabAnchorEl)}
            onClose={handleTabMenuClose}
          >
            <MenuItem onClick={handleTabMenuClose}><Tab onClick={menuTabChange(0)} label="Dashboard" /></MenuItem>
            <MenuItem onClick={handleTabMenuClose}> <Tab onClick={menuTabChange(1)} label="Clients" /></MenuItem>
            <MenuItem onClick={handleTabMenuClose}> <Tab onClick={menuTabChange(2)} label="Source" /></MenuItem>
            <MenuItem onClick={handleTabMenuClose}><Tab onClick={menuTabChange(3)} label="Fundraisers" /></MenuItem>
            <MenuItem onClick={handleTabMenuClose}><Tab onClick={menuTabChange(4)} label="Donors" /></MenuItem>
            <MenuItem onClick={handleTabMenuClose}> <Tab onClick={menuTabChange(5)} label="Teams" /></MenuItem>
          </Menu>
          <Typography variant="h4" className={classes.title}>
            <img alt='logo' src={Logo} />
          </Typography>
          <div className={classes.rightBar}>
            { showMenu > 1100 ? ( <Tabs className={classes.tabs} value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Dashboard" />
              <Tab label="Clients" />
              <Tab label="Source" />
              <Tab label="Fundraisers" />
              <Tab label="Donors" />
              <Tab label="Teams" />
            </Tabs>) : null}
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleAccountMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={accountAnchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleAccountMenuClose}
            >
              {/* <MenuItem onClick={handleShowAccount}>Account</MenuItem> */}
              <MenuItem onClick={handleAccountLogout}>Logout</MenuItem>
            </Menu>
          </div>
        
        </Toolbar>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Grid container spacing={3}>
          <OutLineGrid />
          <Grid item className={classes.chart} xs={12} sm={12} md={6}>
              <Chart />
          </Grid>
          <Grid item className={classes.mainTable} xs={12} sm={12} md={6}>
            <MainTable onClick={campRowClick} />
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel value={value} index={1}>       
        <Clients homeCamp={campId} />
      </TabPanel>
      <TabPanel value={value} index={2}>       
        <Source />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Fundraisers />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Donors />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Teams />
      </TabPanel>
    </div>
  );
}