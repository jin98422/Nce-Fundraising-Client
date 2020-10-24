import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {
    Paper, 
    TextField, 
    Grid, 
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Typography,
    CircularProgress,
    Toolbar,
    Breadcrumbs,
    Link,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import CustomSnackBar from './CustomSnackBar';

const useStyles = makeStyles((theme) => ({
    form: {
        position: 'relative',
        height: '100%',
    },
    root: {
        height: "100%",
    },
    wrapper: {
        height: '100%',
        padding: theme.spacing(2)
    },
    profile: {
        width: "10rem",
        margin: theme.spacing(2),
    },
    header: {
        // width: "100%",
        margin: theme.spacing(2),
    },
    margin: {
        margin: theme.spacing(2)
    },
    background: {
        width: "10rem",
        height: "10rem",
        backgroundColor: "#5b9bd5",
        margin: "auto",
        borderRadius: "15px",
        color: "white",
        display:"flex",
        justifyContent: "center",
        alignItems: "center"
    },
    deleteGrid: {
        position: "relative",
        padding: theme.spacing(2) + "px !important",
    },
    profileInfo: {
        padding: theme.spacing(2) + "px !important",
    },
    buttonContainer: {   
        position: 'absolute',
        bottom: '1rem',
        width: 'calc(100% - ' + theme.spacing(2) + 'px)',
    },
    bread: {
        display: 'flex', 
        alignItems: 'center'
    },
    breadLink: {

    },
    button: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    tableRoot: {
        borderRadius: '18px 18px 0 0',
        border: "2px solid #595959",
        height: "100%",
    },
    table: {
        minWidth: 650,
    },
    toolBar: {
        backgroundColor: '#595959',
        color: 'white',
        borderRadius: '15px 15px 0 0',
    },
    toolBarTitle: {
        flex: '1 1 100%',
        textAlign: "center",
        fontSize: "1.2rem",
    },
    toolBarIcon: {
        color: "white"
    },
    tableContent: {
        padding: theme.spacing(2),
        paddingTop: theme.spacing(8),
    }
})); 

export default function AddNewCamp(props) {
    const { clientId } = props;
    const classes = useStyles();
    const [sourceData, setSourceData] = useState([])
    const [addTableData, setAddTableData] = useState([])
    const [currentTableData, setCurrentTableData] = useState([])
    const [isLoading, setLoding] = useState(false)
    const [name, setName] = useState('');
    const [source, setSource] = useState('');
    const [contact, setContact] = useState('');
    const [lead, setLead] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [leads, setLeads] = useState([]);
    const [enableInfo, setEnableInfo] = useState(true);
    const [enableTeam, setEnableTeam] = useState(false);
    const [content, setContent] = useState('');    
    const [severity, setSeverity] = useState('success');    
    const [openSnack, setOpenSnack] = useState(false);    

    const fundraiserAddColumns = [
        { title: 'Fundraiser Name', field: 'name' },
        { title: 'Action', field: 'action', 
            render: rowData => <Button variant="contained" style={{backgroundColor: "#a8d08c", color: "white", fontWeight: "bold" }} onClick={handleAddFundraiser(rowData._id)} >Add &gt; </Button>,
            cellStyle: {
                width: 'calc((100% - 0px) / 7)',
                textAlign: 'right',
            }
        },
    ];

    const fundraiserRemoveColumns = [
        { title: 'Fundraiser Name', field: 'name' },
        { title: 'Action', field: 'action', 
            render: rowData => <Button variant="contained" color="secondary" onClick={handleRemoveFundraiser(rowData._id)} >Remove</Button>,
            cellStyle: {
                width: 'calc((100% - 0px) / 7)',
                textAlign: 'right',
            }
        },
    ];

    useEffect(() => {
        getTeamsData();
        getCampaignLeads();
        getSourceData();
    }, [])

    const getCampaignLeads = () => {
        axios.get(`${process.env.REACT_APP_HOST}/user/getadmin`,).then(res => {
            console.log(res.data)
            setLeads(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const getTeamsData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/team`).then(res => {
            console.log(res.data)
            setAddTableData(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const getSourceData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/source`).then(doc => {
            console.log(doc)
            setSourceData(doc.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const handleClick = (e) => {
        e.preventDefault();
        setEnableInfo(true)
        setEnableTeam(false)
    }

    const handleAddFundraiser = (id) => () => {
        console.log("id", id)
        if(currentTableData.length === 1) {
            setOpenSnack(true)
            setSeverity('error')
            setContent('Only one team can be added to a campaign.')
            return;
        } 
        let currentResult = addTableData.find((fundraiser) => {
            return fundraiser._id === id
        })
        let addResult = addTableData.filter(fundraiser => {
            return fundraiser._id !== id
        })
        setAddTableData(addResult)
        setCurrentTableData([...currentTableData, currentResult])
    }

    const handleRemoveFundraiser = (id) => () => {
        console.log("id", id)
        let addResult = currentTableData.find((team) => {
            return team._id === id
        })
        let currentResult = currentTableData.filter(team => {
            return team._id !== id
        })
        setAddTableData([...addTableData, addResult])
        setCurrentTableData(currentResult)
    }

    const addNewInfo = (e) => {
        e.preventDefault();
        setEnableInfo(false)
        setEnableTeam(true)             
    }

    const completeNewCampaign = () => {
        setLoding(true)
        let teamId = currentTableData[0]._id;
        if(teamId === '') {
            setLoding(false);
            setOpenSnack(true);
            setContent('You must be added one team at the least.');
            setSeverity('error')
            return;
        }        
        axios.post(`${process.env.REACT_APP_HOST}/campaign/add`, {
            name: name,
            source: source,
            client: clientId,
            contact: contact,
            lead: lead,
            description: description,
            status: status,
            team: teamId
        }).then(res => {
            if(res.status === 200) {
                console.log(res.data)
                setLoding(false)
                setName('')
                setSource('')
                setContact('')
                setLead('')
                setDescription('')
                setStatus('')
                setAddTableData([])
                setCurrentTableData([])
                getTeamsData()
                setEnableInfo(true)
                setEnableTeam(false)
                setOpenSnack(true);
                setContent('Campaign Added');
                setSeverity('success')
            }
        }).catch(err => {
            setLoding(false)
            setOpenSnack(true);
            setSeverity('error')
            if(err.response.status === 409) {
                setContent('This campaign name already existing.');
            } else {
                setContent('Something went wrong, please try again.');
            }
            console.log(err)
        })
    }

    const closeSnack = () => {
        setOpenSnack(false)
    }

    return (
        <div className={classes.root} >
            { enableInfo && <form onSubmit={addNewInfo} >
                <Grid container className={classes.wrapper} spacing={2}>
                    <Grid item xs={12} >
                        <Typography variant="h4" align="center">CAMPAIGN INFORMATION</Typography>
                    </Grid>
                
                        <Grid item xs={12}>
                            <TextField 
                                fullWidth 
                                label="Campaign Name" 
                                name="name"
                                value={name}
                                margin="dense"
                                required
                                onChange={(e) => {
                                    setName(e.target.value)
                                }}
                            />
                            <FormControl margin="dense" required fullWidth>
                                <InputLabel id="role">Source Code</InputLabel>
                                <Select
                                    labelId="role"
                                    value={source}
                                    onChange={(e) => {
                                        setSource(e.target.value)
                                    }}
                                >
                                    {
                                        sourceData.map((element, key) => {
                                            return <MenuItem key={key} value={element._id}>{element.id}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <TextField 
                                fullWidth 
                                label="Contact"
                                value={contact}
                                required
                                margin="dense"
                                onChange={(e) => {
                                    setContact(e.target.value)
                                }}
                            />
                            <FormControl margin="dense" required fullWidth>
                                <InputLabel id="role">Campaign Lead</InputLabel>
                                <Select
                                    labelId="role"
                                    value={lead}
                                    onChange={(e) => {
                                        setLead(e.target.value)
                                    }}
                                >
                                    {
                                        leads.map((element, key) => {
                                            return <MenuItem key={key} value={element.username}>{element.username}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <TextField 
                                fullWidth 
                                label="Description"
                                value={description}
                                required
                                margin="dense"
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                }}
                            />
                            <FormControl margin="dense" required fullWidth>
                                <InputLabel id="active-inactive">Status</InputLabel>
                                <Select
                                    labelId="active-inactive"
                                    value={status}
                                    onChange={(e) => {setStatus(e.target.value)}}
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                            <Grid container spacing={2} className={classes.buttonContainer}>
                                <Grid item xs={12} sm={8} className={classes.bread}>
                                    <Breadcrumbs separator={<ArrowForwardIcon fontSize="small" />} aria-label="breadcrumb">
                                        <Typography color="inherit">New Campaign</Typography>
                                        <Typography color="textPrimary">Information</Typography>
                                    </Breadcrumbs>
                                </Grid>
                                <Grid item xs={12} sm={4} style={{textAlign: 'right'}} >
                                    <Button 
                                        type="submit" 
                                        className={classes.button} 
                                        variant="contained" 
                                        color="primary"
                                    >
                                        Next
                                        {isLoading && <CircularProgress />}
                                    </Button>
                                </Grid>  
                            </Grid>
                        </Grid>
                </Grid>
            </form>}
            { enableTeam && <div className={classes.wrapper} >
                <Grid container spacing={2}>
                    <Grid item xs={12} >
                        <Typography variant="h4" align="center">ADD TEAM</Typography>
                    </Grid>                
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.tableRoot} component={Paper}>
                            <Toolbar className={classes.toolBar}>
                                <Typography className={classes.toolBarTitle} color='inherit'>
                                Select Team
                                </Typography>
                            </Toolbar>
                            <MaterialTable
                                title=""
                                columns={fundraiserAddColumns}
                                data={addTableData}
                                options={{
                                    paging: false,
                                    headerStyle: {
                                        display: "none"
                                        }
                                }}
                            />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper className={classes.tableRoot} component={Paper}>
                            <Toolbar className={classes.toolBar}>
                                <Typography className={classes.toolBarTitle} color='inherit'>
                                    Current Team
                                </Typography>
                            </Toolbar>
                            <MaterialTable
                                title=""
                                columns={fundraiserRemoveColumns}
                                data={currentTableData}
                                options={{
                                    paging: false,
                                    headerStyle: {
                                        display: "none"
                                    }
                                }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container spacing={2} className={classes.buttonContainer}>
                    <Grid item xs={12} sm={8} className={classes.bread}>
                        <Breadcrumbs separator={<ArrowForwardIcon fontSize="small" />} aria-label="breadcrumb">
                            <Typography color="inherit">New Campaign</Typography>
                            <Link color="inherit" href="/" onClick={handleClick}>
                                Information
                            </Link>
                            <Typography color="textPrimary">Team</Typography>
                        </Breadcrumbs>
                    </Grid>
                    <Grid item xs={12} sm={4} style={{textAlign: 'right'}} >
                        <Button 
                            className={classes.button} 
                            variant="contained" 
                            color="primary"
                            onClick={completeNewCampaign}
                        >
                            Add Campaign
                            {isLoading && <CircularProgress />}
                        </Button>
                    </Grid>  
                </Grid>
            </div>}
            <CustomSnackBar open={openSnack} handleClose={closeSnack} severity={severity} content={content} />
        </div>
    );
}