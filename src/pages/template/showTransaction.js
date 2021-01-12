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
class showTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
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
      pilihType: '',
      pilihProvinsi: '',
      pilihKotaKab: '',
      pilihKecamatan: '',
      pilihPelapak: '',
      pilihPelapak2: '',
      pilihEcommerce: '',
      pilihEcommerce2: '',
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
          type_id: 'farmer',
          type_name: 'Farmer',
        },
        {
          type_id: 'upja',
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

  //state pilih Outlet
  state = { pilihPelapak: '', namaOutlet: '' };

  //set Current Limit
  handleSelect(event) {
    this.setState(
      {
        [event.target.name]: event.target.value,
        currentPage: 1,
        realCurrentPage: 1,
      },
      () => {
        this.getListbyPaging(1, this.state.todosPerPage, this.state.keyword);
      },
    );
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

  paginationButtonList(event, flag, maxPages = 0) {
    var currPages = Number(event.target.value);
    if (currPages + flag > 0 && currPages + flag <= maxPages) {
      this.setState(
        {
          currentPages: currPages + flag,
          realCurrentPages: currPages + flag,
        },
        () => {
          this.getProvinsi(this.state.currentPages, this.state.todosPerPages);
        },
      );
    }
  }

  enterPressedPage = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      if (this.state.currentPage > 0) {
        if (this.state.currentPage > this.state.maxPage) {
          this.setState(
            prevState => ({
              realCurrentPage: prevState.maxPage,
              currentPage: prevState.maxPage,
            }),
            () =>
              this.getListbyPaging(
                this.state.currentPage,
                this.state.todosPerPage,
                this.state.keyword,
              ),
          );
        } else {
          this.setState(
            prevState => ({
              realCurrentPage: prevState.currentPage,
            }),
            () =>
              this.getListbyPaging(
                this.state.currentPage,
                this.state.todosPerPage,
                this.state.keyword,
              ),
          );
        }
      }
    }
  };

  enterPressedPageList = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      if (this.state.currentPages > 0) {
        if (this.state.currentPages > this.state.maxPages) {
          this.setState(
            prevState => ({
              realCurrentPages: prevState.maxPages,
              currentPages: prevState.maxPages,
            }),
            () =>
              this.getProvinsi(
                this.state.currentPages,
                this.state.todosPerPages,
              ),
          );
        } else {
          this.setState(
            prevState => ({
              realCurrentPages: prevState.currentPages,
            }),
            () =>
              this.getProvinsi(
                this.state.currentPages,
                this.state.todosPerPages,
              ),
          );
        }
      }
    }
  };

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

  enterPressedSearchList = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      this.setState(
        {
          currentPages: 1,
          realCurrentPages: 1,
          // modal_nested_parent_list: false
        },
        () => {
          this.getProvinsi(this.state.currentPages, this.state.todosPerPages);
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

  setDataStatus() {
    if (
      this.state.resultProvinsi !== null ||
      this.state.resultProvinsi !== undefined
    ) {
      this.setState({
        dataAvailable: true,
      });
    } else {
      this.setState({
        dataAvailable: false,
      });
    }
  }

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
    var pelapakID = this.state.pilihPelapak;
    var ecommerceID = this.state.resultPelapakID;
    var periodeID = this.state.pilihType;
    // var pelapakID = '';
    // var ecommerceID = '';
    // var periodeID = '';
    var lastID = this.state.lastID;
    var keyword = this.state.keyword;
    var action = this.state.action;
    // trace.start();

    // console.log(
    //   'pelapak',
    //   pelapakID,
    //   'ecommerce',
    //   ecommerceID,
    //   'periode',
    //   periodeID,
    // );

    const url =
      myUrl.url_getAllData +
      'length=' +
      currLimit +
      '&page=' +
      currPage +
      '&status=' +
      periodeID +
      '&outletid=' +
      pelapakID +
      '&ecommerceid=' +
      ecommerceID +
      '&procod=' +
      keyword +
      '&lastid=' +
      lastID +
      '&action=' +
      action;
    // console.log('URL GET LIST', url);
    // console.log("offset", offset, "currLimit", currLimit);

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    fetch(url, option)
      .then(response => {
        // trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        console.log('data jalan GetlistByPaging', data);
        if (data.error.status === true) {
          this.showNotification(data.error.msg, 'error');
          this.setState({ setDataErrorStatus: true });
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            this.props.history.push({
              pathname: '/login',
            });
          }
          if (data.error.code === 101) {
            this.setDataStatus();
          }
        } else {
          // console.log("datametadata", data.metadata.pages);

          if (data.metadata.pages === 0) {
            this.setState({ maxPage: 1 });
            // console.log("ini jalan 1");
          } else {
            this.setState(
              {
                setDataErrorStatus: true,
                result: data,
                maxPage: data.metadata.pages ? data.metadata.pages : 1,
                lastID: data.metadata.lastid,
                lastIDprev: data.metadata.lastidprev,
                loading: false,
              },
              () => this.setDataStatus(),
            );
            // console.log("ini jalan 2");
          }
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
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
    console.log('jalan', urlA);
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
        console.log('data Provinsi', data.result);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState(
            {
              resultProvinsi: data.result.provinces,
              // maxPages: data.metadata.pages ? data.metadata.pages : 1,
              loading: false,
            },
            () => this.setDataStatus(),
          );
        }
      });
  }
  // Get KotaKab
  getKotaKab(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    const urlA = myUrl.url_getCity + '?province_id=' + this.state.pilihProvinsi;
    console.log('jalan kota', urlA);
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
        console.log('data Kota/Kabupaten', data.result);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState(
            {
              resultKotaKab: data.result.citys,
              // maxPages: data.metadata.pages ? data.metadata.pages : 1,
              loading: false,
            },
            () => this.setDataStatus(),
          );
        }
      });
  }

  // Get Kecamatan
  getKecamatan(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    const urlA = myUrl.url_getDistrict + '?city=' + this.state.pilihKotaKab;
    console.log('jalan kecamatan', urlA);
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
        console.log('data Kecamatan', data.result);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState(
            {
              resultKecamatan: data.result.districs,
              // maxPages: data.metadata.pages ? data.metadata.pages : 1,
              loading: false,
            },
            () => this.setDataStatus(),
          );
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

  fetchData = () => {
    this.setState({ loading: true });
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
      () =>
        console.log(
          'ISI SETELAH CLOSE',
          this.state.namaProvinsi,
          this.state.namaKotaKab,
          this.state.namaKecamatan,
        ),
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
    console.log('KLIK FIND DATA');
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
      },
      () =>
        this.setState(
          {
            namaProvinsi: '',
            namaKotaKab: '',
            namaKecamatan: '',
            namaType: '',
          },
          () =>
            this.getListbyPaging(
              this.state.currentPage,
              this.state.todosPerPage,
            ),
        ),
    );
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
    const { loading } = this.state;
    const currentTodos = this.state.result.data;
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

    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <th scope="row">{todo.outletid}</th>
            {/* <td>{todo.outletname}</td>
            <td>{todo.ecommercename}</td> */}
            <td>{todo.procod}</td>
            <td>{todo.productname}</td>
            <td>{new Date(todo.startdate).toDateString()}</td>
            <td>{new Date(todo.enddate).toDateString()}</td>
            <td style={{ textAlign: 'right' }}>
              {formatter.format(todo.limitpriceecommerce)}
            </td>
            <td>{todo.sellpackname}</td>
            <td>{new Date(todo.lastupdated).toDateString()}</td>
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
                <Col style={{ paddingLeft: 0, paddingBottom: 0 }}>
                  <InputGroup style={{ float: 'right' }}>
                    <Label
                      style={{
                        fontWeight: 'bold',
                        marginTop: '8px',
                      }}
                    >
                      Type:&nbsp;
                    </Label>
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
                <Col style={{ paddingRight: 0 }}>
                  <InputGroup style={{ float: 'right' }}>
                    <Label
                      style={{
                        fontWeight: 'bold',
                        marginTop: '8px',
                      }}
                    >
                      Domisili:&nbsp;
                    </Label>
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

              <CardHeader className="d-flex justify-content-between">
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
              </CardHeader>
              <CardBody>
                <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                  <Col>
                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      <Col sm={2} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        <Label style={{ fontWeight: 'bold' }}>Type</Label>
                      </Col>
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
                    </Row>

                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      <Col sm={2} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        <Label style={{ fontWeight: 'bold' }}>Provinsi</Label>
                      </Col>
                      <Col
                        sm={10}
                        style={{ paddingBottom: 0, marginBottom: 0 }}
                      >
                        :&nbsp;
                        {this.state.namaProvinsiSave === undefined ? (
                          <Label style={{ fontWeight: 'bold' }}>-</Label>
                        ) : (
                          <Label style={{ fontWeight: 'bold' }}>
                            {this.state.namaProvinsiSave}
                          </Label>
                        )}
                      </Col>
                    </Row>
                  </Col>

                  <Col>
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
                  </Col>
                </Row>

                <Table responsive striped id="tableUtama">
                  <thead>
                    <tr>
                      <th>Kode</th>
                      {/* <th>Pelapak</th>
                      <th>Ecommerce</th> */}
                      <th>Procod</th>
                      <th>Nama Produk</th>
                      <th>Periode Awal</th>
                      <th>Periode Akhir</th>
                      <th style={{ textAlign: 'right' }}>Batas Bawah</th>
                      <th>Sellpack</th>
                      <th>Tgl Update</th>
                    </tr>
                  </thead>

                  <tbody>
                    {!currentTodos ? (
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
                      ) || <LoadingSpinner status={4}></LoadingSpinner>
                    ) : this.state.dataAvailable ? (
                      renderTodos
                    ) : (
                      <LoadingSpinner status={4} />
                    )}
                  </tbody>
                </Table>
              </CardBody>
              <CardBody>
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
              </CardBody>
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
                {/* {renderProvinsi}
                {!provinsiTodos && (
                  <tr>
                    <td
                      style={{ backgroundColor: 'white' }}
                      colSpan="11"
                      className="text-center"
                    >
                      TIDAK ADA DATA
                    </td>
                  </tr>
                )} */}
                {provinsiTodos ? (
                  renderProvinsi || <LoadingSpinner status={4}></LoadingSpinner>
                ) : this.state.dataAvailable ? (
                  <tr>
                    <td
                      style={{ backgroundColor: 'white' }}
                      colSpan="17"
                      className="text-center"
                    >
                      TIDAK ADA DATA
                    </td>
                  </tr>
                ) : (
                  <LoadingSpinner status={4} />
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
                {renderKotakab}
                {!kotakabTodos && (
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
                {renderKecamatan}
                {!kecamatanTodos && (
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
