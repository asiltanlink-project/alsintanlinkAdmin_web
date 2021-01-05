import Page from 'components/Page';
import React from 'react'
import { Table, Input , Form ,FormFeedback, Card, CardHeader,CardBody, 
    ButtonDropdown,DropdownMenu,DropdownToggle,DropdownItem, Button, Row, Col
} from 'reactstrap';
import { Tab , Tabs , TabList , TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Axios from 'axios';
import {base_url_all} from '../urlLink'

class HistoryTeam extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            token:window.localStorage.getItem('tokenLogin')
        }
    }

    componentDidMount(){
    }


    render(){
        // const {} = this.state
        return(
            <Page
            title       = "History Team WFH"
            breadcrumbs = {[{ name: 'History Team WFH', active: true }]}
            className   = "history Team"
            >
                  
            </Page>
        )
    }

}
export default HistoryTeam;