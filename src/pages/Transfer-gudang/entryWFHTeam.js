import Page from 'components/Page';
import React from 'react'
import {
    Table, Label, Input, Form, FormFeedback, Card, CardHeader, CardBody,
    ButtonDropdown, DropdownMenu, DropdownToggle, DropdownItem, Button, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { MdEdit } from 'react-icons/md'
import Axios from 'axios';
import { base_url_all } from 'pages/urlLink';

class EntryTeam extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            btnSearchTypeIsOpen: false,
            btnModalSearchTypeIsOpen: false,
            btnPaginationAmountIsOpen: false,
            modalSearchType: 'NIP',
            searchType: 'Tampilkan Semua',
            openedModalType: 'none',
            searchDefault: true,
            searchByNIP: false,
            searchByDept: false,

            paginationAmount: 'Jumlah Data',
            defaultpagination: true,
            paginationMed: false,
            paginationMax: false,

            modalAddIsOpen: false,
            modalConfirmationIsOpen: false,
            responseModalIsOpen: false,
            modalEditIsOpen: false,
            confModalHeader: '',

            inputSearchNIPHome: '',
            inputSearchNIPModal: '',
            inputSearchPTHome: '',
            inputSearchPTModal: '',
            inputSearchDeptHome: '',
            inputSearchDeptModal: '',
            inputNIP: '',
            inputNama: '',
            inputPT: '',
            inputDept: '',
            inputJumlahKerja: 0,
            prevJumlahKerja: 0,
            invalidSearchHome: false,
            ValidSearchHome: false,
            invalidSearchModal: false,
            validSearchModal: false,
            invalidJumlahKerja: false,
            validJumlahKerja: false,

            btnSearchHomeIsDisabled: true,
            btnSearchModalIsDisabled: true,
            btnTambahModalIsDisabled: true,
            fieldJumlahKerjaModalIsDisabled: true,
            btnEditModalIsDisabled: true,

            ResponseModalHeader: '',
            ResponseModalMessage: '',

            result: [],
            resultModal: [],
            resultPT: [],
            resultDept: [],
            resultTeam: [],
            selectedSubNIP: '',
            selectedSubCDSBArea: '',
            selectedTeamName: '',
            page: 1,
            maxPage: 1,
            length: 10,
            pagination: 'block',
            noDataMessageHome: 'none',
            noDataFoundHome: 'none',
            noDataMessageModal: 'none',
            noDataFoundModal: 'none',

            optionDefaultPT: '== PILIH PT ==',
            optionDefaultDept: '== PILIH PT DAHULU ==',
            PTselected: false,
            selectedPTId: 0,
            selectedDept: 0,
            token: window.localStorage.getItem('tokenLogin')
        }
    }

    componentDidMount() {
        this.getAllDataTeam()
        this.getTeamList()
    }

    getTeamList = () => {
        const url = base_url_all + 'masterwfh-team'
        Axios
            .get(url, {
                headers: {
                    Authorization: this.state.token
                }
            })
            .then((res) => {
                if (res.data.data !== null) {
                    this.setState({
                        result: res.data.data
                    })
                }
            })
    }

    getAllDataTeam = () => {
        const url = base_url_all + 'masterwfh-team?type=header'
        Axios
            .get(url, {
                headers: {
                    Authorization: this.state.token
                }
            })
            .then((res) => {
                if (res.data.data) {
                    this.setState({
                        resultTeam: res.data.data
                    })
                }
            })
    }

    getTeamMemberDetail = () => {
        const url = base_url_all + 'masterwfh-team?subNIP=' + this.state.selectedSubNIP
        Axios
            .get(url, {
                headers: {
                    Authorization: this.state.token
                }
            })
            .then((res) => {
                if (res.data.data) {
                    this.setState({
                        resultModal: res.data.data,
                        fieldJumlahKerjaModalIsDisabled: !this.state.fieldJumlahKerjaModalIsDisabled
                    })
                } else if (res.data.error.status === true) {
                    this.setState({
                        noDataMessageModal: 'block',
                        noDataFoundModal: 'none',
                        resultModal: []
                    })
                } else if (res.data.data === null) {
                    this.setState({
                        noDataMessageModal: 'none',
                        noDataFoundModal: 'block',
                        resultModal: []
                    })
                }
            })
    }

    addTeamWFH = () => {
        const url = base_url_all + 'auto-assigner-wfh/masterwfh-team'
        Axios
            .post(url, {
                sub_cdsbarea: this.state.selectedSubCDSBArea,
                hk_masuk_perminggu: parseInt(this.state.inputJumlahKerja),
                skema_khususyn: "N",
                skema_khususid: 0
            }, {
                headers: {
                    Authorization: this.state.token
                }
            })
            .then((res) => {
                if (res.data.error.status === false) {
                    this.setState({
                        ResponseModalHeader: 'Success',
                        ResponseModalMessage: 'Berhasil Menambahkan Data'
                    }, () => this.toggleAllModal("Add"))
                } else if (res.data.error.status === true) {
                    this.setState({
                        ResponseModalHeader: 'Failed',
                        ResponseModalMessage: 'Gagal Menambahkan Data'
                    }, () => this.toggleAllModal("Add"))
                }
            })
        this.getTeamList()
    }

    // getAllDataKaryawan = () =>{
    //     const url = (base_url_all+'entry?page='+this.state.page+'&length='+this.state.length)
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
    //                 noDataMessageHome:'none',
    //                 noDataFoundHome:'none',
    //                 maxPage:res.data.metadata.last_page
    //             })
    //         }else if(res.data.error.status === true){
    //             this.setState({
    //                 noDataMessageHome:'block',
    //                 noDataFoundHome:'none',
    //                 result:[]
    //             })
    //         }else if(res.data.data === null){
    //             this.setState({
    //                 noDataFoundHome:'block',
    //                 noDataMessageHome:'none',
    //                 result:[]
    //             })
    //         }
    //     })
    // }

    getAllDataPT = () => {
        const url = base_url_all + 'karyawan?type=pt'
        Axios.get(url, {
            headers: {
                Authorization: this.state.token
            }
        })
            .then((res) => {
                if (res.data.data !== null) {
                    this.setState({
                        resultPT: res.data.data,
                        optionDefaultPT: "== PILIH PT =="
                    })
                } else if (res.data.error.status === true) {
                    this.setState({
                        optionDefaultPT: 'Error ! Refresh Browser',
                        resultPT: []
                    })
                }
            })
    }

    getAllDataDeptbyPTId = () => {
        const url = base_url_all + 'karyawan?pt=' + this.state.selectedPTId + '&type=dept'
        Axios
            .get(url, {
                headers: {
                    Authorization: this.state.token
                }
            })
            .then((res) => {
                if (res.data.data) {
                    this.setState({
                        resultDept: res.data.data,
                        optionDefaultDept: '== PILIH DEPT =='
                    })
                } else if (res.data.error.status === true) {
                    this.setState({
                        optionDefaultDept: 'Error ! Refresh Browser',
                        resultDept: []
                    })
                }
            })
    }


    handleSearchType = () => {
        if (this.state.searchType === "NIP") {
            this.searchKaryawanByNIP()
        } else if (this.state.searchType === "Departemen") {
            this.searchKaryawanByDept()
        }
    }

    searchKaryawanByNIP = () => {
        const url = base_url_all + 'entry?NIP=' + this.state.inputSearchNIPHome
        Axios
            .get(url, {
                headers: {
                    Authorization: this.state.token
                }
            })
            .then((res) => {
                if (res.data.data) {
                    this.setState({
                        result: [res.data.data],
                        noDataFoundHome: 'none',
                        noDataMessageHome: 'none'
                    })
                } else if (res.data.data === null) {
                    this.setState({
                        noDataFoundHome: 'block',
                        noDataMessageHome: 'none',
                        result: []
                    })
                } else if (res.data.error.status === true) {
                    this.setState({
                        noDataMessageHome: 'none',
                        noDataFoundHome: 'block',
                        result: []
                    })
                }
            })
    }

    searchKaryawanByDept = () => {
        const url = base_url_all + 'masterwfh-team?dept=' + this.state.selectedDept
        Axios
            .get(url, {
                headers: {
                    Authorization: this.state.token
                }
            })
            .then((res) => {
                if (res.data.data) {
                    this.setState({
                        result: res.data.data,
                        noDataMessageHome: 'none',
                        noDataFoundHome: 'none'
                    })
                } else if (res.data.data === null) {
                    this.setState({
                        noDataMessageHome: 'none',
                        noDataFoundHome: 'block',
                        result: []
                    })
                }
            })
    }

    // searchKaryawanToAddByNIP = () =>{
    //     const url = (base_url_all+'karyawan?NIP='+this.state.inputSearchNIPModal)
    //     Axios
    //     .get(url,{
    //         headers:{
    //             Authorization:this.state.token
    //         }
    //     })
    //     .then((res)=>{
    //         if(res.data.data){
    //             this.setState({
    //                 resultModal:[res.data.data],
    //                 noDataFoundModal:'none',
    //                 noDataMessageModal:'none'
    //             },()=>this.setState({
    //                 fieldJumlahKerjaModalIsDisabled:!this.state.fieldJumlahKerjaModalIsDisabled
    //             }))
    //         }else if(res.data.error.status === true){
    //             this.setState({
    //                 noDataFoundModal:'none',
    //                 noDataMessageModal:'block',
    //                 resultModal:[]
    //             })
    //         }else if(res.data.data === null){
    //             this.setState({
    //                 noDataFoundModal:'block',
    //                 noDataMessageModal:'none',
    //                 resultModal:[]
    //             })
    //         }
    //     })
    // }

    // addKaryawanWFH = () =>{
    //     const url= (base_url_all+'store')
    //     Axios
    //     .post(url,{
    //         nip:this.state.inputNIP,
    //         hk_masuk_perminggu:parseInt(this.state.inputJumlahKerja)
    //     },{
    //         headers:{
    //             Authorization:this.state.token
    //         }
    //     })
    //     .then((res)=>{
    //         if(res.data.error.status === false){
    //             this.setState({
    //                 ResponseModalHeader:'Success',
    //                 ResponseModalMessage:'Berhasil Menambahkan Data'
    //             },()=>this.toggleAllModal("Add"))
    //         }else if(res.data.error.status === true){
    //             this.setState({
    //                 ResponseModalHeader:'Failed',
    //                 ResponseModalMessage:'Gagal Menambahkan Data'
    //             },()=>this.toggleAllModal("Add"))
    //         }
    //         this.getAllDataKaryawan()
    //     })

    // }

    // editKaryawanWFH = () =>{
    //     const url= base_url_all+'update?NIP='+this.state.inputNIP
    //     Axios
    //     .put(url,{
    //         nip:this.state.inputNIP,
    //         hk_masuk_perminggu:parseInt(this.state.inputJumlahKerja)
    //     },{
    //         headers:{
    //             Authorization:this.state.token
    //         }
    //     })
    //     .then((res)=>{
    //         if(res.data.error.status === false){
    //             this.setState({
    //                 ResponseModalHeader:'Success',
    //                 ResponseModalMessage:'Berhasil Menambahkan Data'
    //             },()=>this.toggleAllModal("Edit"))
    //         }else if(res.data.error.status === true){
    //             this.setState({
    //                 ResponseModalHeader:'Failed',
    //                 ResponseModalMessage:'Gagal Menambahkan Data'
    //             },()=>this.toggleAllModal("Edit"))
    //         }
    //         this.getAllDataKaryawan()
    //     })
    // }

    actionHandler = () => {
        if (this.state.openedModalType === 'Add') {
            this.addTeamWFH()
        } else if (this.state.openedModalType === 'Edit') {
            this.editKaryawanWFH()
        }
    }

    toggleSearchButton = (type) => {
        if (type === "Modal") {
            this.setState({
                btnModalSearchTypeIsOpen: !this.state.btnModalSearchTypeIsOpen
            })
        } else {
            this.setState({
                btnSearchTypeIsOpen: !this.state.btnSearchTypeIsOpen
            })
        }
    }

    togglePaginationAmount = () => {
        this.setState({
            btnPaginationAmountIsOpen: !this.state.btnPaginationAmountIsOpen
        })
    }


    handleSearchHome = (type) => {
        if (type === "Departemen") {
            this.setState({
                searchType: 'Departemen',
                searchByDept: true,
                searchDefault: false,
                searchByNIP: false,
                btnSearchHomeIsDisabled: true,
                inputSearchNIPHome: '',
                selectedPTId: 0,
                selectedDept: 0,
                optionDefaultDept: '== PILIH PT DAHULU ==',
                resultDept: [],
                resultPT: [],
                PTselected: false,
                page: 1
            }, () => this.getAllDataPT())
        } else if (type === "NIP") {
            this.setState({
                searchType: 'NIP',
                searchByNIP: true,
                searchByDept: false,
                searchDefault: false,
                btnSearchHomeIsDisabled: true,
                inputSearchNIPHome: '',
                selectedPTId: 0,
                selectedDept: 0,
                optionDefaultDept: '== PILIH PT DAHULU ==',
                resultDept: [],
                resultPT: [],
                PTselected: false,
                page: 1
            })
        } else if (type === "default") {
            this.setState({
                searchType: 'Tampilkan Semua',
                searchDefault: true,
                searchByNIP: false,
                searchByDept: false,
                btnSearchHomeIsDisabled: true,
                inputSearchNIPHome: '',
                selectedPTId: 0,
                selectedDept: 0,
                optionDefaultDept: '== PILIH PT DAHULU ==',
                resultDept: [],
                resultPT: [],
                PTselected: false,
                page: 1
            }, () => this.getTeamList())
        }
    }

    handlePagination = (type) => {
        if (type === "med") {
            this.setState({
                paginationAmount: "25",
                length: 25,
                defaultpagination: false,
                paginationMed: true,
                paginationMax: false
            }, () => this.handlePaginationForEachSearch())
        } else if (type === "max") {
            this.setState({
                paginationAmount: "50",
                length: 50,
                defaultpagination: false,
                paginationMed: false,
                paginationMax: true
            }, () => this.handlePaginationForEachSearch())
        } else if (type === "default") {
            this.setState({
                paginationAmount: "10",
                length: 10,
                defaultpagination: true,
                paginationMed: false,
                paginationMax: false
            }, () => this.handlePaginationForEachSearch())
        }
    }

    handlePaginationForEachSearch = () => {
        if (this.state.searchType === 'NIP') {
            this.searchKaryawanByNIP()
        } else if (this.state.searchType === 'Departemen') {
            this.searchKaryawanByDept()
        } else if (this.state.searchType === 'Tampilkan Semua') {
            this.getAllDataKaryawan()
        }
    }

    handleChange = (type, event) => {
        var regVal = /[^A-Za-z0-9]/g
        if (type === "inputSearchNIPHome") {
            if (event.target.value.trim().length <= 0 || regVal.test(event.target.value) || event.target.value.length < 6) {
                this.setState({
                    invalidSearchHome: true,
                    btnSearchHomeIsDisabled: true,
                    ValidSearchHome: false
                })
            } else {
                this.setState({
                    inputSearchNIPHome: event.target.value.toUpperCase(),
                    ValidSearchHome: true,
                    invalidSearchHome: false,
                    btnSearchHomeIsDisabled: false
                })
            }
        } else if (type === "inputSearchNIPModal") {
            if (event.target.value.trim().length <= 0 || regVal.test(event.target.value) || event.target.value.length < 6) {
                this.setState({
                    invalidSearchModal: true,
                    btnSearchModalIsDisabled: true,
                    validSearchModal: false
                })
            } else {
                this.setState({
                    inputSearchNIPModal: event.target.value.toUpperCase(),
                    validSearchModal: true,
                    invalidSearchModal: false,
                    btnSearchModalIsDisabled: false
                })
            }
        } else if (type === "inputJumlahKerja") {
            if (event.target.value < 0 || event.target.value > 5) {
                this.setState({
                    invalidJumlahKerja: true,
                    validJumlahKerja: false,
                    btnTambahModalIsDisabled: true
                })
            } else {
                this.setState({
                    invalidJumlahKerja: false,
                    validJumlahKerja: true,
                    btnTambahModalIsDisabled: false,
                    inputJumlahKerja: event.target.value
                })
            }
        } else if (type === "editJumlahKerja") {
            if (!isNaN(parseInt(event.target.value))) {
                this.setState({
                    inputJumlahKerja: parseInt(event.target.value)
                }, () => this.validateJumlahKerja())
            } else if (isNaN(parseInt(event.target.value))) {
                this.setState({
                    inputJumlahKerja: 0
                }, () => this.validateJumlahKerja())
            }
        }
    }

    validateJumlahKerja = () => {
        if (this.state.inputJumlahKerja < 2 || this.state.inputJumlahKerja > 6
            || this.state.inputJumlahKerja === this.state.prevJumlahKerja) {
            this.setState({
                invalidJumlahKerja: true,
                validJumlahKerja: false,
                btnEditModalIsDisabled: true,
            })
        } else {
            this.setState({
                invalidJumlahKerja: false,
                validJumlahKerja: true,
                btnEditModalIsDisabled: false
            })
        }
    }

    handleSelect = (type, event) => {
        if (type === "PT") {
            if (event.target.value !== '== PILIH PT ==' && event.target.value !== 'Error ! Refresh Browser') {
                if (this.state.selectedPTId !== 0 && event.target.value !== this.state.selectedPTId) {
                    this.setState({
                        optionDefaultDept: '== PILIH DEPT ==',
                        resultDept: [],
                        btnSearchHomeIsDisabled: true,
                        selectedPTId: event.target.value
                    }, () => this.getAllDataDeptbyPTId())
                } else if (this.state.selectedPTId === 0) {
                    this.setState({
                        PTselected: true,
                        optionDefaultDept: '== PILIH DEPT ==',
                        selectedPTId: event.target.value
                    }, () => this.getAllDataDeptbyPTId())
                }
            } else if (event.target.value === "== PILIH PT ==" || event.target.value === "'Error ! Refresh Browser'") {
                this.setState({
                    PTselected: false,
                    optionDefaultDept: '== PILIH PT Dahulu ==',
                    btnSearchHomeIsDisabled: true,
                    resultDept: []
                })
            }
        } else if (type === "Dept") {
            if (event.target.value !== "== PILIH DEPT ==" && event.target.value !== 'Error ! Refresh Browser') {
                this.setState({
                    selectedDept: event.target.value,
                    btnSearchHomeIsDisabled: false
                })
            } else if (event.target.value === "== PILIH Dept ==" && event.target.value === 'Error ! Refresh Browser') {
                this.setState({
                    btnSearchHomeIsDisabled: true
                })
            }
        } else if (type === "Team") {
            if (event.target.value !== "== PILIH TEAM ==") {
                this.setState({
                    selectedSubNIP: event.target.value.substring(0, 7),
                    selectedSubCDSBArea: event.target.value.substring(8, 12),
                    selectedTeamName: event.target.value.substring(13, event.target.value.length),
                    btnSearchModalIsDisabled: false,
                }, () => this.getTeamMemberDetail())
            } else if (event.target.value === "== PILIH TEAM ==") {
                this.setState({
                    btnSearchModalIsDisabled: true
                })
            }
        }
    }

    firstPage = () => {
        this.setState({
            page: 1
        }, () => this.handlePaginationForEachSearch())
    }

    nextPage = () => {
        if (this.state.page < this.state.maxPage) {
            this.setState({
                page: this.state.page + 1
            }, () => this.handlePaginationForEachSearch())
        }
    }

    previousPage = (type) => {
        if (this.state.page > 1) {
            this.setState({
                page: this.state.page - 1
            }, () => this.handlePaginationForEachSearch())
        }
    }

    lastPage = (type) => {
        this.setState({
            page: this.state.maxPage
        }, () => this.handlePaginationForEachSearch())
    }

    toggleAllModal = (type) => {
        if (type === "Add") {
            this.toggleAddModal()
            this.toggleConfirmationModal()
            this.toggleResponseModal()
        }
        else if (type === "Edit") {
            this.toggleEditModal()
            this.toggleConfirmationModal()
            this.toggleResponseModal()
        }
    }

    toggleAddModal = () => {
        this.setState({
            modalAddIsOpen: !this.state.modalAddIsOpen,
            invalidSearchModal: false,
            validSearchModal: false,
            inputSearchNIPModal: '',
            btnSearchModalIsDisabled: true,
            paginationModal: 'none',
            fieldJumlahKerjaModalIsDisabled: true,
            inputNIP: '',
            inputNama: '',
            inputPT: '',
            inputDept: '',
            inputJumlahKerja: 0,
            invalidJumlahKerja: false,
            validJumlahKerja: false,
            resultModal: [],
            openedModalType: 'Add',
            confModalHeader: 'Apakah Anda Yakin Dengan Penambahan Data Ini ?'
        })
    }

    toggleEditModal = () => {
        this.setState({
            modalEditIsOpen: !this.state.modalEditIsOpen,
            inputNIP: '',
            inputNama: '',
            inputPT: '',
            inputDept: '',
            inputJumlahKerja: 0,
            prevJumlahKerja: 0,
            invalidJumlahKerja: false,
            validJumlahKerja: false,
            openedModalType: 'none',
            btnEditModalIsDisabled: true
        })
    }

    openEditModalwithItemID = (data) => {
        this.setState({
            modalEditIsOpen: true,
            inputNIP: data.nip,
            inputNama: data.nama,
            inputPT: data.pt,
            inputDept: data.departemen,
            inputJumlahKerja: data.hk_masuk_perminggu,
            prevJumlahKerja: data.hk_masuk_perminggu,
            invalidJumlahKerja: false,
            validJumlahKerja: false,
            openedModalType: 'Edit',
            confModalHeader: 'Apakah Anda Yakin Dengan Perubahan Data Ini ?'
        })
    }

    toggleConfirmationModal = () => {
        this.setState({
            modalConfirmationIsOpen: !this.state.modalConfirmationIsOpen,
        })
    }

    openConfirmationModal = () => {
        if (this.state.openedModalType === "Add") {
            this.setState({
                modalConfirmationIsOpen: true
            })
        } else if (this.state.openedModalType === "Edit") {
            this.setState({
                modalConfirmationIsOpen: true
            })
        }
    }

    toggleResponseModal = () => {
        this.setState({
            responseModalIsOpen: !this.state.responseModalIsOpen,
            inputNIP: '',
            inputNama: '',
            inputpt: '',
            inputDept: '',
            inputJumlahKerja: 0,
            prevJumlahKerja: 0,
            invalidJumlahKerja: false,
            validJumlahKerja: false,
        })
    }



    render() {
        const { btnSearchTypeIsOpen, btnModalSearchTypeIsOpen, btnPaginationAmountIsOpen,
            searchType, modalSearchType, paginationAmount, resultTeam,
            result, resultModal, resultPT, resultDept, ResponseModalHeader, ResponseModalMessage } = this.state
        return (
            <Page
                title="Entry Team WFH"
                breadcrumbs={[{ name: 'Entry Team WFH', active: true }]}
                className="entryTeam"
            >
                <Card>
                    <CardHeader>
                        <ButtonDropdown isOpen={false} toggle={() => this.togglePaginationAmount()} style={{ float: 'left', marginBottom: '1%', marginRight: '1%' }}>
                            <DropdownToggle caret>
                                {paginationAmount}
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem hidden={this.state.paginationMed} onClick={(e) => this.handlePagination("med")}>25</DropdownItem>
                                <DropdownItem hidden={this.state.paginationMax} onClick={(e) => this.handlePagination("max")}>50</DropdownItem>
                                <DropdownItem hidden={this.state.defaultpagination} onClick={(e) => this.handlePagination("default")}>Default</DropdownItem>
                            </DropdownMenu>
                        </ButtonDropdown>
                        <Button style={{ float: 'right', width: '10%' }} onClick={() => this.toggleAddModal()}> TAMBAH </Button>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col xs={2} md={2}>
                                <ButtonDropdown isOpen={btnSearchTypeIsOpen} toggle={() => this.toggleSearchButton()} style={{ float: 'left', marginBottom: '1%', marginRight: '1%' }}>
                                    <DropdownToggle caret>
                                        {searchType}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem hidden={this.state.searchDefault} onClick={(e) => this.handleSearchHome("default")}>Tampilkan Semua</DropdownItem>
                                        <DropdownItem hidden={this.state.searchByDept} onClick={(e) => this.handleSearchHome("Departemen")}>Departemen</DropdownItem>
                                        <DropdownItem hidden={true} onClick={(e) => this.handleSearchHome("NIP")}>NIP</DropdownItem>
                                    </DropdownMenu>
                                </ButtonDropdown>
                            </Col>
                            <Col xs={8} style={{ alignItems: 'center' }}>
                                {searchType === "NIP" && <Input
                                    style={{ width: '100%' }}
                                    onChange={(e) => this.handleChange("inputSearchNIPHome", e)}
                                    maxLength={7}
                                    valid={this.state.ValidSearchHome}
                                    invalid={this.state.invalidSearchHome}
                                >
                                </Input>}
                                {this.state.invalidSearchHome && <FormFeedback>
                                    NIP merupakan alphanum sepanjang 7 karakter dan tidak boleh mengandung spasi atau karakter spesial
                            </FormFeedback>}

                                {searchType === "Departemen" &&
                                    <span style={{ float: 'left', fontSize: '1.2em', paddingTop: '5px', marginRight: '2%' }}>PT.</span>}
                                {searchType === "Departemen" &&
                                    <select className='custom-select' style={{ width: '35%', float: 'left' }} onChange={(e) => this.handleSelect("PT", e)}>
                                        <option>{this.state.optionDefaultPT}</option>
                                        {resultPT && resultPT.map((PT) =>
                                            <option value={PT.pt_id}>{PT.pt}</option>
                                        )}
                                    </select>}
                                {searchType === "Departemen" &&
                                    <span style={{ float: 'left', fontSize: '1.2em', paddingTop: '5px', marginRight: '6%', marginLeft: '8%' }}>|</span>}
                                {searchType === "Departemen" &&
                                    <span style={{ float: 'left', fontSize: '1.2em', paddingTop: '5px', marginRight: '2%' }}>DEPT.</span>}
                                {searchType === "Departemen" &&
                                    <select disabled={!this.state.PTselected} className='custom-select' style={{ width: '35%', float: 'right' }} onChange={(e) => this.handleSelect("Dept", e)}>
                                        <option>{this.state.optionDefaultDept}</option>
                                        {resultDept && resultDept.map((DEPT) =>
                                            <option value={DEPT.kd_dept}>{DEPT.departemen}</option>
                                        )}
                                    </select>}
                            </Col>
                            <Col xs={2} md={2}>
                                <Button size="md" style={{ float: 'right', width: '68%' }}
                                    disabled={this.state.btnSearchHomeIsDisabled}
                                    onClick={() => this.handleSearchType()}>
                                    CARI
                            </Button>
                            </Col>
                        </Row>

                        <Table responsive>
                            <thead>
                                <tr>
                                    <th style={{ width: '25%', textAlign: 'left' }}>
                                        Team
                                    </th>
                                    <th style={{ width: '15%', textAlign: 'left' }}>
                                        Sub NIP
                                    </th>
                                    <th style={{ width: '25%', textAlign: 'left' }}>
                                        Sub Nama SPV
                                    </th>
                                    <th style={{ width: '10%', textAlign: 'left' }}>
                                        Hari Kerja Per Minggu
                                    </th>
                                    <th style={{ width: '10%', textAlign: 'center' }}>
                                        Skema Khusus
                                    </th>
                                    {/* <th style={{width:'15%' , textAlign:'center'}}>
                                        Action
                                    </th> */}
                                </tr>
                            </thead>
                            <tbody>
                                {result && result.map((emp) =>
                                    <tr key={emp.nip}>
                                        <td style={{ width: '10%', textAlign: 'left' }}>{emp.sub_nmsbarea}</td>
                                        <td style={{ width: '20%', textAlign: 'left' }}>{emp.sub_nip}</td>
                                        <td style={{ width: '20%', textAlign: 'left' }}>{emp.sub_namaspv}</td>
                                        <td style={{ width: '25%', textAlign: 'left' }}>{emp.hk_masuk_perminggu}</td>
                                        <td style={{ width: '10%', textAlign: 'center' }}>{emp.skema_khususyn}</td>
                                        {/* <td style={{width:'15%', textAlign:'center'}}>
                                        <Button onClick={()=>this.openEditModalwithItemID(emp)}>
                                            <MdEdit></MdEdit>
                                        </Button>
                                    </td> */}
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <p style={{ textAlign: 'center', display: this.state.noDataMessageHome }}>Tidak Ada Data</p>
                        <p style={{ textAlign: 'center', display: this.state.noDataFoundHome }}>Data Tidak Ditemukan</p>

                        <div>
                            <Form
                                inline
                                className="cr-search-form"
                                onSubmit={e => e.preventDefault()}
                                style={{
                                    textAlign: "center",
                                    justifyContent: "center",
                                    display: this.state.pagination,
                                }}>

                                <Button
                                    color={"dark"}
                                    onClick={() => this.firstPage()}
                                >
                                    {"<<"}
                                </Button>

                                <Button
                                    color={"dark"}
                                    onClick={() => this.previousPage()}
                                >
                                    {"<"}
                                </Button>

                                <Button
                                    disabled
                                    color={"dark"}
                                >
                                    {this.state.page} / {this.state.maxPage}
                                </Button>

                                <Button
                                    color={"dark"}
                                    onClick={() => this.nextPage()}
                                >
                                    {">"}
                                </Button>

                                <Button
                                    color={"dark"}
                                    onClick={() => this.lastPage()}
                                >
                                    {">>"}
                                </Button>
                            </Form>
                        </div>
                    </CardBody>
                </Card>

                {/* Add Modal */}
                <Modal isOpen={this.state.modalAddIsOpen} size='lg'>
                    <ModalHeader toggle={() => this.toggleAddModal()}>
                        INPUT HARI KERJA TEAM
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col xs={2} md={2}>
                                <Label style={{ marginTop: '5%' }}><h5>Team</h5></Label>
                            </Col>
                            <Col xs={8} style={{ alignItems: 'center' }}>
                                <select className="custom-select" onChange={(e) => this.handleSelect("Team", e)}>
                                    <option>== PILIH TEAM ==</option>
                                    {resultTeam && resultTeam.map((rt) =>
                                        <option value={[rt.sub_nip, rt.sub_cdsbarea, rt.sub_nmsbarea]}>{rt.sub_nmsbarea}</option>
                                    )}
                                </select>
                            </Col>
                        </Row>

                        <Table style={{ marginTop: '2%' }}>
                            <thead>
                                <th style={{ textAlign: 'left' }}>NIP</th>
                                <th style={{ textAlign: 'left' }}>Nama</th>
                                <th style={{ textAlign: 'left' }}>PT</th>
                                <th style={{ textAlign: 'left' }}>Departemen</th>
                                <th style={{ textAlign: 'left' }}>Divisi</th>
                                <th style={{ textAlign: 'left' }}>Jabatan</th>
                            </thead>
                            <tbody>
                                {resultModal && resultModal.map((emp) =>
                                    <tr>
                                        <td style={{ textAlign: 'left' }}>{emp.grpt_nip}</td>
                                        <td style={{ textAlign: 'left' }}>{emp.grpt_namamr}</td>
                                        <td style={{ textAlign: 'left' }}>{emp.pt}</td>
                                        <td style={{ textAlign: 'left' }}>{emp.departemen}</td>
                                        <td style={{ textAlign: 'left' }}>{emp.divisi}</td>
                                        <td style={{ textAlign: 'left' }}>{emp.jabatan}</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                        <p style={{ textAlign: 'center', display: this.state.noDataMessageModal }}>Tidak Ada Data</p>
                        <p style={{ textAlign: 'center', display: this.state.noDataFoundModal }}>Data Tidak Ditemukan</p>
                        <br />
                        <Label style={{ fontSize: '20px' }}>Jumlah Hari Kerja per Minggu</Label>
                        <Input
                            type='number'
                            style={{ width: '30%', float: 'right' }}
                            disabled={this.state.fieldJumlahKerjaModalIsDisabled}
                            onChange={(e) => this.handleChange("inputJumlahKerja", e)}
                            valid={this.state.validJumlahKerja}
                            invalid={this.state.invalidJumlahKerja}
                        >
                        </Input>
                        {this.state.invalidJumlahKerja && <FormFeedback>
                            Jumlah Kerja Minimal 0 Hari dan Maksimal 5 Hari
                        </FormFeedback>}
                    </ModalBody>
                    <ModalFooter style={{ justifyContent: 'center' }}>
                        <Button color="success"
                            disabled={this.state.btnTambahModalIsDisabled}
                            onClick={() => this.openConfirmationModal()}
                        >
                            TAMBAH
                        </Button>
                        <Button color="danger" onClick={() => this.toggleAddModal()}>CANCEL</Button>
                    </ModalFooter>
                </Modal>
                {/* Add Modal */}

                {/* Edit Modal */}
                <Modal isOpen={this.state.modalEditIsOpen}>
                    <ModalHeader toggle={() => this.toggleEditModal()}>Edit Karyawan</ModalHeader>
                    <ModalBody>
                        <Label>NIP</Label>
                        <Input disabled value={this.state.inputNIP}></Input>
                        <Label>Nama</Label>
                        <Input disabled value={this.state.inputNama}></Input>
                        <Label>PT</Label>
                        <Input disabled value={this.state.inputPT}></Input>
                        <Label>Departemen</Label>
                        <Input disabled value={this.state.inputDept}></Input>
                        <Label>Jumlah Hari Kerja</Label>
                        <Input
                            type='number'
                            value={this.state.inputJumlahKerja}
                            onChange={(e) => this.handleChange("editJumlahKerja", e)}
                            valid={this.state.validJumlahKerja}
                            invalid={this.state.invalidJumlahKerja}
                        ></Input>
                        {this.state.invalidJumlahKerja && <FormFeedback>
                            Jumlah Hari Kerja Minimum 0 Hari dan Maksimum 5 Hari Serta Harus Berbeda Dengan Jumlah Sebelumnya
                            </FormFeedback>}
                    </ModalBody>
                    <ModalFooter style={{ justifyContent: 'center' }}>
                        <Button
                            color='success'
                            disabled={this.state.btnEditModalIsDisabled}
                            onClick={() => this.openConfirmationModal(resultModal)}
                        >
                            Edit
                        </Button>
                        <Button color='danger' onClick={() => this.toggleEditModal()}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Modal>
                {/* Edit Modal */}

                {/* Confirmation Modal */}
                <Modal isOpen={this.state.modalConfirmationIsOpen} size='lg'>
                    <ModalHeader toggle={() => this.toggleConfirmationModal()}>{this.state.confModalHeader}</ModalHeader>
                    <ModalBody>
                        <Row style={{ marginBottom: '1%' }}>
                            <Col xs={3}> <Label>Team</Label></Col>
                            <Col><Input disabled value={this.state.selectedTeamName}></Input></Col>
                        </Row>
                        <Row>
                            <Table style={{ marginTop: '2%' }}>
                                <thead>
                                    <th style={{ textAlign: 'left' }}>NIP</th>
                                    <th style={{ textAlign: 'left' }}>Nama</th>
                                    <th style={{ textAlign: 'left' }}>PT</th>
                                    <th style={{ textAlign: 'left' }}>Departemen</th>
                                    <th style={{ textAlign: 'left' }}>Divisi</th>
                                    <th style={{ textAlign: 'left' }}>Jabatan</th>
                                </thead>
                                <tbody>
                                    {resultModal && resultModal.map((emp) =>
                                        <tr>
                                            <td style={{ textAlign: 'left' }}>{emp.grpt_nip}</td>
                                            <td style={{ textAlign: 'left' }}>{emp.grpt_namamr}</td>
                                            <td style={{ textAlign: 'left' }}>{emp.pt}</td>
                                            <td style={{ textAlign: 'left' }}>{emp.departemen}</td>
                                            <td style={{ textAlign: 'left' }}>{emp.divisi}</td>
                                            <td style={{ textAlign: 'left' }}>{emp.jabatan}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Row>
                        <Row style={{ marginBottom: '1%' }}>
                            <Col xs={3}><Label>Hari Kerja</Label></Col>
                            {
                                this.state.confModalHeader === 'Apakah Anda Yakin Dengan Perubahan Data Ini ?' &&
                                <Col xs={4} style={{ paddingRight: '0px' }}>
                                    <Input disabled
                                        value={this.state.prevJumlahKerja}
                                        style={{ width: '100%' }}
                                    >
                                    </Input>
                                </Col>
                            }
                            {
                                this.state.confModalHeader === 'Apakah Anda Yakin Dengan Perubahan Data Ini ?' &&
                                <Col xs={1} style={{ paddingLeft: '0px', paddingRight: '0px' }}>
                                    <p style={{
                                        marginTop: '1%',
                                        fontSize: '28px',
                                        textAlign: 'center',
                                    }}>
                                    </p>
                                </Col>
                            }
                            {
                                this.state.confModalHeader === 'Apakah Anda Yakin Dengan Perubahan Data Ini ?' &&
                                <Col xs={4} style={{ paddingLeft: '0px' }}>
                                    <Input disabled
                                        value={this.state.inputJumlahKerja}
                                        style={{ width: '100%' }}
                                    >
                                    </Input>
                                </Col>
                            }
                            {this.state.confModalHeader === 'Apakah Anda Yakin Dengan Penambahan Data Ini ?' &&
                                <Col>
                                    <Input disabled
                                        value={this.state.inputJumlahKerja}
                                    >
                                    </Input>
                                </Col>}
                        </Row>
                    </ModalBody>
                    <ModalFooter style={{ justifyContent: 'center' }}>
                        <Button color="success" onClick={() => this.actionHandler()}>Ya</Button>
                        <Button color="danger" onClick={() => this.toggleConfirmationModal()}>Tidak</Button>
                    </ModalFooter>
                </Modal>
                {/* Confirmation Modal */}

                {/* Response Modal */}
                <Modal isOpen={this.state.responseModalIsOpen}>
                    <ModalHeader toggle={() => this.toggleResponseModal()}>{ResponseModalHeader}</ModalHeader>
                    <ModalBody>{ResponseModalMessage}</ModalBody>
                    <ModalFooter>
                        <Button color="success" onClick={() => this.toggleResponseModal()}>
                            OK
                        </Button>
                    </ModalFooter>
                </Modal>
                {/* Response Modal */}
            </Page>
        )
    }

}
export default EntryTeam;