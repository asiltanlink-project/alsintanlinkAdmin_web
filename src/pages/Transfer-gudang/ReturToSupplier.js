import Page from 'components/Page';
import React from 'react';
import {
  Table,
  Input,
  Form,
  FormFeedback,
  Card,
  CardHeader,
  CardBody,
  ButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  DropdownItem,
  Button,
  Row,
  Col,
  Pagination,
  PaginationItem,
  PaginationLink,
  FormGroup,
  Label,
  FormText,
} from 'reactstrap';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Axios from 'axios';
import { base_url_all } from '../urlLink';
import { Redirect } from 'react-router-dom';
import NotificationSystem from 'react-notification-system';

class ReturToGudang extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btnSearchTypeIsOpen: false,
      searchType: 'Apotik',
      searchDefault: true,
      searchByDept: false,
      btnSearchIsDisabled: false,

      btnPaginationIsOpen: false,
      paginationAmount: 'Jumlah Data',
      defaultPagination: true,
      medPagination: false,
      maxPagination: false,

      page: 1,
      length: 10,
      maxPage: 1,

      inputSearchNIP: '',
      ValidSearchNIP: false,
      invalidSearchNIP: false,

      resultPT: [],
      resultDept: [],
      selectedPTId: 0,
      PTselected: false,
      selectedDept: 0,
      optionDefaultDept: '== PILIH PT Dahulu ==',

      result: [],
      metadataWeek: [],
      noDataFound: 'none',
      noDataMessage: 'none',
      pagination: 'block',
      selectedTab: 0,
      token: window.localStorage.getItem('tokenLogin'),
      redirect: false,
    };
  }

  // componentDidMount(){
  //     this.getAllDataPT();
  // }

  // renderRedirect = () => {
  //     if (this.state.redirect) {
  //        alert("Token Expired ! Silahkan Login Kembali")
  //       return <Redirect to='/login' />
  //     }
  //   }

  // getAllDataPT = () =>{
  //     const url = (base_url_all + 'karyawan?type=pt')
  //     Axios.get(url,{
  //         headers:{
  //             Authorization:this.state.token
  //         }
  //     },{validateStatus : ()=> true})
  //     .then((res)=>{
  //          if(res.data.data){
  //             this.setState({
  //                 resultPT:res.data.data,
  //                 optionDefaultPT:"== PILIH PT =="
  //             })
  //         }else if(res.data.error.status === true){
  //             this.setState({
  //                 optionDefaultPT:'Error ! Refresh Browser',
  //                 resultPT:[]
  //             })
  //         }
  //     })
  //     .catch((error)=>{
  //         if(error.response.status === 401){
  //             console.log("hello")
  //             window.localStorage.removeItem('tokenLogin');
  //             window.localStorage.removeItem('accessList');
  //             this.setState({
  //                 redirect:true
  //             })
  //         }
  //     })
  // }

  // getAllDataDeptbyPTId = () => {
  //     const url = (base_url_all + 'karyawan?type=dept&pt='+this.state.selectedPTId)
  //     Axios
  //     .get(url,{
  //         headers:{
  //             Authorization:this.state.token
  //         }
  //     })
  //     .then((res)=>{
  //         if(res.data.data){
  //            this.setState({
  //             resultDept:res.data.data,
  //             optionDefaultDept:'== PILIH DEPT =='
  //            })
  //         }else if(res.data.error.status === true){
  //             this.setState({
  //                 optionDefaultDept:'Error ! Refresh Browser',
  //                 resultDept:[]
  //             })
  //         }
  //     })
  // }

  // getExportedDataExcel = () => {
  //     const url = (base_url_all+'excel')
  //     Axios
  //     .get(url,{
  //         headers:{
  //             Authorization:this.state.token
  //         }
  //     })
  //     .then((res)=>{
  //         const urlblob = window.URL.createObjectURL(new Blob([res.data]));
  //         const link = document.createElement('a');
  //         link.href = urlblob;
  //         link.setAttribute('download', 'download.xlsx');
  //         document.body.appendChild(link);
  //         link.click();
  //     })
  // }

  // searchKaryawanByNIP = () => {
  //     const url = (base_url_all+'wfh?NIP='+this.state.inputSearchNIP)
  //     Axios
  //     .get(url,{
  //         headers:{
  //             Authorization:this.state.token
  //         }
  //     })
  //     .then((res)=>{
  //         if(res.data.metadata.weeks !== null){
  //             this.setState({
  //                 result:res.data.data,
  //                 metadataWeek:res.data.metadata.weeks,
  //                 noDataFound:'none',
  //                 noDataMessage:'none',
  //                 pagination:'none'
  //             })
  //         }else if(res.data.metadata.weeks === null){
  //             this.setState({
  //                 noDataFound:'block',
  //                 noDataMessage:'none',
  //                 result:[],
  //                 metadataWeek:[],
  //                 pagination:'none'
  //             })
  //         }else if(res.data.error.status === true){
  //             this.setState({
  //                 noDataMessage:'none',
  //                 noDataFound:'block',
  //                 result:[],
  //                 metadataWeek:[],
  //                 pagination:'none'
  //             })
  //         }
  //     })
  // }

  // searchKaryawanByDept = () =>{
  //     const url = (base_url_all+'wfh?dept='+this.state.selectedDept)
  //     Axios
  //     .get(url,{
  //         headers:{
  //             Authorization:this.state.token
  //         }
  //     })
  //     .then((res)=>{
  //         if(res.data.data){
  //             this.setState({
  //                 result:res.data.data,
  //                 metadataWeek:res.data.metadata.weeks,
  //                 noDataMessage:'none',
  //                 noDataFound:'none',
  //                 pagination:'none',
  //                 maxPage:res.data.metadata.last_page,
  //             })
  //         }else if(res.data.error.status === true){
  //             this.setState({
  //                 noDataFound:'none',
  //                 noDataMessage:'block',
  //                 pagination:'none',
  //                 result:[],
  //                 metadataWeek:[],
  //             })
  //         }else if(res.data.data === null){
  //             this.setState({
  //                 noDataMessage:'none',
  //                 noDataFound:'block',
  //                 pagination:'none',
  //                 result:[],
  //                 metadataWeek:[]
  //             })
  //         }
  //     })
  // }

  // toggleSearchType = () =>{
  //     this.setState({
  //         btnSearchTypeIsOpen:!this.state.btnSearchTypeIsOpen
  //     })
  // }

  // togglePaginationAmount = () =>{
  //     this.setState({
  //         btnPaginationIsOpen:!this.state.btnPaginationIsOpen
  //     })
  // }

  // handleSearchType = (type) => {
  //      if(type === "Apotik"){
  //         // this.setState({
  //         //     searchType:'NIP',
  //         //     searchDefault:true,
  //         //     btnSearchIsDisabled:true,
  //         //     noDataFound:'none',
  //         //     noDataMessage:'none'
  //         // })
  //     }else if(type === "Floor"){
  //         // this.setState({
  //         //     searchType:'Departemen',
  //         //     searchDefault:false,
  //         //     btnSearchIsDisabled:true,
  //         //     noDataFound:'none',
  //         //     noDataMessage:'none'
  //         // })
  //     }
  // }

  // handlePaginationAmount = (type) =>{
  //     // if(type === 'Default'){
  //     //     this.setState({
  //     //         paginationAmount:'10',
  //     //         length:10,
  //     //         defaultPagination:true,
  //     //         medPagination:false,
  //     //         maxPagination:false,
  //     //     },()=>this.handlePaginationForEachSearch())
  //     // }else if(type === "Med"){
  //     //     this.setState({
  //     //         paginationAmount:'25',
  //     //         length:25,
  //     //         defaultPagination:false,
  //     //         medPagination:true,
  //     //         maxPagination:false,
  //     //     },()=>this.handlePaginationForEachSearch())
  //     // }else if(type === "Max"){
  //     //     this.setState({
  //     //         paginationAmount:'50',
  //     //         length:50,
  //     //         defaultPagination:false,
  //     //         medPagination:false,
  //     //         maxPagination:true,
  //     //     },()=>this.handlePaginationForEachSearch())
  //     // }
  // }

  // handlePaginationForEachSearch = () =>{
  //     // if(this.state.searchType === "NIP"){
  //     //     this.searchKaryawanByNIP()
  //     // }else if(this.state.searchType === "Departemen"){
  //     //     this.searchKaryawanByDept()
  //     // }
  // }

  // handleChange = (type,event)=>{
  //     // var regVal = /[^A-Za-z0-9]/g
  //     // if(type === "inputSearchNIP"){
  //     //     if(event.target.value.trim().length <=0
  //     //     || regVal.test(event.target.value)
  //     //     || event.target.value.length < 6  ){
  //     //         this.setState({
  //     //             invalidSearchNIP:true,
  //     //             ValidSearchNIP:false,
  //     //             btnSearchIsDisabled:true
  //     //         })
  //     //     }else{
  //     //         this.setState({
  //     //             inputSearchNIP:event.target.value.toUpperCase(),
  //     //             ValidSearchNIP:true,
  //     //             invalidSearchNIP:false,
  //     //             btnSearchIsDisabled:false
  //     //         })
  //     //     }
  //     // }
  // }

  // handleSelect = (type,event)=>{
  //     if(type === "PT"){
  //         if(event.target.value !== '== PILIH PT ==' && event.target.value !== 'Error ! Refresh Browser'){
  //             if(this.state.selectedPTId !== 0 && event.target.value !== this.state.selectedPTId){
  //                 this.setState({
  //                     optionDefaultDept:'== PILIH DEPT ==',
  //                     resultDept:[],
  //                     btnSearchIsDisabled:true,
  //                     selectedPTId:event.target.value
  //                 },()=>this.getAllDataDeptbyPTId())
  //             }else if(this.state.selectedPTId === 0){
  //                 this.setState({
  //                     PTselected:true,
  //                     optionDefaultDept:'== PILIH DEPT ==',
  //                     selectedPTId:event.target.value
  //                 },()=>this.getAllDataDeptbyPTId())
  //             }
  //         }else if(event.target.value === "== PILIH PT ==" || event.target.value === "'Error ! Refresh Browser'"){
  //             this.setState({
  //                 PTselected:false,
  //                 optionDefaultDept:'== PILIH PT Dahulu ==',
  //                 btnSearchIsDisabled:true,
  //                 resultDept:[]
  //             })
  //         }
  //     }else if(type === "Dept"){
  //         if(event.target.value !== "== PILIH DEPT ==" && event.target.value !== 'Error ! Refresh Browser'){
  //             this.setState({
  //                 selectedDept:event.target.value,
  //                 btnSearchIsDisabled:false
  //             })
  //         }else if(event.target.value === "== PILIH Dept ==" && event.target.value === 'Error ! Refresh Browser'){
  //             this.setState({
  //                 btnSearchIsDisabled:true
  //             })
  //         }
  //     }
  // }

  // handleKeyPress = (e) =>{
  //     var enterPressed = e.keyCode || e.which;
  //     if(enterPressed === 13 && this.state.ValidSearchNIP === false){
  //         e.preventDefault();
  //     }else if(enterPressed === 13 && this.state.ValidSearchNIP === true){
  //         this.searchKaryawanByNIP()
  //     }
  // }

  // searchBtnType = () =>{
  //      if(this.state.searchType === "NIP"){
  //         this.searchKaryawanByNIP()
  //     }else if(this.state.searchType === "Departemen"){
  //         this.searchKaryawanByDept()
  //     }
  // }

  // firstPage = () => {
  //     this.setState({
  //         page:1
  //     },()=>this.searchBtnType())
  // }

  // nextPage = () => {
  //     if(this.state.page < this.state.maxPage){
  //         this.setState({
  //             page:this.state.page + 1
  //         },()=>this.searchBtnType())
  //     }else{
  //        this.setState({
  //         page:this.state.maxPage
  //        },()=>this.searchBtnType())
  //     }
  // }

  // previousPage = () => {
  //    if(this.state.page > 1){
  //        this.setState({
  //            page:this.state.page - 1
  //        },()=>this.searchBtnType())
  //    }else{
  //        this.setState({
  //            page:1
  //        },()=>this.searchBtnType())
  //    }
  // }

  // lastPage = () => {
  //   this.setState({
  //       page:this.state.maxPage
  //   }, ()=>this.searchBtnType())
  // }

  // returnViewBasedonWeek = (data) =>{
  //     var weeklyResult = this.state.result[data]
  //     return(
  //     <div>
  //     <Table>
  //         <thead>
  //             <tr>
  //                 <th style={{width:'10%',textAlign:'left'}}>
  //                     Tgl. Proses
  //                 </th>
  //                 <th style={{width:'20%',textAlign:'left'}}>
  //                     PT
  //                 </th>
  //                 <th style={{width:'18%',textAlign:'left'}}>
  //                     Departemen
  //                 </th>
  //                 <th style={{width:'10%',textAlign:'left'}}>
  //                     NIP
  //                 </th>
  //                 <th style={{width:'22%',textAlign:'left'}}>
  //                     Nama
  //                 </th>
  //                 <th style={{width:'10%',textAlign:'left'}}>
  //                     Hari Kerja
  //                 </th>
  //                 <th style={{width:'10%',textAlign:'left'}}>
  //                     Status
  //                 </th>
  //             </tr>
  //         </thead>
  //         <tbody>
  //             {weeklyResult && weeklyResult.map((emp)=>
  //                 <tr>
  //                     <td style={{width:'10%',textAlign:'left'}}>{emp.tgl_proses}</td>
  //                     <td style={{width:'20%',textAlign:'left'}}>{emp.pt}</td>
  //                     <td style={{width:'18%',textAlign:'left'}}>{emp.departemen}</td>
  //                     <td style={{width:'10%',textAlign:'left'}}>{emp.nip}</td>
  //                     <td style={{width:'15%',textAlign:'left'}}>{emp.nama}</td>
  //                     <td style={{width:'17%',textAlign:'left'}}>{emp.tgl_assign}</td>
  //                     <td style={{width:'10%',textAlign:'left'}}>{emp.status_tempatkerja}</td>
  //                 </tr>
  //             )}
  //         </tbody>
  //     </Table>
  //     </div>
  //     )
  // }

  render() {
    const {
      btnSearchTypeIsOpen,
      searchType,
      searchDefault,
      btnPaginationIsOpen,
      paginationAmount,
      defaultPagination,
      medPagination,
      maxPagination,
      resultPT,
      resultDept,
    } = this.state;
    return (
      <Page>
        {/* Keperluan Autentifikasi */}
        {/* {this.renderRedirect()} */}
        <Card>
          <CardBody>
            <Row className="align-items-center">
              <Col xs="12">
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="radio1" /> Floor
                  </Label>
                  <Label check style={{ marginLeft: '50px' }}>
                    <Input type="radio" name="radio1" /> Apotik
                  </Label>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col xs="4" className="d-flex justify-content-center">
                <Input
                  id="searchInputNIP"
                  style={{ width: '100%' }}
                  maxLength={7}
                  valid={this.state.ValidSearchNIP}
                  invalid={this.state.invalidSearchNIP}
                  autoFocus={true}
                  onKeyPress={e => this.handleKeyPress(e, true)}
                ></Input>
              </Col>

              <Button disabled={this.state.btnSearchIsDisabled}>CARI</Button>
            </Row>

            <Table striped style={{ marginTop: '16px' }}>
              <thead>
                <tr style={{ textAlign: 'center' }}>
                  <th style={{ width: '15%' }}>No. Receive</th>
                  <th style={{ width: '15%' }}>Tanggal Receive</th>
                  <th style={{ width: '15%' }}>Comco Pengirim</th>
                  <th style={{ width: '20%' }}>Outlet Pengirim</th>
                  <th style={{ width: '15%' }}>No. Transfer</th>
                  <th style={{ width: '10%' }}>Delete</th>
                  <th style={{ width: '10%' }}>Print</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ textAlign: 'center' }}>
                  <th scope="row">
                    <a href="">286726</a>
                  </th>
                  <td>01 Nov 2019</td>
                  <td>9K</td>
                  <td>Generik Pengayoman</td>
                  <td>000000240</td>
                  <td>NO</td>
                  <td>YES</td>
                </tr>
                <tr style={{ textAlign: 'center' }}>
                  <th scope="row">
                    <a href="">286826</a>
                  </th>
                  <td>01 Nov 2019</td>
                  <td>9K</td>
                  <td>Generik Sudimara Timur</td>
                  <td>000000028</td>
                  <td>NO</td>
                  <td>YES</td>
                </tr>
              </tbody>
            </Table>

            <Button
              onClick={() =>
                (window.location.href = '/ReturToGudangAddTransfer')
              }
            >
              New Transfer In
            </Button>

            <div>
              <Form
                inline
                className="cr-search-form"
                onSubmit={e => e.preventDefault()}
                style={{
                  textAlign: 'center',
                  justifyContent: 'center',
                  marginTop: '50px',
                  display: this.state.pagination,
                }}
              >
                <Button>{'<<'}</Button>

                <Button>{'<'}</Button>

                <Button disabled>
                  {this.state.page} / {this.state.maxPage}
                </Button>

                <Button>{'>'}</Button>

                <Button>{'>>'}</Button>
              </Form>
            </div>
          </CardBody>
        </Card>
      </Page>
    );
  }
}
export default ReturToGudang;
