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
import MaterialTable from 'material-table';
import TableTemplate from '../components/TableTemplate';
import CustomSnackBar from '../components/CustomSnackBar';

const useStyles = makeStyles((theme) => ({
    rootContainer: {
        minHeight: "80vh",
    },
    root: {
        border: "2px solid #595959",
        minHeight: "100%",
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
        display: "flex",
        justifyContent: "flex-end",
        marginTop: theme.spacing(2)
    },
    button: {
        marginTop: theme.spacing(2),
        marginLeft: theme.spacing(2),
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
    { title: 'Team Name', field: 'name' },
    { title: 'Status', field: 'status' },
    { title: 'Funderaisers', field: 'fundraisers' },
    { title: 'Leader', field: 'leader'}
];



export default function Teams() {
    const classes = useStyles();

    const [leader, setLeader] = useState('');
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [type, setType] = useState('');
    const [status, setStatus] = useState('');
    const [teamsTableData, setTeamsTableData] = useState([])
    const [allFundraisers, setAllFundraisers] = useState([])
    const [teamLeaders, setTeamLeaders] = useState([])
    const [addTableData, setAddTableData] = useState([])
    const [currentTableData, setCurrentTableData] = useState([])
    const [id, setId] = useState(null)
    const [isLoading, setLoding] = useState(false);    
    const [content, setContent] = useState('');    
    const [severity, setSeverity] = useState('success');    
    const [openSnack, setOpenSnack] = useState(false);   
    const [selectedID, setSelectedID] = useState(null) 

    const fundraiserAddColumns = [
        { title: 'Photo', field: 'photo', 
            render: rowData => <img src={rowData.photo} alt="profile" style={{width: 40, borderRadius: '50%'}} />, 
            cellStyle: {
                width: 'calc((100% - 0px) / 10)',
                textAlign: "center"
            } 
        },
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
        { title: 'Photo', field: 'photo', 
            render: rowData => <img src={rowData.photo} alt="profile" style={{width: 40, borderRadius: '50%'}} />, 
            cellStyle: {
                width: 'calc((100% - 0px) / 10)',
                textAlign: "center"
            } 
        },
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
        getFundraisersData();
        getTeamLeaders()
    }, [])

    const getTeamLeaders = () => {
        axios.get(`${process.env.REACT_APP_HOST}/user`, {
            params: {
              role: "4"
            }
          }).then(res => {
            console.log(res.data)
            setTeamLeaders(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const getTeamsData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/team`).then(res => {
            console.log(res.data)
            setTeamsTableData(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const getFundraisersData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/fundraiser`).then(res => {
            setAddTableData(res.data);
            setAllFundraisers(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const addNewTeam = () => {
        setId(null);
        setSelectedID(null)
        setLeader('')
        setName('')
        setCity('')
        setState('')
        setType('')
        setStatus('')
        setAddTableData(allFundraisers)
        setCurrentTableData([])
    }

    const handleAddFundraiser = (id) => () => {
        console.log("id", id)
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
        let addResult = currentTableData.find((fundraiser) => {
            return fundraiser._id === id
        })
        let currentResult = currentTableData.filter(fundraiser => {
            return fundraiser._id !== id
        })
        setAddTableData([...addTableData, addResult])
        setCurrentTableData(currentResult)
    }

    const teamsTableRowClick = async (e, rowData) => {
        console.log(rowData)
        setSelectedID(rowData.tableData.id)
        setId(rowData._id)
        setLeader(rowData.leader)
        setName(rowData.name)
        setCity(rowData.city)
        setState(rowData.state)
        setType(rowData.type)
        setStatus(rowData.status)
        setAddTableData([])
        setCurrentTableData([])
        let addData = [];
        let currentData = [];
        allFundraisers.forEach(element => {
           if(rowData.fundraisersIds.some(fundId => fundId === element._id)) {
               currentData.push(element)
           } else {
               addData.push(element)
           }
        })
        setAddTableData(addData)
        setCurrentTableData(currentData)
    }

    const completeSave = (e) => {
        e.preventDefault();
        setLoding(true)
        let fundIds = [];
        fundIds = currentTableData.map(data => {
            return data._id
        })
        if(fundIds.length === 0) {
            setLoding(false);
            setOpenSnack(true);
            setContent('You must be added a Fundraiser at the least.');
            setSeverity('error')
            return;
        }
        if(id) {
            console.log("edit")            
            axios.post(`${process.env.REACT_APP_HOST}/team/update`, {
                id: id,
                leader: leader,
                name: name,
                city: city,
                state: state,
                type: type,
                status: status,
                fundraisersIds: fundIds
            }).then(res => {
               if(res.status === 200) {
                    console.log(res.data)
                    setLoding(false)                   
                    getTeamsData()
                    setOpenSnack(true);
                    setContent('Team Saved');
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
            axios.post(`${process.env.REACT_APP_HOST}/team/add`, {
                leader: leader,
                name: name,
                city: city,
                state: state,
                type: type,
                status: status,
                fundraisersIds: fundIds
            }).then(res => {
               if(res.status === 200) {
                    console.log(res.data)
                    setLoding(false)
                    setLeader('')
                    setName('')
                    setCity('')
                    setState('')
                    setType('')
                    setStatus('')
                    setAddTableData(allFundraisers)
                    setCurrentTableData([])
                    getTeamsData()
                    setOpenSnack(true);
                    setContent('Team Added');
                    setSeverity('success')
               }
            }).catch(err => {
                setLoding(false)
                setOpenSnack(true);
                setSeverity('error')
                if(err.response.status === 409) {
                    setContent('This team name already existing.');
                } else {
                    setContent('Something went wrong, please try again.');
                }
                console.log(err)
            })
        }
    }

    const deleteTeam = () => {
        setLoding(true)
        axios.post(`${process.env.REACT_APP_HOST}/team/delete`, {
            id: id
        }).then(res => {
            console.log(res.data)
            setLoding(false)
            setId(null)
            setSelectedID(null)
            setLeader('')
            setName('')
            setCity('')
            setState('')
            setType('')
            setStatus('')
            setAddTableData(allFundraisers)
            setCurrentTableData([])
            getTeamsData()
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
        <Grid container className={classes.rootContainer} spacing={3}>
          <Grid item xs={12} sm={12} md={4}>
            <TableTemplate title="Teams" selectedID={selectedID} addNew={addNewTeam} tableRowClick={teamsTableRowClick} columns={columns} tableData={teamsTableData} />
          </Grid>
          <Grid item xs={12} sm={12} md={8}>
            <Paper className={classes.root}>
                <form onSubmit={completeSave} >
                    <Grid container className={classes.wrapper} spacing={2}>
                        <Grid item xs={12} >
                            <Typography variant="h4" >CREATE TEAM</Typography>
                        </Grid>
                    
                            <Grid item xs={12}>
                                <FormControl margin="dense" required fullWidth>
                                    <InputLabel id="role">Team Leader</InputLabel>
                                    <Select
                                        labelId="role"
                                        value={leader}
                                        onChange={(e) => {
                                            setLeader(e.target.value)
                                        }}
                                    >
                                        {
                                            teamLeaders.map((teamLeader, key) => {
                                                return <MenuItem key={key} value={teamLeader.username}>{teamLeader.username}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <TextField 
                                    fullWidth 
                                    label="Team Name" 
                                    name="name"
                                    value={name}
                                    margin="dense"
                                    required
                                    onChange={(e) => {
                                        setName(e.target.value)
                                    }}
                                />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
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
                                    <Grid item xs={12} sm={6}>
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
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl margin="dense" required fullWidth>
                                            <InputLabel id="active-inactive">Team Type</InputLabel>
                                            <Select
                                                labelId="active-inactive"
                                                value={type}
                                                onChange={(e) => {
                                                    setType(e.target.value)
                                                }}
                                            >
                                                <MenuItem value="steet">Street</MenuItem>
                                                <MenuItem value="table">Table</MenuItem>
                                                <MenuItem value="private">Private Site</MenuItem>
                                                <MenuItem value="door">Door-to-Door</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
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
                                    </Grid>
                                </Grid>
                                <Grid container className={classes.tablewrapper} spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Paper className={classes.tableRoot} component={Paper}>
                                            <Toolbar className={classes.toolBar}>
                                                <Typography className={classes.toolBarTitle} color='inherit'>
                                                Add Fundraisers
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
                                                Current Fundraisers
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
                                {
                                    id ? <div className={classes.buttonContainer}>
                                            <Button type="submit" className={classes.button} variant="contained" color="primary">
                                                Save Team
                                                {isLoading && <CircularProgress color="secondary" />}
                                            </Button>
                                            <br />
                                            <Button className={classes.button} onClick={deleteTeam} variant="contained" color="secondary">
                                                Delete Team
                                                {isLoading && <CircularProgress color="primary" />}
                                            </Button>
                                        </div>
                                    : <div className={classes.buttonContainer}><Button type="submit" className={classes.button} variant="contained" color="primary">
                                        Add Team
                                        {isLoading && <CircularProgress color="secondary" />}
                                        </Button>
                                    </div>
                                }
                            </Grid>
                    </Grid>
                </form>
                <CustomSnackBar open={openSnack} handleClose={closeSnack} severity={severity} content={content} />
            </Paper>
          </Grid>
        </Grid>
    );
}