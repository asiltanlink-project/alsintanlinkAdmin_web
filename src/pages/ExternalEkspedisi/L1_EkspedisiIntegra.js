import React from 'react'
import {Label,Input,Card,CardHeader,CardBody,CardFooter,Table,Button,
    Modal,ModalHeader,ModalBody,ModalFooter} from 'reactstrap'
import {MdPrint,MdClose} from 'react-icons/md'
import Page from 'components/Page';
import {url_getData_EkspedisiIntegra,url_getPdf,url_getResi} from '../urlLinkIntegra'
import Axios from 'axios';

class EkspedisiIntegra extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            result:[],
            gudangId:window.localStorage.getItem('gID'),
            orderId_Eccommerce_toPrint:'INV/20201208/XX/XII/694478112',
            noResi:'',
            modalPrintResiIsOpen:false,
            DoNumber:[
                'I002012000002',
                'I002012000054',
                'I002012000055'
            ],
            doCount:0
        }
    }

    componentDidMount(){
        this.getEkspedisiIntegraData()
        this.props.setTitle(
            'Pesanan Untuk Di Proses',
            'red'
        )
    }

    getEkspedisiIntegraData = () =>{
        // var url_getData = 'http://10.0.111.16:8888//eksternal-ekspedisi/getorderekspedition'
        var url_getData = url_getData_EkspedisiIntegra+this.state.gudangId
        Axios
        .get(url_getData)
        .then((response)=>{
            console.log(response)
            this.setState({
                result:response.data.data
            })
        })
        .catch((error)=>{
            alert(error.message)
        })
    }

    getPdfToPrint = () =>{
        var url_getpdf_toprint = url_getPdf+this.state.orderId_Eccommerce_toPrint
        console.log('url pdf',url_getpdf_toprint)
        Axios
        .get(url_getpdf_toprint)
        .then((response)=>{
            console.log('response pdf',response)
        })
        .catch((error)=>{
            console.log({error})
        })
    }

    getNomorResi = () =>{
        // this.setState({
        //     doCount:this.state.doCount + 1
        // })
        // var url_getResi_toprint = url_getResi+this.state.orderId_Eccommerce_toPrint+'&donum='+this.state.DoNumber[this.state.doCount]
        var url_getResi_toprint = 'https://staging-api.cfu.pharmalink.id/eksternal-ekspedisi/bookorderjnttrial?invoice_num=INV/20201208/XX/XII/694478112&donum=123126'
        console.log('url resi',url_getResi_toprint)
        Axios
        .post(url_getResi_toprint)
        .then((response)=>{
            console.log('response get no resi',response)
            if(response.data.data){
                this.setState({
                    noResi:response.data.data.awb_no
                },()=>this.openPrintResiModal('open'))
            }
        })
        .catch((error)=>{
            console.log({error})
        })
    }

    openPrintResiModal = (type) =>{
      if(type==='open'){
          this.setState({
            modalPrintResiIsOpen:true,
          })
      }else if(type ==='close'){
          this.setState({
              modalPrintResiIsOpen:false,
              orderId_Eccommerce_toPrint:''
          })
      }
    }

    returnSuitableButton = (buttonStatus) =>{
        if(!buttonStatus){
            return(
                <Button 
                color='success'
                onClick={()=>this.getNomorResi()}
                >
                    Request Pickup
                </Button>
            )
        }else if(buttonStatus){
            return(
                <Button disabled color='danger'>
                    No Pickup
                </Button>
            )
        }
    }

    render(){
        const {result,orderId_Eccommerce_toPrint,noResi,modalPrintResiIsOpen} = this.state
        return(
            <Page className='Ekspedisi-Integra'>
                <Card>
                    <CardBody>
                        <Table responsive striped>
                            <thead>
                                <tr>
                                    <th>
                                        No
                                    </th>
                                    <th>
                                        Outlet
                                    </th>
                                    <th>
                                        OrderID
                                    </th>
                                    <th>
                                        Deadline
                                    </th>
                                    <th>
                                        NoSP
                                    </th>
                                    <th>
                                        NoDO
                                    </th>
                                    <th>
                                        S. WKT
                                    </th>
                                    <th>
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {result && result.map((item)=>
                                <tr>
                                    <td>{item.no}</td>
                                    <td>{item.outlet_name}</td>
                                    <td>{item.order_id}</td>
                                    <td>{item.deadline === '' ? '-' : item.deadline}</td>
                                    <td>{item.no_sp === ''? '-' : item.no_sp}</td>
                                    <td>{item.no_do === '' ? '-' : item.no_do}</td>
                                    <td>{item.time_remaining}</td>
                                    <td>
                                        {this.returnSuitableButton(item.enable_button)}
                                    </td>
                                </tr>
                                )}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card>
                
                <Modal isOpen={modalPrintResiIsOpen}>
                    <ModalBody>
                        <Label>OrderID: </Label>
                        <Input 
                        disabled 
                        value={orderId_Eccommerce_toPrint} 
                        style={{fontWeight:'bold'}}>
                        </Input>
                        <Label>No Resi: </Label>
                        <Input 
                        disabled 
                        value={noResi} 
                        style={{fontWeight:'bold'}}>
                        </Input>
                    </ModalBody>
                    <ModalFooter style={{justifyContent:'center'}}>
                        <Button
                        onClick={()=>this.getPdfToPrint()} 
                        color='success'>
                            <MdPrint/>
                             Print Resi
                        </Button>
                        <Button color='danger'
                        onClick={()=>this.openPrintResiModal('close')}
                        >
                            <MdClose/>
                             Exit
                        </Button>
                    </ModalFooter>
                </Modal>
            </Page>
        )
    }

}
export default EkspedisiIntegra;