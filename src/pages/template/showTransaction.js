import Page from 'components/Page';
import React from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Input,
  Label,
  ButtonGroup,
  InputGroup,
  InputGroupAddon,
  Form,
  FormGroup,
  Badge,
  Tooltip,
} from 'reactstrap';
import {
  MdSearch,
  MdAutorenew,
  MdEdit,
  MdDelete,
  MdList,
  MdAdd,
} from 'react-icons/md';
import { MdLoyalty, MdRefresh } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from 'pages/urlLink.js';
import * as firebase from 'firebase/app';
import { Scrollbar } from 'react-scrollbars-custom';
import LoadingSpinner from 'pages/LoadingSpinner.js';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
class showTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultFarmer: [],
      resultUpja: [],
      currentPage: 1,
      currentPages: 1,
      realCurrentPage: 1,
      realCurrentPages: 1,
      todosPerPage: 5,
      todosPerPages: 5,
      maxPage: 1,
      maxPages: 1,
      flag: 0,
      keyword: '',
      keywordList: '',
      procod: '',
      loading: false,
      checked: false,
      barcode: '',
      newProductDesc: '',
      newProcode: '',
      enterButton: false,
      resultProvinsi: [],
      resultKotaKab: [],
      resultKecamatan: [],
      loadingPage: false,
      pilihType: '',
      pilihProvinsi: '',
      pilihKotaKab: '',
      pilihKecamatan: '',
      lastID: 0,
      namaPeriode: '',
      ecommerceID: '',
      action: '',
      typeDisabled: false,
      domisiliDisabled: true,
      periodeDisabled: true,
      dataAvailable: false,
      startDate: '',
      endDate: '',
      resetInfo: false,
      resultType: [
        {
          type_id: 'show_farmer',
          type_name: 'Farmer',
        },
        {
          type_id: 'show_upja',
          type_name: 'UPJA',
        },
      ],

      namaProvinsi2: [],
      idPelapak: [],
      pelapakDetail: [],
      ecommerceDetail: [],
      dynamicHeightEcommerce: '0px',
      dynamicHeightPelapak: '0px',
    };
  }

  //set Current Page
  paginationButton(event, flag, maxPage = 0) {
    var currPage = Number(event.target.value);
    if (currPage + flag > 0 && currPage + flag <= maxPage) {
      this.setState(
        {
          currentPage: currPage + flag,
          realCurrentPage: currPage + flag,
        },
        () => {
          this.getListbyPaging(
            this.state.currentPage,
            this.state.todosPerPage,
            this.state.keyword,
          );
        },
      );
    }
  }

  enterPressedSearch = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      // this.showNotification('Sedang Mencari data', 'info');
      event.preventDefault();
      this.setState(
        {
          currentPage: 1,
          realCurrentPage: 1,
        },
        () => {
          this.getListbyPaging(
            this.state.currentPage,
            this.state.todosPerPage,
            this.state.keyword,
          );
        },
      );
    }
  };

  showNotification = (currMessage, levelType) => {
    setTimeout(() => {
      if (!this.notificationSystem) {
        return;
      }
      this.notificationSystem.addNotification({
        title: <MdLoyalty />,
        message: currMessage,
        level: levelType,
      });
    }, 300);
  };

  saveDomisili() {
    this.setState({
      pilihProvinsi: this.state.pilihProvinsi,
      pilihKotaKab: this.state.pilihKotaKab,
      pilihKecamatan: this.state.pilihKecamatan,
      domisiliDisabled: true,
      typeDisabled: true,
      modal_nested_parent_list_domisili: false,
    });
  }

  getListbyPaging(currPage, currLimit) {
    // const trace = perf.trace('getBundling');
    var namaKecamatan = this.state.namaKecamatanSave;
    var showType = this.state.pilihType;
    var kecamatanID = this.state.pilihKecamatan;
    const url = myUrl.url_getAllData + showType + '?district_id=' + kecamatanID;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST', url);

    this.setState({ loading: true });
    // console.log("offset", offset, "currLimit", currLimit);

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
      },
    };
    // console.log('option', option);
    fetch(url, option)
      .then(response => {
        // trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          if (response.status === 401) {
            this.showNotification('Username/Password salah!', 'error');
          } else if (response.status === 500) {
            this.showNotification('Internal Server Error', 'error');
          } else {
            this.showNotification('Response ke server gagal!', 'error');
          }
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        var status = data.status;
        var result = data.result.farmers;
        var message = data.result.message;
        // console.log('data jalan GetlistByPaging', data);
        if (status === 0) {
          this.showNotification(message, 'error');
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
            result: result,
            loading: false,
          });
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loading: false,
        });
      });
  }

  // get data farmer
  getListbyPagingFarmer(currPage, currLimit) {
    var kecamatanID = this.state.pilihKecamatan;
    const url = myUrl.url_getAllData + 'show_farmer?district_id=' + kecamatanID;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST', url);

    this.setState({ loading: true });
    // console.log("offset", offset, "currLimit", currLimit);

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
      },
    };
    // console.log('option', option);
    fetch(url, option)
      .then(response => {
        // trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          if (response.status === 401) {
            this.showNotification('Username/Password salah!', 'error');
          } else if (response.status === 500) {
            this.showNotification('Internal Server Error', 'error');
          } else {
            this.showNotification('Response ke server gagal!', 'error');
          }
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        var status = data.status;
        var result = data.result.farmers;
        var message = data.result.message;
        // console.log('data jalan GetlistByPaging', data);
        // console.log('message GetlistByPaging', message);
        if (status === 0) {
          this.showNotification(message, 'error');
        } else {
          if (result.length === 0) {
            this.showNotification(
              `${'Data'} ${
                this.state.namaTypeSave
              } ${', '} ${this.state.namaProvinsiSave.toLowerCase()} ${'-'} ${this.state.namaKotaKabSave.toLowerCase()} ${'-'} ${this.state.namaKecamatanSave.toLowerCase()} ${', tidak ditemukan!'} `,
              'error',
            );
            this.setState({
              // resultFarmer: [{}],
              loading: false,
            });
          } else {
            this.showNotification('Data ditemukan!', 'info');
            this.setState({
              resultFarmer: result,
              loading: false,
            });
          }
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loading: false,
        });
      });
  }

  // get data Upja
  getListbyPagingUpja(currPage, currLimit) {
    // const trace = perf.trace('getBundling');
    var kecamatanID = this.state.pilihKecamatan;
    const url = myUrl.url_getAllData + 'show_upja?district_id=' + kecamatanID;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST', url);

    this.setState({ loading: true });
    // console.log("offset", offset, "currLimit", currLimit);

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
      },
    };
    // console.log('option', option);
    fetch(url, option)
      .then(response => {
        // trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          if (response.status === 401) {
            this.showNotification('Username/Password salah!', 'error');
          } else if (response.status === 500) {
            this.showNotification('Internal Server Error', 'error');
          } else {
            this.showNotification('Response ke server gagal!', 'error');
          }
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        var status = data.status;
        var result = data.result.upjas;
        var message = data.result.message;
        // console.log('data jalan GetlistByPaging', data);
        if (status === 0) {
          this.showNotification(message, 'error');
        } else {
          if (result.length === 0) {
            this.showNotification(
              `${'Data'} ${
                this.state.namaTypeSave
              } ${', '} ${this.state.namaProvinsiSave.toLowerCase()} ${'-'} ${this.state.namaKotaKabSave.toLowerCase()} ${'-'} ${this.state.namaKecamatanSave.toLowerCase()} ${', tidak ditemukan!'} `,
              'error',
            );
            this.setState({
              // resultUpja: [{}],
              loading: false,
            });
          } else {
            this.showNotification('Data ditemukan!', 'info');
            this.setState({
              resultUpja: result,
              loading: false,
            });
          }
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loading: false,
        });
      });
  }

  // Get Provinsi
  getProvinsi(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    const urlA = myUrl.url_getProvince;
    // console.log('jalan', urlA);
    this.setState({ loadingPage: true });
    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        // console.log('data Provinsi', data.result);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState({
            resultProvinsi: data.result.provinces,
            // maxPages: data.metadata.pages ? data.metadata.pages : 1,
            loading: false,
            loadingPage: false,
          });
        }
      });
  }
  // Get KotaKab
  getKotaKab(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    const urlA = myUrl.url_getCity + '?province_id=' + this.state.pilihProvinsi;
    // console.log('jalan kota', urlA);
    this.setState({ loadingPage: true });
    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        // console.log('data Kota/Kabupaten', data.result);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState({
            resultKotaKab: data.result.citys,
            // maxPages: data.metadata.pages ? data.metadata.pages : 1,
            loading: false,
            loadingPage: false,
          });
        }
      });
  }

  // Get Kecamatan
  getKecamatan(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    const urlA = myUrl.url_getDistrict + '?city_id=' + this.state.pilihKotaKab;
    // console.log('jalan kecamatan', urlA);
    this.setState({ loadingPage: true });
    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        // console.log('data Kecamatan', data.result);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState({
            resultKecamatan: data.result.districts,
            // maxPages: data.metadata.pages ? data.metadata.pages : 1,
            loading: false,
            loadingPage: false,
          });
        }
      });
  }

  componentDidMount() {
    var token = window.localStorage.getItem('tokenCookies');
    if (token === '' || token === null || token === undefined) {
      window.location.replace('/login');
    }
    this.getProvinsi(this.state.currentPages, this.state.todosPerPages);
  }

  // untuk pilih Provinsi
  setProvinsi = event => {
    var nama = this.state.resultProvinsi.find(function (element) {
      return element.id === parseInt(event.target.value);
    });

    this.setState(
      {
        pilihProvinsi: event.target.value,
        namaProvinsi: nama.name,
        modal_nested_parent_list_provinsi: false,
        keywordList: '',
        domisiliDisabled: false,
      },
      // () => console.log('PILIH PROVINSI', this.state.pilihProvinsi),
      () => this.getKotaKab(this.state.currentPages, this.state.todosPerPages),
    );
  };
  // untuk pilih Provinsi

  // untuk pilih Kota/Kabupaten
  setKotakab = event => {
    var nama = this.state.resultKotaKab.find(function (element) {
      return element.id === parseInt(event.target.value);
    });

    this.setState(
      {
        pilihKotaKab: event.target.value,
        namaKotaKab: nama.name,
        modal_nested_parent_list_kotakab: false,
        keywordList: '',
        domisiliDisabled: false,
      },
      () =>
        this.getKecamatan(this.state.currentPages, this.state.todosPerPages),
    );
  };
  // untuk pilih Kota/Kabupaten

  // untuk pilih Kecamatan
  setKecamatan = event => {
    var nama = this.state.resultKecamatan.find(function (element) {
      return element.id === parseInt(event.target.value);
    });

    this.setState(
      {
        pilihKecamatan: event.target.value,
        namaKecamatan: nama.name,
        modal_nested_parent_list_kecamatan: false,
        keywordList: '',
        domisiliDisabled: false,
      },
      () => this.getProvinsi(this.state.currentPages, this.state.todosPerPages),
    );
  };
  // untuk pilih Kecamatan

  // untuk pilih Type
  setType = event => {
    var nama = this.state.resultType.find(function (element) {
      return element.type_id === event.target.value;
    });
    this.setState(
      {
        pilihType: event.target.value,
        namaType: nama.type_name,
        namaTypeTemp: nama.type_name,
        modal_nested_parent_list: false,
        domisiliDisabled: false,
        pilihProvinsi: '',
        pilihKotaKab: '',
        pilihKecamatan: '',
      },
      // () => console.log('CEK CEK CEK', this.state.pilihType),
      // () =>
      // this.getListbyPaging(),
    );
  };

  //modal batas standar
  state = {
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    backdrop: true,
  };

  //modal batas per pelapak
  state = {
    modal_batasPerPelapak: false,
    modal_backdrop_batasPerPelapak: false,
    modal_nested_parent_batasPerPelapak: false,
    modal_nested_batasPerPelapak: false,
    backdrop_batasPerPelapak: true,
  };

  //modal Edit Batas per Pelapak
  state = {
    modal_editBatasPerPelapak: false,
    modal_backdrop_editBatasPerPelapak: false,
    modal_nested_parent_editBatasPerPelapak: false,
    modal_nested_editBatasPerPelapak: false,
    editBatasPerPelapak: {},
    tempEditBatasPerPelapak: {},
  };

  //modal Edit Massal
  state = {
    modal_editMassal: false,
    modal_backdrop_editMassal: false,
    modal_nested_parent_editMassal: false,
    modal_nested_editMassal: false,
    editDimen: {},
  };

  //modal Edit - edit Massal
  state = {
    modal_editMassal_edit: false,
    modal_backdrop_editMassal_edit: false,
    modal_nested_parent_editMassal_edit: false,
    modal_nested_editMassal_edit: false,
    editBatasBawah: {},
  };

  //modal Edit
  state = {
    modal_edit: false,
    modal_backdrop: false,
    modal_nested_parent_edit: false,
    modal_nested_edit: false,
    editDimen: {},
  };

  //modal delete
  state = {
    modal_delete: false,
    modal_backdrop: false,
    modal_nested_parent_delete: false,
    delete_data: {},
    modal_nested_delete: false,
  };

  //modal nonaktif
  state = {
    modal_nonaktif: false,
    modal_backdrop: false,
    modal_nested_parent_nonaktif: false,
    nonaktif_data: {},
    modal_nested_nonaktif: false,
  };

  //modal tambah Produk
  state = {
    modal_tambahProduk: false,
    modal_backdrop_tambahProduk: false,
    modal_nested_parent_tambahProduk: false,
    modal_nested_tambahProduk: false,
    backdrop_tambahProduk: true,
  };

  // KHUSUS STATE MODAL

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState(
        {
          modal: !this.state.modal,
          keywordList: '',
          realCurrentPages: 1,
          maxPages: 1,
          currentPages: 1,
          ecommerceIDtemp: this.state.ecommerceID,
        },
        // () => this.getProvinsi(1, this.state.todosPerPages),
      );
    }

    this.setState(
      {
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        keywordList: '',
        realCurrentPages: 1,
        maxPages: 1,
        currentPages: 1,
      },
      // () => this.getProvinsi(1, this.state.todosPerPages),
    );
  };

  handleCloseDomisili = () => {
    this.setState(
      {
        namaProvinsi: '',
        namaKotaKab: '',
        namaKecamatan: '',
        pilihProvinsi: '',
        pilihKotaKab: '',
        pilihKecamatan: '',
        modal_nested_parent_list_domisili: false,
      },
      // () =>
      //   console.log(
      //     'ISI SETELAH CLOSE',
      //     this.state.namaProvinsi,
      //     this.state.namaKotaKab,
      //     this.state.namaKecamatan,
      //   ),
    );
  };

  handleClose = () => {};

  SearchAllList() {
    const {
      pilihKecamatan,
      pilihKotaKab,
      pilihType,
      pilihProvinsi,
    } = this.state;
    return (
      pilihKecamatan !== '' &&
      pilihKotaKab !== '' &&
      pilihType !== '' &&
      pilihProvinsi !== ''
    );
  }

  findData() {
    // console.log('KLIK FIND DATA');
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = true;
    this.setState(
      {
        namaProvinsiSave: this.state.namaProvinsi,
        namaKotaKabSave: this.state.namaKotaKab,
        namaKecamatanSave: this.state.namaKecamatan,
        namaTypeSave: this.state.namaTypeTemp,
        domisiliDisabled: true,
        typeDisabled: false,
        periodeDisabled: true,
        lastID: 0,
        resultFarmer: [],
        resultUpja: [],
        resultKotaKab: [],
        resultKecamatan: [],
      },
      () =>
        this.setState(
          {
            namaProvinsi: '',
            namaKotaKab: '',
            namaKecamatan: '',
            namaType: '',
          },
          () => this.findUpjaFarmer(),
        ),
    );
  }

  findUpjaFarmer() {
    var show_type = this.state.pilihType;
    if (show_type === 'show_farmer') {
      this.getListbyPagingFarmer();
    } else {
      this.getListbyPagingUpja();
    }
  }

  resetSearch() {
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = true;
    this.setState({
      namaType: '',
      namaKotaKab: '',
      namaProvinsi: '',
      namaKecamatan: '',
      domisiliDisabled: true,
      typeDisabled: false,
    });
  }

  setModalType() {
    this.setState(
      {
        domisiliDisabled: true,
        // namaEcommerce: '',
      },
      this.toggle('nested_parent_list'),
    );
  }

  setModalDomisili() {
    this.setState(
      {
        periodeDisabled: false,
        typeDisabled: true,
        // namaEcommerce: '',
      },
      this.toggle('nested_parent_list_domisili'),
    );
  }

  setModalProvinsi() {
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = false;
    this.setState(
      {
        periodeDisabled: false,
        typeDisabled: true,
        // domisiliDisabled: true,
        // namaEcommerce: '',
      },
      this.toggle('nested_parent_list_provinsi'),
    );
  }

  setModalKotaKab() {
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = false;
    this.setState(
      {
        periodeDisabled: false,
        typeDisabled: true,
        domisiliDisabled: true,
        // namaEcommerce: '',
      },
      this.toggle('nested_parent_list_kotakab'),
    );
  }

  setModalKecamatan() {
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = false;
    this.setState(
      {
        periodeDisabled: false,
        typeDisabled: true,
        domisiliDisabled: true,
        // namaEcommerce: '',
      },
      this.toggle('nested_parent_list_kecamatan'),
    );
  }

  firstPage() {
    this.setState(
      {
        lastID: 0,
      },
      () => this.getListbyPaging(),
    );
  }

  actionPage(param) {
    var nextPage = document.getElementById('nextPageHeader');
    var prevPage = document.getElementById('prevPageHeader');
    var firstPage = document.getElementById('firstPageHeader');

    // console.log('PARAM', param, 'TEST', param === nextPage);

    if (param === 'nextPageHeader') {
      // console.log('A');
      // this.setState(
      //   {
      //     action: 'next',
      //   },
      //   () => this.getListbyPaging(),
      // );
    }
    if (param === 'prevPageHeader') {
      // console.log('B');
      this.setState(
        {
          action: 'prev',
          lastID: this.state.lastIDprev,
        },
        () => this.getListbyPaging(),
      );
    }
    if (param === 'firstPageHeader') {
      // console.log('C');
      this.setState(
        {
          lastID: 0,
          action: '',
        },
        () => this.getListbyPaging(),
      );
    }
  }

  render() {
    const { loading, loadingPage } = this.state;
    const currentTodosFarmer = this.state.resultFarmer;
    const currentTodosUpja = this.state.resultUpja;
    const provinsiTodos = this.state.resultProvinsi;
    const kotakabTodos = this.state.resultKotaKab;
    const kecamatanTodos = this.state.resultKecamatan;
    const typeTodos = this.state.resultType;
    const isEnabledSaveDomisili = this.canBeSubmittedDomisili();
    const isSearch = this.SearchAllList();

    var formatter = new Intl.NumberFormat('id-ID', {
      currency: 'IDR',
    });

    const renderType =
      typeTodos &&
      typeTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.type_name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="primary"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.type_id}
                onClick={this.setType}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderProvinsi =
      provinsiTodos &&
      provinsiTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="primary"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.id}
                onClick={this.setProvinsi}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderKotakab =
      kotakabTodos &&
      kotakabTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="primary"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.id}
                onClick={this.setKotakab}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderKecamatan =
      kecamatanTodos &&
      kecamatanTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="primary"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.id}
                onClick={this.setKecamatan}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderTodosFarmer =
      currentTodosFarmer &&
      currentTodosFarmer.map((todo, i) => {
        return (
          <tr key={i}>
            <th scope="row">{todo.farmer_id}</th>
            {todo.farmer_name !== '' && (
              <td style={{ width: '10%', textAlign: 'left' }}>
                <Link to={`/showTransaction/farmer/${todo.farmer_id}`}>
                  {
                    <Label
                      style={{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: '#009688',
                      }}
                    >
                      {todo.farmer_name}
                    </Label>
                  }
                </Link>
              </td>
            )}
            <td>{todo.phone_number}</td>
            {todo.phone_verify === 1 && (
              <td>
                <Badge color="success">Sudah Terverifikasi</Badge>
              </td>
            )}
            {todo.phone_verify === 0 && (
              <td>
                <Badge color="danger">Belum Terverifikasi</Badge>
              </td>
            )}
          </tr>
        );
      });

    const renderTodosUpja =
      currentTodosUpja &&
      currentTodosUpja.map((todo, i) => {
        return (
          <tr key={i}>
            <th scope="row">{todo.upja_id}</th>
            <td>{todo.village}</td>
            <td>{todo.leader_name}</td>
            {todo.upja_name !== '' && (
              <td style={{ width: '10%', textAlign: 'left' }}>
                <Link to={`/showTransaction/upja/${todo.upja_id}`}>
                  {
                    <Label
                      style={{
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        color: '#009688',
                      }}
                    >
                      {todo.upja_name}
                    </Label>
                  }
                </Link>
              </td>
            )}
            {(todo.class === 'Pemula' || todo.class === '1') && (
              <td>
                <Badge color="success">Pemula </Badge>
              </td>
            )}
            {(todo.class === 'Berkembang' || todo.class === '2') && (
              <td>
                <Badge color="warning">Berkembang </Badge>
              </td>
            )}
            {(todo.class === 'Profesional' || todo.class === '3') && (
              <td>
                <Badge color="danger">Profesional </Badge>
              </td>
            )}
          </tr>
        );
      });

    return (
      <Page
        title="Alsintanlink Admin"
        breadcrumbs={[{ name: 'Admin', active: true }]}
        className="Alsintanlink Admin"
      >
        <Row>
          <Col>
            <Card className="mb-3">
              <NotificationSystem
                dismissible={false}
                ref={notificationSystem =>
                  (this.notificationSystem = notificationSystem)
                }
                style={NOTIFICATION_SYSTEM_STYLE}
              />
              <CardHeader
                className="d-flex justify-content-between"
                style={{ paddingBottom: 0 }}
              >
                <Col
                  style={{
                    paddingLeft: 0,
                    paddingBottom: 0,
                    paddingRight: 0,
                    marginBottom: 0,
                  }}
                >
                  <InputGroup style={{ float: 'right' }}>
                    <Input
                      disabled
                      placeholder="Pilih Type"
                      style={{ fontWeight: 'bold' }}
                      value={this.state.namaType}
                    />
                    <InputGroupAddon addonType="append">
                      <Button
                        disabled={this.state.typeDisabled}
                        onClick={() => this.setModalType()}
                      >
                        <MdList />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
                <Col
                  style={{ paddingRight: 0, paddingBottom: 0, marginBottom: 0 }}
                >
                  <InputGroup style={{ float: 'right' }}>
                    <Input
                      type="text"
                      id="ecommerceValue"
                      disabled={true}
                      placeholder="Pilih Domisili"
                      style={{ fontWeight: 'bold' }}
                      value={
                        // this.state.namaProvinsi
                        // this.state.namaKotaKab
                        this.state.namaKecamatan
                      }
                      // onChange={event => this.setEcommerce(event)}
                    ></Input>
                    <InputGroupAddon addonType="append">
                      <Button
                        disabled={this.state.domisiliDisabled}
                        onClick={() => this.setModalDomisili()}
                      >
                        <MdList />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
                <Col style={{ paddingRight: 0, float: 'right' }}>
                  <ButtonGroup style={{ float: 'right' }}>
                    <Button
                      id="resetInfo"
                      color="danger"
                      style={{ float: 'right' }}
                      onClick={() => this.resetSearch()}
                    >
                      <MdRefresh />
                    </Button>
                    <Tooltip
                      placement="bottom"
                      isOpen={this.state.resetInfo}
                      target="resetInfo"
                      toggle={() =>
                        this.setState({ resetInfo: !this.state.resetInfo })
                      }
                    >
                      Reset Farmer/UPJA dan Domisili yang telah dipilih
                    </Tooltip>
                    <Button
                      style={{ float: 'right' }}
                      onClick={() => this.findData()}
                      disabled={!isSearch}
                      id="buttonSearch"
                    >
                      <MdSearch />
                      Cari
                    </Button>
                  </ButtonGroup>
                </Col>
              </CardHeader>

              {/* <CardHeader className="d-flex justify-content-between">
                <Col sm={5} style={{ paddingLeft: 0 }}>
                  <Form
                    inline
                    className="cr-search-form"
                    onSubmit={e => e.preventDefault()}
                  >
                    <MdSearch
                      size="20"
                      className="cr-search-form__icon-search text-secondary"
                    />
                    <Input
                      autoComplete="off"
                      type="search"
                      className="cr-search-form__input"
                      placeholder="Cari..."
                      id="search"
                      onChange={evt => this.updateSearchValue(evt)}
                      onKeyPress={event => this.enterPressedSearch(event, true)}
                    />
                  </Form>
                </Col>
                <Col
                  sm={7}
                  style={{ textAlign: 'right', paddingRight: 0 }}
                ></Col>
              </CardHeader> */}
              <CardBody>
                <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                  <Col>
                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      {(currentTodosFarmer.length !== 0 ||
                        currentTodosUpja.length !== 0) && (
                        <Col
                          sm={2}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          <Label style={{ fontWeight: 'bold' }}>Type</Label>
                        </Col>
                      )}
                      {(currentTodosFarmer.length !== 0 ||
                        currentTodosUpja.length !== 0) && (
                        <Col
                          sm={10}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          :&nbsp;
                          {this.state.namaTypeSave === undefined ? (
                            <Label style={{ fontWeight: 'bold' }}>-</Label>
                          ) : (
                            <Label style={{ fontWeight: 'bold' }}>
                              {this.state.namaTypeSave}
                            </Label>
                          )}
                        </Col>
                      )}
                    </Row>

                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      {(currentTodosFarmer.length !== 0 ||
                        currentTodosUpja.length !== 0) && (
                        <Col
                          sm={2}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          <Label style={{ fontWeight: 'bold' }}>Alamat</Label>
                        </Col>
                      )}
                      {(currentTodosFarmer.length !== 0 ||
                        currentTodosUpja.length !== 0) && (
                        <Col
                          sm={10}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          :&nbsp;
                          {this.state.namaProvinsiSave === undefined ? (
                            <Label style={{ fontWeight: 'bold' }}>-</Label>
                          ) : (
                            <Label style={{ fontWeight: 'bold' }}>
                              {this.state.namaProvinsiSave},&nbsp;
                              {this.state.namaKotaKabSave},&nbsp;
                              {this.state.namaKecamatanSave}
                            </Label>
                          )}
                        </Col>
                      )}
                    </Row>
                  </Col>

                  {/* <Col>
                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      <Col sm={2} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        <Label style={{ fontWeight: 'bold' }}>Kota/Kab</Label>
                      </Col>
                      <Col
                        sm={10}
                        style={{ paddingBottom: 0, marginBottom: 0 }}
                      >
                        :&nbsp;
                        {this.state.namaKotaKabSave === undefined ? (
                          <Label style={{ fontWeight: 'bold' }}>-</Label>
                        ) : (
                          <Label style={{ fontWeight: 'bold' }}>
                            {this.state.namaKotaKabSave}
                          </Label>
                        )}
                      </Col>
                    </Row>

                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      <Col sm={2} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        <Label style={{ fontWeight: 'bold' }}>Kecamatan</Label>
                      </Col>
                      <Col
                        sm={10}
                        style={{ paddingBottom: 0, marginBottom: 0 }}
                      >
                        :&nbsp;
                        {this.state.namaKecamatanSave === undefined ? (
                          <Label style={{ fontWeight: 'bold' }}>-</Label>
                        ) : (
                          <Label style={{ fontWeight: 'bold' }}>
                            {this.state.namaKecamatanSave}
                          </Label>
                        )}
                      </Col>
                    </Row>
                  </Col> */}
                </Row>

                <Table responsive striped id="tableUtama">
                  {currentTodosFarmer.length > currentTodosUpja.length && (
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nama Petani</th>
                        <th>No. Telepon</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                  )}
                  {currentTodosFarmer.length < currentTodosUpja.length && (
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Desa</th>
                        <th>Kepala Desa</th>
                        <th>UPJA</th>
                        <th>Kelas</th>
                      </tr>
                    </thead>
                  )}
                  {currentTodosFarmer.length > currentTodosUpja.length && (
                    <tbody>
                      {currentTodosFarmer.length === 0 && loading === true ? (
                        <LoadingSpinner status={4} />
                      ) : loading === false &&
                        currentTodosFarmer.length === 0 ? (
                        (
                          <tr>
                            <td
                              style={{ backgroundColor: 'white' }}
                              colSpan="17"
                              className="text-center"
                            >
                              TIDAK ADA DATA
                            </td>
                          </tr>
                        ) || <LoadingSpinner status={4} />
                      ) : loading === true &&
                        currentTodosFarmer.length !== 0 ? (
                        <LoadingSpinner status={4} />
                      ) : (
                        renderTodosFarmer
                      )}
                    </tbody>
                  )}
                  {currentTodosFarmer.length < currentTodosUpja.length && (
                    <tbody>
                      {currentTodosUpja.length === 0 && loading === true ? (
                        <LoadingSpinner status={4} />
                      ) : loading === false && currentTodosUpja.length === 0 ? (
                        (
                          <tr>
                            <td
                              style={{ backgroundColor: 'white' }}
                              colSpan="17"
                              className="text-center"
                            >
                              TIDAK ADA DATA
                            </td>
                          </tr>
                        ) || <LoadingSpinner status={4} />
                      ) : loading === true && currentTodosUpja.length !== 0 ? (
                        <LoadingSpinner status={4} />
                      ) : (
                        renderTodosUpja
                      )}
                    </tbody>
                  )}
                </Table>
              </CardBody>
              {/* <CardBody>
                <Row>
                  <Col>
                    <Button
                      name="firstPageHeader"
                      value={1}
                      // onClick={e =>
                      //   this.paginationButton(e, 0, this.state.lastID)
                      // }
                      onClick={() => this.actionPage('firstPageHeader')}
                      disabled={
                        this.state.result.length === 0 ||
                        this.state.result !== null
                      }
                    >
                      First &#10092;&#10092;
                    </Button>
                    <ButtonGroup style={{ float: 'right' }}>
                      <Button
                        name="prevPageHeader"
                        style={{ float: 'right' }}
                        onClick={() => this.actionPage('prevPageHeader')}
                        disabled={
                          this.state.result.length === 0 ||
                          this.state.result !== null
                        }
                      >
                        Prev &#10092;
                      </Button>
                      <Button
                        name="nextPageHeader"
                        // value={this.state.currentPage}
                        style={{ float: 'right' }}
                        onClick={() => this.actionPage('nextPageHeader')}
                        disabled={
                          this.state.result.length === 0 ||
                          this.state.result !== null
                        }
                      >
                        Next &#10093;
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardBody> */}
            </Card>
          </Col>
        </Row>

        {/* KHUSUS MODAL */}
        {/* Modal List Type */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_list}
          toggle={this.toggle('nested_parent_list')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list')}>
            List Type
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <tbody>
                {renderType}
                {!typeTodos && (
                  <tr>
                    <td
                      style={{ backgroundColor: 'white' }}
                      colSpan="11"
                      className="text-center"
                    >
                      TIDAK ADA DATA
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Type */}

        {/* Modal List Domisili */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_list_domisili}
          toggle={this.toggle('nested_parent_list_domisili')}
          className={this.props.className}
        >
          <ModalHeader>List Domisili</ModalHeader>
          <ModalBody>
            <Row>
              <Col>
                <Label style={{ fontSize: '0.6em' }}>
                  *NB: Harap isi sesuai alur Provinsi - Kota/Kab - Kecamatan
                  untuk mendapatkan Data
                </Label>
              </Col>
            </Row>
            <Row>
              <Col sm={3}>
                <Label
                  style={{
                    fontWeight: 'bold',
                    marginTop: '8px',
                  }}
                >
                  Provinsi:&nbsp;
                </Label>
              </Col>
              <Col sm={9}>
                <InputGroup style={{ float: 'right' }}>
                  <Input
                    disabled
                    placeholder="Pilih Provinsi"
                    style={{ fontWeight: 'bold' }}
                    value={this.state.namaProvinsi}
                  />
                  {/* {console.log('ISINYA:', this.state.namaProvinsi)} */}
                  <InputGroupAddon addonType="append">
                    <Button onClick={() => this.setModalProvinsi()}>
                      <MdList />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={3}>
                <Label
                  style={{
                    fontWeight: 'bold',
                    marginTop: '8px',
                  }}
                >
                  Kota/Kab:&nbsp;
                </Label>
              </Col>
              <Col sm={9}>
                <InputGroup style={{ float: 'right' }}>
                  <Input
                    disabled
                    placeholder="Pilih Kota/Kab"
                    style={{ fontWeight: 'bold' }}
                    value={this.state.namaKotaKab}
                  />
                  <InputGroupAddon addonType="append">
                    <Button onClick={() => this.setModalKotaKab()}>
                      <MdList />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Col sm={3}>
                <Label
                  style={{
                    fontWeight: 'bold',
                    marginTop: '8px',
                  }}
                >
                  Kecamatan:&nbsp;
                </Label>
              </Col>
              <Col sm={9}>
                <InputGroup style={{ float: 'right' }}>
                  <Input
                    disabled
                    placeholder="Pilih Kecamatan"
                    style={{ fontWeight: 'bold' }}
                    value={this.state.namaKecamatan}
                  />
                  <InputGroupAddon addonType="append">
                    <Button onClick={() => this.setModalKecamatan()}>
                      <MdList />
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.saveDomisili()}
              disabled={!isEnabledSaveDomisili}
            >
              Simpan Domisili
            </Button>
            <Button color="danger" onClick={this.handleCloseDomisili}>
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal List Domisili */}

        {/* Modal List Provinsi */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_list_provinsi}
          toggle={this.toggle('nested_parent_list_provinsi')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_provinsi')}>
            List Provinsi
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <tbody>
                {provinsiTodos.length === 0 && loadingPage === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPage === false && provinsiTodos.length === 0 ? (
                  (
                    <tr>
                      <td
                        style={{ backgroundColor: 'white' }}
                        colSpan="17"
                        className="text-center"
                      >
                        TIDAK ADA DATA
                      </td>
                    </tr>
                  ) || <LoadingSpinner status={4} />
                ) : loadingPage === true && provinsiTodos.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderProvinsi
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Provinsi */}

        {/* Modal List Kota/kabupaten */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_list_kotakab}
          toggle={this.toggle('nested_parent_list_kotakab')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_kotakab')}>
            List Kota/Kabupaten
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <tbody>
                {kotakabTodos.length === 0 && loadingPage === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPage === false && kotakabTodos.length === 0 ? (
                  (
                    <tr>
                      <td
                        style={{ backgroundColor: 'white' }}
                        colSpan="17"
                        className="text-center"
                      >
                        TIDAK ADA DATA
                      </td>
                    </tr>
                  ) || <LoadingSpinner status={4} />
                ) : loadingPage === true && kotakabTodos.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderKotakab
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Kota/kabupaten */}

        {/* Modal List Kecamatan */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_list_kecamatan}
          toggle={this.toggle('nested_parent_list_kecamatan')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_kecamatan')}>
            List Kecamatan
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <tbody>
                {kecamatanTodos.length === 0 && loadingPage === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPage === false && kecamatanTodos.length === 0 ? (
                  (
                    <tr>
                      <td
                        style={{ backgroundColor: 'white' }}
                        colSpan="17"
                        className="text-center"
                      >
                        TIDAK ADA DATA
                      </td>
                    </tr>
                  ) || <LoadingSpinner status={4} />
                ) : loadingPage === true && kecamatanTodos.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderKecamatan
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Kecamatan */}
        {/* KHUSUS MODAL */}
      </Page>
    );
  }

  canBeSubmittedDomisili() {
    const { pilihProvinsi, pilihKotaKab, pilihKecamatan } = this.state;
    return pilihProvinsi !== '' && pilihKotaKab !== '' && pilihKecamatan !== '';
  }

  updateSearchValue(evt) {
    this.setState({
      keyword: evt.target.value,
    });
  }
}
export default showTransaction;
