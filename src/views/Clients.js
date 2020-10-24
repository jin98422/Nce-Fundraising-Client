import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
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
    CircularProgress,
    Tabs,
    Tab,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'
import MaterialTable from 'material-table';
import { DropzoneDialog } from 'material-ui-dropzone';
import TableTemplate from '../components/TableTemplate';
import ShowCampData from '../components/ShowCampData';
import AddNewCamp from '../components/AddNewCamp';
import CustomSnackBar from '../components/CustomSnackBar';

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
           children
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
    rootContainer: {
        minHeight: "80vh",
    },
    root: {
        border: "2px solid #595959",
        minHeight: '100%',
        padding: theme.spacing(2)
    },
    tabtable: {
        height: 'calc(100% - 47px)'
    },
    camproot: {
        border: "2px solid #595959",
        height: '100%',
    },
    campdetailroot: {
        border: "2px solid #595959",
        position: 'relative',
        height: '100%',
    },
    close: {
        position: 'absolute',
        right: 0,
        transform: 'translate(0, -100%)',
    },
    imgCenter: {
        display: "flex",
        justifyContent: "center"
    },
    profile: {
        height: "10rem",
        margin: theme.spacing(2),
    },
    header: {
        height: "10rem",
        margin: theme.spacing(2),
    },
    margin: {
        margin: theme.spacing(2)
    },
    background: {
        width: "10rem",
        height: "10rem",
        margin: "auto",
        borderRadius: "15px",
        color: "white",
        display:"flex",
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        textAlign: "center"
    },
    deleteGrid: {
        position: "relative",
        padding: theme.spacing(2) + "px !important",
    },
    profileInfo: {
        padding: theme.spacing(2) + "px !important",
    },
    buttons: {
        textAlign: "center"
    },
    delete: {
        margin: theme.spacing(1),
    },
    tabroot: {
        border: '1px solid #44546a',
        borderRadius: '10px 10px 0 0'
    },
    selected: {
        backgroundColor: '#595959',
        color: 'white',
    }
})); 

const columns = [
    { title: 'Client Name', field: 'name' },
    { title: 'Status', field: 'status' },
    { title: 'Campaigns', field: 'campaigns' },
];

const campColumns = [
    { title: 'Campaign Name', field: 'name' },
    { title: 'Status', field: 'status' },
    { title: 'Team Leader', field: 'leader' },
    { title: 'Source Code', field: 'source' },
];

