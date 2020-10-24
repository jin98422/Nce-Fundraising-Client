import React, {useState, useEffect} from 'react';
import QRCode from 'qrcode.react';
import axios from 'axios'
;import { useParams } from "react-router-dom";
import { 
    makeStyles, 
    Typography, 
    Grid,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    CircularProgress
} from '@material-ui/core';
 import MuiPhoneNumber from 'material-ui-phone-number'
import sms from '../static/sms.png';
import facebook from '../static/facebook.png';
import instagram from '../static/instagram.png';
import twitter from '../static/twitter.png';
import Copyright from "../components/Copyright";
import CustomSnackBar from '../components/CustomSnackBar';
import {
    FacebookShareButton,
    PinterestShareButton,
    TwitterShareButton,
  } from "react-share";


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    container: {
        backgroundColor: '#5b9bd5',
        color: 'white',
        textAlign: 'center',
        padding: '1rem',
    },
    social: {
        alignItems: 'center',
        display: 'flex',
    },
    share: {
        textAlign: 'center',
        marginTop: theme.spacing(8)
    },
    socialIcon: {
        width: '50%',
        cursor: 'pointer'
    },
    copyright: {
        marginBottom: theme.spacing(8),
        marginTop: theme.spacing(3)
    }
}));

export default function Home() {
    const classes = useStyles();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('')
    const [openSMS, setOpenSMS] = useState(false)
    const [number, setNumber] =  useState('')
    const [isLoading, setLoding] = useState(false);
    const [content, setContent] = useState('');    
    const [severity, setSeverity] = useState('success');    
    const [openSnack, setOpenSnack] = useState(false);   

    useEffect(() => {
        getCampaingsData()
        // var link = document.createElement('meta');
        // link.setAttribute('property', 'og:title');
        // link.content = "NCE Share on Twitter";
        // document.getElementsByTagName('head')[0].appendChild(link);
        // let number = '+8613236937200';
        // let message = "http://localhost:3000/form/5f328586ffda82524810fc33";
        // let image = "https://cdn.shopify.com/s/files/1/0152/4003/6406/products/Pet-product1.jpg"
        // console.log('https://api.whatsapp.com/send?phone=' + number + '&text=%20' + encodeURIComponent(message) + '$image=' + encodeURIComponent(image))
    }, [])

    const getCampaingsData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/campaign`, {
            params: {
                id: id
            }
        }).then(res => {
            console.log(res)
            setTitle(res.data[0].name)
            setDescription(res.data[0].description)
        }).catch(err => {
            console.log(err)
        })
    }

    const twitterShare = () => {
        alert('twitter');
        var link = document.createElement('meta');
        link.setAttribute('property', 'og:title');
        link.content = "NCE Share on Twitter";
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    const sendSMS = () => {
        setOpenSMS(true)
    }

    const shareFacebook = () => {
        window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(`${process.env.REACT_APP_DOMAIN}/form/${id}`) + '&display=popup&ref=plugin&src=like&kid_directed_site=0&app_id=1380330618851629','facebook-share-dialog','width=626,height=436');        
    }

    const shareInstagram = () => {
        
    }

    const shareTwitter = () => {
        var url = `${process.env.REACT_APP_DOMAIN}/form/${id}`;
        window.open('http://twitter.com/share?url='+encodeURIComponent(url)+'&text='+encodeURIComponent(description), '', 'left=0,top=0,width=550,height=450,personalbar=0,toolbar=0,scrollbars=0,resizable=0');
    }

    const handleOnChange = (value) => {
        setNumber(value)
    }

    const handleCloseSMS = () => {
        setOpenSMS(false)
    }

    const handleSendSMS = () => {
        setLoding(true)
        let filterNum = number.replace(/[{()}]/gi, "").replace(/-/gi, '').replace(/ /gi, '');
        console.log(filterNum)
        axios.post(`${process.env.REACT_APP_HOST}/share/sms`, {
            number: filterNum,
            id: id
        }).then(res => {
            if(res.status === 200) {
                console.log(res.data)
                setLoding(false)   
                setOpenSMS(false)                
                setOpenSnack(true);
                setContent('Message Sent to your number');
                setSeverity('success')
           }
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
        <div className={classes.root}>
            <Grid container className={classes.container}>
                <Grid item xs={12}>
                    <Typography variant="h4" className={classes.center}>
                        Share `{title}`
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" className={classes.center}>
                        {description}
                    </Typography>
                </Grid>      
            </Grid>        
            <Container className={classes.share} maxWidth="md">
                <Grid container spacing={3}>
                    <Grid item xs={12} className={classes.social} md={6}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <img className={classes.socialIcon} alt='social icons' src={sms} onClick={sendSMS} />
                                <Typography variant="h6" className={classes.center}>
                                    SMS
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <img className={classes.socialIcon} alt='social icons' src={facebook} onClick={shareFacebook} />
                                <Typography variant="h6" className={classes.center}>
                                    Facebook
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <img className={classes.socialIcon} alt='social icons' src={instagram} onClick={shareInstagram} />
                                <Typography variant="h6" className={classes.center}>
                                    Instagram
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <img className={classes.socialIcon} alt='social icons' src={twitter} onClick={shareTwitter} />
                                <Typography variant="h6" className={classes.center}>
                                    Twitter
                                </Typography>
                            </Grid>                
                        </Grid> 
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <QRCode 
                            value={`${process.env.REACT_APP_DOMAIN}/form/${id}`}
                            size={300}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.copyright}>
                        <Copyright />
                    </Grid>               
                </Grid> 
            </Container>
            <Dialog open={openSMS} onClose={handleCloseSMS} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">SMS</DialogTitle>
                <DialogContent>
                <DialogContentText>
                    To send message on your phone, please enter your phone number here.
                </DialogContentText>
                    <MuiPhoneNumber defaultCountry={'us'} onChange={handleOnChange}/>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleCloseSMS} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSendSMS} color="primary">
                    Send {isLoading && <CircularProgress color="secondary" />}
                </Button>
                </DialogActions>
            </Dialog>
            <CustomSnackBar open={openSnack} handleClose={closeSnack} severity={severity} content={content} />
        </div>
    );
}