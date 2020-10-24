import React, {useState, useEffect} from 'react';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import axios from 'axios';
import ShareIcon from '@material-ui/icons/Share';
import TableTemplate from '../components/TableTemplate';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import CustomSnackBar from './CustomSnackBar';

export default function MainTable(props) {
    // const { onClick } = props;
    const [tableData, setTableData] = useState([])
    const [selectedID, setSelectedID] = useState(null)
    const [content, setContent] = useState('');    
    const [severity, setSeverity] = useState('success');    
    const [openSnack, setOpenSnack] = useState(false);

    const columns = [
        { title: 'Client', field: 'client'},
        { title: 'Campaign', field: 'name'},
        { title: 'Canvassers', field: 'fundraisers' },
        { title: 'Start Date', field: 'createdAt',
            render: rowData => rowData.createdAt.split('T')[0],
            onClick: () => alert("this")
        },
        { title: 'Share Link', field: 'share', 
            render: rowData => 
                <CopyToClipboard 
                    text={`${process.env.REACT_APP_DOMAIN}/share/${rowData._id}`}
                    onCopy={() => {
                        window.event.preventDefault()
                        setOpenSnack(true);
                        setContent('Share Link Copied!');
                        setSeverity('success')
                    }}
                >
                    <ShareIcon onClick={(e) => { e.stopPropagation() }} />
                </CopyToClipboard>,
        },
        { title: 'Form Link', field: 'form', 
            render: rowData => 
                <CopyToClipboard 
                    text={`${process.env.REACT_APP_DOMAIN}/form/${rowData._id}`}
                    onCopy={() => { 
                        setOpenSnack(true);
                        setContent('Form Link Copied!');
                        setSeverity('success')
                    }}
                >
                <FileCopyIcon onClick={(e) => { e.stopPropagation() }} />
            </CopyToClipboard>,
        },
    ];

    useEffect(() => {
        getCampaingsData();
        setSelectedID(0)
    }, [])

    const getCampaingsData = () => {
        axios.get(`${process.env.REACT_APP_HOST}/campaign`).then(doc => {
            console.log(doc)
            setTableData(doc.data)
        }).catch(err => {
            console.log(err)
        })
    }

    const addNewCamp = () => {

    }

    const tableRowClick = (e, rowData) => {
        console.log(rowData)
        setSelectedID(rowData.tableData.id)
        // onClick(1, rowData._id)
    }

    const closeSnack = () => {
        setOpenSnack(false)
    }
    
    return (
        <div>
            <TableTemplate title="Active Campaigns" selectedID={selectedID} addNew={addNewCamp} tableRowClick={tableRowClick} columns={columns} tableData={tableData} />
             <CustomSnackBar open={openSnack} handleClose={closeSnack} severity={severity} content={content} />
        </div>
    );
}