export default function Clients(props) {
    const { homeCamp } = props;
    const classes = useStyles();

    const [tableData, setTableData] = useState([])
    const [campTableData, setCampTableData] = useState([])
    const [id, setId] = useState(null);
    const [capmId, setCampId] = useState(homeCamp);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [contact, setContact] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("");
    const [payment, setPayment] = useState("");
    const [key1, setKey1] = useState("");
    const [key2, setKey2] = useState("");
    const [merchantKey, setMerchantKey] = useState("");
    const [profilePhotoOpen, setProfilePhotoOpen] = useState(false);
    const [headerPhotoOpen, setHeaderPhotoOpen] = useState(false);
    const [profileSrc, setProfileSrc] = useState(null);
    const [headerSrc, setHeaderSrc] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [headerPhoto, setHeaderPhoto] = useState(null);
    const [color, setColor] = useState("#5b9bd5");
    const [value, setValue] = useState(0);
    const [selectedID, setSelectedID] = useState(null)
    const [showCampTable, setShowCampTable] = useState(true)
    const [showCampDetail, setShowCampDetail] = useState(false)
    const [isLoading, setLoding] = useState(false);    
    const [content, setContent] = useState('');    
    const [severity, setSeverity] = useState('success');    
    const [openSnack, setOpenSnack] = useState(false);  

    useEffect(() => {
        if(capmId) {
            setValue(1);
            setShowCampDetail(true);
            setShowCampTable(false)
        }
        getData();
        getCampaingsData();
    }, [capmId])

    const getData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/client`).then(res => {
            console.log(res.data)
            setTableData(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const getCampaingsData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/campaign`).then(doc => {
            console.log(doc)
            setCampTableData(doc.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const profilePhotoUpload = (files) => {
        console.log('ProfileFiles:', files);
        setProfilePhoto(files[0])
        let reader = new FileReader();
        reader.onloadend = (e) => {
            setProfileSrc(reader.result)
            console.log("url", reader.result)
        }
        reader.readAsDataURL(files[0])
        setProfilePhotoOpen(false);
    }

    const headerPhotoUpload = (files) => {
        console.log('HeaderFiles:', files);
        setHeaderPhoto(files[0])
        let reader = new FileReader();
        reader.onloadend = (e) => {
            setHeaderSrc(reader.result)
            console.log("url", reader.result)
        }
        reader.readAsDataURL(files[0])
        setHeaderPhotoOpen(false);
    }

    const addNewClient = () => {
        setSelectedID(null)
        setId(null)
        setName("")
        setEmail("")
        setPhone("")
        setContact("")
        setDescription("")
        setStatus("")
        setPayment("")
        setKey1("")
        setKey2("")
        setMerchantKey("")
        setProfileSrc(null)
        setHeaderSrc(null)
        setProfilePhoto(null)
        setHeaderPhoto(null)
        setColor("#5b9bd5")
    }

    const addNewCamp = () => {
        if(!id) {
            setOpenSnack(true);
            setSeverity('error')
            setContent('You need to select a Client from the table.');
            return;
        }
        setShowCampTable(false)
        setShowCampDetail(true)
    }

    const tableRowClick = (e, rowData) => {
        console.log(rowData)
        setSelectedID(rowData.tableData.id)
        setId(rowData._id)
        setName(rowData.name)
        setEmail(rowData.email)
        setPhone(rowData.phone)
        setContact(rowData.contact)
        setDescription(rowData.description)
        setStatus(rowData.status)
        setPayment(rowData.payment)
        setKey1(rowData.key1)
        setKey2(rowData.key2)
        setMerchantKey(rowData.merchantKey)
        setProfileSrc(process.env.REACT_APP_HOST + rowData.profile)
        setHeaderSrc(process.env.REACT_APP_HOST + rowData.header)
        setColor(rowData.color)
    }

    const campTableRowClick = (e, rowData) => {
        console.log(rowData)
        setShowCampTable(false)
        setShowCampDetail(true)
        setCampId(rowData._id)
    }

    const uploadClient = (e) => {
        e.preventDefault();
        setLoding(true)
        if(id) {
            const formData =  new FormData();
            formData.append("id", id);
            formData.append("profile", profilePhoto);
            formData.append("header", headerPhoto);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("color", color)
            formData.append("phone", phone);
            formData.append("contact", contact);
            formData.append("description", description)
            formData.append("status", status);
            formData.append("payment", payment);
            formData.append("key1", key1);
            formData.append("key2", key2);
            formData.append("merchantKey", merchantKey);
            axios.post(`${process.env.REACT_APP_HOST}/client/edit`, formData).then(res => {
                console.log(res.data)
                setLoding(false)
                getData();
                setOpenSnack(true);
                setContent('Client Saved');
                setSeverity('success')
            }).catch(err => {
                setLoding(false)
                setOpenSnack(true);
                setSeverity('error')
                setContent('Something went wrong, please try again.');
                console.log(err)
            })
        } else {
            if(profilePhoto === null) {
                setLoding(false)
                setOpenSnack(true);
                setSeverity('error')
                setContent('You must upload profile photo.');
                return;
            }
            if(headerPhoto === null) {
                setLoding(false)
                setOpenSnack(true);
                setSeverity('error')
                setContent('You must upload header photo.');
                return;
            }
            console.log(color)
            const formData =  new FormData();
            formData.append("profile", profilePhoto);
            formData.append("header", headerPhoto);
            formData.append("color", color);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("contact", contact);
            formData.append("description", description)
            formData.append("status", status);
            formData.append("payment", payment);
            formData.append("key1", key1);
            formData.append("key2", key2);
            formData.append("merchantKey", merchantKey);
            axios.post(`${process.env.REACT_APP_HOST}/client/add`, formData).then(res => {
                console.log(res.data)
                setLoding(false)
                getData();
                setName("")
                setEmail("")
                setPhone("")
                setContact("")
                setDescription("")
                setStatus("")
                setPayment("")
                setKey1("")
                setKey2("")
                setMerchantKey("")
                setHeaderSrc(null)
                setProfileSrc(null)
                setProfilePhoto(null)
                setHeaderPhoto(null)
                setColor("#5b9bd5")
                setOpenSnack(true);
                setContent('Client Added');
                setSeverity('success')
            }).catch(err => {
                setLoding(false)
                setOpenSnack(true);
                setSeverity('error')
                if(err.response.status === 409) {
                    setContent('This email already registered.');
                } else {
                    setContent('Something went wrong, please try again.');
                }
                console.log(err)
            })
        }
    }

    const deleteClient = () => {
        axios.post(`${process.env.REACT_APP_HOST}/client/delete`, {
            id: id
        }).then(res => {
            getData();
            setSelectedID(null)
            setId(null)
            setName("")
            setEmail("")
            setPhone("")
            setContact("")
            setDescription("")
            setStatus("")
            setPayment("")
            setKey1("")
            setKey2("")
            setMerchantKey("")
            setHeaderSrc(null)
            setProfileSrc(null)
            setProfilePhoto(null)
            setHeaderPhoto(null)
            setColor("#5b9bd5")
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

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleCampClose = () => {
        getCampaingsData();
        setShowCampTable(true)
        setShowCampDetail(false)
    }

    const closeSnack = () => {
        setOpenSnack(false)
    }

    return (
        <Grid container spacing={3} className={classes.rootContainer}>
            <Grid item xs={12} sm={12} md={4}>
                <TableTemplate title="All Clients" selectedID={selectedID} addNew={addNewClient} tableRowClick={tableRowClick} columns={columns} tableData={tableData} />
            </Grid>
            <Grid item xs={12} sm={12} md={8}>
            <Tabs 
                className={classes.tabs} 
                value={value} 
                onChange={handleChange} 
                aria-label="client tab"
                TabIndicatorProps={{
                    style: {
                        backgroundColor: 'transparent'
                    }
                }}
            >
                <Tab 
                    label="Information"
                    classes={{
                        root: classes.tabroot,
                        selected: classes.selected
                    }}
                />
                <Tab 
                    label="Campaigns"
                    classes={{
                        root: classes.tabroot,
                        selected: classes.selected
                    }}
                />
            </Tabs>
            <TabPanel value={value} index={0}>       
                <Paper className={classes.root}>
                    <Grid container spacing={2}>
                        <Grid item className={classes.image} xs={12} sm={12} md={3}>
                            <div className={classes.imgCenter}>
                                {
                                    profileSrc === null ? 
                                    <img className={classes.profile} alt='profile' src={window.location.origin +   '/profile.jpg'} />
                                    : <img className={classes.profile} alt='profile' src={profileSrc} />
                                }
                            </div>
                        
                            <div>
                                <Button variant="contained" color="primary" onClick={() => setProfilePhotoOpen(true)}>
                                    {
                                        id ? "Change Profile Photo" : "Add Profile Photo" 
                                    }
                                </Button>
                            </div>
                            <DropzoneDialog
                                acceptedFiles={['image/*']}
                                cancelButtonText={"Cancel"}
                                submitButtonText={"Upload"}
                                filesLimit={1}
                                open={profilePhotoOpen}
                                onClose={() => setProfilePhotoOpen(false)}
                                onSave={profilePhotoUpload}
                                showPreviews={true}
                                showFileNamesInPreview={true}
                            />
                            
                        </Grid>
                        <Grid item className={classes.image} xs={12} sm={12} md={6}>
                            <div  className={classes.imgCenter}>
                                {
                                    headerSrc === null ?
                                    <img className={classes.header} alt="header" src={window.location.origin +   '/header.png'} />
                                    : <img className={classes.header} alt="header" src={headerSrc} />
                                }
                            </div>
                            
                            <div>
                                <Button variant="contained" color="primary" onClick={() => setHeaderPhotoOpen(true)}>
                                    {
                                        id ? "Change Header Photo" : "Add Header Photo" 
                                    }
                                </Button>
                                <DropzoneDialog
                                    acceptedFiles={['image/*']}
                                    cancelButtonText={"Cancel"}
                                    submitButtonText={"Upload"}
                                    filesLimit={1}
                                    open={headerPhotoOpen}
                                    onClose={() => setHeaderPhotoOpen(false)}
                                    onSave={headerPhotoUpload}
                                    showPreviews={true}
                                    showFileNamesInPreview={true}
                                />
                            </div>
                            
                        </Grid>
                        <Grid item className={classes.image} xs={12} sm={12} md={3}>
                            <div className={classes.margin}>
                                <div className={classes.background} style={{backgroundColor: color}}>Background Color</div>
                            </div>
                            <TextField variant="outlined" value={color} onChange={(e) => {setColor(e.target.value)}} />
                        </Grid>
                    </Grid>
                    <form onSubmit={uploadClient}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} className={classes.profileInfo}>
                            <TextField fullWidth margin="dense" label="Name" value={name} onChange={(e) => {setName(e.target.value)}} required />
                            <TextField fullWidth margin="dense" label="Email" type="email" value={email} onChange={(e) => {setEmail(e.target.value)}} required />
                            <TextField fullWidth margin="dense" label="Phone" value={phone} onChange={(e) => {setPhone(e.target.value)}} required />
                            <TextField fullWidth margin="dense" label="Contact" value={contact} onChange={(e) => {setContact(e.target.value)}} required />
                            <TextField fullWidth margin="dense" label="Description" value={description} onChange={(e) => {setDescription(e.target.value)}} required />
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
                        <Grid item xs={12} sm={6} className={classes.deleteGrid}>
                            <FormControl margin="dense" required fullWidth>
                                <InputLabel id="payment-provider">Payment Provider</InputLabel>
                                <Select
                                    labelId="payment-provider"
                                    value={payment}
                                    onChange={(e) => {setPayment(e.target.value)}}
                                >
                                    <MenuItem value="Cybersource">Cybersource</MenuItem>
                                </Select>
                            </FormControl>
                            <TextField fullWidth margin="dense" label="MerchantKeyId" value={key1} onChange={(e) => {setKey1(e.target.value)}} required />
                            <TextField fullWidth margin="dense" label="MerchantSecretKey" value={key2} onChange={(e) => {setKey2(e.target.value)}} required />
                            <TextField fullWidth margin="dense" label="Merchant ID" value={merchantKey} onChange={(e) => {setMerchantKey(e.target.value)}} required />
                            {
                                id ? <div className={classes.buttons}>
                                        <Button type="submit" className={classes.delete}variant="contained" color="primary">
                                            Save Client
                                            {isLoading && <CircularProgress color="secondary" />}
                                        </Button>
                                        <br />
                                        <Button className={classes.delete} onClick={deleteClient} variant="contained" color="secondary">
                                            Delete Client
                                            {isLoading && <CircularProgress color="secondary" />}
                                        </Button>
                                    </div>
                                : <div className={classes.buttons}>
                                    <Button type="submit" className={classes.delete} variant="contained" color="primary">
                                        Add Client
                                        {isLoading && <CircularProgress color="secondary" />}
                                    </Button>
                                </div>
                            }
                        </Grid>
                    </Grid>
                    </form>
                </Paper>
            </TabPanel>
            <TabPanel value={value} index={1} className={classes.tabtable}>
                {showCampTable && <Paper className={classes.camproot}>
                    <MaterialTable
                        title={<Button variant="contained" color="primary" onClick={addNewCamp}>Add New Campaign</Button>}
                        columns={campColumns}
                        data={campTableData}
                        options={{
                            paging: false,
                        }}
                        onRowClick={campTableRowClick}
                    />
                </Paper>}
                {showCampDetail && <Paper className={classes.campdetailroot}>
                    <CloseIcon onClick={handleCampClose} className={classes.close} fontSize="large" />
                   { capmId && <ShowCampData id={capmId} close={handleCampClose} />}
                   { !capmId && <AddNewCamp clientId={id} />}
                </Paper>}
            </TabPanel>
          </Grid>
          <CustomSnackBar open={openSnack} handleClose={closeSnack} severity={severity} content={content} />
        </Grid>
    );
}