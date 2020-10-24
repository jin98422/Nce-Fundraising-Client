import React, { useState, useRef, useEffect } from "react";
import decode from 'jwt-decode';
import { useHistory, useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import {
    Box,
    Avatar,
    Button,
    CssBaseline,
    TextField,
    FormHelperText,
    Link,
    Grid,
    Typography,
    Container,
    CircularProgress,
    AppBar,
    Toolbar,
    Divider
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
  confirm: {
    fontStyle: 'italic'
  },
  divider: {
    width: "100%",
    backgroundColor: "#3c4d34",
    marginTop: theme.spacing(1)
  },
}));

export default function Password() {
  const classes = useStyles();
  const history = useHistory();

  const { verify } = useParams();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitFail, setIsSubmitFail] = useState(false);
  const [hasPasswordMatchError, setHasPasswordMatchError] = useState(false);
  const resetPassword = useRef();
  const resetPasswordRepeat = useRef();

  useEffect(() => {
    const decodedToken = decode(verify);
    if(decodedToken.status === 'new') {
      setTitle('Your account has been activated.')
      setContent('Set your password and then sign in your account.')
    } else {
      setTitle('Reset your password')
      setContent(`Change password for ${decodedToken.email}`)
    }
  }, [])

  const resetFormSubmit = (e) => {
    e.preventDefault()
    const decodedToken = decode(verify);
    if (resetPassword.current.value !== resetPasswordRepeat.current.value) {
      setHasPasswordMatchError(true);
      return;
  }
    setIsLoading(true);
    axios.post(`${process.env.REACT_APP_HOST}/user/reset`,{
      email: decodedToken.email,
      password: resetPassword.current.value
    }).then(res => {
      if(res.status === 200) {
          setIsLoading(false);
          localStorage.setItem("token", res.data.token);
          axios.defaults.headers.common['Authorization'] = res.data.token;
          history.push("/")
      } else {
          setIsLoading(false);
          setIsSubmitFail(true)
      }       
    }).catch(err => {
      console.log(err)
      setIsLoading(false);
      setIsSubmitFail(true)
    })
  }

  return (
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
                <Typography component="h1" variant="h5" className={classes.confirm}>
                  {title}
                </Typography>
                <Divider variant="fullWidth" className={classes.divider} />
                <Typography >
                  {content}
                </Typography>
                <form className={classes.form} onSubmit={resetFormSubmit}>
                    {isSubmitFail && <Alert severity="error">Something went wrong!. Please try again.</Alert>}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        inputRef={resetPassword}
                        error={hasPasswordMatchError}
                        onChange={() => {
                            if (resetPassword.current.value === resetPasswordRepeat.current.value) {
                                setHasPasswordMatchError(false);
                            }
                        }}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        error={hasPasswordMatchError}
                        name="repeatPassword"
                        label="Repeat Password"
                        type="password"
                        id="repeatPassword"
                        autoComplete="current-repeat-password"
                        inputRef={resetPasswordRepeat}
                        onChange={() => {
                            if (resetPassword.current.value === resetPasswordRepeat.current.value) {
                                setHasPasswordMatchError(false);
                            }
                        }}
                    />
                    {hasPasswordMatchError && (
                        <FormHelperText
                            error
                        >
                        Your passwords don't match.
                        </FormHelperText>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Set and Sign In
                        {isLoading && <CircularProgress />}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                        </Grid>
                        <Grid item>
                        <Link href="/login" variant="body2">
                            {"Sign In?"}
                        </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
          <Box mt={8}>
              <Copyright />
          </Box>
          </Container>
      </div> 
  );
}