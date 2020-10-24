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
} from '@material-ui/core';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import ShareIcon from '@material-ui/icons/Share';
import MaterialTable from 'material-table';
import CustomSnackBar from './CustomSnackBar';

const useStyles = makeStyles((theme) => ({
    rootContainer: {
        height: "100%",
        padding: theme.spacing(1),
    },
    root: {
        border: "2px solid #595959",
        minHeight: "100%",
    },
    wrapper: {
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
        // position: 'absolute',
        // bottom: 0,
        marginTop: theme.spacing(2),
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
    },
    formroot: {
        // position: "relative",
        // height: '100%'
    }
})); 

export default function ShowCampData(props) {
    const classes = useStyles();
    const {id, close} = props

    const [fundTableData, setFundTableData] = useState([])
    const [sourceData, setSourceData] = useState([])
    const [isLoading, setLoding] = useState(false)
    const [name, setName] = useState('');
    const [source, setSource] = useState('');
    const [contact, setContact] = useState('');
    const [lead, setLead] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('');
    const [client, setClient] = useState('');
    const [leads, setLeads] = useState([]);
    const [content, setContent] = useState('');    
    const [severity, setSeverity] = useState('success');    
    const [openSnack, setOpenSnack] = useState(false);

    const fundraiserColumns = [
        { title: 'Photo', field: 'photo', 
            render: rowData => <img src={rowData.photo} alt='profile' style={{width: 40, borderRadius: '50%'}} />, 
            cellStyle: {
                width: 'calc((100% - 0px) / 10)',
                textAlign: "center"
            } 
        },
        { title: 'Fundraiser Name', field: 'name' },
        { title: 'Status', field: 'status' },
        { title: 'Share', field: 'share', 
            render: rowData =>
                    <ShareIcon />
        },
        { title: 'Form', field: 'form', 
            render: rowData =>
                    <FileCopyIcon />
        },
    ];

    useEffect(() => {
        getCampaingsData();
        getFundraisersData();
        getCampaignLeads();
        getSourceData()
    }, [])

    const getCampaignLeads = () => {
        axios.get(`${process.env.REACT_APP_HOST}/user/getadmin`,).then(res => {
            console.log(res.data)
            setLeads(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const getCampaingsData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/campaign`, {
            params: {
                id: id,
            }
        }).then(res => {
            console.log(res)
            let data = res.data[0];
            setName(data.name)
            setSource(data.source)
            setContact(data.contact)
            setLead(data.lead)
            setStatus(data.status)
            setDescription(data.description)
            setClient(data.client)
        }).catch(err => {
            console.log(err)
        })
    }

    const getFundraisersData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/fundraiser`).then(res => {
            console.log(res.data)
            setFundTableData(res.data)
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

    const saveCampaign = (e) => {
        e.preventDefault();
        setLoding(true)
        axios.post(`${process.env.REACT_APP_HOST}/campaign/update`, {
            id: id,
            name: name,
            source: source,
            contact: contact,
            lead: lead,
            status: status,
            description: description,
            client: client,
        }).then(res => {
           if(res.status === 200) {
                console.log(res.data)
                setLoding(false)
                setOpenSnack(true);
                setContent('Campaign Saved');
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

    const deleteCamp = () => {
        axios.post(`${process.env.REACT_APP_HOST}/campaign/delete`, {
            id: id
        }).then(res => {
            close()
            setOpenSnack(true);
            setContent('Client Deleted');
            setSeverity('success')
        }).catch(err => {
            console.log(err)
            setLoding(false)
            setOpenSnack(true);
            setSeverity('error')
            setContent('Something went wrong, please try again.');
        })
    }  
    
    const closeSnack = () => {
        setOpenSnack(false)
    }

    return (
        
        <Grid container className={classes.rootContainer} spacing={3}>    
            <Grid item xs={12} sm={12} md={6} className={classes.formroot}>
                <form onSubmit={saveCampaign}>               
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
                    <Grid container spacing={2} >
                        <Grid item xs={12} sm={6} style={{textAlign: 'center'}}>
                            <Typography color='inherit'>
                                Share URL
                            </Typography>
                            <CopyToClipboard 
                                text={`${process.env.REACT_APP_DOMAIN}/share/${id}`}
                                onCopy={() => { 
                                    setOpenSnack(true);
                                    setContent('Share Link Copied!');
                                    setSeverity('success')
                                 }}
                            >
                                <ShareIcon fontSize='large' />
                            </CopyToClipboard>
                        </Grid>
                        <Grid item xs={12} sm={6} style={{textAlign: 'center'}}>
                            <Typography color='inherit'>
                                Form URL
                            </Typography>
                            <CopyToClipboard 
                                text={`${process.env.REACT_APP_DOMAIN}/form/${id}`}
                                onCopy={() => { 
                                    setOpenSnack(true);
                                    setContent('Form Link Copied!');
                                    setSeverity('success')
                                }}
                            >
                                <FileCopyIcon fontSize='large' />
                            </CopyToClipboard>
                        </Grid>
                    </Grid>
                    <div className={classes.buttonContainer}>
                        <Button 
                            fullWidth
                            type="submit"
                            className={classes.button} 
                            variant="outlined" 
                            color="primary"
                        >
                            Save Campaign
                            {isLoading && <CircularProgress color="secondary" />}
                        </Button>
                        <Button 
                            fullWidth
                            onClick={deleteCamp}
                            className={classes.button} 
                            variant="contained" 
                            color="secondary"
                        >
                            Delete Campaign
                            {isLoading && <CircularProgress color="primary" />}
                        </Button>
                    </div>
                </form>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
                <Paper className={classes.tableRoot} component={Paper}>
                    <Toolbar className={classes.toolBar}>
                        <Typography className={classes.toolBarTitle} color='inherit'>
                        Fundraisers Assigned to Team
                        </Typography>
                    </Toolbar>
                    <MaterialTable
                        title=""
                        columns={fundraiserColumns}
                        data={fundTableData}
                        options={{
                            paging: false,
                            headerStyle: {
                            display: "none"
                            }
                        }}
                    />
                </Paper>
            </Grid>
            <CustomSnackBar open={openSnack} handleClose={closeSnack} severity={severity} content={content} />
        </Grid>
    );
}