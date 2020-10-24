import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
    square: {
      display: 'grid',
      alignItems: 'center',
      margin: theme.spacing(2),
      padding: theme.spacing(2),
      backgroundColor: "#5b9bd5",
      textAlign: "center",
      color: "white",
      borderRadius: "20px"
    },
}));

export default function OutLineGrid() {
    const classes = useStyles();

    const [campaigns, setCampaigns] = useState(0);
    const [fundraisers, setFundraisers] = useState(0);
    const [donors, setDonors] = useState(0);
    const [total, setTotal] = useState('$0');
    const [donationByCamp, setDonationByCamp] = useState('$0.00');
    const [donationByFund, setDonationByFund] = useState('$0.00');
    const [age, setAge] = useState(0.00);

    useEffect(() => {
      getData();
    }, [])

    const getData = async () => {
      let campaignsNum = 0;
      let fundraisersNum = 0;
      let amount = 0;
      let ageNum = 0;
      await axios.get(`${process.env.REACT_APP_HOST}/campaign`).then(res => {
        console.log(res.data)
        campaignsNum = res.data.length
        setCampaigns(res.data.length)
      }).catch(err => {
          console.log(err)
      })
      await axios.get(`${process.env.REACT_APP_HOST}/fundraiser`).then(res => {
        console.log(res.data)
        fundraisersNum = res.data.length;
          setFundraisers(res.data.length)
      }).catch(err => {
          console.log(err)
      })
      axios.get(`${process.env.REACT_APP_HOST}/donor`).then(res => {
          console.log( 'donor' ,res.data)
          amount = res.data.reduce(function(prev, cur) {
            return prev + parseInt(cur.amount);
          }, 0);
          ageNum = res.data.reduce(function(prev, cur) {
            return prev + parseInt(cur.age);
          }, 0);
          setTotal('$' + amount)
          setDonationByCamp('$' + (amount/campaignsNum).toFixed(2));
          setDonationByFund('$' + (amount/fundraisersNum).toFixed(2));
          setDonors(res.data.length)
          if(res.data.length === 0) {
            setAge(0.00)
          } else {
            setAge((ageNum/res.data.length).toFixed(2))
          }
      }).catch(err => {
          console.log(err)
      })
    }

    return (
      <Grid container justify="space-evenly">  
        <Grid className={classes.square} item xs={6} sm={4} md={1}>
            <Typography>
            {campaigns}
            <br />
            CAMPAIGNS
            </Typography> 
        </Grid>
        <Grid className={classes.square} item xs={6} sm={4} md={1}>
            <Typography>
            {fundraisers}
            <br />
            FUNDRAISERS
            </Typography>  
        </Grid>
        <Grid className={classes.square} item xs={6} sm={4} md={1}>
            <Typography>
            {donors}
            <br />
            DONORS
            </Typography> 
        </Grid>
        <Grid className={classes.square} item xs={6} sm={4} md={1}>
            <Typography>
            {total}
            <br />
            TOTAL RAISED
            </Typography> 
        </Grid>
        <Grid className={classes.square} item xs={6} sm={4} md={1}> 
            <Typography>
            {donationByCamp}
            <br />
            AVG. DANATION BY CAMPAIGN
            </Typography>   
        </Grid>
        <Grid className={classes.square} item xs={6} sm={4} md={1}>
            <Typography>
            {age}
            <br />
            AVG. AGE
            </Typography>  
        </Grid>
        <Grid className={classes.square} item xs={6} sm={4} md={1}>
            <Typography>
            {donationByFund}
            <br />
            AVG. DONATION BY FUNDRAISER
            </Typography>  
        </Grid>
    </Grid>
    )
}