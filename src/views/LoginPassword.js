import React, { useState, useRef, useEffect } from "react";
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
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert'
import Copyright from "../components/Copyright";

const useStyles = makeStyles((theme) => ({
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
    if(localStorage.getItem("isChecked")) {
      console.log(localStorage.getItem("isChecked"))
      setEmail(localStorage.getItem("email"))
      setPassword(localStorage.getItem("password"))
      setChecked(localStorage.getItem("isChecked"))
    }
    const token = localStorage.getItem("token");
    if(token === null || token === "") {
      setLogin(true)
    } else {
        const decodedToken = decode(token);
        if (decodedToken.exp < Date.now() / 1000) {
          setLogin(true)
        } else {
          window.location.href="/"
        }
    }
  }, [])

  const loginContinue = () => {
    setIsLoading(true);
    axios.post(`${process.env.REACT_APP_HOST}/user/checkEmail`,{
      email: email,
    }).then(res => {
      if(res.status === 200) {
        setEnableEmail(false)
        setEnablePassword(true)
      }
    }).catch(err => {
        setIsLoading(false);
        setErrorInfo("Oops! your email is incorrect")
        setIsLoginFail(true)
    })
  }

  const loginFormSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true);
    axios.post(`${process.env.REACT_APP_HOST}/user/login`,{
      email: email,
      password: password
    }).then(res => {
      if(res.status === 200) {
          setIsLoading(false);
          localStorage.setItem("token", res.data.token);
          axios.defaults.headers.common['Authorization'] = res.data.token;
          if(isChecked) {
            localStorage.setItem("email", email)
            localStorage.setItem("password", password)
            localStorage.setItem("isChecked", isChecked)
          }
          history.push("/")
      } else {
          setIsLoading(false);
          setIsLoginFail(true)
      }       
    }).catch(err => {
      console.log(err)
      setIsLoading(false);
      setIsLoginFail(true)
    })
  }

  const handleChecked = () => {
    setChecked(!isChecked);
  }

  return (
    login && (
      <div>
          <AppBar position="static">
              <Toolbar>
                  <Typography variant="h4" className={classes.title}>
                      NCE
                  </Typography>
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
              <form className={classes.form} onSubmit={loginFormSubmit}>
              {isLoginFail && <Alert severity="error">{errorInfo}</Alert>}
              { enableEmail && <TextField
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
              />}
              { enablePassword && <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                  }}
              />}
             { enablePassword && <Grid container >
                  <Grid item>
                      <FormControlLabel
                        control={<Checkbox checked={isChecked} onChange={handleChecked} value="remember" color="primary" />}
                        label="Keep me logged in"
                    />
                  </Grid>
                  <Grid item>
                  <Link href="/forgot" variant="body2">
                      {"Forgot password?"}
                  </Link>
                  </Grid>
              </Grid>}
             
             { enablePassword && <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
              >
                  Sign In
                  {isLoading && <CircularProgress />}
              </Button>}
             { enableEmail && <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  onClick={loginContinue}
              >
                  Continue
                  {isLoading && <CircularProgress />}
              </Button>}
              
              </form>
          </div>
          <Box mt={8}>
              <Copyright />
          </Box>
          </Container>
      </div> 
    )
  );
}