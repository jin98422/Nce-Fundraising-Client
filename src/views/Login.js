import React, { useState, useEffect } from "react";
import decode from 'jwt-decode';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import {
  Box,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Typography,
  Container,
  CircularProgress,
  AppBar,
  Toolbar,
  FormHelperText,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert'
import Copyright from "../components/Copyright";
import Logo from '../static/logo.png'

const useStyles = makeStyles((theme) => ({
  logo: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  title: {
    flexGrow: 1,
    color: "#ffc000"
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const history = useHistory();

  const [login, setLogin] = useState(false);
  const [enableEmail, setEnableEmail] = useState(true);
  const [enablePassword, setEnablePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginFail, setIsLoginFail] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [email, setEmail] = useState(null)
  const [password, setPassword] = useState(null)
  const [errorInfo, setErrorInfo] = useState("");

  useEffect(() => {    
    const token = localStorage.getItem("token");
    if (token === null || token === "") {
      setLogin(true)
    } else {
      const decodedToken = decode(token);
      if (decodedToken.exp < Date.now() / 1000) {
        setLogin(true)
      } else {
        history.push("/")
      }
    }
  }, [history])

  const loginContinue = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios.post(`${process.env.REACT_APP_HOST}/user/checkEmail`, {
      email: email,
    }).then(res => {
        setEnableEmail(false)
        setEnablePassword(true)
        setIsLoginFail(false)
        setIsLoading(false);
    }).catch(err => {
      if(err.response.status === 401) {
        setIsLoading(false);
        setErrorInfo("This account not activated. Please check your email and activate your account.")
        setIsLoginFail(true)
      } else {
        setIsLoading(false);
        setErrorInfo("Oops! your email is incorrect")
        setIsLoginFail(true)
      }
    })
  }

  const loginFormSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true);
    axios.post(`${process.env.REACT_APP_HOST}/user/login`, {
      email: email,
      password: password
    }).then(res => {
        setIsLoading(false);
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common['Authorization'] = res.data.token;
        history.push("/")
    }).catch(err => {
      setIsLoading(false);
      setErrorInfo("Something went wrong. try again!")
      setIsLoginFail(true)
    })
  }

  const handleChecked = () => {
    setChecked(!isChecked);
  }

  const handleNotYou = (e) => {
    e.preventDefault()
    setEnableEmail(true);
    setEnablePassword(false);
    setEmail(null)
    setPassword(null)
    setChecked(false)
  }

  const forgotPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios.post(`${process.env.REACT_APP_HOST}/user/forgot`, {
      email: email,
    }).then(res => {
      console.log(res)
        setIsLoading(false);
        history.push(`/forgot/${email}`)
    }).catch(err => {
        setIsLoading(false);
        setErrorInfo("Something went wrong. try again!")
        setIsLoginFail(true)
    })
  }

  return (
    login && (
      <div>
        <AppBar position="static">
          <Toolbar className={classes.logo}>
            <img alt='logo' src={Logo} />
          </Toolbar>
        </AppBar>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login to Get Started
            </Typography>
            { enableEmail && <form className={classes.form} onSubmit={loginContinue}>
              {isLoginFail && <Alert severity="error">{errorInfo}</Alert>}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                autoFocus
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                type="submit"
              >
                Continue
                  {isLoading && <CircularProgress />}
              </Button>
            </form>}
            { enablePassword && <form className={classes.form} onSubmit={loginFormSubmit}>
              <Typography variant="body2" align="center" >
                {email}
              </Typography>
              {isLoginFail && <Alert severity="error">{errorInfo}</Alert>}
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
              <Grid container alignItems="center" >
                <Grid item xs>
                  <FormControlLabel
                    control={<Checkbox checked={isChecked} onChange={handleChecked} value="remember" color="primary" />}
                    label="Keep me logged in"
                  />
                </Grid>
                <Grid item>
                  <Link onClick={forgotPassword} href={`/forgot/${email}`} variant="body2">
                    {"Forgot password?"}
                  </Link>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign In
                  {isLoading && <CircularProgress />}
              </Button>
              <Grid container justify="center" alignItems="center" >
                <Grid item>
                  <Link href="" onClick={handleNotYou} variant="body2">
                    {"Not you?"}
                  </Link>
                </Grid>
              </Grid>
            </form>}            
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </div>
    )
  );
}