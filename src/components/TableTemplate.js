import React from 'react';
import MaterialTable from 'material-table';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar'
import AddIcon from '@material-ui/icons/Add';
import { Typography, Tooltip, IconButton } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        borderRadius: '18px 18px 0 0',
        border: "2px solid #595959",
        height: "100%",
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
    }
})); 

export default function TableTemplate(props) {
    const classes = useStyles();
    const { selectedID, title, addNew, tableRowClick, tableData, columns } =  props
   
    return (
            <Paper className={classes.root} component={Paper}>
                <Toolbar className={classes.toolBar}>
                    <Typography className={classes.toolBarTitle} color='inherit'>
                       {title}
                    </Typography>
                    <Tooltip title="Add">
                        <IconButton onClick={addNew} aria-label="add">
                            <AddIcon fontSize="large" className={classes.toolBarIcon} />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
                <MaterialTable
                    title=""
                    columns={columns}
                    data={tableData}
                    options={{
                        paging: false,
                        rowStyle: rowData => {
                            if(rowData.tableData.id === selectedID) {
                                return {backgroundColor: "#d0cece"}
                            }
                        }
                    }}
                    onRowClick={tableRowClick}
                    onCellClick={(row,column,event) => {
                        console.log("cellClick", row, column, event)
                    }}
                />
            </Paper>
    );
}
