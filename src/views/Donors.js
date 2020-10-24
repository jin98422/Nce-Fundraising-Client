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
    Slider
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close'
import MaterialTable from 'material-table';
import CustomSnackBar from '../components/CustomSnackBar';

const useStyles = makeStyles((theme) => ({
    rootContainer: {
        minHeight: "70vh",
    },
    root: {
        border: "2px solid #595959",
        minHeight: "calc( 100% + 116px )",
        position: 'relative',
    },
    close: {
        position: 'absolute',
        right: theme.spacing(2),
        top: theme.spacing(2),
        cursor: 'pointer',
    },
    wrapper: {
        padding: theme.spacing(1)
    },
    tableButtons: {
        margin: theme.spacing(1)
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
        height: "calc( 100% + 116px )",
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
    },
    clearButton: {
        margin: theme.spacing(1),
        float: 'right'
    },
})); 

const columns = [
    { title: 'Date', field: 'createdAt' },
    { title: 'Source', field: 'source' },
    { title: 'First Name', field: 'fname' },
    { title: 'Last Name', field: 'lname' },
    { title: 'Age', field: 'age' },
    { title: 'Campaign', field: 'campaigns' },
    { title: 'Payment Status', field: 'status' },
    { title: 'Amount ($)', field: 'amount' },
    { title: 'Charity', field: 'charity' },
    { title: 'Team', field: 'team' },
    { title: 'Fundraisers', field: 'fundraisers' },
];

  function valuetext(value) {
    return `$${value}`;
  }


