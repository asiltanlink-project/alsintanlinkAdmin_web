import Page from 'components/Page';
import React from 'react';
import imageNotFound from 'assets/img/imageNotFound.jpg';
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
  MdHome,
} from 'react-icons/md';
import { MdLoyalty, MdRefresh } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from 'pages/urlLink.js';
import * as firebase from 'firebase/app';
import { Scrollbar } from 'react-scrollbars-custom';
import LoadingSpinner from 'pages/LoadingSpinner.js';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
class showTransactionDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultFarmer: [],
      resultUpja: [],
      resultFarmerTransaction: [],
      resultUpjaTransaction: [],
      resultUpjaAlsin: [],
      resultAlsin: [],
      resultAlsinItem: [],
      resultDetailAlsinItem: [],
      resultDetailTransactionAlsinItem: [],
      resultTransactionAlsin: [],
      resultTransaction: [],
      resultTransactionAlsinItem: [],
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
      loadingPage: true,
      loadingPageAlsin: true,
      loadingPageDetailAlsin: true,
      loadingPageTransaction: true,
      loadingPageTransactionAlsinItem: true,
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

      farmer_id: props.match.params.farmer_id,
      upja_id: props.match.params.upja_id,
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

  // get data farmer
  getListbyPagingFarmer(currPage, currLimit) {
    var farmer_id = this.state.farmer_id;
    const url = myUrl.url_showDetailFarmer + '?farmer_id=' + farmer_id;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST', url);

    this.setState({ loadingPage: true });
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
            loadingPage: false,
          });
        }
      })
      .then(data => {
        var status = data.status;
        var resultFarmer = data.result.farmer;
        var resultTransaction = data.result.transactions.transactions;
        var message = data.result.message;
        // console.log('data jalan GetlistByPaging farmer', data);
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPage: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState(
            {
              resultFarmer: [resultFarmer],
              resultFarmerTransaction: resultTransaction,
              loadingPage: false,
            },
            // () =>
            //   console.log(
            //     'TRANSAKSI FARMER',
            //     this.state.resultFarmerTransaction,
            //   ),
          );
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPage: false,
        });
      });
  }

  // get data upja
  getListbyPagingUpja(currPage, currLimit) {
    var upja_id = this.state.upja_id;
    const url = myUrl.url_showDetailUpja + '?upja_id=' + upja_id;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST', url);

    this.setState({ loadingPage: true });
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
            loadingPage: false,
          });
        }
      })
      .then(data => {
        // console.log('DATA UPJA', data);
        var status = data.status;
        var resultUpja = data.result.upja;
        var resultTransaction = data.result.transactions;
        var resultAlsin = data.result.alsins;
        var message = data.result.message;
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPage: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
            resultUpja: [resultUpja],
            resultUpjaTransaction: resultTransaction,
            resultUpjaAlsin: resultAlsin,
            loadingPage: false,
          });
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPage: false,
        });
      });
  }

  getDetailAlsin(currPage, currLimit) {
    var upja_id = this.state.upja_id;
    // console.log('UPJA ID', upja_id);
    var alsin_type_id = this.state.detailAlsin.alsin_type_id;
    const url =
      myUrl.url_getDetailAlsin +
      '?upja_id=' +
      upja_id +
      '&alsin_type_id=' +
      alsin_type_id;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST ALSIN', url);

    this.setState(
      { loadingPageAlsin: true },
      this.toggle('nested_parent_detail_alsin'),
    );
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
            loadingPageAlsin: false,
          });
        }
      })
      .then(data => {
        // console.log('DATA ALSIN', data);
        var status = data.status;
        var resultAlsinItem = data.result.alsin_items;
        var resultAlsin = data.result.alsin;
        var message = data.result.message;
        // console.log('data jalan GetlistByPaging upja', data);
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPageAlsin: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
            resultAlsin: [resultAlsin],
            resultAlsinItem: resultAlsinItem,
            loadingPageAlsin: false,
          });
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPageAlsin: false,
        });
      });
  }

  getDetailAlsinItem(currPage, currLimit) {
    var alsin_item_id = this.state.detailAlsinItem.alsin_item_id;
    const url =
      myUrl.url_getDetailAlsinItem + '?alsin_item_id=' + alsin_item_id;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST ALSIN DETAIL', url);

    this.setState(
      { loadingPageDetailAlsin: true },
      this.toggle('nested_parent_detail_alsin_item'),
    );
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
            loadingPageDetailAlsin: false,
          });
        }
      })
      .then(data => {
        // console.log('DATA ALSIN DETAIL', data);
        var status = data.status;
        var resultDetailAlsinItem = data.result.alsin_items;
        var resultDetailTransactionAlsinItem = data.result.transactions;
        var message = data.result.message;
        // console.log('data jalan GetlistByPaging upja', data);
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPageDetailAlsin: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
            resultDetailAlsinItem: [resultDetailAlsinItem],
            resultDetailTransactionAlsinItem: resultDetailTransactionAlsinItem,
            loadingPageDetailAlsin: false,
          });
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPageDetailAlsin: false,
        });
      });
  }

  getDetailTransaction(currPage, currLimit) {
    var transaction_order_id = this.state.detailTransaction
      .transaction_order_id;
    const url =
      myUrl.url_getDetailTransaction +
      '?transaction_order_id=' +
      transaction_order_id;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST TRANSACTION', url);

    this.setState(
      { loadingPageTransaction: true },
      this.toggle('nested_parent_list_transaksi'),
    );
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
            loadingPageTransaction: false,
          });
        }
      })
      .then(data => {
        // console.log('DATA TRANSAKSI', data);
        var status = data.status;
        var resultTransaction = data.result.transaction;
        var resultTransactionAlsin = data.result.alsins;
        var message = data.result.message;
        // console.log('data jalan GetlistByPaging upja', data);
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPageTransaction: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState(
            {
              resultTransaction: [resultTransaction],
              resultTransactionAlsin: resultTransactionAlsin,
              loadingPageTransaction: false,
            },
            // () => console.log('DATA TRANSAKSI', data),
          );
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPageTransaction: false,
        });
      });
  }

  getDetailTransactionAlsin(currPage, currLimit) {
    // console.log(
    //   'this.state.detailTransactionAlsinItem',
    //   this.state.detailTransactionAlsinItem,
    // );
    var transaction_order_id = this.state.detailTransaction
      .transaction_order_id;
    var alsin_type_id = this.state.detailTransactionAlsinItem.alsin_type_id;
    const url =
      myUrl.url_getDetailTransactionAlsinItem +
      '?transaction_order_id=' +
      transaction_order_id +
      '&alsin_type_id=' +
      alsin_type_id;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST TRANSACTION ALSIN ITEM', url);

    this.setState(
      { loadingPageTransactionAlsinItem: true },
      this.toggle('nested_parent_list_transaksi_alsinItem'),
    );
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
            loadingPageTransactionAlsinItem: false,
          });
        }
      })
      .then(data => {
        // console.log('DATA TRANSAKSI ALSIN ITEM', data);
        var status = data.status;
        var resultTransactionAlsinItem = data.result.alsin_items;
        var message = data.result.message;
        // console.log('data jalan GetlistByPaging upja', data);
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPageTransactionAlsinItem: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState(
            {
              resultTransactionAlsinItem: resultTransactionAlsinItem,
              loadingPageTransactionAlsinItem: false,
            },
            // () => console.log('DATA TRANSAKSI', data),
          );
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPageTransactionAlsinItem: false,
        });
      });
  }

  componentDidMount() {
    var token = window.localStorage.getItem('tokenCookies');
    if (token === '' || token === null || token === undefined) {
      window.location.replace('/login');
    }
    if (window.location.pathname.includes('farmer')) {
      // console.log('INCLUDES FARMER');
      this.getListbyPagingFarmer();
    } else {
      // console.log('INCLUDES UPJA');
      this.getListbyPagingUpja();
    }
  }

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
    // console.log('TERPANGGIL');
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

  setModalType() {
    this.setState(
      {
        domisiliDisabled: true,
        // namaEcommerce: '',
      },
      this.toggle('nested_parent_list'),
    );
  }

  setModalDetailAlsin(todo) {
    this.setState(
      {
        detailAlsin: todo,
        // namaEcommerce: '',
      },
      () => this.getDetailAlsin(),
    );
  }

  setModalDetailAlsinItem(todo) {
    this.setState(
      {
        detailAlsinItem: todo,
        // namaEcommerce: '',
      },
      () => this.getDetailAlsinItem(),
    );
  }
  setModalDetailTransaction(todo) {
    this.setState(
      {
        detailTransaction: todo,
        // namaEcommerce: '',
      },
      () => this.getDetailTransaction(),
    );
  }

  setModalDetailTransaksiAlsin(todo) {
    this.setState(
      {
        detailTransactionAlsinItem: todo,
        // namaEcommerce: '',
      },
      () => this.getDetailTransactionAlsin(),
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
    const {
      loading,
      loadingPage,
      loadingPageAlsin,
      loadingPageDetailAlsin,
      loadingPageTransaction,
      loadingPageTransactionAlsinItem,
    } = this.state;
    const currentTodosFarmer = this.state.resultFarmer;
    const currentTodosUpja = this.state.resultUpja;
    const currentTodosFarmerTransaction = this.state.resultFarmerTransaction;
    const currentTodosUpjaTransaction = this.state.resultUpjaTransaction;
    const currentTodosUpjaAlsin = this.state.resultUpjaAlsin;
    const currentTodosAlsinItem = this.state.resultAlsinItem;
    const currentTodosDetailAlsinItem = this.state
      .resultDetailTransactionAlsinItem;
    const currentTodosTransaction = this.state.resultTransactionAlsin;
    const currentTodosTransactionAlsinItem = this.state
      .resultTransactionAlsinItem;
    const provinsiTodos = this.state.resultProvinsi;
    const kotakabTodos = this.state.resultKotaKab;
    const kecamatanTodos = this.state.resultKecamatan;
    const typeTodos = this.state.resultType;
    const isEnabledSaveDomisili = this.canBeSubmittedDomisili();
    const isSearch = this.SearchAllList();

    var formatter = new Intl.NumberFormat('id-ID', {
      currency: 'IDR',
    });

    const renderTodosFarmer =
      currentTodosFarmerTransaction &&
      currentTodosFarmerTransaction.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.upja_id !== '' && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#009688',
                    }}
                    onClick={() => this.setModalDetailTransaction({ ...todo })}
                  >
                    {todo.upja_id}
                  </Label>
                }
              </td>
            )}
            <td>{formatter.format(todo.transport_cost)}</td>
            <td>{formatter.format(todo.total_cost)}</td>
            {todo.upja_name !== '' && (
              <td style={{ textAlign: 'left' }}>
                <Link to={`/showTransaction/upja=${todo.upja_id}`}>
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
            <td>{todo.order_time}</td>
            <td>{todo.delivery_time}</td>
            {todo.payment_yn === 1 && (
              <td>
                <Badge color="success">Sudah Lunas</Badge>
              </td>
            )}
            {todo.payment_yn === 0 && (
              <td>
                <Badge color="danger">Belum Dibayar</Badge>
              </td>
            )}
          </tr>
        );
      });

    // {
    //   console.log('UPJA TODOS', currentTodosUpjaTransaction);
    // }
    const renderTodosUpja =
      currentTodosUpjaTransaction &&
      currentTodosUpjaTransaction.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.farmer_id !== '' && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#009688',
                    }}
                    onClick={() => this.setModalDetailTransaction({ ...todo })}
                  >
                    {todo.farmer_id}
                  </Label>
                }
              </td>
            )}
            <td>{formatter.format(todo.transport_cost)}</td>
            <td>{formatter.format(todo.total_cost)}</td>
            {todo.farmer_name !== '' && (
              <td style={{ textAlign: 'left' }}>
                <Link to={`/showTransaction/farmer=${todo.farmer_id}`}>
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
            <td>{todo.order_time}</td>
            <td>{todo.delivery_time}</td>
            {todo.payment_yn === 1 && (
              <td>
                <Badge color="success">Sudah Lunas</Badge>
              </td>
            )}
            {todo.payment_yn === 0 && (
              <td>
                <Badge color="danger">Belum Dibayar</Badge>
              </td>
            )}
          </tr>
        );
      });

    const renderTodosTransaction =
      currentTodosTransaction &&
      currentTodosTransaction.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.alsin_type_name !== '' && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#009688',
                    }}
                    onClick={() =>
                      this.setModalDetailTransaksiAlsin({ ...todo })
                    }
                  >
                    {todo.alsin_type_name}
                  </Label>
                }
              </td>
            )}
            {todo.alsin_type_name === '' && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    -
                  </Label>
                }
              </td>
            )}
            <td>{todo.total_alsin}</td>
          </tr>
        );
      });

    const renderTodosTransactionAlsinItem =
      currentTodosTransactionAlsinItem &&
      currentTodosTransactionAlsinItem.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.vechile_code !== null && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    {todo.vechile_code}
                  </Label>
                }
              </td>
            )}
            {todo.vechile_code === null && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    -
                  </Label>
                }
              </td>
            )}
            <td>{todo.cost}</td>
            <td>
              <Label
                style={{
                  fontWeight: 'bold',
                }}
              >
                <Badge color="success">{todo.status}</Badge>
              </Label>
            </td>
          </tr>
        );
      });

    const renderTodosUpjaAlsin =
      currentTodosUpjaAlsin &&
      currentTodosUpjaAlsin.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.alsin_type_name !== '' && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#009688',
                    }}
                    onClick={() => this.setModalDetailAlsin({ ...todo })}
                  >
                    {todo.alsin_type_name}
                  </Label>
                }
              </td>
            )}
            {todo.picture === null && (
              <td>
                <img
                  src={imageNotFound}
                  width="100"
                  height="50"
                  className="pr-2"
                  alt=""
                />
              </td>
            )}
            {todo.picture !== null && (
              <td>
                <img
                  src={todo.picture}
                  width="100"
                  height="50"
                  className="pr-2"
                  alt=""
                />
              </td>
            )}

            <td>{formatter.format(todo.cost)}</td>
            <td>{todo.available}</td>
            <td>{todo.not_available}</td>
            <td>{todo.total_item}</td>
          </tr>
        );
      });

    const renderTodosAlsinItem =
      currentTodosAlsinItem &&
      currentTodosAlsinItem.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.vechile_code !== '' && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#009688',
                    }}
                    onClick={() => this.setModalDetailAlsinItem({ ...todo })}
                  >
                    {todo.vechile_code}
                  </Label>
                }
              </td>
            )}
            <td>
              <Label
                style={{
                  fontWeight: 'bold',
                }}
              >
                <Badge color="success">{todo.status}</Badge>
              </Label>
            </td>
          </tr>
        );
      });

    const renderTodosDetailAlsinItem =
      currentTodosDetailAlsinItem &&
      currentTodosDetailAlsinItem.map((todo, i) => {
        return (
          <tr key={i}>
            <th scope="row">{todo.upja_name}</th>
            <td>{todo.farmer_name}</td>
            {todo.vechile_code !== '' && (
              <td style={{ textAlign: 'left' }}>
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#009688',
                    }}
                    onClick={() => this.setModalDetailAlsinItem({ ...todo })}
                  >
                    {todo.vechile_code}
                  </Label>
                }
              </td>
            )}
            {/* <td>{todo.vechile_code}</td> */}
            <td>{formatter.format(todo.transport_cost)}</td>
            <td>{formatter.format(todo.total_cost)}</td>
            <td>{todo.order_time}</td>
            <td>{todo.delivery_time}</td>
            {todo.payment_yn === 1 && (
              <td>
                <Badge color="red">Belum Dibayar</Badge>
              </td>
            )}
            {todo.payment_yn === 0 && (
              <td>
                <Badge color="success">Sudah Lunas</Badge>
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
                      {window.location.pathname.includes('farmer') && (
                        <Col
                          sm={3}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          <Label style={{ fontWeight: 'bold' }}>Nama</Label>
                        </Col>
                      )}
                      {window.location.pathname.includes('upja') && (
                        <Col
                          sm={3}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          <Label style={{ fontWeight: 'bold' }}>Nama</Label>
                        </Col>
                      )}
                      {window.location.pathname.includes('farmer') && (
                        <Col
                          sm={9}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          :&nbsp;
                          {currentTodosFarmer &&
                          currentTodosFarmer.length === 0 ? (
                            <Label style={{ fontWeight: 'bold' }}>-</Label>
                          ) : (
                            <Label style={{ fontWeight: 'bold' }}>
                              &nbsp;
                              {currentTodosFarmer[0] &&
                                currentTodosFarmer[0].farmer_name}
                            </Label>
                          )}
                        </Col>
                      )}
                      {window.location.pathname.includes('upja') && (
                        <Col
                          sm={9}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          :&nbsp;
                          {currentTodosUpja && currentTodosUpja.length === 0 ? (
                            <Label style={{ fontWeight: 'bold' }}>-</Label>
                          ) : (
                            <Label style={{ fontWeight: 'bold' }}>
                              &nbsp;
                              {currentTodosUpja[0] &&
                                currentTodosUpja[0].upja_name}
                              &nbsp;
                              {(currentTodosUpja[0] &&
                                currentTodosUpja[0].class) === 'Pemula' &&
                                '(Pemula)'}
                              {(currentTodosUpja[0] &&
                                currentTodosUpja[0].class) === 'Berkembang' &&
                                '(Berkembang)'}
                              {(currentTodosUpja[0] &&
                                currentTodosUpja[0].class) === 'Profesional' &&
                                '(Profesional)'}
                            </Label>
                          )}
                        </Col>
                      )}
                    </Row>
                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      {window.location.pathname.includes('farmer') && (
                        <Col
                          sm={3}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          <Label style={{ fontWeight: 'bold' }}>
                            No. Telepon
                          </Label>
                        </Col>
                      )}
                      {window.location.pathname.includes('upja') && (
                        <Col
                          sm={3}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          <Label style={{ fontWeight: 'bold' }}>
                            Kepala Desa
                          </Label>
                        </Col>
                      )}
                      {window.location.pathname.includes('farmer') && (
                        <Col
                          sm={9}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          :&nbsp;
                          {currentTodosFarmer &&
                          currentTodosFarmer.length === 0 ? (
                            <Label style={{ fontWeight: 'bold' }}>-</Label>
                          ) : (
                            <Label style={{ fontWeight: 'bold' }}>
                              &nbsp;
                              {currentTodosFarmer[0] &&
                                currentTodosFarmer[0].phone_number}
                              &nbsp;
                              {(currentTodosFarmer[0] &&
                                currentTodosFarmer[0].phone_verify) === 1 &&
                                '(Sudah Verifikasi)'}
                              {(currentTodosFarmer[0] &&
                                currentTodosFarmer[0].phone_verify) === 0 &&
                                '(Belum Verifikasi)'}
                            </Label>
                          )}
                        </Col>
                      )}
                      {window.location.pathname.includes('upja') && (
                        <Col
                          sm={9}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          :&nbsp;
                          {currentTodosUpja && currentTodosUpja.length === 0 ? (
                            <Label style={{ fontWeight: 'bold' }}>-</Label>
                          ) : (
                            <Label style={{ fontWeight: 'bold' }}>
                              &nbsp;
                              {currentTodosUpja[0] &&
                                currentTodosUpja[0].leader_name}
                            </Label>
                          )}
                        </Col>
                      )}
                    </Row>
                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      {window.location.pathname.includes('farmer') && (
                        <Col
                          sm={3}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          <Label style={{ fontWeight: 'bold' }}>Alamat</Label>
                        </Col>
                      )}
                      {window.location.pathname.includes('upja') && (
                        <Col
                          sm={3}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          <Label style={{ fontWeight: 'bold' }}>Desa</Label>
                        </Col>
                      )}
                      {window.location.pathname.includes('farmer') && (
                        <Col
                          sm={9}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          :&nbsp;
                          {currentTodosFarmer &&
                          currentTodosFarmer.length === 0 ? (
                            <Label style={{ fontWeight: 'bold' }}>-</Label>
                          ) : (
                            <Label style={{ fontWeight: 'bold' }}>
                              {currentTodosFarmer[0] &&
                                currentTodosFarmer[0].province}
                              ,&nbsp;
                              {currentTodosFarmer[0] &&
                                currentTodosFarmer[0].city}
                              ,&nbsp;
                              {currentTodosFarmer[0] &&
                                currentTodosFarmer[0].district}
                            </Label>
                          )}
                        </Col>
                      )}
                      {window.location.pathname.includes('upja') && (
                        <Col
                          sm={9}
                          style={{ paddingBottom: 0, marginBottom: 0 }}
                        >
                          :&nbsp;
                          {currentTodosUpja && currentTodosUpja.length === 0 ? (
                            <Label style={{ fontWeight: 'bold' }}>-</Label>
                          ) : (
                            <Label style={{ fontWeight: 'bold' }}>
                              &nbsp;
                              {currentTodosUpja[0] &&
                                currentTodosUpja[0].village}
                            </Label>
                          )}
                        </Col>
                      )}
                    </Row>
                  </Col>
                  <Col style={{ marginBottom: 0, paddingBottom: 0 }}>
                    <Button
                      color="danger"
                      style={{
                        float: 'right',
                        marginLeft: '1%',
                      }}
                      onClick={() =>
                        (window.location.href = '/showTransaction')
                      }
                    >
                      <MdHome></MdHome>
                    </Button>
                    <Button
                      style={{
                        float: 'right',
                        width: '120px',
                        marginLeft: '1%',
                      }}
                      onClick={() => window.history.back()}
                    >
                      Kembali
                    </Button>

                    {window.location.pathname.includes('upja') && (
                      <Button
                        color="orange"
                        style={{
                          float: 'right',
                          color: 'white',
                          width: '120px',
                        }}
                        onClick={this.toggle('nested_parent_list')}
                      >
                        Detail Alsin
                      </Button>
                    )}
                  </Col>
                </Row>

                <Table responsive striped id="tableUtama">
                  {window.location.pathname.includes('farmer') && (
                    <thead>
                      <tr>
                        <th>Alsin ID</th>
                        <th>Biaya Transport</th>
                        <th>Total Biaya</th>
                        <th>UPJA</th>
                        <th>Waktu Order</th>
                        <th>Waktu Kirim</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                  )}
                  {window.location.pathname.includes('upja') && (
                    <thead>
                      <tr>
                        <th>Alsin ID</th>
                        <th>Biaya Transport</th>
                        <th>Total Biaya</th>
                        <th>Farmer</th>
                        <th>Waktu Order</th>
                        <th>Waktu Kirim</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                  )}

                  {window.location.pathname.includes('farmer') && (
                    <tbody>
                      {currentTodosFarmerTransaction.length === 0 &&
                      loadingPage === true ? (
                        <LoadingSpinner status={4} />
                      ) : loadingPage === false &&
                        currentTodosFarmerTransaction.length === 0 ? (
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
                      ) : loadingPage === true &&
                        currentTodosFarmerTransaction.length !== 0 ? (
                        <LoadingSpinner status={4} />
                      ) : (
                        renderTodosFarmer
                      )}
                    </tbody>
                  )}
                  {/* {console.log(
                    'CURRENT TODOS',
                    currentTodosUpjaTransaction.length,
                    // >=
                    // currentTodosUpjaTransaction.length,
                    'LOADING',
                    loadingPage,
                  )} */}
                  {window.location.pathname.includes('upja') && (
                    <tbody>
                      {currentTodosUpjaTransaction.length === 0 &&
                      loadingPage === true ? (
                        <LoadingSpinner status={4} />
                      ) : loadingPage === false &&
                        currentTodosUpjaTransaction.length === 0 ? (
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
                      ) : loadingPage === true &&
                        currentTodosUpjaTransaction.length !== 0 ? (
                        <LoadingSpinner status={4} />
                      ) : (
                        renderTodosUpja
                      )}
                    </tbody>
                  )}
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* KHUSUS MODAL */}
        {/* Modal Detail Alsin */}
        <Modal
          size="xl"
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_list}
          toggle={this.toggle('nested_parent_list')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list')}>
            Detail Alsin List
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Alsin</th>
                  <th>Gambar</th>
                  <th>Harga</th>
                  <th>Tersedia</th>
                  <th>Tidak Tersedia</th>
                  <th>Total Item</th>
                </tr>
              </thead>
              <tbody>
                {currentTodosUpjaAlsin.length === 0 && loadingPage === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPage === false &&
                  currentTodosUpjaAlsin.length === 0 ? (
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
                ) : loadingPage === true &&
                  currentTodosUpjaAlsin.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosUpjaAlsin
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal Detail Alsin */}

        {/* Modal Detail Alsin List */}
        <Modal
          size="xl"
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_detail_alsin}
          toggle={this.toggle('nested_parent_detail_alsin')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_detail_alsin')}>
            Detail Alsin
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col style={{ textAlign: 'center' }}>
                  {this.state.resultAlsin[0] &&
                    this.state.resultAlsin[0].picture === null && (
                      <img
                        src={imageNotFound}
                        width="300"
                        height="180"
                        className="pr-2"
                        alt=""
                      />
                    )}
                  {this.state.resultAlsin[0] &&
                    this.state.resultAlsin[0].picture !== null && (
                      <img
                        src={
                          this.state.resultAlsin[0] &&
                          this.state.resultAlsin[0].picture
                        }
                        width="300"
                        height="180"
                        className="pr-2"
                        alt=""
                      />
                    )}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Alsin
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultAlsin[0] &&
                              this.state.resultAlsin[0].alsin_type_name}
                          </Label>
                        )}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Harga
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {formatter.format(
                              this.state.resultAlsin[0] &&
                                this.state.resultAlsin[0].cost,
                            )}
                          </Label>
                        )}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Total Item
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultAlsin[0] &&
                              this.state.resultAlsin[0].total_item}
                          </Label>
                        )}
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Tersedia
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultAlsin[0] &&
                              this.state.resultAlsin[0].available}
                          </Label>
                        )}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Tidak Tersedia
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultAlsin &&
                        this.state.resultAlsin.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultAlsin[0] &&
                              this.state.resultAlsin[0].not_available}
                          </Label>
                        )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Table responsive striped>
              <thead>
                <tr>
                  {/* <th>Alsin ID</th> */}
                  <th>No. Reg Alsin</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentTodosAlsinItem.length === 0 &&
                loadingPageAlsin === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPageAlsin === false &&
                  currentTodosAlsinItem.length === 0 ? (
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
                ) : loadingPageAlsin === true &&
                  currentTodosAlsinItem.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosAlsinItem
                )}
              </tbody>
            </Table>
          </ModalFooter>
        </Modal>
        {/* Modal Detail Alsin List */}

        {/* Modal Detail Alsin Item List */}
        <Modal
          size="xl"
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_detail_alsin_item}
          toggle={this.toggle('nested_parent_detail_alsi_itemn')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_detail_alsin_item')}>
            Detail Alsin Item
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        UPJA
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultDetailAlsinItem[0] &&
                              this.state.resultDetailAlsinItem[0].upja_name}
                          </Label>
                        )}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Alsin
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultDetailAlsinItem[0] &&
                              this.state.resultDetailAlsinItem[0]
                                .alsin_type_name}
                          </Label>
                        )}
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        No. Reg Alsin
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;-
                          </Label>
                        )}
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultDetailAlsinItem[0] &&
                              this.state.resultDetailAlsinItem[0].vechile_code}
                          </Label>
                        )}
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={4}>
                      <Label style={{ marginTop: '8px', fontWeight: 'bold' }}>
                        Status
                      </Label>
                    </Col>
                    <Col sm={8}>
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length === 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp; -
                          </Label>
                        )}
                      {this.state.resultDetailAlsinItem &&
                        this.state.resultDetailAlsinItem.length !== 0 && (
                          <Label
                            style={{ marginTop: '8px', fontWeight: 'bold' }}
                          >
                            :&nbsp;
                            {this.state.resultDetailAlsinItem[0] &&
                              this.state.resultDetailAlsinItem[0].status}
                          </Label>
                        )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>UPJA</th>
                  <th>Farmer</th>
                  <th>Biaya Transport</th>
                  <th>Total Biaya</th>
                  <th>Waktu Pesan</th>
                  <th>Waktu Kirim</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* {console.log('DETAIL ALSIN ITEMS', currentTodosDetailAlsinItem)} */}
                {currentTodosDetailAlsinItem.length === 0 &&
                loadingPageDetailAlsin === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPageDetailAlsin === false &&
                  currentTodosDetailAlsinItem.length === 0 ? (
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
                ) : loadingPageDetailAlsin === true &&
                  currentTodosDetailAlsinItem.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosDetailAlsinItem
                )}
              </tbody>
            </Table>
          </ModalFooter>
        </Modal>
        {/* Modal Detail Alsin Item List */}

        {/* Modal Transaction */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_list_transaksi}
          toggle={this.toggle('nested_parent_list_transaksi')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_transaksi')}>
            List Transaksi
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Alsin</th>
                  <th>Total Alsin</th>
                </tr>
              </thead>
              <tbody>
                {currentTodosTransaction.length === 0 &&
                loadingPageTransaction === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPageTransaction === false &&
                  currentTodosTransaction.length === 0 ? (
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
                ) : loadingPageTransaction === true &&
                  currentTodosTransaction.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosTransaction
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal Transaction */}

        {/* Modal Transaction Alsin Item */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={this.state.modal_nested_parent_list_transaksi_alsinItem}
          toggle={this.toggle('nested_parent_list_transaksi_alsinItem')}
          className={this.props.className}
        >
          <ModalHeader
            toggle={this.toggle('nested_parent_list_transaksi_alsinItem')}
          >
            List Transaksi Item
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>No. Reg Alsin</th>
                  <th>Harga</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {currentTodosTransactionAlsinItem.length === 0 &&
                loadingPageTransactionAlsinItem === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPageTransactionAlsinItem === false &&
                  currentTodosTransactionAlsinItem.length === 0 ? (
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
                ) : loadingPageTransactionAlsinItem === true &&
                  currentTodosTransactionAlsinItem.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosTransactionAlsinItem
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal Transaction Alsin Item*/}

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
                  <Label>ADA KECAMATAN</Label>
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
export default showTransactionDetail;
