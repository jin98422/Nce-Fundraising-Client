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
} from '@material-ui/core';
import TableTemplate from '../components/TableTemplate';
import CustomSnackBar from '../components/CustomSnackBar';

const useStyles = makeStyles((theme) => ({
    rootContainer: {
        minHeight: "80vh",
    },
    root: {
        border: "2px solid #595959",
        minHeight: "100%",
        position: 'relative',
    },
    wrapper: {
        padding: theme.spacing(1)
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
        bottom: 0,
        width: 'calc(100% - ' + theme.spacing(2) + 'px)',
    },
    button: {
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        marginBottom: theme.spacing(2),
    },
    tableRoot: {
        borderRadius: '18px 18px 0 0',
        border: "2px solid #595959",
        height: "100%",
    },
    tablewrapper: {
        marginTop: theme.spacing(2),
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

const columns = [
    { title: 'Source ID', field: 'id' },
    { title: 'Client', field: 'clientName' },
    { title: 'Status', field: 'status' },
    { title: 'Campaigns', field: 'campaigns' },
];



export default function Source() {
    const classes = useStyles();

    const [client, setClient] = useState('');
    const [method, setMethod] = useState('');
    const [status, setStatus] = useState('');
    const [street1, setStreet1] = useState('');
    const [street2, setStreet2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [sourceId, setSourceId] = useState('');
    const [sourceTableData, setSourceTableData] = useState([])
    const [clients, setClients] = useState([])
    const [id, setId] = useState(null)
    const [isLoading, setLoding] = useState(false);    
    const [content, setContent] = useState('');    
    const [severity, setSeverity] = useState('success');    
    const [openSnack, setOpenSnack] = useState(false);  
    const [selectedID, setSelectedID] = useState(null)

    useEffect(() => {
        getSourceData();
        getClients()
    }, [])

    const getClients = () => {
        axios.get(`${process.env.REACT_APP_HOST}/client`).then(res => {
            console.log(res.data)
            setClients(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const getSourceData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/source`).then(res => {
            console.log(res.data)
            setSourceTableData(res.data)
        }).catch(err => {
            console.log(err)
        })
    }
    const addNewSource = () => {
        setId(null);
        setClient('')
        setMethod('')
        setStatus('')
        setStreet1('')
        setStreet2('')
        setCity('')
        setState('')
        setZip('')
        setSourceId('')
    }

    const sourceTableRowClick = async (e, rowData) => {
        console.log(rowData)
        setSelectedID(rowData.tableData.id)
        setId(rowData._id)
        setClient(rowData.client)
        setMethod(rowData.method)
        setStatus(rowData.status)
        setStreet1(rowData.street1)
        setStreet2(rowData.street2)
        setCity(rowData.city)
        setState(rowData.state)
        setZip(rowData.zip)
        setSourceId(rowData.id)
    }

    const completeSave = (e) => {
        e.preventDefault();
        setLoding(true)
        if(id) {
            console.log("edit")            
            axios.post(`${process.env.REACT_APP_HOST}/source/update`, {
                id: id,
                client: client,
                method: method,
                status: status,
                street1: street1,
                street2: street2,
                city: city,
                state: state,
                zip: zip,
                sourceId: sourceId,
            }).then(res => {
               if(res.status === 200) {
                    console.log(res.data)
                    setLoding(false)                   
                    getSourceData()
                    setOpenSnack(true);
                    setContent('Source Code Saved');
                    setSeverity('success')
               }
            }).catch(err => {
                setLoding(false)
                setOpenSnack(true);
                setSeverity('error')
                setContent('Something went wrong, please try again.');
                console.log(err)
            })
        } else {
            console.log("add")
            axios.post(`${process.env.REACT_APP_HOST}/source/add`, {
                client: client,
                method: method,
                status: status,
                street1: street1,
                street2: street2,
                city: city,
                state: state,
                zip: zip,
                sourceId: sourceId,
            }).then(res => {
               if(res.status === 200) {
                    console.log(res.data)
                    setLoding(false)
                    setClient('')
                    setMethod('')
                    setStatus('')
                    setStreet1('')
                    setStreet2('')
                    setCity('')
                    setState('')
                    setZip('')
                    setSourceId('')
                    getSourceData()
                    setOpenSnack(true);
                    setContent('Source Code Added');
                    setSeverity('success')
               }
            }).catch(err => {
                setLoding(false)
                setOpenSnack(true);
                setSeverity('error')
                if(err.response.status === 409) {
                    setContent('This id already existing.');
                } else {
                    setContent('Something went wrong, please try again.');
                }
                console.log(err)
            })
        }
    }

    const deleteSource = () => {
        setLoding(true)
        axios.post(`${process.env.REACT_APP_HOST}/source/delete`, {
            id: id,
        }).then(res => {
           if(res.status === 200) {
                console.log(res.data)
                setLoding(false)
                setClient('')
                setMethod('')
                setStatus('')
                setStreet1('')
                setStreet2('')
                setCity('')
                setState('')
                setZip('')
                setSourceId('')
                getSourceData()
                setOpenSnack(true);
                setContent('Source Code Deleted');
                setSeverity('success')
           }
        }).catch(err => {
            setLoding(false)
            setOpenSnack(true);
            setSeverity('error')
            setContent('Something went wrong, please try again.');
            console.log(err)
        })
    }

    const closeSnack = () => {
        setOpenSnack(false)
    }

    return (
        <Grid container className={classes.rootContainer} spacing={3}>
          <Grid item xs={12} sm={12} md={4}>
            <TableTemplate title="All Sources" selectedID={selectedID} addNew={addNewSource} tableRowClick={sourceTableRowClick} columns={columns} tableData={sourceTableData} />
          </Grid>
          <Grid item xs={12} sm={12} md={8}>
            <Paper className={classes.root}>
                <form onSubmit={completeSave} >
                    <Grid container className={classes.wrapper} spacing={2}>
                        <Grid item xs={12} >
                            { !id && <Typography variant="h4" >ADD NEW SOURCE</Typography>}
                            { id && <Typography variant="h4" >Save SOURCE</Typography>}
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl margin="dense" required fullWidth>
                                        <InputLabel id="role">Client</InputLabel>
                                        <Select
                                            labelId="role"
                                            value={client}
                                            onChange={(e) => {
                                                setClient(e.target.value)
                                            }}
                                        >
                                            {
                                                clients.map((element, key) => {
                                                    return <MenuItem key={key} value={element._id}>{element.name}</MenuItem>
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        fullWidth 
                                        label="ID"
                                        value={sourceId}
                                        margin="dense"
                                        required
                                        onChange={(e) => {
                                            setSourceId(e.target.value)
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl margin="dense" required fullWidth>
                                        <InputLabel id="active-inactive">Method</InputLabel>
                                        <Select
                                            labelId="active-inactive"
                                            value={method}
                                            onChange={(e) => {
                                                setMethod(e.target.value)
                                            }}
                                        >
                                            <MenuItem value="0">Street</MenuItem>
                                            <MenuItem value="1">Table</MenuItem>
                                            <MenuItem value="2">Private Site</MenuItem>
                                            <MenuItem value="3">Door-to-Door</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
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
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        fullWidth 
                                        label="Street Address 1"
                                        value={street1}
                                        margin="dense"
                                        onChange={(e) => {
                                            setStreet1(e.target.value)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField 
                                        fullWidth 
                                        label="Street Address 2"
                                        value={street2}
                                        margin="dense"
                                        onChange={(e) => {
                                            setStreet2(e.target.value)
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <TextField 
                                        fullWidth 
                                        label="City"
                                        value={city}
                                        required
                                        margin="dense"
                                        onChange={(e) => {
                                            setCity(e.target.value)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField 
                                        fullWidth 
                                        label="State"
                                        value={state}
                                        required
                                        margin="dense"
                                        onChange={(e) => {
                                            setState(e.target.value)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <TextField 
                                        fullWidth 
                                        label="Zip"
                                        value={zip}
                                        margin="dense"
                                        onChange={(e) => {
                                            setZip(e.target.value)
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            {!id && <div className={classes.buttonContainer}>
                                <Button 
                                    type="submit"
                                    fullWidth
                                    className={classes.button} 
                                    variant="contained" 
                                    color="primary"
                                >
                                    Add New Source
                                    {isLoading && <CircularProgress color="secondary" />}
                                </Button>
                            </div>}
                            {id && <div className={classes.buttonContainer}>
                                <Button 
                                    type="submit"
                                    fullWidth
                                    className={classes.button} 
                                    variant="outlined" 
                                    color="primary"
                                >
                                    Save Source
                                    {isLoading && <CircularProgress color="secondary" />}
                                </Button>
                                <Button 
                                    fullWidth
                                    className={classes.button} 
                                    variant="contained" 
                                    color="secondary"
                                    onClick={deleteSource}
                                >
                                    Delete Source
                                    {isLoading && <CircularProgress color="primary" />}
                                </Button>
                            </div>}
                        </Grid>
                    </Grid>
                </form>
                <CustomSnackBar open={openSnack} handleClose={closeSnack} severity={severity} content={content} />
            </Paper>
          </Grid>
        </Grid>
    );
}