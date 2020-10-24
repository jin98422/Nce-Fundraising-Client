import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    Container, 
    TextField, 
    Typography, 
    Grid,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    Button,
    CircularProgress,
    Switch,
    FormLabel
} from '@material-ui/core';
import { makeStyles,} from '@material-ui/core/styles';
import HeaderPhoto from '../static/form_header.jpg'
import ProfilePhoto from '../static/form_profile.jpg'
import Copyright from "../components/Copyright";
import CustomSnackBar from '../components/CustomSnackBar';

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    header: {
        backgroundImage: `url(${HeaderPhoto})`,
        width: '100%',
        height: '10rem',
        backgroundPosition: "center",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        [theme.breakpoints.down('sm')] : {
            marginBottom: '2rem',
        },
        [theme.breakpoints.up('md')] : {
            marginBottom: '4rem',
        },
        [theme.breakpoints.up('lg')] : {
            marginBottom: '7rem',
        },
    },
    pos: {
        position: 'relative'
    },
    profile: {
        borderRadius: '50%',
        position: 'absolute',
        margin: 'auto',
        right: 0,
        left: 0,
        bottom: 0,
        transform: 'translate(0, 40%)',
        maxWidth: '15rem',
        [theme.breakpoints.down('sm')] : {
            width: '100%',
        },
        [theme.breakpoints.up('md')] : {
            width: '80%',
        },
        [theme.breakpoints.up('lg')] : {
            width: '50%',
        },
    },
    title: {
        textAlign: 'center',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    background: {
        backgroundColor: '#70ad47',
        height: '3rem',
    },
    nameSet: {
        fontStyle: 'italic'
    },
    date: {
        marginTop: "8px",
        width: "100%"
    },
    copyright: {
        marginBottom: theme.spacing(8),
        marginTop: theme.spacing(3)
    }
})); 

