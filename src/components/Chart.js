import React, { useState, useEffect } from 'react';
import { Paper, TextField, Typography, Grid, Card } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {
  ArgumentAxis,
  ValueAxis,
  Chart,
  SplineSeries,
  Legend
} from '@devexpress/dx-react-chart-material-ui';
import StopIcon from '@material-ui/icons/Stop'
import {scalePoint} from 'd3-scale'
import { ArgumentScale, Animation } from '@devexpress/dx-react-chart';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
  chartHeader: {
    display: 'inline-flex',
  },
  chartInput: {
    margin: theme.spacing(2)
  },
  chartTitle: {
    margin: 'auto'
  },
  saveColor: {
    color: "#1e4e79"
  },
  ronaldColor: {
    color: "#548135"
  },
  feedColor: {
    color: "#00b050"
  },
  lineStyle: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      textAlign: "center",
      color: "white",
      margin: 0,
  },
  jimmy: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    textAlign: "center",
    color: "white",
    backgroundColor: "#1e4e79",
    margin: 0,
},
  rollo: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      textAlign: "center",
      color: "white",
      backgroundColor: "#548135",
      margin: 0,
  },
  fred: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      textAlign: "center",
      color: "white",
      backgroundColor: "#00b050",
      margin: 0,
  },
  empty: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '10rem'
  }
})); 

const Lable = symbol => (props) => {
  const { text } = props;
  return (
    <ValueAxis.Label
      {...props}
      text={symbol + text}
    />
  )
}

const PriceLable = Lable("$");

export default function HomeChart() { 
  const classes = useStyles();

  const [chatShow, setChatShow] = useState(false)
  const [initData,setInitData] = useState([]);
  const [chartData,setChartData] = useState([]);
  const [emptyCamp, setEmptyCamp] = useState(true);
  const [lineChart, setLineChart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    getCampData();
  }, [])

  const getCampData = () => {
    axios.get(`${process.env.REACT_APP_HOST}/campaign`).then(res => {
        console.log('res--data', res.data)
        let fields = [];
        let values = [];
        let lines = [];
        let total = 0;
        for( let k = 0; k<res.data.length; k++) {
          let element = res.data[k];
          let valueName = element.name.replaceAll(' ', '_');
          let totalItemAmount = 0;
          fields.push({
            name: element.name,
            valueField: valueName,
            argumentField: 'argument'
          })
          for (let i=0; i < element.donor.length; i++) {
            let flag = false;
            totalItemAmount += element.donor[i].amount;
            for(let j=0; j<values.length; j++) {
              if(element.donor[i].year === values[j].year && element.donor[i].month === values[j].argument) {
                values[j][valueName] = element.donor[i].amount;
                flag = true;
              }
            }
            if(!flag) {
              values.push({
                year: element.donor[i].year,
                argument: element.donor[i].month,
                [valueName] : element.donor[i].amount
              })
            }
          }
          lines.push({
            name: element.name,
            amount: totalItemAmount,
            color: '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0')
          })
          total += totalItemAmount;
        };

        if(values.length === 0) {
          setEmptyCamp(true)
        } else {
          setEmptyCamp(false)
        }
        setInitData(fields)
        setChartData(values)
        setChatShow(true)
        setLineChart(lines)
        setTotalAmount(total);
    }).catch(err => {
        console.log(err)
    })
  }

    return (
      chatShow && <Paper className={classes.root}>
        <div>
          <Grid container>
            <Grid item xs={12} className={classes.chartHeader} sm={12}>
              <Typography className={classes.chartTitle} component="h6" variant="h6">
                    Funds Raised by Campaign
                </Typography>          
                <TextField className={classes.chartInput} variant="outlined" />
                <Typography className={classes.chartTitle} component="h6" variant="h6">
                    To
                </Typography> 
                <TextField className={classes.chartInput} variant="outlined" />
            </Grid>
          </Grid>
        </div>
        { emptyCamp ? <Card className={classes.empty} variant="outlined"><p>No data to display</p></Card> : <Chart
          data={chartData}
        >
          <ArgumentScale factory={scalePoint} />
          <ArgumentAxis />
          <ValueAxis labelComponent={PriceLable} />
          {
            initData.map((data, key) => {
              return <SplineSeries
                key={key}
                name={data.name}
                valueField={data.valueField}
                argumentField={data.argumentField}
                color={data.color}
              />
            })
          }
          <Animation />
          <Legend />
        </Chart>}
        <div >
          <Grid container>
            <Grid item xs={12} className={classes.chartHeader} sm={12}>
              <Typography className={classes.chartTitle} component="h6" variant="h6">
                    Funds Raised by Canvasser
                </Typography>          
                <TextField className={classes.chartInput} variant="outlined" />
                <Typography className={classes.chartTitle} component="h6" variant="h6">
                    To
                </Typography> 
                <TextField className={classes.chartInput} variant="outlined" />
            </Grid>
            
          </Grid>
        </div>
        <div>
          { emptyCamp ? <Card className={classes.empty} variant="outlined"><p>No data to display</p></Card> : 
            <Grid container>
              {
                lineChart.map((element, key) => {
                  return <div style={{width: (element.amount*100/totalAmount) + "%"}}>
                    <StopIcon className={classes.saveColor} /> {element.name}
                    <div className={classes.lineStyle} style={{backgroundColor: element.color}}>
                      ${element.amount}
                    </div>
                  </div>
                })
              }
              {/* <div style={{width: '33%'}}>
                <StopIcon className={classes.saveColor} /> Jimmy Choo
                <div className={classes.jimmy}>
                  $1540
                </div>
              </div>
              <div style={{width: '33%'}}>
                <StopIcon className={classes.ronaldColor} /> Rollo Tomassi
                <div className={classes.rollo}>
                  $3598
                </div>
              </div>
              <div style={{width: '33%'}}>
                <StopIcon className={classes.feedColor} /> Fred Smith
                <div className={classes.fred}>
                 $8456
                </div>
              </div> */}
          </Grid>}
        </div>
      </Paper>
    );  
}
