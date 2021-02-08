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
  MdAddAlert,
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
      resultTransaction: [],
      resultTransactionAll: [],
      resultTransactionStatus: [],
      namaStatus: '',
      loadingPage: false,
      pilihType: '',
      pilihProvinsi: '',
      pilihKotaKab: '',
      pilihKecamatan: '',
      pilihStatus: '',
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
          status_id: ' ',
          status_name: 'Semuanya',
        },
        {
          status_id: 'Menunggu Penentuan Pembayaran',
          status_name: 'Menunggu Penentuan Pembayaran',
        },
        {
          status_id: 'Menunggu Konfirimasi Petani',
          status_name: 'Menunggu Konfirimasi Petani',
        },
        {
          status_id: 'Menunggu Konfirmasi Upja',
          status_name: 'Menunggu Konfirmasi Upja',
        },
        {
          status_id: 'Menunggu Alsin dikirim',
          status_name: 'Menunggu Alsin dikirim',
        },
        {
          status_id: 'Sedang dikerjakan',
          status_name: 'Sedang dikerjakan',
        },
        {
          status_id: 'Selesai',
          status_name: 'Selesai',
        },
        {
          status_id: 'Transaksi ditolak Upja',
          status_name: 'Transaksi ditolak Upja',
        },
      ],

      namaProvinsi2: [],
      idPelapak: [],
      pelapakDetail: [],
      ecommerceDetail: [],
      dynamicHeightEcommerce: '0px',
      dynamicHeightPelapak: '0px',


      resultAlsinItemOtherService: [],
      resultTransactionAlsinOtherService: [],
      resultTransactionAlsinItemOtherService: [],
      resultTransactionAlsin: [],
      resultTransactionAlsinItem: [],
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

  getDetailTransaction(currPage, currLimit) {
    var transaction_order_id = this.state.detailTransaction
      .transaction_order_id;
    const url =
      myUrl.url_getDetailTransaction +
      '?transaction_order_id=' +
      transaction_order_id;
    var token = window.localStorage.getItem('tokenCookies');
    console.log('URL GET LIST TRANSACTION', url);

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
        console.log('DATA TRANSAKSI', data.result);
        var status = data.status;
        var resultTransaction = data.result.transaction;
        var resultTransactionAlsin = data.result.alsins;
        var resultTransactionAlsinOtherService = data.result.other_service;
        // var resultOtherService = data.result.other_service;
        var message = data.result.message;
        console.log('data jalan GetlistByPaging upja', data);
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
              resultTransactionAlsinOtherService: resultTransactionAlsinOtherService,
              // resultReparation: resultOtherService.reparations,
              // resultRiceSeeds: resultOtherService.rice_seeds,
              // resultRices: resultOtherService.rices,
              // resultRMUS: resultOtherService.rmus,
              // resultSparePart: resultOtherService.spare_parts,
              // resultTrainings: resultOtherService.trainings,

              loadingPageTransaction: false,
            },
            // () => console.log('DATA TRANSAKSI', this.state.resultReparation),
          );
        }
      })
      .catch(err => {
        console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingPageTransaction: false,
        });
      });
  }

  getDetailTransactionAlsin(currPage, currLimit) {
    console.log(
      'this.state.detailTransactionAlsinItem',
      this.state.detailTransactionAlsinItem,
      '2',
      this.state.detailTransaction,
    );
    var transaction_order_type_id = this.state.detailTransactionAlsinItem
      .transaction_order_type_id;
    var alsin_type_id = this.state.detailTransactionAlsinItem.alsin_type_id;
    var alsin_other = this.state.detailTransactionAlsinItem.alsin_other;
    const url =
      myUrl.url_getDetailTransactionItem +
      '?transaction_order_type_id=' +
      transaction_order_type_id +
      '&alsin_type_id=' +
      alsin_type_id +
      '&alsin_other=' +
      alsin_other;
    var token = window.localStorage.getItem('tokenCookies');
    console.log('URL GET LIST TRANSACTION ALSIN ITEM', url);

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
        console.log('DATA TRANSAKSI ALSIN ITEM', data);
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

  getDetailTransactionAlsinOtherService(currPage, currLimit) {
    console.log(
      'this.state.detailTransactionAlsinItem',
      this.state.detailTransactionAlsinItem,
      '2',
      this.state.detailTransaction,
    );
    var transaction_order_type_id = this.state.detailTransactionAlsinItem
      .transaction_order_type_id;
    var alsin_type_id = this.state.detailTransactionAlsinItem.alsin_type_id;
    var alsin_other = this.state.detailTransactionAlsinItem.alsin_other;
    const url =
      myUrl.url_getDetailTransactionItem +
      '?transaction_order_type_id=' +
      transaction_order_type_id +
      '&alsin_type_id=' +
      alsin_type_id +
      '&alsin_other=' +
      alsin_other;
    var token = window.localStorage.getItem('tokenCookies');
    console.log('URL GET LIST TRANSACTION ALSIN ITEM', url);

    this.setState(
      { loadingPageTransactionAlsinItem: true },
      this.toggle('nested_parent_list_transaksi_alsinItemOtherService'),
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
        console.log('DATA TRANSAKSI ALSIN ITEM', data);
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
              resultTransactionAlsinItemOtherService: resultTransactionAlsinItem,
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

  setModalDetailTransaksiAlsinOtherService(todo) {
    this.setState(
      {
        detailTransactionAlsinItem: todo,
        // namaEcommerce: '',
      },
      () => this.getDetailTransactionAlsinOtherService(),
    );
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

  // get data Transaksi
  getListbyPagingTransaksi(currPage, currLimit) {
    // const trace = perf.trace('getBundling');
    var province_id = this.state.pilihProvinsi;
    const url = myUrl.url_getAllUpjaTransaction + '?provinces=' + province_id;
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
        var resultTransaction = data.result.transactions;
        var resultTransactionAll = data.result.transactions_all;
        var message = data.result.message;
        console.log('data jalan GetlistByPaging', data);
        if (status === 0) {
          this.showNotification(message, 'error');
        } else {
          if (
            resultTransaction.length === 0 ||
            resultTransactionAll.length === 0
          ) {
            this.showNotification(
              `${'Data UPJA '} ${this.state.namaProvinsiSave.toLowerCase()} ${', tidak ditemukan!'} `,
              'error',
            );
            this.setState({
              // resultUpja: [{}],
              loading: false,
            });
          } else {
            this.showNotification('Data ditemukan!', 'info');
            this.setState({
              resultTransaction: resultTransaction,
              resultTransactionAll: resultTransactionAll,
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

  // Get getStatus
  getStatus(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    var pilihStatus = this.state.pilihStatus;
    const urlA = myUrl.url_showAllTransaction + '?status=' + pilihStatus;
    console.log('jalan', urlA);
    var token = window.localStorage.getItem('tokenCookies');
    this.setState({ loadingPage: true });
    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
      },
    };
    fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        console.log('data transaksi', data);
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState({
            resultTransactionStatus: data.result.transactions,
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

  // Send Alert
  sendAlert() {
    const urlA = myUrl.url_sendUpjaAlert;
    // console.log('jalan kecamatan', urlA);
    this.setState({ loadingPage: true });
    var payload = {};
    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
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
          this.setState({
            loadingPage: false,
          });
        } else {
          this.showNotification(data.result.message, 'error');
          this.setState({
            loadingPage: false,
          });
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Koneksi ke Server gagal!', 'error');
        this.setState({
          loadingPage: false,
        });
      });
  }

  componentDidMount() {
    var token = window.localStorage.getItem('tokenCookies');
    if (token === '' || token === null || token === undefined) {
      window.location.replace('/login');
    }
    this.getStatus(this.state.currentPages, this.state.todosPerPages);
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
      () => this.getStatus(this.state.currentPages, this.state.todosPerPages),
    );
  };
  // untuk pilih Kecamatan

  // untuk pilih Type
  setType = event => {
    var nama = this.state.resultType.find(function (element) {
      return element.status_id === event.target.value;
    });
    this.setState(
      {
        pilihStatus: event.target.value,
        namaStatus: nama.status_name,
        namaStatusTemp: nama.status_name,
        modal_nested_parent_list_provinsi: false,
        domisiliDisabled: false,
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
    this.setState({
      namaProvinsi: '',
      namaKotaKab: '',
      namaKecamatan: '',
      pilihProvinsi: '',
      pilihKotaKab: '',
      pilihKecamatan: '',
      modal_nested_parent_list_domisili: false,
    });
  };

  handleClose = () => {};

  SearchAllList() {
    const { pilihStatus } = this.state;
    return pilihStatus !== '';
  }

  findData() {
    // console.log('KLIK FIND DATA');
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = true;
    this.setState(
      {
        namaStatusSave: this.state.namaStatus,
      },
      () =>
        this.setState(
          {
            namaStatus: '',
          },
          () => this.getStatus(),
        ),
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
    const {
      loading,
      loadingPage,
      loadingPageTransaction,
      loadingPageTransactionAlsinItem,
    } = this.state;
    const currentTodosFarmer = this.state.resultFarmer;
    const currentTodosUpja = this.state.resultUpja;
    const provinsiTodos = this.state.resultProvinsi;
    const kotakabTodos = this.state.resultKotaKab;
    const kecamatanTodos = this.state.resultKecamatan;
    const typeTodos = this.state.resultType;
    const TransactionTodos = this.state.resultTransaction;
    const TransactionAllTodos = this.state.resultTransactionStatus;
    const isEnabledSaveDomisili = this.canBeSubmittedDomisili();
    const isSearch = this.SearchAllList();

    const currentTodosTransaction = this.state.resultTransactionAlsin;
    const currentTodosTransactionOtherService = this.state
      .resultTransactionAlsinOtherService;
    const currentTodosTransactionAlsinItem = this.state
      .resultTransactionAlsinItem;
    const currentTodosTransactionAlsinItemOtherService = this.state
      .resultTransactionAlsinItemOtherService;

    var formatter = new Intl.NumberFormat('id-ID', {
      currency: 'IDR',
    });

    const renderTransactionAll =
      TransactionAllTodos &&
      TransactionAllTodos.map((todo, i) => {
        return (
          <tr key={i}>
            {/* {console.log("TODOS ISINYA", todo)} */}
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
                    {todo.status}
                  </Label>
                }
              </td>
            {/* <td>{todo.status}</td> */}
            <td>{todo.upja_name}</td>
            <td>{todo.order_time}</td>
            <td>{todo.delivery_time}</td>
            <td>{formatter.format(todo.transport_cost)}</td>
            <td>{formatter.format(todo.total_cost)}</td>
          </tr>
        );
      });

    const renderType =
      typeTodos &&
      typeTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.status_name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="primary"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.status_id}
                onClick={this.setType}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

      const renderTodosTransaction =
      currentTodosTransaction &&
      currentTodosTransaction.map((todo, i) => {
        return (
          <tr key={i}>
            {console.log('TOTAL ALSIN', todo)}
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
            {/* <td>{todo.alsin_item_total}</td> */}
          </tr>
        );
      });

    {
      console.log('TOTAL REPARATION', this.state.resultReparation);
    }
    const renderTodosTransactionOtherService =
      this.state.resultTransactionAlsinOtherService &&
      this.state.resultTransactionAlsinOtherService.map((todo, i) => {
        return (
          <tr key={i}>
            {console.log('TOTAL REPARATION', todo)}
            {(todo.alsin_type_id === 8 || todo.alsin_type_id === 10) && (
              <td>{todo.alsin_type_name}</td>
            )}
            {todo.alsin_type_id !== 8 && todo.alsin_type_id !== 10 && (
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
                      this.setModalDetailTransaksiAlsinOtherService({ ...todo })
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
            <td>{todo.alsin_item_total}</td>
          </tr>
        );
      });

      const renderTodosTransactionAlsinItem =
      currentTodosTransactionAlsinItem &&
      currentTodosTransactionAlsinItem.map((todo, i) => {
        return (
          <tr key={i}>
            {<td>{todo.vechile_code}</td>}
            {<td>{todo.description}</td>}
            {<td>{todo.status} </td>}

            {/* <td>{todo.status}</td> */}
          </tr>
        );
      });

    const renderTodosTransactionAlsinItemOtherService =
      currentTodosTransactionAlsinItemOtherService &&
      currentTodosTransactionAlsinItemOtherService.map((todo, i) => {
        return (
          <tr key={i}>
            {todo.alsin_type_id !== 8 && todo.alsin_type_id !== 10 && (
              <td>{todo.name}</td>
            )}

            {/* <td>{todo.status}</td> */}
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
                    paddingRight: 0,
                    paddingBottom: 0,
                    marginBottom: 0,
                    paddingLeft: 0,
                  }}
                >
                  <InputGroup style={{ float: 'right' }}>
                    <Input
                      disabled
                      placeholder="Pilih Status"
                      style={{ fontWeight: 'bold' }}
                      value={this.state.namaStatus}
                    />
                    {/* {console.log('ISINYA:', this.state.namaProvinsi)} */}
                    <InputGroupAddon addonType="append">
                      <Button onClick={() => this.setModalProvinsi()}>
                        <MdList />
                      </Button>
                      <Button
                        color="primary"
                        style={{ float: 'right' }}
                        onClick={() => this.findData()}
                        disabled={!isSearch}
                        id="buttonSearch"
                      >
                        <MdSearch />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </Col>
                <Col style={{ paddingRight: 0, float: 'right' }}>
                  <ButtonGroup style={{ float: 'right' }}>
                    <Button
                      color="danger"
                      onClick={() => window.history.back()}
                    >
                      Kembali
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
                <Table responsive striped id="tableUtama">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>UPJA</th>
                      <th>Waktu Pesan</th>
                      <th>Waktu Kirim</th>
                      <th>Harga Transport</th>
                      <th>Total Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TransactionAllTodos.length === 0 && loading === true ? (
                      <LoadingSpinner status={4} />
                    ) : loading === false &&
                      TransactionAllTodos.length === 0 ? (
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
                    ) : loading === true && TransactionAllTodos.length !== 0 ? (
                      <LoadingSpinner status={4} />
                    ) : (
                      renderTransactionAll
                    )}
                  </tbody>
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
            Konfirmasi pengiriman Email
          </ModalHeader>
          <ModalBody>
            Apakah Anda yakin untuk mengirim Email peringatan untuk UPJA yang
            belum melakukan transaksi?
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={loadingPage}
              onClick={() => this.sendAlert()}
              color="primary"
            >
              {!loadingPage && 'Ya'}
              {loadingPage && <MdAutorenew />}
              {loadingPage && 'Sedang diproses'}
            </Button>
            <Button onClick={this.toggle('nested_parent_list')}>Tidak</Button>
          </ModalFooter>
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
            List Status
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <tbody>
                {typeTodos.length === 0 && loadingPage === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPage === false && typeTodos.length === 0 ? (
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
                ) : loadingPage === true && typeTodos.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderType
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
                  // renderKotakab
                  <Label>-</Label>
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
                  // renderKecamatan
                  <Label>-</Label>
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Kecamatan */}

        {/* Modal Transaction */}
        <Modal
          size="xl"
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
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Service Lainnya</th>
                </tr>
              </thead>
              <tbody>
                {currentTodosTransactionOtherService.length === 0 &&
                loadingPageTransaction === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPageTransaction === false &&
                  currentTodosTransactionOtherService.length === 0 ? (
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
                  currentTodosTransactionOtherService.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosTransactionOtherService
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
                  <th>Kode Kendaraan</th>
                  <th>Deskripsi</th>
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

        {/* Modal Transaction Alsin Item Other Service */}
        <Modal
          onExit={this.handleCloseDomisili}
          isOpen={
            this.state.modal_nested_parent_list_transaksi_alsinItemOtherService
          }
          toggle={this.toggle(
            'nested_parent_list_transaksi_alsinItemOtherService',
          )}
          className={this.props.className}
        >
          <ModalHeader
            toggle={this.toggle(
              'nested_parent_list_transaksi_alsinItemOtherService',
            )}
          >
            List Transaksi Item Service lainnya
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Nama</th>
                </tr>
              </thead>
              <tbody>
                {currentTodosTransactionAlsinItemOtherService.length === 0 &&
                loadingPageTransactionAlsinItem === true ? (
                  <LoadingSpinner status={4} />
                ) : loadingPageTransactionAlsinItem === false &&
                  currentTodosTransactionAlsinItemOtherService.length === 0 ? (
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
                  currentTodosTransactionAlsinItemOtherService.length !== 0 ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderTodosTransactionAlsinItemOtherService
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal Transaction Alsin Item Other Service*/}
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
