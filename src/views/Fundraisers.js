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
    CircularProgress,
    Toolbar,
    Typography,
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { DropzoneDialog } from 'material-ui-dropzone';
import TableTemplate from '../components/TableTemplate';
import CustomSnackBar from '../components/CustomSnackBar';

const useStyles = makeStyles((theme) => ({
    root: {
        border: "2px solid #595959",
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
    delete: {
        marginTop: theme.spacing(2),
    },
    tableRoot: {
        borderRadius: '18px 18px 0 0',
        border: "2px solid #595959",
        height: "100%",
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
})); 

const allColumns = [
    { title: 'Fundraiser Name', field: 'name' },
    { title: 'Status', field: 'status' },
    { title: 'Campaigns', field: 'campaigns' },
];

const teamColumns = [
    { title: 'Name', field: 'name' },
    { title: 'Status', field: 'status' },
];

export default function Fundraisers() {
    const classes = useStyles();

    const [tableData, setTableData] = useState([])
    const [teamData, setTeamData] = useState([])
    const [isLoading, setLoding] = useState(false);   
    const [id, setId] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [contact, setContact] = useState("");
    const [status, setStatus] = useState("");
    const [profilePhotoOpen, setProfilePhotoOpen] = useState(false);
    const [profileSrc, setProfileSrc] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [selectedID, setSelectedID] = useState(null)
    const [content, setContent] = useState('');    
    const [severity, setSeverity] = useState('success');    
    const [openSnack, setOpenSnack] = useState(false);  

    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/fundraiser`).then(res => {
            console.log(res.data)
            setTableData(res.data)
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

    const addNewClient = () => {
        setSelectedID(null)
        setId(null)
        setName("")
        setEmail("")
        setPhone("")
        setContact("")
        setStatus("")
        setProfileSrc(null)
        setProfilePhoto(null)
    }

    const tableRowClick = (e, rowData) => {
        console.log(rowData)
        axios.get(`${process.env.REACT_APP_HOST}/team`, {
            params: {
                fundraiserId: rowData._id
            }
        }).then(res => {
            console.log(res.data)
            setTeamData(res.data)
            setSelectedID(rowData.tableData.id)
            setId(rowData._id)
            setName(rowData.name)
            setEmail(rowData.email)
            setPhone(rowData.phone)
            setContact(rowData.contact)
            setStatus(rowData.status)
            setProfileSrc(process.env.REACT_APP_HOST + rowData.photo)
        }).catch(err => {
            setSelectedID(rowData.tableData.id)
            setId(rowData._id)
            setName(rowData.name)
            setEmail(rowData.email)
            setPhone(rowData.phone)
            setContact(rowData.contact)
            setStatus(rowData.status)
            setProfileSrc(process.env.REACT_APP_HOST + rowData.photo)
            console.log(err)
        })
    }

    const uploadClient = (e) => {
        e.preventDefault();
        setLoding(true)
        if(id) {
            console.log("edit")
            const formData =  new FormData();
            formData.append("photo", profilePhoto);
            formData.append("id", id);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("contact", contact);
            formData.append("status", status);
            axios.post(`${process.env.REACT_APP_HOST}/fundraiser/edit`, formData).then(res => {
                console.log(res.data)
                setLoding(false)
                getData();
                setOpenSnack(true);
                setContent('Fundraiser Saved');
                setSeverity('success')
            }).catch(err => {
                setLoding(false)
                setOpenSnack(true);
                setSeverity('error')
                setContent('Something went wrong, please try again.');
                console.log(err)
            })
        } else {
            console.log("add")
            if(profilePhoto === null) {
                setOpenSnack(true);
                setSeverity('error')
                setContent('You must upload profile photo.');
                setLoding(false)
                return;
            }
            const formData =  new FormData();
            console.log(profilePhoto)
            formData.append("photo", profilePhoto);
            formData.append("name", name);
            formData.append("email", email);
            formData.append("phone", phone);
            formData.append("contact", contact);
            formData.append("status", status);
            axios.post(`${process.env.REACT_APP_HOST}/fundraiser/add`, formData).then(res => {
                console.log(res.data)
                setLoding(false)
                getData();
                setId(null);
                setSelectedID(null)
                setName("")
                setEmail("")
                setPhone("")
                setContact("")
                setStatus("")
                setProfileSrc(null)
                setProfilePhoto(null)
                setOpenSnack(true);
                setContent('Fundraiser Added and Sent Account Confirm Email');
                setSeverity('success')
            }).catch(err => {
                setLoding(false)
                setOpenSnack(true);
                setSeverity('error')
                if(err.response.status === 409) {
                    setContent('This Fundraiser already existing.');
                } else {
                    setContent('Something went wrong, please try again.');
                }
                console.log(err)
            })
        }
    }

    const deleteClient = () => {
        setLoding(true)
        axios.post(`${process.env.REACT_APP_HOST}/fundraiser/delete`, {
            id: id
        }).then(res => {
            console.log(res.data)
            setLoding(false)
            getData();
            setId(null)
            setName("")
            setEmail("")
            setPhone("")
            setContact("")
            setStatus("")
            setProfileSrc(null)
            setProfilePhoto(null)
            setOpenSnack(true);
            setContent('Team deleted');
            setSeverity('success')
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
        <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={4}>
                <TableTemplate title="All Fundraisers" selectedID={selectedID} addNew={addNewClient} tableRowClick={tableRowClick} columns={allColumns} tableData={tableData} />
            </Grid>
            <Grid item xs={12} sm={12} md={8}>
                <Paper className={classes.root}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={6}>
                        <form onSubmit={uploadClient}>
                            <div className={classes.imgCenter}>
                                {
                                    profileSrc === null ? 
                                    <img className={classes.profile} alt="profile" src={window.location.origin +   '/profile.jpg'} />
                                    : <img className={classes.profile} alt="profile" src={profileSrc} />
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
                            <TextField fullWidth margin="dense" label="Name" value={name} onChange={e => {setName(e.target.value)}} required />
                            <TextField fullWidth margin="dense" label="Email" type="email" value={email} onChange={e => {setEmail(e.target.value)}} required />
                            <TextField fullWidth margin="dense" label="Phone" value={phone} onChange={e => {setPhone(e.target.value)}} required />
                            <TextField fullWidth margin="dense" label="Contact" value={contact} onChange={e => {setContact(e.target.value)}} required />
                            <FormControl margin="dense" fullWidth>
                                <InputLabel id="active-inactive">Status</InputLabel>
                                <Select
                                    labelId="active-inactive"
                                    value={status} 
                                    onChange={e => {setStatus(e.target.value)}} required
                                >
                                    <MenuItem value="Active">Active</MenuItem>
                                    <MenuItem value="Inactive">Inactive</MenuItem>
                                </Select>
                            </FormControl>
                            {
                                id ? <div className={classes.buttons}>
                                        <Button type="submit" className={classes.delete} variant="contained" color="primary">
                                            Save Fundraiser
                                            {isLoading && <CircularProgress color="secondary" />}
                                        </Button>
                                        <br />
                                        <Button className={classes.delete} onClick={deleteClient} variant="contained" color="secondary">
                                            Delete Fundraiser
                                            {isLoading && <CircularProgress color="primary" />}
                                        </Button>
                                    </div>
                                : <div className={classes.buttons}><Button type="submit" className={classes.delete} variant="contained" color="primary">
                                    Add Fundraiser
                                    {isLoading && <CircularProgress color="secondary" />}
                                    </Button>
                                </div>
                            }
                        </form>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Paper className={classes.tableRoot} component={Paper}>
                                <Toolbar className={classes.toolBar}>
                                    <Typography className={classes.toolBarTitle} color='inherit'>
                                        Current Team
                                    </Typography>
                                </Toolbar>
                                <MaterialTable
                                    title=""
                                    columns={teamColumns}
                                    data={teamData}
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
                </Paper>
            </Grid>
            <CustomSnackBar open={openSnack} handleClose={closeSnack} severity={severity} content={content} />
        </Grid>
    );
}