export default function Donors() {
    const classes = useStyles();

    const [donorData, setDonorData] = useState([])
    const [filterName, setFilterName] = useState('')
    const [filterAge, setFilterAge] = useState([])
    const [filterDate, setFilterDate] = useState('')
    const [filterCampaign, setFilterCampaign] = useState('')
    const [filterCard, setFilterCard] = useState('')
    const [filterTerritory, setFilterTerritory] = useState('')
    const [filterDonation, setFilterDonation] = useState([])
    const [donorTableData, setDonorTableData] = useState([])
    const [selectedID, setSelectedID] = useState(null)
    const [showTable, setShowTable] = useState(true)
    const [showNew, setShowNew] = useState(false)
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [street1, setStreet1] = useState('');
    const [street2, setStreet2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [country, setCountry] = useState('');
    const [campaign, setCampaign] = useState('');
    const [amount, setAmount] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [campaigns, setCampaigns] = useState([])
    const [id, setId] = useState(null)
    const [isLoading, setLoding] = useState(false);    
    const [content, setContent] = useState('');    
    const [severity, setSeverity] = useState('success');    
    const [openSnack, setOpenSnack] = useState(false);
    const [ageRange, setAgeRange] = useState([])
    const [donationRange, setDonationRange] = useState([])
    const [camps, setCamps] = useState([])
    const [terrs, setTerrs] = useState([])
    const [cards, setCards] = useState([])

    useEffect(() => {
        getCampaignData();
        getDonorData();
    }, [])

    const getCampaignData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/campaign`).then(res => {
            console.log(res.data)
            setCampaigns(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const getDonorData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/donor`).then(res => {
            console.log(res.data)
            let ageArr = []
            let donationArr = []
            let campaignArr = []
            let terArr = [];
            let cardArr = [];
            for(let i in res.data) {
                let camp = res.data[i].campaigns
                res.data[i].createdAt = res.data[i].createdAt.split('T')[0];
                res.data[i].source = camp.source.id;
                res.data[i].campaigns = camp.name;
                res.data[i].charity = camp.client.name;
                res.data[i].team = camp.team.name;
                res.data[i].fundraisers = camp.team.fundraisersIds;
                ageArr.push(parseInt(res.data[i].age))
                donationArr.push(parseInt(res.data[i].amount))
                campaignArr.push(camp.name)
                terArr.push(camp.source.id)
                cardArr.push(res.data[i].status)
            }
            setAgeRange([Math.min(...ageArr), Math.max(...ageArr)])
            setFilterAge([Math.min(...ageArr), Math.max(...ageArr)])
            setDonationRange([Math.min(...donationArr), Math.max(...donationArr)])
            setFilterDonation([Math.min(...donationArr), Math.max(...donationArr)])
            setDonorData(res.data)
            setDonorTableData(res.data)
            campaignArr = campaignArr.filter((elem, index, self) => {
                return index === self.indexOf(elem)
            })
            terArr = terArr.filter((elem, index, self) => {
                return index === self.indexOf(elem)
            })
            cardArr = cardArr.filter((elem, index, self) => {
                return index === self.indexOf(elem)
            })
            setCamps(campaignArr)
            setTerrs(terArr)
            setCards(cardArr)
        }).catch(err => {
            console.log(err)
        })
    }

    const donorTableRowClick = async (e, rowData) => {
        console.log(rowData)
        setSelectedID(rowData.tableData.id)
        setId(rowData._id)
        setFname(rowData.fname)
        setLname(rowData.lname)
        setStreet1(rowData.street1)
        setStreet2(rowData.street2)
        setCity(rowData.city)
        setState(rowData.state)
        setZip(rowData.zip)
        setCountry(rowData.country)
        setCampaign(rowData.campaign)
        setAmount(rowData.amount)
        setAge(rowData.age)
        setGender(rowData.gender)
        setPhone(rowData.phone)
        setEmail(rowData.email)
        setShowTable(false)
        setShowNew(true)
    }
    
    const addNewDonor = () => {
        setId(null);
        setShowTable(false)
        setShowNew(true)
        setFname('')
        setLname('')
        setStreet1('')
        setStreet2('')
        setCity('')
        setState('')
        setZip('')
        setCountry('')
        setCampaign('')
        setAmount('')
        setAge('')
        setGender('')
        setPhone('')
        setEmail('')
    }

    const exportData = () => {
        console.log('export')
    }

    const completeSave = (e) => {
        e.preventDefault();
        setLoding(true)
        if(id) {
            console.log("edit")            
            axios.post(`${process.env.REACT_APP_HOST}/donor/update`, {
                id: id,
                fname: fname,
                lname: lname,
                street1: street1,
                street2: street2,
                city: city,
                state: state,
                zip: zip,
                country: country,
                campaign: campaign,
                amount: amount,
                age: age,
                gender: gender,
                phone: phone,
                email: email,
            }).then(res => {
               if(res.status === 200) {
                    console.log(res.data)
                    setLoding(false)
                    getDonorData()                
                    setOpenSnack(true);
                    setContent('Donor Saved');
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
            axios.post(`${process.env.REACT_APP_HOST}/donor/add`, {
                fname: fname,
                lname: lname,
                street1: street1,
                street2: street2,
                city: city,
                state: state,
                zip: zip,
                country: country,
                campaign: campaign,
                amount: amount,
                age: age,
                gender: gender,
                phone: phone,
                email: email,
            }).then(res => {
               if(res.status === 200) {
                    setLoding(false)
                    setFname('')
                    setLname('')
                    setStreet1('')
                    setStreet2('')
                    setCity('')
                    setState('')
                    setZip('')
                    setCountry('')
                    setCampaign('')
                    setAmount('')
                    setAge('')
                    setGender('')
                    setPhone('')
                    setEmail('')
                    getDonorData()
                    setShowTable(true)
                    setShowNew(false)
                    setOpenSnack(true);
                    setContent('Donor Added');
                    setSeverity('success')
               }
            }).catch(err => {
                setLoding(false)
                setOpenSnack(true);
                setSeverity('error')
                if(err.response.status === 409) {
                    setContent('This email already existing.');
                } else {
                    setContent('Something went wrong, please try again.');
                }
                console.log(err)
            })
        }
    }

    const deleteDonor = () => {
        setLoding(true)
        axios.post(`${process.env.REACT_APP_HOST}/donor/delete`, {
            id: id,
        }).then(res => {
           if(res.status === 200) {
                console.log(res.data)
                setLoding(false)
                setFname('')
                setLname('')
                setStreet1('')
                setStreet2('')
                setCity('')
                setState('')
                setZip('')
                setCountry('')
                setCampaign('')
                setAmount('')
                setAge('')
                setGender('')
                setPhone('')
                setEmail('')
                setShowTable(true)
                setShowNew(false)
                getDonorData()
                setOpenSnack(true);
                setContent('Team Deleted');
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

    const handleDonorClose = () => {
        setShowTable(true)
        setShowNew(false)
        getDonorData()
    }

    const closeSnack = () => {
        setOpenSnack(false)
    }

    const filterDonors = (name, age, date, campaign, card, territory, donation) => {
        console.log(filterDate)
        let draftData = [];
        for(let i in donorData) {
            let item =  donorData[i];
            if (name && !item.fname.toLowerCase().includes(name.toLowerCase()) && !item.lname.toLowerCase().includes(name.toLowerCase())) {
                continue
            } 

            if(item.age < age[0] || item.age > age[1]) {
                continue
            } 

            if( date && item.createdAt !== date) {
                continue
            }

            if(campaign && item.campaigns !== campaign) {
                continue
            }

            if(card && item.status !== card) {
                continue
            }

            if(territory && item.source !== territory) {
                continue
            }

            if(item.amount < donation[0] || item.amount > donation[1]) {
                continue
            } 
            draftData.push(item)
        }
        setDonorTableData(draftData)
    }

    const clearFilter = () => {
        setFilterName('')
        setFilterAge(ageRange)
        setFilterDate('')
        setFilterCampaign('')
        setFilterCard('')
        setFilterTerritory('')
        setFilterDonation(donationRange)
        // filterDonors('', ageRange, '', '', '', '', donationRange)
        setDonorTableData(donorData)
    }

    return (
        <Grid container className={classes.rootContainer} spacing={3}>
            <Grid item xs={12} sm={12} md={3}>
                <Paper className={classes.tableRoot} component={Paper}>
                    <Toolbar className={classes.toolBar}>
                        <Typography className={classes.toolBarTitle} color='inherit'>
                        Filters
                        </Typography>
                    </Toolbar>
                    <Grid container className={classes.wrapper} spacing={2}>
                        <Grid item xs={12}> 
                            <TextField 
                                fullWidth 
                                label="Name"
                                value={filterName}
                                margin="dense"
                                onChange={(e) => {
                                    setFilterName(e.target.value);
                                    filterDonors(e.target.value, filterAge, filterDate, filterCampaign, filterCard, filterTerritory, filterDonation)
                                }}
                            />
                            <FormControl margin="dense" fullWidth>
                                <Typography id="discrete-slider-custom" gutterBottom>
                                    Age Range
                                </Typography>
                                <Slider
                                    value={filterAge}
                                    onChange={(event, newValue) => {
                                        setFilterAge(newValue);
                                        filterDonors(filterName, newValue, filterDate, filterCampaign, filterCard, filterTerritory, filterDonation)
                                    }}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="range-slider"
                                    min={ageRange[0]}
                                    max={ageRange[1]}
                                />
                            </FormControl>
                            <TextField
                                margin="dense"
                                fullWidth
                                label="Date"
                                name="date"
                                type="date"
                                value={filterDate}
                                onChange={(e) => {
                                    setFilterDate(e.target.value)
                                    filterDonors(filterName, filterAge, e.target.value, filterCampaign, filterCard, filterTerritory, filterDonation)
                                }}
                                InputLabelProps={{
                                    shrink: true
                                }}
                            />
                            <FormControl margin="dense" fullWidth>
                                <InputLabel id="active-inactive">Campaign</InputLabel>
                                <Select
                                    labelId="active-inactive"
                                    value={filterCampaign}
                                    onChange={(e) => {
                                        setFilterCampaign(e.target.value)
                                        filterDonors(filterName, filterAge, filterDate, e.target.value, filterCard, filterTerritory, filterDonation)
                                    }}
                                >
                                    {
                                        camps.map((element, key) => {
                                            return <MenuItem value={element} key={key}>{element}</MenuItem>
                                        })
                                    }
                                   
                                </Select>
                            </FormControl>
                            <FormControl margin="dense" fullWidth>
                                <InputLabel id="active-inactive">Card Validation</InputLabel>
                                <Select
                                    labelId="active-inactive"
                                    value={filterCard}
                                    onChange={(e) => {
                                        setFilterCard(e.target.value)
                                        filterDonors(filterName, filterAge, filterDate, filterCampaign, e.target.value, filterTerritory, filterDonation)
                                    }}
                                >
                                    {
                                        cards.map((element, key) => {
                                            return <MenuItem value={element} key={key}>{element}</MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                            <FormControl margin="dense" fullWidth>
                                <InputLabel id="active-inactive">Territory</InputLabel>
                                <Select
                                    labelId="active-inactive"
                                    value={filterTerritory}
                                    onChange={(e) => {
                                        setFilterTerritory(e.target.value)
                                        filterDonors(filterName, filterAge, filterDate, filterCampaign, filterCard, e.target.value, filterDonation)
                                    }}
                                >
                                    {
                                        terrs.map((element, key) => {
                                            return <MenuItem value={element} key={key}>{element}</MenuItem>
                                        })
                                    }
                                   
                                </Select>
                            </FormControl>
                            <FormControl margin="dense" fullWidth>
                                <Typography id="discrete-slider-custom" gutterBottom>
                                    Donation Range
                                </Typography>
                                <Slider
                                    value={filterDonation}
                                    onChange={(event, newValue) => {
                                        setFilterDonation(newValue);
                                        filterDonors(filterName, filterAge, filterDate, filterCampaign, filterCard, filterTerritory, newValue)
                                    }}
                                    valueLabelDisplay="auto"
                                    aria-labelledby="range-slider"
                                    getAriaValueText={valuetext}
                                    min={donationRange[0]}
                                    max={donationRange[1]}
                                />
                            </FormControl>
                            <Button variant="outlined" color="primary" className={classes.clearButton} onClick={clearFilter} >Clear Filter</Button>               
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={9}>
                <Paper className={classes.root}>
                    {showTable && <MaterialTable
                        title={
                            <div>
                                <Button variant="contained" color="primary" className={classes.tableButtons} onClick={addNewDonor} >Add Donor</Button>
                                {/* <Button variant="contained" color="primary" className={classes.tableButtons} onClick={exportData} >Export CSV</Button> */}
                            </div>
                        }
                        columns={columns}
                        data={donorTableData}
                        options={{
                            paging: false,
                            exportButton: true,
                            exportFileName: 'Donor',
                            rowStyle: rowData => {
                                if(rowData.tableData.id === selectedID) {
                                    return {backgroundColor: "#d0cece"}
                                }
                            }
                        }}
                        onRowClick={donorTableRowClick}
                    />}
                    { showNew && <form onSubmit={completeSave} >
                        <CloseIcon onClick={handleDonorClose} className={classes.close} fontSize="large" />
                        <Grid container className={classes.wrapper} spacing={2}>
                            <Grid item xs={12} >
                                { !id && <Typography variant="h4" >ADD NEW DONOR</Typography>}
                                { id && <Typography variant="h4" >Save DONOR</Typography>}
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth
                                            required
                                            label="First Name"
                                            value={fname}
                                            margin="dense"
                                            onChange={(e) => {
                                                setFname(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth
                                            required
                                            label="Last Name"
                                            value={lname}
                                            margin="dense"
                                            onChange={(e) => {
                                                setLname(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth
                                            required
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
                                            required
                                            label="City"
                                            value={city}
                                            margin="dense"
                                            onChange={(e) => {
                                                setCity(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField 
                                            fullWidth
                                            required
                                            label="State"
                                            value={state}
                                            margin="dense"
                                            onChange={(e) => {
                                                setState(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField 
                                            fullWidth
                                            required
                                            label="Zip"
                                            value={zip}
                                            margin="dense"
                                            onChange={(e) => {
                                                setZip(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={12}>
                                        <TextField 
                                            fullWidth
                                            required
                                            label="Country"
                                            value={country}
                                            margin="dense"
                                            onChange={(e) => {
                                                setCountry(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <FormControl margin="dense" required fullWidth>
                                    <InputLabel id="role">Campaign Associated With Collection</InputLabel>
                                    <Select
                                        labelId="role"
                                        value={campaign}
                                        onChange={(e) => {
                                            setCampaign(e.target.value)
                                        }}
                                    >
                                        {
                                            campaigns.map((element, key) => {
                                                return <MenuItem key={key} value={element._id}>{element.name}</MenuItem>
                                            })
                                        }
                                    </Select>
                                </FormControl>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth
                                            required
                                            type='number'
                                            label="Donation Amount ($)"
                                            value={amount}
                                            margin="dense"
                                            onChange={(e) => {
                                                setAmount(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth
                                            required
                                            type="number"
                                            label="Age"
                                            value={age}
                                            margin="dense"
                                            onChange={(e) => {
                                                setAge(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl margin="dense" required fullWidth>
                                            <InputLabel id="active-inactive">Gender</InputLabel>
                                            <Select
                                                labelId="active-inactive"
                                                value={gender}
                                                onChange={(e) => {
                                                    setGender(e.target.value)
                                                }}
                                            >
                                                <MenuItem value="0">Male</MenuItem>
                                                <MenuItem value="1">Female</MenuItem>
                                                <MenuItem value="2">Other</MenuItem>
                                                <MenuItem value="3">Prefer not to Answer</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth 
                                            required
                                            label="Phone"
                                            value={phone}
                                            margin="dense"
                                            onChange={(e) => {
                                                setPhone(e.target.value)
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField 
                                            fullWidth
                                            required
                                            type="email"
                                            label="Email"
                                            value={email}
                                            margin="dense"
                                            onChange={(e) => {
                                                setEmail(e.target.value)
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
                                        Add New Donor
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
                                        Save Donor
                                        {isLoading && <CircularProgress color="secondary" />}
                                    </Button>
                                    <Button 
                                        fullWidth
                                        className={classes.button} 
                                        variant="contained" 
                                        color="secondary"
                                        onClick={deleteDonor}
                                    >
                                        Delete Donor
                                        {isLoading && <CircularProgress color="secondary" />}
                                    </Button>
                                </div>}
                            </Grid>
                        </Grid>
                    </form>}
                    <CustomSnackBar open={openSnack} handleClose={closeSnack} severity={severity} content={content} />
                </Paper>
            </Grid>
        </Grid>
    );
}