export default function HomeChart() { 
    const classes = useStyles();

    const { id } = useParams();

    const [campName, setCampName] = useState('');
    const [client, setClient] = useState('');
    const [funds, setFunds] = useState([])
    const [profile, setProfile] = useState(null)
    const [header, setHeader] = useState(null)
    const [color, setColor] = useState(null)
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [street1, setStreet1] = useState("");
    const [street2, setStreet2] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [country, setCountry] = useState("");
    const [birthday, setBirthday] = useState("");
    const [gender, setGender] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [recurring, setRecurring] = useState(true);
    const [frequency, setFrequency] = useState("");
    const [amount, setAmount] = useState("");
    const [amountSelect, setAmountSelect] = useState("");
    const [amountWidth, setAmountWidth] = useState(4);
    const [recurringWidth, setRecurringWidth] = useState(4);
    const [cardNum, setCardNum] = useState("");
    const [expMon, setExpMon] = useState("");
    const [expYear, setExpYear] = useState("");
    const [cvv, setCvv] = useState("");
    const [enableAmount, setEnableAmount] = useState(false)
    const [enableRecurring, setEnableRecurring] = useState(true)
    const [enableDonate, setEnableDonate] = useState(false)
    const [isLoading, setLoding] = useState(false);    
    const [content, setContent] = useState('');    
    const [severity, setSeverity] = useState('success');    
    const [openSnack, setOpenSnack] = useState(false);  

    useEffect(() => {
        getCampData();
    }, [])

    const getCampData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/campaign/getformdata`, {
            params: {
                id: id,
            }
        }).then(res => {
            console.log(res.data)
            let item = res.data;
        setClient(item.client.name);
        setCampName(item.name);
        setFunds(item.fundraisers);
        setProfile(process.env.REACT_APP_HOST + item.client.profile)
        setHeader(process.env.REACT_APP_HOST + item.client.header);
        setColor(item.client.color)
        }).catch(err => {
            console.log(err)
        })
    }

    const saveFormData = (e) => {
        e.preventDefault();
        setEnableDonate(true)
    }

    const submitFormData = (e) => {
        e.preventDefault();
        let nowDate = new Date();
        let ageDate = new Date(birthday);
        let age = nowDate.getFullYear() - ageDate.getFullYear();
        axios.post(`${process.env.REACT_APP_HOST}/donor/form`, {
            fname: fname,
            lname: lname,
            street1: street1,
            street2: street2,
            city: city,
            state: state,
            zip: zip,
            country: country,
            campaign: id,
            age: age,
            gender: gender,
            phone: phone,
            email: email,
            recurring: recurring,
            frequency: frequency,
            amount: amount,
            cardNum: cardNum,
            expMon: expMon,
            expYear: expYear,
            cvv: cvv,
            id: id
        }).then(res => {
            if(res.status === 200) {
                setOpenSnack(true);
                setContent('Your information submitted!');
                setSeverity('success')
                // window.location.href = `${process.env.REACT_APP_DOMAIN}/share/${id}`;
            } else {
                setOpenSnack(true);
                setContent(res.data.message);
                setSeverity('error')
            }            
        }).catch(err => {            
            setLoding(false)
            setOpenSnack(true);
            setSeverity('error')
            let resString = JSON.parse(err.response.data)
            setContent(resString.response.rmsg);
            console.log(err.response.data)
        })
    }

    const closeSnack = () => {
        setOpenSnack(false)
    }

    return (
        <div>
            <Grid container className={classes.header} style={header? {backgroundImage: `url(${header})`} : null}>
                <Grid item xs={4} ></Grid>
                <Grid item xs={4} className={classes.pos} >
                    <img src={ profile? profile:ProfilePhoto} className={classes.profile} />
                </Grid>
                <Grid item xs={4} ></Grid>
            </Grid>            
            <Container maxWidth="md">
                <Grid container className={classes.root}>            
                    <Grid container>
                        <Grid item xs={6} >
                            <Typography className={classes.nameSet}>Charity</Typography>
                            <Typography>{client}</Typography>
                        </Grid>
                        <Grid item xs={6} style={{textAlign: 'right'}} >
                            <Typography className={classes.nameSet}>Fundraiser</Typography>
                            {
                                funds.map((fund, key) => {
                                return <Typography key={key} >{fund.name}</Typography>
                                })
                            }
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className={classes.title}>
                        <Typography variant="h4">
                            {campName}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.background} style={color? {backgroundColor: color} : null}>
                    </Grid>
                    { !enableDonate && <form onSubmit={saveFormData}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="first-name"
                                    label="First Name"
                                    name="fname"
                                    autoComplete="fname"
                                    value={fname}
                                    onChange={(e) => {
                                        setFname(e.target.value)
                                    }}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="last-name"
                                    label="Last Name"
                                    name="lname"
                                    autoComplete="lname"
                                    value={lname}
                                    onChange={(e) => {
                                        setLname(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="birthday"
                                    label="Date of Birth"
                                    name="birthday"
                                    type="date"
                                    value={birthday}
                                    onChange={(e) => {
                                        setBirthday(e.target.value)
                                    }}
                                    InputLabelProps={{
                                        shrink: true
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl margin="normal" variant='outlined' required fullWidth>
                                    <InputLabel id="active-inactive">Gender</InputLabel>
                                    <Select
                                        labelId="active-inactive"
                                        value={gender}
                                        onChange={(e) => {
                                            setGender(e.target.value)
                                        }}
                                        label="Gender"
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
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    type="email"
                                    label="Email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="phone"
                                    label="Phone"
                                    name="phone"
                                    autoComplete="phone"
                                    value={phone}
                                    onChange={(e) => {
                                        setPhone(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="street1"
                                    label="Street Address 1"
                                    name="street1"
                                    autoComplete="street1"
                                    value={street1}
                                    onChange={(e) => {
                                        setStreet1(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    id="street2"
                                    label="Street Address 2"
                                    name="street2"
                                    autoComplete="street2"
                                    value={street2}
                                    onChange={(e) => {
                                        setStreet2(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="city"
                                    label="City"
                                    name="city"
                                    autoComplete="city"
                                    value={city}
                                    onChange={(e) => {
                                        setCity(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="state"
                                    label="State"
                                    name="state"
                                    autoComplete="state"
                                    value={state}
                                    onChange={(e) => {
                                        setState(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>                   
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    type="number"
                                    id="zip"
                                    label="Zip"
                                    name="zip"
                                    autoComplete="zip"
                                    value={zip}
                                    onChange={(e) => {
                                        setZip(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="country"
                                    label="Country"
                                    name="country"
                                    autoComplete="country"
                                    value={country}
                                    onChange={(e) => {
                                        setCountry(e.target.value)
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}></Grid>                            
                            <Grid item xs={12} sm={4}></Grid>
                            <Grid item xs={12} sm={4}>
                                <Button 
                                    type="submit"
                                    fullWidth
                                    variant="contained" 
                                    color="primary"
                                >
                                    Next
                                </Button>
                            </Grid>                            
                        </Grid> 
                    </form>}
                    { enableDonate && <Grid item xs={12} sm={12}>
                        <form onSubmit={submitFormData}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={recurringWidth}>
                                    <FormControl component="fieldset" margin="normal" variant='outlined' fullWidth>
                                        <FormLabel component="legend">Payment</FormLabel>      
                                        <Grid component="label" container alignItems="center" spacing={1}>
                                            <Grid item>One-Time</Grid>
                                            <Grid item>
                                                <Switch
                                                    checked={recurring}
                                                    onChange={(e) => {
                                                        setRecurring(e.target.checked)
                                                        if(e.target.checked) {
                                                            setEnableRecurring(true)
                                                            setRecurringWidth(4)
                                                        } else {
                                                            setRecurringWidth(8)
                                                            setEnableRecurring(false)
                                                        }
                                                    }}
                                                    name="payment"
                                                    inputProps={{ 'aria-label': 'payment' }}
                                                />
                                            </Grid>
                                            <Grid item>Recurring</Grid>
                                        </Grid>
                                    </FormControl>
                                </Grid>
                                { enableRecurring && <Grid item xs={12} sm={recurringWidth}>
                                    <FormControl margin="normal" variant='outlined' required fullWidth>
                                        <InputLabel id="active-inactive">Frequency</InputLabel>
                                        <Select
                                            labelId="active-inactive"
                                            value={frequency}
                                            onChange={(e) => {
                                                setFrequency(e.target.value)
                                            }}
                                            label="Recurring"
                                        >
                                            <MenuItem value="Monthly">Monthly</MenuItem>
                                            <MenuItem value="Quarterly">Quarterly</MenuItem>
                                            <MenuItem value="Yearly">Yearly</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>}
                                <Grid item xs={12} sm={amountWidth}>
                                    <FormControl margin="normal" variant='outlined' required fullWidth>
                                        <InputLabel id="active-inactive">Amount ($)</InputLabel>
                                        <Select
                                            labelId="active-inactive"
                                            value={amountSelect}
                                            onChange={(e) => {
                                                setAmountSelect(e.target.value)
                                                if(e.target.value === 'custom') {
                                                    setEnableAmount(true)
                                                    setAmount('')
                                                    setAmountWidth(2)
                                                } else {
                                                    setAmountWidth(4)
                                                    setEnableAmount(false)
                                                    setAmount(e.target.value)
                                                }
                                            }}
                                            label="Amount ($)"
                                        >
                                            <MenuItem value="20">25</MenuItem>
                                            <MenuItem value="50">50</MenuItem>
                                            <MenuItem value="100">100</MenuItem>
                                            <MenuItem value="custom">custom</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                               { enableAmount && <Grid item xs={12} sm={amountWidth}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        type="number"
                                        id="amount"
                                        label="Amount ($)"
                                        name="amount"
                                        autoComplete="amount"
                                        value={amount}
                                        onChange={(e) => {
                                            setAmount(e.target.value)
                                        }}
                                    />
                                </Grid>}
                                <Grid item xs={12} sm={12}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        type="number"
                                        id="cardNum"
                                        label="Card Number"
                                        name="cardNum"
                                        autoComplete="cardNum"
                                        value={cardNum}
                                        onChange={(e) => {
                                            setCardNum(e.target.value)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        type="number"
                                        id="expMon"
                                        label="Expiration Month"
                                        name="expMon"
                                        autoComplete="expMon"
                                        value={expMon}
                                        onChange={(e) => {
                                            setExpMon(e.target.value)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        type="number"
                                        id="expYear"
                                        label="Expiration Year"
                                        name="expYear"
                                        autoComplete="expYear"
                                        value={expYear}
                                        onChange={(e) => {
                                            setExpYear(e.target.value)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        type="number"
                                        id="cvv"
                                        label="Security Code"
                                        name="cvv"
                                        autoComplete="cvv"
                                        value={cvv}
                                        onChange={(e) => {
                                            setCvv(e.target.value)
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={4}></Grid>                            
                                <Grid item xs={12} sm={4}>
                                    <Button 
                                        fullWidth
                                        variant="contained" 
                                        color="secondary"
                                        onClick={() => {
                                            setEnableDonate(false)
                                        }}
                                    >
                                        Back
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Button 
                                        type="submit"
                                        fullWidth
                                        variant="contained" 
                                        color="primary"
                                    >
                                        Submit
                                        {isLoading && <CircularProgress color="secondary" />}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Grid>}
                    <Grid item xs={12} sm={12} className={classes.copyright}>
                        <Copyright />
                    </Grid>
                </Grid>
                <CustomSnackBar open={openSnack} handleClose={closeSnack} severity={severity} content={content} />
            </Container>
        </div>
    );  
}
