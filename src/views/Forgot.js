import React from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import axios from "axios";
import {
    Box,
    Avatar,
    CssBaseline,
    Typography,
    Container,
    AppBar,
    Toolbar,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
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
    textAlign: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  divider: {
    width: "100%",
    backgroundColor: "#3c4d34",
    marginTop: theme.spacing(1)
  },
  email: {
    fontStyle: 'italic',
    textDecoration: 'underline'
  }
}));

export default function Forgot() {
  const classes = useStyles();
  const { email } = useParams();

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
                <Typography component="h1" variant="h5">
                    Reset your password
                </Typography>
                <Typography >
                  We have sent confirm email to <span className={classes.email}>{email}</span>.
                  Check your email for a link to reset your password.
                </Typography>
            </div>
          <Box mt={8}>
              <Copyright />
          </Box>
          </Container>
      </div>
  );
}