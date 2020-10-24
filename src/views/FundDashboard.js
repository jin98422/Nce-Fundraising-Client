import React, {useState, useEffect} from 'react';
import { useHistory } from "react-router-dom";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import QRCode from 'qrcode.react';
import decode from 'jwt-decode';
import axios from 'axios';
import ShareIcon from '@material-ui/icons/Share';
import { 
    makeStyles, 
    AppBar, 
    Typography, 
    Toolbar,
    Grid,
    Container,
    Menu, 
    MenuItem, 
    IconButton
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle'
import TableTemplate from '../components/TableTemplate';
import Logo from '../static/logo.png'

const columns = [
    { title: 'Campaign Name', field: 'name'},
    { title: 'Client', field: 'client',
        render: rowData => rowData.client[0].name, 
    },
    { title: 'Start Date', field: 'createdAt',
        render: rowData => rowData.createdAt.split('T')[0], 
    },
    { title: 'Share Link', field: 'share', 
        render: rowData => <ShareIcon />,
    },
    { title: 'Form Link', field: 'form', 
        render: rowData => <FileCopyIcon />,
    },
];

const useStyles = makeStyles((theme) => ({
    logo: {
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
      },
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    title: {
       display: 'flex'
    },
    center: {
        display: 'flex',
        justifyContent: 'center',
        flexGrow: 1,
        [theme.breakpoints.down('sm')]: {
            display: 'none'
        },
    },
    square: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        backgroundColor: "#5b9bd5",
        textAlign: "center",
        color: "white",
        borderRadius: "20px"
    },
    goal: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        textAlign: "center",
        color: "white",
        borderRadius: "20px",
        backgroundColor: '#ed7d31',
        border: '3px solid #ac5b23'
    },
    qrcode: {
        textAlign: 'center',
        marginTop: theme.spacing(4)
    },
}));

export default function Home() {
    const classes = useStyles();
    const history = useHistory();

    const [tableData, setTableData] = useState([])
    const [selectedID, setSelectedID] = useState(null)
    const [accountAnchorEl, setAccountAnchorEl] = useState(null);
    const open = Boolean(accountAnchorEl);

    const [load, setLoad] = useState(false)
    const [donation, setDonation] = useState('');
    const [succeeded, setSucceeded] = useState('100%');
    const [hours, setHours] = useState('3/8');
    const [total, setTotal] = useState('');
    const [avgDonation, setAvgDonation] = useState('');
    const [age, setAge] = useState('32.5');
    const [goal, setGoal] = useState('$2400');

    useEffect(() => {
        let path = window.location.pathname;
        const token = localStorage.getItem("fundraiser");
        if(token === null || token === "") {
            if(path.includes("fundraiser")) {
                window.location.href="/fundraiser/login";
            } else {
                setLoad(true)
            }        
        } else {
            const decodedToken = decode(token);
            if (decodedToken.exp < Date.now() / 1000) {
                if(path.includes("fundraiser")) {
                    window.location.href="/fundraiser/login";
                } else {
                    setLoad(true)
                }   
            } else {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem("fundraiser");
                setLoad(true)
                getFundraiserData(decodedToken.id)
            }
        }    
        
    }, [])

    const getFundraiserData = (id) => {
        axios.get(`${process.env.REACT_APP_HOST}/fundraiser/getData`, {
            params: {
                id:  id
            }
        }).then(doc => {
            console.log(doc.data);
            setTableData(doc.data.allCampaigns)
            let donors = doc.data.allDonors;
            setDonation(donors.length)
            let amount = 0.00
            for(let i in donors) {
                let item = donors[i];
                amount += parseFloat(item.amount)
            }
            setTotal('$'+ amount)
            setAvgDonation('$'+ (amount/donors.length).toFixed(2))
        }).catch(err => {
            console.log(err)
        })
    }

    const tableRowClick = (e, rowData) => {
        console.log(rowData)
        setSelectedID(rowData.tableData.id)
    }

    const handleAccountMenu = (event) => {
        setAccountAnchorEl(event.currentTarget);
    };

    const handleAccountMenuClose = () => {
        setAccountAnchorEl(null);
    };

    const handleAccountLogout = () => {
        localStorage.removeItem("fundraiser");
        history.push("/fundraiser/login")
    }

    const handleShowAccount = () => {

    }


    return (
        load &&  <div className={classes.root}>
            <AppBar position="static">
                <Toolbar className={classes.logo}>
                    <Typography variant="h4" className={classes.title}>
                        <img alt='logo' src={Logo} />
                    </Typography>
                    <Typography variant="h4" className={classes.center}>
                        FUNDRAISER DASHBOARD
                    </Typography>
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
                </Toolbar>
            </AppBar>
            <Grid container justify="space-evenly">  
                <Grid className={classes.square} item xs={4} sm={3} md={1}>
                    <Typography>
                    {donation}
                    <br />
                    DONATION
                    </Typography> 
                </Grid>
                <Grid className={classes.square} item xs={4} sm={3} md={1}>
                    <Typography>
                    {succeeded}
                    <br />
                    SUCCEEDED
                    </Typography>  
                </Grid>
                <Grid className={classes.square} item xs={4} sm={3} md={1}>
                    <Typography>
                    {hours}
                    <br />
                    HOURS
                    </Typography> 
                </Grid>
                <Grid className={classes.square} item xs={4} sm={3} md={1}>
                    <Typography>
                    {total}
                    <br />
                    TOTAL RAISED
                    </Typography> 
                </Grid>
                <Grid className={classes.square} item xs={4} sm={3} md={1}> 
                    <Typography>
                    {avgDonation}
                    <br />
                    AVG. DANATION
                    </Typography>   
                </Grid>
                <Grid className={classes.square} item xs={4} sm={3} md={1}>
                    <Typography>
                    {age}
                    <br />
                    AVG. AGE
                    </Typography>  
                </Grid>
                <Grid className={classes.goal} item xs={4} sm={3} md={1}>
                    <Typography>
                    {goal}
                    <br />
                    GOAL
                    </Typography>  
                </Grid>
            </Grid>
            <Container maxWidth="md">
                <TableTemplate title="Current Campaign" selectedID={selectedID} tableRowClick={tableRowClick} columns={columns} tableData={tableData} />
            </Container>
            <Container className={classes.qrcode} maxWidth="md">
                <QRCode 
                    value={`${process.env.REACT_APP_DOMAIN}/fundraiser`}
                    size={300}
                />
            </Container>
            
        </div>
    );
}