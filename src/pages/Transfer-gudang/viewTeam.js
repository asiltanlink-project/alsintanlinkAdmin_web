import Page from 'components/Page';
import React from 'react'
import {  Table, Input, Form ,FormFeedback, Card, CardHeader,CardBody, 
    ButtonDropdown,DropdownMenu,DropdownToggle,DropdownItem, Button, Row, Col,
} from 'reactstrap';
import { Tab , Tabs , TabList , TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Axios from 'axios';
import {base_url_all} from '../urlLink'

class ViewTeam extends React.Component{

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
           title       = "Jadwal WFH Team"
           breadcrumbs = {[{ name: 'Jadwal WFH Team', active: true }]}
           className   = "Jadwal WFH Team"
           >
                
           </Page>
        )
    }

}
export default ViewTeam;