import React, { useState, useEffect } from "react";
import decode from 'jwt-decode';
import axios from "axios";
import { useHistory } from "react-router-dom";
import {
    makeStyles,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
    Avatar,
    Button,
    CssBaseline,
    TextField,
    Container,
    CircularProgress,
    Dialog,
    Snackbar,
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle'
import MaterialTable from 'material-table';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Alert from '@material-ui/lab/Alert'
import Copyright from "../components/Copyright";

const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
    app: {
        right: 0,
    },
    top: {
        textAlign: "center"
    },
    square: {
        padding: theme.spacing(4),
        margin: theme.spacing(2),
        backgroundColor: "#5b9bd5",
        textAlign: "center",
        color: "white",
        borderRadius: "20px"
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        color: "#ffc000"
    },
    rightBar: {
        display: "flex"
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
}));

export default function AdminHome() {
    const classes = useStyles();
    const history = useHistory();

    const [openDialog, setOpenDialog] = useState(true);
    const [openSnack, setOpenSnack] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoginFail, setIsLoginFail] = useState(false);
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)
    const [accountAnchorEl, setAccountAnchorEl] = useState(null);
    const [validationError, setValidationError] = useState("");
    const open = Boolean(accountAnchorEl);
    const [columns, setColumns] = useState([
        { title: 'Name', field: 'username' },
        { title: 'Email', field: 'email' },
        {
            title: 'Role',
            field: 'role',
            lookup: {
                1: 'Administrator',
                2: 'Senior Manager',
                3: 'Logistics',
                4: 'Team Leaders',
                5: 'Office Director',
                6: 'Campaign Director',
            },
        },
    ]);
    const [data, setData] = useState([])

    useEffect(() => {
        const admin = localStorage.getItem("admin");
        if(admin === null || admin === "") {
            setOpenDialog(true)
        } else {
            const decodedTokenAdmin = decode(admin);
            if (decodedTokenAdmin.exp < Date.now() / 1000) {                
                setOpenDialog(true)
            } else {
                getUserData();
                setOpenDialog(false)
            }
        }
        
    }, [])

    const getUserData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/user`).then(res => {
            console.log(res.data)
            setData(res.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const loginFormSubmit = (e) => {
        e.preventDefault()
        setIsLoading(true);
        axios.post(`${process.env.REACT_APP_HOST}/user/admin`,{
          email: email,
          password: password
        }).then(res => {
          if(res.status === 200) {
                setIsLoading(false);
                localStorage.setItem("admin", res.data.admin);
                getUserData();
                setOpenDialog(false)
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

    const handleAccountMenu = (event) => {
        setAccountAnchorEl(event.currentTarget);
    };

    const handleAccountMenuClose = () => {
        setAccountAnchorEl(null);
    };

    const handleAccountLogout = () => {
        localStorage.removeItem("admin");
        history.push("/")
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }    
        setOpenSnack(false);
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h4" className={classes.title}>
                        NCE
                    </Typography>
                    <div className={classes.rightBar}>
                        <IconButton
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleAccountMenu}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={accountAnchorEl}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={open}
                            onClose={handleAccountMenuClose}
                        >
                            <MenuItem onClick={handleAccountLogout}>Logout from Admin</MenuItem>
                        </Menu>
                    </div>
                </Toolbar>
            </AppBar>
            <MaterialTable
                title="Set Role"
                columns={columns}
                data={data}
                editable={{
                    onRowAdd: (newData) =>
                        new Promise((resolve, reject) => {
                            if(newData.username === undefined) {
                                setValidationError("Please fill out these all fields")
                                setOpenSnack(true)
                                reject()
                            } else if(newData.email === undefined) {
                                setValidationError("Please fill out these all fields")
                                setOpenSnack(true)
                                reject()
                            } else if(newData.role === undefined) {
                                setValidationError("Please fill out these all fields")
                                setOpenSnack(true)
                                reject()
                            } else if(!expression.test(String(newData.email).toLowerCase())) {
                                setValidationError("Please enter a valid email address")
                                setOpenSnack(true)
                                reject()
                            }
                            axios.post(`${process.env.REACT_APP_HOST}/user/register`, {
                                username: newData.username,
                                email: newData.email,
                                role: newData.role
                              }).then(res => {
                                  console.log(res)
                                    getUserData()
                                    resolve()
                              }).catch(err => {
                                if(err.response.status === 409) {
                                    setValidationError("This email already registered")
                                    setOpenSnack(true)
                                    reject()
                                } else {
                                    setValidationError("Something went wrong, please try again")
                                    setOpenSnack(true)
                                    reject()
                                }      
                            })
                        }),
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            if(newData.username === undefined) {
                                setValidationError("Please fill out these all fields")
                                setOpenSnack(true)
                                reject()
                            } else if(newData.email === undefined) {
                                setValidationError("Please fill out these all fields")
                                setOpenSnack(true)
                                reject()
                            } else if(newData.role === undefined) {
                                setValidationError("Please fill out these all fields")
                                setOpenSnack(true)
                                reject()
                            } else if(!expression.test(String(newData.email).toLowerCase())) {
                                setValidationError("Please enter a valid email address")
                                setOpenSnack(true)
                                reject()
                            }
                            axios.post(`${process.env.REACT_APP_HOST}/user/update`, {
                                id: newData._id,
                                username: newData.username,
                                email: newData.email,
                                role: newData.role
                              }).then(res => {
                                console.log(res)
                                    getUserData()
                                    resolve()
                              }).catch(err => {
                                    setValidationError("Something went wrong, please try again")
                                    setOpenSnack(true)
                                    reject()
                            })
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve, reject) => {
                            axios.post(`${process.env.REACT_APP_HOST}/user/delete`, {
                                id: oldData._id,
                              }).then(res => {
                                console.log(res)
                                    getUserData()
                                    resolve()
                              }).catch(err => {
                                    setValidationError("Something went wrong, please try again")
                                    setOpenSnack(true)
                                    reject()
                            })
                        }),
                }}
                options={{
                    actionsColumnIndex: -1
                }}
            />
            <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} variant="filled" elevation={6} severity="error">
                    {validationError}
                </Alert>
            </Snackbar>
            <Dialog fullScreen open={openDialog}>
                <div>
                    <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Admin Confirmation
                        </Typography>
                        <form className={classes.form} onSubmit={loginFormSubmit}>
                        {isLoginFail && <Alert severity="error">Some of your info isn't correct. Please try again.</Alert>}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            autoFocus
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Confirm
                            {isLoading && <CircularProgress />}
                        </Button>
                        </form>
                    </div>
                    <Box mt={8}>
                        <Copyright />
                    </Box>
                    </Container>
                </div>
            </Dialog>
        </div>
    );
}