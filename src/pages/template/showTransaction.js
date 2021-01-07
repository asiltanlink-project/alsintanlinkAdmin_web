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

const perf = firebase.performance();

const initialCurrentDimen = {
  procod: '',
  nama: '',
  updateBy: '',
  qty: 0,
};

class showTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      resultDataProcod: [],
      currentDimen: { ...initialCurrentDimen },
      inputtedName: '',
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
      currentDimenBatasStandar: [],
      currentDimenBatasStandarLama: [],
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
      listEditMasal: [],
      dynamicHeightEcommerce: '0px',
      dynamicHeightPelapak: '0px',
      resultBatasPerPelapak: [],
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

  handleSelectEditMasal(event) {
    this.setState(
      {
        ecommerceID: event.target.value,
      },
      () => {
        this.getOutletEcommerce();
      },
    );
  }

  handleSelectList(event) {
    this.setState(
      {
        [event.target.name]: event.target.value,
        currentPages: 1,
        realCurrentPages: 1,
      },
      () => {
        this.getPelapak(1, this.state.todosPerPages);
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
          this.getPelapak(this.state.currentPages, this.state.todosPerPages);
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
              this.getPelapak(
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
              this.getPelapak(
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
          this.getPelapak(this.state.currentPages, this.state.todosPerPages);
        },
      );
    }
  };

  enterPressedSearchListEditMasal = event => {
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
          this.getOutletEcommerce();
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
    if (this.state.result !== null || this.state.result !== undefined) {
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
    this.setState(
      {
        pilihProvinsi: this.state.pilihProvinsi,
        pilihKotaKab: this.state.pilihKotaKab,
        pilihKecamatan: this.state.pilihKecamatan,
        namaProvinsiSave: this.state.namaProvinsi,
        namaKotaKabSave: this.state.namaKotaKab,
        namaKecamatanSave: this.state.namaKecamatan,
        domisiliDisabled: true,
        typeDisabled: false,
        modal_nested_parent_list_domisili: false,
        namaType: '',
        namaTypeSave: this.state.namaTypeTemp,
      },
      () =>
        this.setState({ namaKecamatan: '', namaProvinsi: '', namaKotaKab: '' }),
    );
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

  getOutletEcommerce() {
    var keyword = this.state.keyword;
    var ecommerceID = this.state.ecommerceID;
    const url =
      myUrl.url_getOutletEcommerce +
      '&ecommerceid=' +
      ecommerceID +
      '&keyword=' +
      keyword;
    console.log('URL GET LIST OUTLET ECOMMERCE', url);
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
        // console.log('data jalan GetlistByPagingOUTLETECOMMERCE', data);
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
                resultPelapakEcommerce: data.data,
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

  deleteHeaderData = first_param => {
    // const trace = perf.trace('updateDefault');
    // trace.start();
    var url = myUrl.url_deleteHeaderData;
    const deleteDataHeader = first_param;

    console.log('DELETE HEADER DATA', deleteDataHeader);

    this.fetchData();
    var payload = {
      limitid: deleteDataHeader.limitid,
      outletid: deleteDataHeader.outletid,
      ecommerceid: deleteDataHeader.ecommerceid,
      procod: deleteDataHeader.procod,
      updatedby: this.state.nip_user,
    };

    console.log('PAYLOAD DELETE', payload);

    const option = {
      method: 'PUT',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };
    fetch(url, option)
      .then(response => {
        console.log('RESPONSE DELETE', response);
        // trace.stop();
        if (response.ok) {
          this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
          // this.componentDidMount();
          this.setState({
            modal_nested_nonaktifHeaderData: false,
            modal_nested_parent_nonaktifHeaderData: false,
            loading: false,
            deleteDataHeader: [],
            // currentDimen: { ...initialCurrentDimen },
          });
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({ loading: false, enterButton: false });
        }
      })
      .then(data => {
        console.log('DATA DELETE', data);
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          this.showNotification(data.data.message, 'info');
        }
      })
      .catch(err => {
        // console.log('ISI ERRORNYA:', err);
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({ loading: false, enterButton: false });
      });
  };

  getListPerOutlet(currPage, currLimit) {
    // const trace = perf.trace('getBundling');
    // var pelapakID = this.state.pilihPelapak;
    // var ecommerceID = this.state.pilihEcommerce;
    var pelapakID = '';
    var ecommerceID = '';
    // trace.start();
    const url =
      myUrl.url_getListPerOulet +
      'length=' +
      currLimit +
      '&page=' +
      currPage +
      '&outletid=' +
      pelapakID +
      '&ecommerceid=' +
      ecommerceID;
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
        // console.log('data jalan Per Outlet', data);
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          this.setState(
            {
              resultBatasPerPelapak: data.data,
              maxPage: data.metadata.pages ? data.metadata.pages : 1,
              loading: false,
            },
            // () =>
            //   console.log(
            //     'BATAS PER PELAPAK',
            //     this.state.resultBatasPerPelapak,
            //   ),
          );
        }
        // }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({
          loading: false,
        });
      });
  }

  getListDefault() {
    // const trace = perf.trace('getBundling');
    // trace.start();
    const url = myUrl.url_getLimitDefault;
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
        // console.log('data jalan ALLL', data);
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          // console.log('ALLL data jalan LIST', data);
          this.setState({
            currentDimenBatasStandar: data.data[0],
            nilaiLamaPharos: data.data[0].dividerlnbupripi,
            nilaiLamaNonPharos: data.data[0].dividerlnbuprinonpi,
            loading: false,
          });
        }
        // }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({
          loading: false,
        });
      });
  }

  // Get Data All
  getListbyPagingAll(currPage, currLimit) {
    var pelapakID = this.state.pilihPelapak;
    var ecommerceID = this.state.pilihEcommerce;
    const url =
      myUrl.url_getAllData +
      'length=' +
      currLimit +
      '&page=' +
      currPage +
      '&outletid=' +
      pelapakID +
      '&ecommerceid=' +
      ecommerceID;

    // console.log('URL JALAN', url);

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };

    // console.log('OPTION', option);

    fetch(url, option)
      .then(response => {
        // console.log('OPTION ALL', response);
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal getListAll!', 'error');
          this.setState(
            {
              loading: false,
            },
            () =>
              this.getPelapak(
                this.state.currentPages,
                this.state.todosPerPages,
              ),
          );
        }
      })
      .then(data => {
        // console.log('data jalan', data);
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          if (data.metadata.pages === 0) {
            this.setState(
              {
                maxPage: 1,
                modal_nested_parent_list: false,
                keywordList: '',
                namaOutlet: '',
                offset: 0,
              },
              () =>
                this.getPelapak(
                  this.state.currentPages,
                  this.state.todosPerPages,
                ),
            );
          } else {
            this.setState(
              {
                result: data,
                maxPage: data.metadata.pages ? data.metadata.pages : 1,
                loading: false,
                modal_nested_parent_list: false,
                keywordList: '',
                namaOutlet: '',
                offset: 0,
              },
              () =>
                this.getPelapak(
                  this.state.currentPages,
                  this.state.todosPerPages,
                ),
            );
          }
        }
      })
      .catch(err => {
        // console.log('ERRORNYA KENAPA', err);
        this.showNotification('Koneksi ke server gagal getListAll2!', 'error');
        this.setState(
          {
            loading: false,
            keywordList: '',
            namaOutlet: '',
            offset: 0,
          },
          () =>
            this.getPelapak(this.state.currentPages, this.state.todosPerPages),
        );
      });
  }

  // Get Outlet
  getPelapak(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    const urlA =
      myUrl.url_getPelapak +
      '&offset=' +
      offset +
      '&limit=' +
      currLimit +
      '&keyword=' +
      keyword;
    // console.log('jalan', urlA);
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
        // console.log('data Pelapak', data);
        if (data.error.status === true) {
          this.showNotification(data.error.msg, 'error');
        } else {
          this.setState({
            resultProvinsi: data.data,
            maxPages: data.metadata.pages ? data.metadata.pages : 1,
            loading: false,
          });
        }
      });
  }

  getAllEcommerce() {
    // const trace = perf.trace('getEcommerce');
    const urlA = myUrl.url_getEcommerce;
    // trace.start();
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
        // trace.stop();
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        // console.log('DATA ECOMMERCE', data);
        this.setState(
          { resultEcommerce: data.data },
          //     () =>
          //   console.log('ISINYA:', this.state.resultEcommerce),
        );
      });
  }

  componentDidMount() {
    this.props.setTitle('Alsintanlink Admin', 'black');
    // this.showNotification(
    //   'Silahkan Pilih Pelapak, Ecommerce & Periode terlebih dahulu!',
    //   'warning',
    // );
    this.setProfileData();
    this.getAllEcommerce();
    // this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    // this.getListbyPagingAll(this.state.currentPage, this.state.todosPerPage);
    this.getOutletEcommerce();
    this.getListPerOutlet(this.state.currentPage, this.state.todosPerPage);
    this.getListDefault();
    this.getPelapak(this.state.currentPages, this.state.todosPerPages);
    // console.log("TOKEN", window.localStorage.getItem('tokenCookies'))
  }

  getPelapakID() {
    // console.log('KEPANGGIL');
    // const trace = perf.trace('getPelapak');
    // trace.start();
    const urlA =
      myUrl.url_getPelapakID +
      'outletId=' +
      this.state.pilihPelapak +
      // pelapakID +
      '&ecommerceId=' +
      this.state.pilihEcommerce;
    // ecommerceID;
    // console.log('URLGETID', urlA);
    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    window.localStorage.setItem('ecommerceID', this.state.pilihEcommerce);
    window.localStorage.setItem('pelapakID', this.state.pilihPelapak);

    fetch(urlA, option)
      .then(response => {
        // trace.stop();
        if (response.ok) {
          return response.json();
        }
      })
      .then(data => {
        // console.log('data insertPelapak', data);
        if (data.data === null) {
          // console.log('NULL');
          // this.getListbyPagingAll2();
          return;
        } else {
          // console.log('MASUK ALL 2');
          this.setState(
            { resultPelapakID: data.data[0].pelapak_id },
            // this.setState({ resultPelapakID: data.data },
            () =>
              window.localStorage.setItem(
                'insertPelapakID',
                this.state.resultPelapakID,
              ),
            // this.getListbyPaging(
            //   this.state.currentPage,
            //   this.state.todosPerPage,
            // ),
          );
          // }
        }
      });
  }

  // untuk pilih Pelapak
  setPelapakEditMasal = event => {
    // console.log('TERPANGGIL', this.state.resultPelapakEcommerce);
    var nama = this.state.resultPelapakEcommerce.find(function (element) {
      return element.outletid === event.target.value;
    });

    // console.log('NAMA', nama);

    var listProvinsi = this.state.idPelapak;
    var listDetail = this.state.pelapakDetail;
    // console.log('ISI LIST', listDetail);

    this.setState(
      {
        pilihPelapak2: event.target.value,
        namaProvinsi2: nama.outletname,
        modal_nested_parent_list_editMasal: false,
        keywordList: '',
        domisiliDisabled: false,
        outletData: nama,

        pelapak2: nama.outletname,
        pelapakDetail: listDetail,
        idPelapak: listProvinsi,
      },
      () => {
        var newpelapakDetail = {
          pelapakid: nama.pelapakid,
          ecommerceid: nama.ecommerceid,
          ecommercename: nama.ecommercename,
          outletid: nama.outletid,
          outletname: nama.outletname,
        };

        var newArr = listDetail.filter(
          item => item.pelapakid === newpelapakDetail.pelapakid,
        );

        if (newArr.length > 0) {
        } else {
          listDetail.push(newpelapakDetail);

          this.dynamicHeightPelapak();
        }
      },
      this.setState(
        {
          keyword: '',
          ecommerceID: '',
        },
        () => this.getOutletEcommerce(),
      ),
    );
  };

  // untuk pilih Provinsi
  setProvinsi = event => {
    var nama = this.state.resultProvinsi.find(function (element) {
      return element.out_code === event.target.value;
    });

    this.setState(
      {
        pilihProvinsi: event.target.value,
        namaProvinsi: nama.out_name,
        modal_nested_parent_list_provinsi: false,
        keywordList: '',
        domisiliDisabled: false,
      },
      () => this.getPelapak(this.state.currentPages, this.state.todosPerPages),
    );
  };
  // untuk pilih Provinsi

  // untuk pilih Kota/Kabupaten
  setKotakab = event => {
    var nama = this.state.resultProvinsi.find(function (element) {
      return element.out_code === event.target.value;
    });

    this.setState(
      {
        pilihKotaKab: event.target.value,
        namaKotaKab: nama.out_name,
        modal_nested_parent_list_kotakab: false,
        keywordList: '',
        domisiliDisabled: false,
      },
      () => this.getPelapak(this.state.currentPages, this.state.todosPerPages),
    );
  };
  // untuk pilih Kota/Kabupaten

  // untuk pilih Kecamatan
  setKecamatan = event => {
    var nama = this.state.resultProvinsi.find(function (element) {
      return element.out_code === event.target.value;
    });

    this.setState(
      {
        pilihKecamatan: event.target.value,
        namaKecamatan: nama.out_name,
        modal_nested_parent_list_kecamatan: false,
        keywordList: '',
        domisiliDisabled: false,
      },
      () => this.getPelapak(this.state.currentPages, this.state.todosPerPages),
    );
  };
  // untuk pilih Kecamatan

  // untuk pilih Ecommerce
  setEcommerce = event => {
    var nama = this.state.resultEcommerce.find(function (element) {
      return element.ecommerce_id === event.target.value;
    });

    // console.log('ISINYA', nama.ecommerce_name);
    this.setState(
      {
        pilihEcommerce: event.target.value,
        namaEcommerce: nama.ecommerce_name,
        modal_nested_parent_list_domisili: false,
      },
      () => this.getPelapakID(),

      // () =>
      // this.getListbyPaging(),
    );
  };

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
      },
      () => console.log('CEK CEK CEK', this.state.pilihType),
      // () =>
      // this.getListbyPaging(),
    );
  };

  setEcommerceBatasPerPelapak = event => {
    this.setState(
      { pilihEcommerceBatasPerPelapak: event.target.value },
      // () =>
      //   console.log('ecommerceID: ', this.state.pilihEcommerceBatasPerPelapak),
      // this.getListbyPaging(),
    );
  };

  setEcommerceEditMassal = event => {
    var nama = this.state.resultEcommerce.find(function (element) {
      return element.ecommerce_id === event.target.value;
    });
    var listDetail = this.state.ecommerceDetail;
    this.setState(
      {
        pilihEcommerce2: event.target.value,
        namaEcommerce2: nama.ecommerce_name,
        ecommerceDetail: listDetail,
        modal_nested_parent_list_ecommerceListEditMasal: false,
      },
      () => {
        var newEcommerceDetail = {
          ecommerceID: this.state.pilihEcommerce2,
          ecommerceName: this.state.namaEcommerce2,
        };
        var newArr = listDetail.filter(
          item => item.ecommerceID === newEcommerceDetail.ecommerceID,
        );
        // console.log('NEW', newArr);

        if (newArr.length > 0) {
        } else {
          listDetail.push(newEcommerceDetail);
          this.dynamicHeightEcommerce();
        }
      },
      this.getAllEcommerce(),
    );
  };
  // untuk pilih ecommerce

  setListEditMassal = event => {
    var listDetail = this.state.listEditMasal;

    this.setState(
      {
        listEditMasal: listDetail,
      },
      () => {
        var newlistEditMasal = {
          procod: this.state.resultDataProcod.ProductID,
          // satuan: 'sachet',
          prodes: this.state.resultDataProcod.ProductName,
          qtybatasbawah: parseInt(this.state.currentDimen.qtyBatasBawah),
        };

        // console.log('NEW LIST EDIT MASAL', newlistEditMasal);

        var newArr = listDetail.filter(
          item => item.procod === newlistEditMasal.procod,
        );

        if (newArr.length > 0) {
        } else {
          listDetail.push(newlistEditMasal);
        }

        this.setState({
          modal_tambahProduk: false,
          modal_backdrop_tambahProduk: false,
          modal_nested_parent_tambahProduk: false,
          modal_nested_tambahProduk: false,
        });
      },
    );
  };

  setListEditMassalEdit = (param, todo) => {
    var listDetail = [param];

    this.setState(
      {
        listEditMasal: listDetail,
      },
      () => {
        var newlistEditMasal = {
          procod: this.state.editBatasBawah.procod,
          prodes: this.state.editBatasBawah.prodes,
          qtybatasbawah: parseInt(this.state.editBatasBawah.qtybatasbawah),
        };

        var newArr = listDetail.filter(item => item.procod === todo.procod);

        // console.log('NEW ARR', newArr);
        // console.log('NEW ARR 2', newlistEditMasal);

        if (newArr.length > 0) {
        } else {
          listDetail.push(newlistEditMasal);
        }

        this.setState({
          modal_editMassal_edit: false,
          modal_backdrop_editMassal_edit: false,
          modal_nested_parent_editMassal_edit: false,
          modal_nested_editMassal_edit: false,
        });
      },
    );
  };

  onEnterSearchProcod = (event, param) => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      // const trace = perf.trace('searchProcod');
      // trace.start();
      const currButton = event.target;
      var pelapakID = this.state.pilihPelapak;

      currButton.disabled = true;

      var url =
        myUrl.url_scanProcod +
        '?pelapakID=' +
        pelapakID +
        '&productId=' +
        param;
      const option = {
        method: 'GET',
        json: true,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          Authorization: window.localStorage.getItem('tokenCookies'),
        },
      };

      // console.log('URLNYA: ', url);

      fetch(url, option)
        .then(response => {
          // trace.stop();
          if (response.ok) {
            this.setState({ procod: '' });
            return response.json();
          } else {
            this.showNotification('Koneksi ke server gagal!', 'error');
            currButton.disabled = false;
            this.setState({
              loading: false,
              procod: '',
            });
          }
        })
        .then(result => {
          var data = result.data;
          // console.log('ISI DATA PROCOD', data);
          if (data === null) {
            this.showNotification(
              'Data tidak ditemukan atau sudah pernah di Input sebelumnya!',
              'error',
            );
            this.setState({
              newProductDesc: '',
              newProcode: '',
              procod: '',
              qty: '',
            });
            currButton.disabled = false;
          } else {
            this.setState({
              resultDataProcod: data[0],
            });
            this.setState(prevState => ({
              currentDimen: {
                ...prevState.currentDimen,
                productID: data[0].productName ? data[0].ProductID : '',
                qty: data[0].qty,
              },
            }));
            currButton.disabled = false;
          }
        })
        .catch(err => {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({
            loading: false,
          });
          currButton.disabled = false;
        });
    }
  };

  searchBarcode = () => event => {
    // const trace = perf.trace('searchProcod');
    // trace.start();
    const currButton = event.target;
    var procod = this.state.procod;
    var pelapakID = this.state.pilihPelapak;

    currButton.disabled = true;

    var url =
      myUrl.url_scanProcod + '?pelapakID=' + pelapakID + '&productId=' + procod;
    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };

    // console.log('URLNYA: ', url);

    fetch(url, option)
      .then(response => {
        // trace.stop();
        if (response.ok) {
          this.setState({ procod: '' });
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          currButton.disabled = false;
          this.setState({
            loading: false,
            procod: '',
          });
        }
      })
      .then(result => {
        var data = result.data;
        // console.log('ISI DATA PROCOD: ', data);
        if (data === null) {
          this.showNotification(
            'Data tidak ditemukan atau sudah pernah di Input sebelumnya!',
            'error',
          );
          this.setState({
            newProductDesc: '',
            newProcode: '',
            procod: '',
            qty: '',
          });
          currButton.disabled = false;
        } else {
          this.setState({
            resultDataProcod: data[0],
          });
          this.setState(prevState => ({
            currentDimen: {
              ...prevState.currentDimen,
              productID: data[0].productName ? data[0].ProductID : '',
              qty: data[0].qty,
            },
          }));
          currButton.disabled = false;
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({
          loading: false,
        });
        currButton.disabled = false;
      });
  };

  setProfileData() {
    var profileObj = JSON.parse(window.localStorage.getItem('profile'));

    this.setState({
      nip_user: profileObj['mem_nip'],
      nama_user: profileObj['mem_username'],
    });
  }

  insertListEditMasal = () => {
    // const trace = perf.trace('newBundle');
    // trace.start();
    var startDate = this.state.startDate;
    var endDate = this.state.endDate;
    var productDetail = this.state.listEditMasal;
    var pelapakDetail = this.state.pelapakDetail;

    // console.log(
    //   'MAU SAVE: ',
    //   startDate,
    //   'PART2',
    //   endDate,
    //   'PART 3',
    //   productDetail,
    //   'PART4',
    //   pelapakDetail,
    // );

    var url = myUrl.url_insertDataOutlet;
    this.setState({ enterButton: true });

    this.fetchData();
    var payload = {
      startdate: new Date(startDate).toISOString(),
      enddate: new Date(endDate).toISOString(),
      outlets: pelapakDetail,
      products: productDetail,
      updateby: this.state.nip_user,
      activeyn: 'Y',
      limitpriceecommerce: 0,
    };

    // console.log('PAYLOAD SAVE ADD BATAS BAWAH', payload);

    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };

    fetch(url, option)
      .then(response => {
        // trace.stop();
        if (response.ok) {
          // this.getListbyPaging();
          this.setState({
            modal_nested_editMassal: false,
            modal_nested_parent_editMassal: false,
            loading: false,
            modal_nested: false,
            lastID: 0,
            editDimen: {},
          });
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({ loading: false, enterButton: false });
        }
      })
      .then(data => {
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          // console.log('DATA BALASANNYA', data);
          this.showNotification(data.data.message, 'info');
          if (this.state.result.length === 0) {
            return;
          } else {
            this.getListbyPaging(1, 5);
          }
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({ loading: false, enterButton: false });
      });
  };

  updateDataHeader = first_param => {
    // const trace = perf.trace('updatePembelian');
    // trace.start();
    var url = myUrl.url_editDataHeader;
    const editDimen = first_param;

    // Tanggal Awal
    var tanggalFormatAwal = editDimen.startdate;
    var strTanggalAwal = tanggalFormatAwal.split('T');
    var tanggalAwal = strTanggalAwal[0];

    // Tanggal Akhir
    var tanggalFormatAkhir = editDimen.enddate;
    var strTanggalAkhir = tanggalFormatAkhir.split('T');
    var tanggalAkhir = strTanggalAkhir[0];

    this.fetchData();
    var payload = {
      outletid: editDimen.outletid,
      ecommerceid: editDimen.ecommerceid,
      procod: editDimen.procod,
      limitpriceecommerce: parseInt(editDimen.limitpriceecommerce),
      startdate: tanggalAwal,
      enddate: tanggalAkhir,
      activeyn: editDimen.activeyn,
      updatedby: this.state.nip_user,
      limitid: editDimen.limitid,
    };

    // console.log(
    //   'EDIT HEADER PAYLOAD',
    //   payload,
    //   'PELAPAK',
    //   this.state.pilihPelapak,
    //   'ECOMMERCE',
    //   this.state.pilihEcommerce,
    //   'PERIODE',
    //   this.state.pilihType,
    // );
    const option = {
      method: 'PUT',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };
    fetch(url, option)
      .then(response => {
        // trace.stop();
        if (response.ok) {
          // this.getListbyPaging();
          this.setState({
            modal_nested_edit: false,
            modal_nested_parent_edit: false,
            loading: false,
            editDimen: {},
            lastID: 0,
          });
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({ loading: false, enterButton: false });
        }
      })
      .then(data => {
        // console.log(
        //   'EDIT DATA HEADER',
        //   data,
        //   'AS',
        //   data.data.message.includes('tidak'),
        // );
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          if (data.data.message.includes('tidak')) {
            this.showNotification(data.data.message, 'error');
          } else {
            this.showNotification(data.data.message, 'info');
            this.getListbyPaging(1, 5);
          }
        }
      })
      .catch(err => {
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({ loading: false, enterButton: false });
      });
  };

  updateBatasStandarDefault = first_param => {
    // const trace = perf.trace('updateDefault');
    // trace.start();
    var url = myUrl.url_editLimitDefault;
    const editBatasDefault = first_param;

    this.fetchData();
    var payload = {
      limitpricevslnbupripi: editBatasDefault.limitpricevslnbupripi,
      limitpricevslnbuprinonpi: editBatasDefault.limitpricevslnbuprinonpi,
      dividerlnbupripi: parseFloat(editBatasDefault.dividerlnbupripi),
      dividerlnbuprinonpi: parseFloat(editBatasDefault.dividerlnbuprinonpi),
      updatedby: this.state.nip_user,
    };

    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };
    fetch(url, option)
      .then(response => {
        // trace.stop();
        if (response.ok) {
          // this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
          this.componentDidMount();
          this.setState({
            modal_nested: false,
            modal_nested_parent: false,
            loading: false,
            currentDimenBatasStandar: [],
            // currentDimen: { ...initialCurrentDimen },
          });
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({ loading: false, enterButton: false });
        }
      })
      .then(data => {
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          this.showNotification('Data berhasil diubah', 'info');
        }
      })
      .catch(err => {
        // console.log('ISI ERRORNYA:', err);
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({ loading: false, enterButton: false });
      });
  };

  deleteBatasPerPelapak = first_param => {
    // const trace = perf.trace('updateDefault');
    // trace.start();
    var url = myUrl.url_deleteBatasPerPelapak;
    const deleteBatasPerPelapak = first_param;

    this.fetchData();
    var payload = {
      outletid: deleteBatasPerPelapak.outletid,
      ecommerceid: deleteBatasPerPelapak.ecommerceid,
      activeyn: 'N',
      // updatedby: deleteBatasPerPelapak.updatedby,
      updatedby: this.state.nip_user,
    };

    const option = {
      method: 'PUT',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };
    fetch(url, option)
      .then(response => {
        // console.log('RESPONSE DELETE', response);
        // trace.stop();
        if (response.ok) {
          // this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
          this.componentDidMount();
          this.setState({
            modal_nested_deleteBatasPerPelapak: false,
            modal_nested_parent_deleteBatasPerPelapak: false,
            loading: false,
            deleteBatasPerPelapak: [],
            // currentDimen: { ...initialCurrentDimen },
          });
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({ loading: false, enterButton: false });
        }
      })
      .then(data => {
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          this.showNotification(data.data.message, 'info');
        }
      })
      .catch(err => {
        // console.log('ISI ERRORNYA:', err);
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({ loading: false, enterButton: false });
      });
  };

  updateBatasPerPelapak = param => {
    // const trace = perf.trace('updateDefault');
    // trace.start();
    var url = myUrl.url_editLimitPerPelapak;
    const editBatasPerPelapak = param;

    this.fetchData();
    var payload = {
      outletid: editBatasPerPelapak.outletid,
      ecommerceid: editBatasPerPelapak.ecommerceid,
      limitpricevslnbupri: editBatasPerPelapak.limitpricevslnbupri,
      limitpricevslnbuprinonpi: editBatasPerPelapak.limitpricevslnbuprinonpi,
      limitpriceproduct: editBatasPerPelapak.limitpriceproduct,
      dividerlnbupripi: parseFloat(editBatasPerPelapak.dividerlnbupripi),
      dividerlnbuprinonpi: parseFloat(editBatasPerPelapak.dividerlnbuprinonpi),
      activeyn: editBatasPerPelapak.activeyn,
      updatedby: this.state.nip_user,
    };

    // console.log('ISI PAYLOAD', payload);

    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };

    // console.log('OPTION', option);
    fetch(url, option)
      .then(response => {
        // console.log('RESPONSE', response);
        // trace.stop();
        if (response.ok) {
          // this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
          this.componentDidMount();
          this.setState({
            modal_nested_editBatasPerPelapak: false,
            modal_nested_parent_editBatasPerPelapak: false,
            editBatasPerPelapak: {},
            loading: false,
          });
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal!', 'error');
          this.setState({ loading: false, enterButton: false });
        }
      })
      .then(data => {
        // console.log('DATA PER PELAPAK', data);
        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.error.code === 401) {
            this.showNotification(
              'Token anda sudah expired, silakan login kembali!',
              'error',
            );
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/',
            });
          }
        } else {
          this.showNotification(data.data.message, 'info');
        }
      })
      .catch(err => {
        // console.log('ISI ERRORNYA:', err);
        this.showNotification('Koneksi ke server gagal!', 'error');
        this.setState({ loading: false, enterButton: false });
      });
  };

  hapusProduk = first_param => () => {
    var url = myUrl.url_hapusProdukOutlet;
    const delete_data = first_param;
    var pelapakID = this.state.pilihPelapak;
    this.fetchData();
    var payload = {
      outlet_id: delete_data.pelapakID,
      procod: delete_data.procod,
    };

    const option = {
      method: 'DELETE',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
      body: JSON.stringify(payload),
    };
    fetch(url, option)
      .then(response => response.json())
      .then(data => {
        this.setState({
          modal_delete: false,
          modal_nested_delete: false,
          modal_nested_parent_delete: false,
          loading: false,
        });
        this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
        this.setState({ modal_delete: false });
        this.showNotification('Data Berhasil Di Hapus', 'info');
      });
  };

  setData = (data = null) => {
    if (data === null || data === -1) {
      return '-';
    } else {
      if (typeof data === 'number' && !Number.isInteger(data)) {
        return data.toFixed(2);
      } else {
        return data;
      }
    }
  };

  // KHUSUS STATE MODAL

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

  toggleEditData = (modalType, todo) => {
    if (!modalType) {
      const modal_edit = Object.assign({}, this.state.modal_edit);
      return this.setState({
        modal_edit: !modal_edit,
      });
    }
    if (modalType === 'nested_parent_editMassal_edit') {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        editBatasBawah: todo,
      });
    }
    if (modalType === 'nested_parent_editBatasPerPelapak') {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        editBatasPerPelapak: todo,
        tempEditBatasPerPelapak: [
          todo.dividerlnbuprinonpi,
          todo.dividerlnbupripi,
        ],
      });
    } else {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        editDimen: todo,
      });
    }
  };

  toggleDeleteData = (modalType, todo) => {
    if (!modalType) {
      const modal_delete = Object.assign({}, this.state.modal_delete);
      return this.setState({
        modal_delete: !modal_delete,
      });
    }

    if (modalType === 'nested_parent_delete') {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      });
    } else if (modalType === 'nested_parent_deleteBatasPerPelapak') {
      this.setState({
        deleteBatasPerPelapak: todo,
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      });
    } else if (modalType === 'nested_parent_nonaktifHeaderData') {
      this.setState({
        deleteDataHeader: todo,
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      });
    } else {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        delete_data: todo,
      });
    }
  };

  toggleYN = (modalType, todo) => {
    if (!modalType) {
      const modal_nonaktif = Object.assign({}, this.state.modal_nonaktif);
      return this.setState({
        modal_nonaktif: !modal_nonaktif,
      });
    }
    if (modalType === 'nested_parent_nonaktif') {
      // console.log('LOG 1');
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        nonaktif: todo,
      });
    } else {
      // console.log('LOG 2');
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        nonaktif: todo,
      });
    }
  };

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
        () => this.getPelapak(1, this.state.todosPerPages),
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
      () => this.getPelapak(1, this.state.todosPerPages),
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

  handleClose = () => {
    // console.log('CURRRRR', this.state.currentDimenBatasStandar);
    this.setState({
      currentDimenBatasStandar: {
        dividerlnbupripi: this.state.nilaiLamaPharos,
        dividerlnbuprinonpi: this.state.nilaiLamaNonPharos,
      },
      // pelapakDetail: [],
      // ecommerceDetail: [],
      editBatasBawah: {},
      resultDataProcod: [],
      // listEditMasal: [],
    });
  };

  handleCloseEditMasal = () => {
    this.setState({
      editBatasBawah: [],
      listEditMasal: [],
      pelapakDetail: [],
      ecommerceDetail: [],
      dynamicHeightEcommerce: '0px',
      dynamicHeightPelapak: '0px',
    });
  };

  canBeSearch() {
    const { procod } = this.state;
    return procod.length !== 0 && procod.trim().length !== 0;
  }

  SearchAllList() {
    const { pilihEcommerce, pilihPelapak, pilihType } = this.state;
    return pilihPelapak !== '' && pilihEcommerce !== '' && pilihType !== '';
  }

  openModalWithItemID(code, user_id, name) {
    this.setState({
      modal_delete: true,
      activeCode: code,
      activeUserId: user_id,
      name_delete: name,
    });
  }

  updateTanggalValue = field => evt => {
    this.setState(
      {
        [`${field}`]: evt.target.value,
      },
      () => this.validateTgl(field),
    );
    evt.preventDefault();
  };

  validateTgl(field) {
    var d1 = Date.parse(this.state.startDate);
    var d2 = Date.parse(this.state.endDate);
    var today = Date.parse(new Date().toJSON().slice(0, 10));

    if (isNaN(d2)) {
      if (d1 < today) {
        this.showNotification(
          'Tanggal Start tidak boleh kurang dari hari ini!',
          'error',
        );
      }
      return;
    }
    if (d1 > d2) {
      this.showNotification(
        'Tanggal Expired tidak boleh kurang dari hari ini!',
        'error',
      );
    } else {
      this.updateTanggalValue();
    }
  }

  deleteEcommerceProps(todo) {
    var ecommerceList =
      this.state.ecommerceDetail && this.state.ecommerceDetail.length;
    var newArr = this.state.ecommerceDetail.filter(
      item => item.ecommerceID !== todo.ecommerceID,
    );

    this.setState({
      ecommerceDetail: newArr,
    });
    if (ecommerceList === 1) {
      this.setState({ dynamicHeightEcommerce: '0px' });
    }
  }

  deletePelapakProps(todo) {
    var pelapakList =
      this.state.pelapakDetail && this.state.pelapakDetail.length;
    var newArr = this.state.pelapakDetail.filter(
      item => item.pelapakid !== todo.pelapakid,
    );

    this.setState({
      pelapakDetail: newArr,
    });

    if (pelapakList === 1) {
      this.setState({ dynamicHeightPelapak: '0px' });
    }
  }

  deleteListEditMassal(todo) {
    var newArr = this.state.listEditMasal.filter(
      item => item.qtybatasbawah !== todo.qtybatasbawah,
    );
    this.setState({
      listEditMasal: newArr,
    });
  }

  dynamicHeightPelapak() {
    var pelapakList =
      this.state.pelapakDetail && this.state.pelapakDetail.length;

    if (pelapakList > 0) {
      this.setState({ dynamicHeightPelapak: '120px' });
      return;
    }
    if (pelapakList === 0) {
      this.setState({ dynamicHeightPelapak: '0px' });
    }
  }

  dynamicHeightEcommerce() {
    var ecommerceList =
      this.state.ecommerceDetail && this.state.ecommerceDetail.length;

    if (ecommerceList > 0) {
      this.setState({ dynamicHeightEcommerce: '80px' });
      return;
    }
    if (ecommerceList === 0) {
      this.setState({ dynamicHeightEcommerce: '0px' });
    }
  }

  findData() {
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = true;
    this.setState(
      {
        namaProvinsi: '',
        namaEcommerce: '',
        namaPeriode: '',
        domisiliDisabled: true,
        typeDisabled: false,
        periodeDisabled: true,
        lastID: 0,
      },
      () =>
        this.getListbyPaging(this.state.currentPage, this.state.todosPerPage),
    );
  }

  resetSearch() {
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = true;
    this.setState({
      namaType: '',
      namaEcommerce: '',
      namaPeriode: '',
      domisiliDisabled: true,
      typeDisabled: false,
      periodeDisabled: true,
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
    const kotakabTodos = this.state.resultProvinsi;
    const kecamatanTodos = this.state.resultProvinsi;
    const pelapakEcommerceTodos = this.state.resultPelapakEcommerce;
    const typeTodos = this.state.resultType;
    const isEnabledSaveDomisili = this.canBeSubmittedDomisili();
    const isEnabled = this.canBeSubmitted();
    const isEnabledEdit = this.canBeSubmittedEdit();
    const isEnabledAddProduct = this.canBeSubmittedAddProduct();
    const isEnabledSaveAddProduct = this.canBeSubmittedSaveAddProduct();
    const isEnabledEditMassalEdit = this.canBeSubmittedEditMassalEdit();
    const isEnabledEditBatasPerPelapak = this.canBeSubmittedEditBatasPerPelapak();
    const isEnabledToSearch = this.canBeSearch();
    const isSearch = this.SearchAllList();

    var formatter = new Intl.NumberFormat('id-ID', {
      currency: 'IDR',
    });

    const listEcommerce = this.state.resultEcommerce;
    // console.log("A",listEcommerce )
    // console.log("B", typeTodos)
    // console.log(
    //   'AAA',
    //   this.state.pilihPelapak,
    //   this.state.resultPelapakID,
    //   this.state.pilihType,
    // );

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
            <td>{todo.out_comco}</td>
            <td>{todo.out_name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="info"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.out_code}
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
            <td>{todo.out_comco}</td>
            <td>{todo.out_name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="info"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.out_code}
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
            <td>{todo.out_comco}</td>
            <td>{todo.out_name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="info"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.out_code}
                onClick={this.setKecamatan}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderEcommerce =
      listEcommerce &&
      listEcommerce.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.ecommerce_name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="info"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.ecommerce_id}
                onClick={this.setEcommerce}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderEcommerceEditMasal =
      listEcommerce &&
      listEcommerce.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.ecommerce_name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="info"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.ecommerce_id}
                onClick={this.setEcommerceEditMassal}
              >
                Pilih
              </Button>
            </td>
          </tr>
        );
      });

    const renderPelapakEditMasal =
      pelapakEcommerceTodos &&
      pelapakEcommerceTodos.map((todo, i) => {
        return (
          <tr key={i}>
            {/* {console.log('TODOS PELAPAK ECOMMERCE', todo)} */}
            <td>{todo.outletid}</td>
            <td>{todo.outletname}</td>
            <td>{todo.ecommercename}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="info"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.outletid}
                onClick={this.setPelapakEditMasal}
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
            {todo.activeyn === 'Y' && (
              <td>
                <Badge color="success">Aktif</Badge>
              </td>
            )}
            {todo.activeyn === 'N' && (
              <td>
                <Badge color="danger">Tidak Aktif</Badge>
              </td>
            )}
            <td>{new Date(todo.lastupdated).toDateString()}</td>
            <td>
              <Button
                style={{ margin: '0px' }}
                color="secondary"
                size="sm"
                onClick={() =>
                  this.toggleEditData('nested_parent_edit', { ...todo })
                }
              >
                <MdEdit />
              </Button>
            </td>
            <td>
              <Button
                style={{ margin: '0px' }}
                color="danger"
                size="sm"
                onClick={() =>
                  this.toggleDeleteData('nested_parent_nonaktifHeaderData', {
                    ...todo,
                  })
                }
              >
                <MdDelete />
              </Button>
            </td>
          </tr>
        );
      });

    const renderBatasPerPelapak =
      this.state.resultBatasPerPelapak &&
      this.state.resultBatasPerPelapak.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.outletid}</td>
            <td>{todo.outletname}</td>
            <td>{todo.ecommercename}</td>
            <td style={{ textAlign: 'right' }}>{todo.dividerlnbupripi}</td>
            <td style={{ textAlign: 'right' }}>{todo.dividerlnbuprinonpi}</td>
            {todo.activeyn === 'Y' && (
              <td>
                <Badge color="success">Aktif</Badge>
              </td>
            )}
            {todo.activeyn === 'N' && (
              <td>
                <Badge color="danger">Tidak Aktif</Badge>
              </td>
            )}
            <td>
              <Button
                color="secondary"
                size="sm"
                onClick={() =>
                  this.toggleEditData('nested_parent_editBatasPerPelapak', {
                    ...todo,
                  })
                }
              >
                <MdEdit />
              </Button>
            </td>
            <td>
              <Button
                color="danger"
                size="sm"
                onClick={() =>
                  this.toggleDeleteData('nested_parent_deleteBatasPerPelapak', {
                    ...todo,
                  })
                }
              >
                <MdDelete />
              </Button>
            </td>
          </tr>
        );
      });

    const renderListEditMassal =
      this.state.listEditMasal &&
      this.state.listEditMasal.map((todo, i) => {
        return (
          <tr key={i}>
            {/* {console.log('TODO', todo, 'nomor', i + 1)} */}
            <td>{i + 1}</td>
            <td>{todo.procod}</td>
            <td>{todo.prodes}</td>
            <td style={{ textAlign: 'right' }}>
              {formatter.format(todo.qtybatasbawah)}
            </td>
            {/* <td>{todo.satuan}</td> */}
            <td>
              <Button
                color="secondary"
                size="sm"
                onClick={() =>
                  this.toggleEditData('nested_parent_editMassal_edit', {
                    ...todo,
                  })
                }
              >
                <MdEdit />
              </Button>
            </td>
            <td>
              <Button
                color="danger"
                size="sm"
                value={todo.qtybatasbawah}
                onClick={() => this.deleteListEditMassal({ ...todo })}
              >
                <MdDelete />
              </Button>
            </td>
          </tr>
        );
      });

    return (
      <Page>
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
                      value={this.state.namaEcommerce}
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
                <Col sm={7} style={{ textAlign: 'right', paddingRight: 0 }}>
                  {/* <Button
                    // size="sm"
                    onClick={this.toggle('nested_parent')}
                    // disabled={!pelapakID}
                    style={{ marginLeft: '1%' }}
                  >
                    Detail Farmer
                  </Button>
                  <Button
                    // size="sm"
                    onClick={this.toggle('nested_parent_batasPerPelapak')}
                    // disabled={!pelapakID}
                    style={{ marginLeft: '1%' }}
                  >
                    Detail UPJA
                  </Button>
                  <Button
                    // size="sm"
                    onClick={this.toggle('nested_parent_editMassal')}
                    // disabled={!pelapakID}
                    style={{ marginLeft: '1%' }}
                  >
                    Detail Alsin
                  </Button> */}
                </Col>
              </CardHeader>
              <CardBody>
                {/* <Row style={{ paddingBottom: 0, marginBottom: 0 }}></Row> */}
                <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                  <Col sm={2} style={{ paddingBottom: 0, marginBottom: 0 }}>
                    <Label style={{ fontWeight: 'bold' }}>Type</Label>
                  </Col>
                  <Col sm={10} style={{ paddingBottom: 0, marginBottom: 0 }}>
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
                  <Col sm={10} style={{ paddingBottom: 0, marginBottom: 0 }}>
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

                <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                  <Col sm={2} style={{ paddingBottom: 0, marginBottom: 0 }}>
                    <Label style={{ fontWeight: 'bold' }}>Kota/Kab</Label>
                  </Col>
                  <Col sm={10} style={{ paddingBottom: 0, marginBottom: 0 }}>
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
                  <Col sm={10} style={{ paddingBottom: 0, marginBottom: 0 }}>
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

                {/* <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                  <Col style={{ paddingBottom: 0, marginBottom: 0 }}>
                    <Label style={{ fontWeight: 'bold' }}>Type:&nbsp;</Label>
                    <br></br>
                    {this.state.namaTypeSave === undefined ? (
                      <Label style={{ fontWeight: 'bold' }}>-</Label>
                    ) : (
                      <Label style={{ fontWeight: 'bold' }}>
                        {this.state.namaTypeSave}
                      </Label>
                    )}
                  </Col>
                  <Col style={{ paddingBottom: 0, marginBottom: 0 }}>
                    <Label style={{ fontWeight: 'bold' }}>
                      Provinsi:&nbsp;
                    </Label>
                    <br></br>
                    {this.state.namaProvinsiSave === undefined ? (
                      <Label style={{ fontWeight: 'bold' }}>-</Label>
                    ) : (
                      <Label style={{ fontWeight: 'bold' }}>
                        {this.state.namaProvinsiSave}
                      </Label>
                    )}
                  </Col>
                  <Col style={{ paddingBottom: 0, marginBottom: 0 }}>
                    <Label style={{ fontWeight: 'bold' }}>
                      Kota/Kab:&nbsp;
                    </Label>
                    <br></br>
                    {this.state.namaKotaKabSave === undefined ? (
                      <Label style={{ fontWeight: 'bold' }}>-</Label>
                    ) : (
                      <Label style={{ fontWeight: 'bold' }}>
                        {this.state.namaKotaKabSave}
                      </Label>
                    )}
                  </Col>
                  <Col style={{ paddingBottom: 0, marginBottom: 0 }}>
                    <Label style={{ fontWeight: 'bold' }}>
                      Kecamatan:&nbsp;
                    </Label>
                    <br></br>
                    {this.state.namaKecamatanSave === undefined ? (
                      <Label style={{ fontWeight: 'bold' }}>-</Label>
                    ) : (
                      <Label style={{ fontWeight: 'bold' }}>
                        {this.state.namaKecamatanSave}
                      </Label>
                    )}
                  </Col>
                </Row> */}
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
                      <th>Status</th>
                      <th>Tgl Update</th>
                      <th>Edit</th>
                      <th>Hapus</th>
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
                {/* <Row>
                  <Col md="9" sm="12" xs="12">
                    <InputGroup>
                      <InputGroupAddon addonType="prepend">
                        Tampilkan
                      </InputGroupAddon>
                      <select
                        name="todosPerPage"
                        style={{ height: '38px' }}
                        value={this.state.value}
                        onChange={e => this.handleSelect(e)}
                      >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="20">20</option>
                      </select>
                      <InputGroupAddon addonType="append">
                        Baris Per-Halaman
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                  <Col md="3" sm="12" xs="12">
                    <Card className="mb-3s">
                      <ButtonGroup>
                        <Button
                          name="FirstButton"
                          value={1}
                          // onClick={e =>
                          //   this.paginationButton(e, 0, this.state.lastID)
                          // }
                          onClick={() => this.firstPage()}
                        >
                          First &#10092;&#10092;
                        </Button>
                        <Button
                          name="PrevButton"
                          value={this.state.currentPage}
                          onClick={e =>
                            this.paginationButton(e, -1, this.state.maxPage)
                          }
                        >
                          &#10092;
                        </Button>
                        <input
                          type="text"
                          placeholder="Page"
                          outline="none"
                          value={this.state.currentPage}
                          onChange={e =>
                            this.setState({ currentPage: e.target.value })
                          }
                          onKeyPress={e => this.enterPressedPage(e)}
                          style={{
                            height: '38px',
                            width: '75px',
                            textAlign: 'center',
                          }}
                        />
                        <Button
                          name="NextButton"
                          value={this.state.currentPage}
                          // onClick={e =>
                          //   this.paginationButton(e, 1, this.state.maxPage)
                          // }
                          onClick={() => this.getListbyPaging()}
                        >
                          Next &#10093;
                        </Button>
                        <Button
                          name="LastButton"
                          value={this.state.maxPage}
                          onClick={e =>
                            this.paginationButton(e, 0, this.state.maxPage)
                          }
                        >
                          &#10093;&#10093;
                        </Button>
                      </ButtonGroup>
                    </Card>
                  </Col>
                </Row> */}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* KHUSUS MODAL */}

        {/* Modal Aktif YN Header*/}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_nonaktifHeaderData}
          toggle={() =>
            this.toggleDeleteData('nested_parent_nonaktifHeaderData')
          }
          className={this.props.className}
        >
          <ModalHeader>Konfirmasi Penghapusan Data Header</ModalHeader>
          <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.deleteHeaderData(this.state.deleteDataHeader)}
              disabled={loading}
            >
              {!loading && 'Ya'}
              {loading && <MdAutorenew />}
              {loading && 'Sedang diproses'}
            </Button>{' '}
            {!loading && (
              <Button
                color="secondary"
                onClick={() =>
                  this.toggleDeleteData('nested_parent_nonaktifHeaderData')
                }
              >
                Tidak
              </Button>
            )}
          </ModalFooter>
        </Modal>
        {/* Modal Aktif YN Header*/}

        {/* Modal Aktif YN Detail (dalam edit header)*/}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_nonaktif}
          toggle={this.toggle('nested_parent_nonaktif')}
          className={this.props.className}
        >
          <ModalHeader>Konfirmasi Penghapusan</ModalHeader>
          <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() =>
                this.updateBatasStandarDefault(
                  this.state.currentDimenBatasStandar,
                )
              }
              disabled={loading}
            >
              {!loading && 'Ya'}
              {loading && <MdAutorenew />}
              {loading && 'Sedang diproses'}
            </Button>{' '}
            {!loading && (
              <Button
                color="secondary"
                onClick={this.toggle('nested_parent_nonaktif')}
              >
                Tidak
              </Button>
            )}
          </ModalFooter>
        </Modal>
        {/* Modal Aktif YN Detail (dalam edit header)*/}

        {/* Modal Batas Standar */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent}
          toggle={this.toggle('nested_parent')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent')}>
            Batas Standar (Nilai Pembagi LNBuPri)
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={e => e.preventDefault()}>
              <FormGroup>
                <Label>Produk Pharos</Label>
                <Input
                  type="number"
                  name="dividerlnbupripi"
                  min={0}
                  autoComplete="off"
                  onKeyPress={e => this.numValidate(e)}
                  onChange={evt =>
                    this.updateInputValue(
                      evt.target.value,
                      evt.target.name,
                      'currentDimenBatasStandar',
                    )
                  }
                  value={
                    this.state.currentDimenBatasStandar &&
                    this.state.currentDimenBatasStandar.dividerlnbupripi
                  }
                  placeholder="Tidak boleh minus dan tidak boleh kosong"
                />
                <Label>Produk Non-Pharos</Label>
                <Input
                  placeholder="Tidak boleh minus dan tidak boleh kosong"
                  type="number"
                  name="dividerlnbuprinonpi"
                  autoComplete="off"
                  min={0}
                  onKeyPress={e => this.numValidate(e)}
                  onChange={evt =>
                    this.updateInputValue(
                      evt.target.value,
                      evt.target.name,
                      'currentDimenBatasStandar',
                    )
                  }
                  value={
                    this.state.currentDimenBatasStandar &&
                    this.state.currentDimenBatasStandar.dividerlnbuprinonpi
                  }
                />
              </FormGroup>
            </Form>
            <br></br>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!isEnabled}
              color="primary"
              onClick={this.toggle('nested')}
            >
              Simpan Batas Default
            </Button>
            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_nested}
              toggle={this.toggle('nested')}
            >
              <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() =>
                    this.updateBatasStandarDefault(
                      this.state.currentDimenBatasStandar,
                    )
                  }
                  disabled={loading}
                >
                  {!loading && 'Ya'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>{' '}
                {!loading && (
                  <Button color="secondary" onClick={this.toggle('nested')}>
                    Tidak
                  </Button>
                )}
              </ModalFooter>
            </Modal>{' '}
            <Button color="secondary" onClick={this.toggle('nested_parent')}>
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Batas Standar */}

        {/* Modal Batas per Pelapak */}
        <Modal
          size="xl"
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_batasPerPelapak}
          toggle={this.toggle('nested_parent_batasPerPelapak')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_batasPerPelapak')}>
            Batas per Pelapak
          </ModalHeader>
          <ModalBody style={{ paddingTop: 0 }}>
            {/* <CardHeader
              className="d-flex justify-content-between"
              style={{ paddingLeft: 0, paddingRight: 0 }}
            >
              <Col sm={6} style={{ paddingLeft: 0 }}>
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
                    placeholder="Search ..."
                    id="search"
                    onChange={evt => this.updateSearchValueList(evt)}
                    onKeyPress={event =>
                      this.enterPressedSearchList(event, true)
                    }
                  />
                </Form>
              </Col>
              <Col sm={6} style={{ paddingRight: 0 }}>
                <Form inline style={{ float: 'right' }}>
                  <Label
                    id="ecommerceBatasPerPelapak"
                    style={{
                      fontWeight: 'bold',
                    }}
                  >
                    E-commerce:&nbsp;
                  </Label>
                  <Input
                    type="select"
                    // disabled={this.state.domisiliDisabled}
                    placeholder="Pilih E-Commerce"
                    style={{ fontWeight: 'bold' }}
                    value={this.state.namaEcommerce}
                    onChange={event => this.setEcommerceBatasPerPelapak(event)}
                  >
                    <option selected hidden id="pilih">
                      Pilih E-Commerce
                    </option>
                    {renderEcommerce}
                  </Input>
                </Form>
              </Col>
            </CardHeader> */}
            <CardBody style={{ paddingTop: 0 }}>
              <Table responsive striped id="tableBatasPerPelapak">
                <thead>
                  <tr>
                    <th>Kode</th>
                    <th>pelapak</th>
                    <th>Ecommerce</th>
                    <th>Pembagi Pharos</th>
                    <th>Pembagi Non-Pharos</th>
                    <th>Status</th>
                    <th>Edit</th>
                    <th>Hapus</th>
                  </tr>
                </thead>
                <tbody>
                  {renderBatasPerPelapak}
                  {this.state.resultBatasPerPelapak.length === 0 && (
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
            </CardBody>
            <CardBody>
              <Row>
                <Col md="9" sm="12" xs="12">
                  {/* <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      Tampilkan
                    </InputGroupAddon>
                    <select
                      name="todosPerPage"
                      style={{ height: '38px' }}
                      value={this.state.value}
                      onChange={e => this.handleSelect(e)}
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                    </select>
                    <InputGroupAddon addonType="append">
                      Baris Per-Halaman
                    </InputGroupAddon>
                  </InputGroup> */}
                </Col>
                <Col md="3" sm="12" xs="12">
                  <Card className="mb-3s">
                    <ButtonGroup>
                      <Button
                        name="FirstButton"
                        value={1}
                        onClick={e =>
                          this.paginationButton(e, 0, this.state.maxPage)
                        }
                      >
                        &#10092;&#10092;
                      </Button>
                      <Button
                        name="PrevButton"
                        value={this.state.currentPage}
                        onClick={e =>
                          this.paginationButton(e, -1, this.state.maxPage)
                        }
                      >
                        &#10092;
                      </Button>
                      <input
                        type="text"
                        placeholder="Page"
                        outline="none"
                        value={this.state.currentPage}
                        onChange={e =>
                          this.setState({ currentPage: e.target.value })
                        }
                        onKeyPress={e => this.enterPressedPage(e)}
                        style={{
                          height: '38px',
                          width: '75px',
                          textAlign: 'center',
                        }}
                      />
                      <Button
                        name="NextButton"
                        value={this.state.currentPage}
                        onClick={e =>
                          this.paginationButton(e, 1, this.state.maxPage)
                        }
                      >
                        &#10093;
                      </Button>
                    </ButtonGroup>
                  </Card>
                </Col>
              </Row>
            </CardBody>
          </ModalBody>
        </Modal>
        {/* Modal Batas per Pelapak */}

        {/* Modal Delete Batas per Pelapak*/}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_deleteBatasPerPelapak}
          toggle={() =>
            this.toggleDeleteData('nested_parent_deleteBatasPerPelapak')
          }
          className={this.props.className}
        >
          <ModalHeader>Konfirmasi Penghapusan Batas Per Pelapak</ModalHeader>
          <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() =>
                this.deleteBatasPerPelapak(this.state.deleteBatasPerPelapak)
              }
              disabled={loading}
            >
              {!loading && 'Ya'}
              {loading && <MdAutorenew />}
              {loading && 'Sedang diproses'}
            </Button>{' '}
            {!loading && (
              <Button
                color="secondary"
                onClick={() =>
                  this.toggleDeleteData('nested_parent_deleteBatasPerPelapak')
                }
              >
                Tidak
              </Button>
            )}
          </ModalFooter>
        </Modal>
        {/* Modal Delete Batas per Pelapak */}

        {/* Modal Edit batas per pelapak */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_editBatasPerPelapak}
          toggle={this.toggle('nested_parent_editBatasPerPelapak')}
          className={this.props.className}
        >
          <ModalHeader
            toggle={this.toggle('nested_parent_editBatasPerPelapak')}
          >
            Edit Batas per Pelapak
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={e => e.preventDefault()}>
              {/* {console.log('VALUE', this.state.editBatasPerPelapak)} */}
              <FormGroup>
                <Row>
                  <Col>
                    <Label>Kode</Label>
                    <Input
                      type="text"
                      disabled
                      value={
                        this.state.editBatasPerPelapak &&
                        this.state.editBatasPerPelapak.outletid
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label>Pelapak</Label>
                    <Input
                      type="text"
                      disabled
                      value={
                        this.state.editBatasPerPelapak &&
                        this.state.editBatasPerPelapak.outletname
                      }
                    />
                  </Col>
                  <Col>
                    <Label>Ecommerce</Label>
                    <Input
                      type="text"
                      disabled
                      value={
                        this.state.editBatasPerPelapak &&
                        this.state.editBatasPerPelapak.ecommercename
                      }
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Label>Pembagi Pharos</Label>
                    <Input
                      type="number"
                      name="dividerlnbupripi"
                      style={{ textAlign: 'right' }}
                      autoComplete="off"
                      placeholder="Qty Batas Bawah"
                      min={0}
                      onKeyPress={e => this.numValidate(e)}
                      onChange={evt =>
                        this.updateInputValue(
                          evt.target.value,
                          evt.target.name,
                          'editBatasPerPelapak',
                        )
                      }
                      value={
                        this.state.editBatasPerPelapak &&
                        this.state.editBatasPerPelapak.dividerlnbupripi
                      }
                    />
                  </Col>
                  <Col>
                    <Label>Pembagi Non-Pharos</Label>
                    <Input
                      type="number"
                      name="dividerlnbuprinonpi"
                      autoComplete="off"
                      placeholder="Qty Batas Bawah"
                      style={{ textAlign: 'right' }}
                      min={0}
                      onKeyPress={e => this.numValidate(e)}
                      onChange={evt =>
                        this.updateInputValue(
                          evt.target.value,
                          evt.target.name,
                          'editBatasPerPelapak',
                        )
                      }
                      value={
                        this.state.editBatasPerPelapak &&
                        this.state.editBatasPerPelapak.dividerlnbuprinonpi
                      }
                    />
                  </Col>
                </Row>
              </FormGroup>
            </Form>
            <br></br>
            {/* <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label> */}
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!isEnabledEditBatasPerPelapak}
              color="primary"
              onClick={this.toggle('nested_editBatasPerPelapak')}
            >
              Simpan Batas per Pelapak
            </Button>
            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_nested_editBatasPerPelapak}
              toggle={this.toggle('nested_editBatasPerPelapak')}
            >
              <ModalHeader>
                Konfirmasi Penyimpanan Batas per Pelapak
              </ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() =>
                    this.updateBatasPerPelapak(this.state.editBatasPerPelapak)
                  }
                  disabled={loading}
                >
                  {!loading && 'Ya'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>{' '}
                {!loading && (
                  <Button
                    color="secondary"
                    onClick={this.toggle('nested_editBatasPerPelapak')}
                  >
                    Tidak
                  </Button>
                )}
              </ModalFooter>
            </Modal>{' '}
            <Button
              color="secondary"
              onClick={this.toggle('nested_parent_editBatasPerPelapak')}
            >
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Edit batas per pelapak */}

        {/* Modal edit massal */}
        <Modal
          size="lg"
          onExit={this.handleCloseEditMasal}
          isOpen={this.state.modal_nested_parent_editMassal}
          toggle={this.toggle('nested_parent_editMassal')}
          className={this.props.className}
          scrollable={true}
          centered={true}
        >
          <ModalHeader toggle={this.toggle('nested_parent_editMassal')}>
            Tambah Masal
          </ModalHeader>
          <ModalBody>
            <CardBody>
              {/* ROW 1 */}
              <Row
                className="d-flex justify-content-between"
                //   style={{ paddingRight: 0, paddingLeft: 0 }}
              >
                <Col sm={4}>
                  <Label style={{ marginTop: '8px' }}>Periode</Label>
                </Col>
                <Col sm={8}>
                  <InputGroup>
                    <Input
                      type="date"
                      onChange={this.updateTanggalValue('startDate')}
                    ></Input>
                    <InputGroupAddon addonType="append">s/d</InputGroupAddon>
                    <Input
                      type="date"
                      onChange={this.updateTanggalValue('endDate')}
                    ></Input>
                  </InputGroup>
                </Col>
              </Row>
              {/* ROW 1 */}
              <br></br>
              {/* ROW 2 Pelapak*/}
              <Row className="d-flex justify-content-between">
                <Col sm={4}>
                  <Label style={{ marginTop: '8px' }}>Pelapak</Label>
                </Col>
                <Col sm={8} style={{ textAlign: 'right' }}>
                  <ButtonGroup>
                    <Button
                      style={{ float: 'right' }}
                      onClick={this.toggle('nested_parent_list_editMasal')}
                    >
                      <MdAdd></MdAdd>
                    </Button>
                    <Button
                      color="danger"
                      style={{ float: 'right' }}
                      disabled={this.state.pelapakDetail.length === 0}
                      onClick={() =>
                        this.setState({
                          pelapakDetail: [],
                          dynamicHeightPelapak: '0px',
                        })
                      }
                    >
                      <MdDelete></MdDelete>
                    </Button>
                  </ButtonGroup>
                  {/* NEW LIST PELAPAK */}
                  <Scrollbar
                    style={{ height: this.state.dynamicHeightPelapak }}
                  >
                    {this.state.pelapakDetail &&
                      this.state.pelapakDetail.map((todo, i) =>
                        this.state.pelapakDetail.length === 0 ? (
                          this.state.pelapakDetail.length + 1
                        ) : (
                          <InputGroup style={{ marginTop: '1%' }} id={i}>
                            <Input
                              key={i}
                              disabled
                              placeholder="Pelapak yang dipilih"
                              value={todo.outletname}
                            ></Input>
                            <InputGroupAddon addonType="append">
                              <Button
                                onClick={() =>
                                  this.deletePelapakProps({ ...todo })
                                }
                                color="danger"
                              >
                                <MdDelete
                                  onClick={() =>
                                    this.deletePelapakProps({ ...todo })
                                  }
                                />
                              </Button>
                            </InputGroupAddon>
                          </InputGroup>
                        ),
                      )}
                  </Scrollbar>
                  {/* NEW LIST PELAPAK */}
                </Col>
              </Row>
              {/* ROW 2 */}
              <br></br>
              {/* ROW 3 Ecommerce*/}
              {/* <Row
                className="d-flex justify-content-between"
                //   style={{ paddingRight: 0, paddingLeft: 0 }}
              >
                <Col sm={4}>
                  <Label style={{ marginTop: '8px' }}>Ecommerce</Label>
                </Col>
                <Col sm={8} style={{ textAlign: 'right' }}>
                  <ButtonGroup>
                    <Button
                      style={{ float: 'right' }}
                      onClick={this.toggle(
                        'nested_parent_list_ecommerceListEditMasal',
                      )}
                    >
                      <MdAdd></MdAdd>
                    </Button>
                    <Button
                      color="danger"
                      style={{ float: 'right' }}
                      disabled={this.state.ecommerceDetail.length === 0}
                      onClick={() =>
                        this.setState({
                          ecommerceDetail: [],
                          dynamicHeightEcommerce: '0px',
                        })
                      }
                    >
                      <MdDelete></MdDelete>
                    </Button>
                  </ButtonGroup> */}

              {/* NEW LIST ECOMMERCE */}
              {/* <Scrollbar
                    style={{ height: this.state.dynamicHeightEcommerce }}
                  >
                    {this.state.ecommerceDetail &&
                      this.state.ecommerceDetail.map(
                        (todo, i) =>
                          this.state.ecommerceDetail.length === 0 ? (
                            this.state.ecommerceDetail.length + 1
                          ) : (
                            <InputGroup style={{ marginTop: '1%' }} id={i}>
                              <Input
                                key={i}
                                id={i}
                                disabled
                                placeholder="Ecommerce yang dipilih:"
                                value={todo.ecommerceName}
                              ></Input>
                              <InputGroupAddon addonType="append">
                                <Button
                                  onClick={() =>
                                    this.deleteEcommerceProps({ ...todo })
                                  }
                                  color="danger"
                                  value={todo.ecommerceID}
                                >
                                  <MdDelete
                                    onClick={() =>
                                      this.deleteEcommerceProps({ ...todo })
                                    }
                                  />
                                </Button>
                              </InputGroupAddon>
                            </InputGroup>
                          ),
                        <Input />,
                      )}
                  </Scrollbar> */}
              {/* NEW LIST ECOMMERCE */}
              {/* </Col>
              </Row> */}
              {/* ROW 3 */}
            </CardBody>
            <CardBody>
              <Row
                className="d-flex justify-content-between"
                style={{ marginBottom: '1%' }}
                //   style={{ paddingRight: 0, paddingLeft: 0 }}
              >
                <Label
                  style={{
                    fontWeight: 'bold',
                    marginLeft: '2%',
                    marginTop: '8px',
                  }}
                >
                  Batas Bawah
                </Label>
                <Button
                  size="sm"
                  onClick={this.toggle('nested_parent_tambahProduk')}
                >
                  Tambah produk
                </Button>
              </Row>
              <Table responsive striped id="tableBatasPerPelapak">
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Procod</th>
                    <th>Nama Produk</th>
                    <th>Batas Bawah</th>
                    {/* <th>Satuan</th> */}
                    <th>Edit</th>
                    <th>Hapus</th>
                  </tr>
                </thead>
                <tbody>{renderListEditMassal}</tbody>
                {this.state.listEditMasal.length === 0 && (
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
              </Table>
            </CardBody>
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!isEnabledSaveAddProduct}
              // disabled={this.state.listEditMasal.length === 0}
              color="primary"
              onClick={this.toggle('nested_editMassal')}
            >
              Simpan Penambahan
            </Button>
            <Modal
              onExit={this.handleCloseEditMasal}
              isOpen={this.state.modal_nested_editMassal}
              toggle={this.toggle('nested_editMassal')}
            >
              <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() => this.insertListEditMasal()}
                  disabled={loading}
                >
                  {!loading && 'Ya'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>{' '}
                {!loading && (
                  <Button
                    color="secondary"
                    onClick={this.toggle('nested_editMassal')}
                  >
                    Tidak
                  </Button>
                )}
              </ModalFooter>
            </Modal>{' '}
            <Button
              color="secondary"
              onClick={this.toggle('nested_parent_editMassal')}
            >
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Batas Edit Massal */}

        {/* Modal Tambah Produk */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_tambahProduk}
          toggle={this.toggle('nested_parent_tambahProduk')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_tambahProduk')}>
            Tambah Produk
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={e => e.preventDefault()}>
              <FormGroup>
                <Label>Cari Procod</Label>
                <InputGroup>
                  <Input
                    type="text"
                    id="unit"
                    autoComplete="off"
                    onChange={evt => this.inputBarcode(evt)}
                    onKeyPress={event =>
                      this.onEnterSearchProcod(event, this.state.procod)
                    }
                    value={this.state.procod}
                    name="namaunit"
                    placeholder="Masukkan Procod"
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      style={{ width: '100px', textAlign: 'center' }}
                      disabled={!isEnabledToSearch}
                      onClick={this.searchBarcode(this.state.procod)}
                    >
                      Cari
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
                <br></br>
                <Label>Procod</Label>
                <Input
                  type="text"
                  disabled
                  value={
                    this.state.resultDataProcod &&
                    this.state.resultDataProcod.ProductID
                  }
                />
                <Label>Nama</Label>
                <Input
                  type="text"
                  disabled
                  value={
                    this.state.resultDataProcod &&
                    this.state.resultDataProcod.ProductName
                  }
                />
                {/* <Label>Satuan</Label>
                <Input type="text" disabled value={this.state.resultDataProcod} /> */}
                <Label>Batas Bawah</Label>
                <Input
                  type="number"
                  min={0}
                  name="qtyBatasBawah"
                  style={{ textAlign: 'right' }}
                  placeholder="Qty Batas Bawah"
                  onKeyPress={e => this.numValidate(e)}
                  onChange={evt =>
                    this.updateInputValue(
                      evt.target.value,
                      evt.target.name,
                      'currentDimen',
                    )
                  }
                  value={this.state.qtyBatasBawah}
                />
              </FormGroup>
            </Form>
            <br></br>
            {/* <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label> */}
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!isEnabledAddProduct}
              color="primary"
              onClick={this.toggle('nested_tambahProduk')}
            >
              Simpan Tambah Produk
            </Button>
            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_nested_tambahProduk}
              toggle={this.toggle('nested_tambahProduk')}
            >
              <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() =>
                    this.setListEditMassal(this.state.editBatasBawah, {
                      ...this.state.editBatasBawah,
                    })
                  }
                  disabled={loading}
                >
                  {!loading && 'Ya'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>{' '}
                {!loading && (
                  <Button
                    color="secondary"
                    onClick={this.toggle('nested_tambahProduk')}
                  >
                    Tidak
                  </Button>
                )}
              </ModalFooter>
            </Modal>{' '}
            <Button
              color="secondary"
              onClick={this.toggle('nested_parent_tambahProduk')}
            >
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Tambah Produk */}

        {/* Modal Edit - Edit Masal */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_editMassal_edit}
          toggle={this.toggle('nested_parent_editMassal_edit')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_editMassal_edit')}>
            Edit Batas Bawah Produk
          </ModalHeader>
          <ModalBody>
            <Form onSubmit={e => e.preventDefault()}>
              <FormGroup>
                <Label>Procod</Label>
                <Input
                  type="text"
                  disabled
                  value={
                    this.state.editBatasBawah &&
                    this.state.editBatasBawah.procod
                  }
                />
                <Label>Nama</Label>
                <Input
                  type="text"
                  disabled
                  value={
                    this.state.editBatasBawah &&
                    this.state.editBatasBawah.prodes
                  }
                />
                {/* <Label>Satuan</Label>
                <Input
                  type="text"
                  disabled
                  value={
                    this.state.editBatasBawah &&
                    this.state.editBatasBawah.satuan
                  }
                /> */}
                <Label>Batas Bawah</Label>
                <Input
                  type="number"
                  name="qtybatasbawah"
                  autoComplete="off"
                  placeholder="Qty Batas Bawah"
                  min={0}
                  style={{ textAlign: 'right' }}
                  onKeyPress={e => this.numValidate(e)}
                  onChange={evt =>
                    this.updateInputValue(
                      parseInt(evt.target.value),
                      evt.target.name,
                      'editBatasBawah',
                    )
                  }
                  value={
                    this.state.editBatasBawah &&
                    parseInt(this.state.editBatasBawah.qtybatasbawah)
                  }
                />
              </FormGroup>
            </Form>
            <br></br>
            {/* <Label style={{ fontSize: "12px" }}>CTRL+S untuk simpan</Label> */}
          </ModalBody>
          <ModalFooter>
            <Button
              disabled={!isEnabledEditMassalEdit}
              color="primary"
              onClick={this.toggle('nested_editMassal_edit')}
            >
              Simpan Edit Batas Bawah
            </Button>
            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_nested_editMassal_edit}
              toggle={this.toggle('nested_editMassal_edit')}
            >
              <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onClick={() =>
                    this.setListEditMassalEdit(this.state.editBatasBawah, {
                      ...this.state.editBatasBawah,
                    })
                  }
                  disabled={loading}
                >
                  {!loading && 'Ya'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>{' '}
                {!loading && (
                  <Button
                    color="secondary"
                    onClick={this.toggle('nested_editMassal_edit')}
                  >
                    Tidak
                  </Button>
                )}
              </ModalFooter>
            </Modal>{' '}
            <Button
              color="secondary"
              onClick={this.toggle('nested_parent_editMassal_edit')}
            >
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Edit - Edit Masal */}

        {/* Modal Hapus */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_delete}
          toggle={this.toggle('delete')}
        >
          <ModalHeader toggle={this.toggle('delete')}>Hapus Produk</ModalHeader>
          <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={this.hapusProduk(this.state.delete_data)}
              disabled={loading}
            >
              {!loading && <span>Ya</span>}
              {loading && <MdAutorenew />}
              {loading && <span>Sedang diproses</span>}
            </Button>
            {!loading && (
              <Button color="secondary" onClick={this.toggle('delete')}>
                Tidak
              </Button>
            )}
          </ModalFooter>
        </Modal>
        {/* Modal Hapus */}

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
                  {console.log('ISINYA:', this.state.namaProvinsi)}
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
              Simpan
            </Button>
            <Button color="danger" onClick={this.handleCloseDomisili}>
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal List Domisili */}

        {/* Modal List Ecommerce Edit Masal */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_list_ecommerceListEditMasal}
          toggle={this.toggle('nested_parent_list_ecommerceListEditMasal')}
          className={this.props.className}
        >
          <ModalHeader
            toggle={this.toggle('nested_parent_list_ecommerceListEditMasal')}
          >
            List Ecommerce
          </ModalHeader>
          <ModalBody>
            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ border: 'none' }}>
                    <Label style={{ textAlign: 'left' }}>Nama Ecommerce</Label>
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderEcommerceEditMasal}
                {!renderEcommerceEditMasal && (
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
        {/* Modal List Ecommerce Edit Masal */}

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
                {renderProvinsi}
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

        {/* Modal List Pelapak Edit Masal */}
        <Modal
          size="lg"
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_list_editMasal}
          toggle={this.toggle('nested_parent_list_editMasal')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_list_editMasal')}>
            List Pelapak
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col>
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
                    placeholder="Pilih Pelapak yang di tuju"
                    id="search"
                    onChange={evt => this.updateSearchValue(evt)}
                    onKeyPress={event =>
                      this.enterPressedSearchListEditMasal(event, true)
                    }
                  />
                  {/* <Button style={{ float:'right' }} onClick={() => this.getListbyPagingAll(this.state.currentPage, this.state.todosPerPage)}>All Outlet</Button> */}
                </Form>
              </Col>
              <Col>
                <InputGroup>
                  <InputGroupAddon addonType="prepend">Ecom</InputGroupAddon>
                  <select
                    name="todosPerPage"
                    style={{ height: '38px' }}
                    value={this.state.value}
                    onChange={e => this.handleSelectEditMasal(e)}
                  >
                    <option value="">All</option>
                    <option value="1">Tokopedia</option>
                    <option value="2">Shopee</option>
                  </select>
                </InputGroup>
              </Col>
            </Row>

            <Table responsive striped>
              <thead>
                <tr>
                  <th style={{ border: 'none' }}>
                    <Label style={{ textAlign: 'left' }}>Comco</Label>
                  </th>
                  <th style={{ border: 'none' }}>
                    <Label style={{ textAlign: 'left' }}>Pelapak</Label>
                  </th>
                  <th style={{ border: 'none' }}>
                    <Label style={{ textAlign: 'left' }}>Ecommerce</Label>
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderPelapakEditMasal}
                {!pelapakEcommerceTodos && (
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
          {/* <ModalFooter>
            <Row>
              <Col sm="6">
                <Input
                  disabled
                  style={{
                    textAlign: 'left',
                    backgroundColor: 'transparent',
                    border: 0,
                  }}
                  value={
                    'Halaman: ' +
                    this.state.realCurrentPages +
                    '/' +
                    this.state.maxPages
                  }
                ></Input>
              </Col>
              <Col sm="6">
                <Card className="mb-3s">
                  <ButtonGroup>
                    <Button
                      name="FirstButton"
                      value={1}
                      onClick={e =>
                        this.paginationButtonList(e, 0, this.state.maxPages)
                      }
                    >
                      &#10092;&#10092;
                    </Button>
                    <Button
                      name="PrevButton"
                      value={this.state.currentPages}
                      onClick={e =>
                        this.paginationButtonList(e, -1, this.state.maxPages)
                      }
                    >
                      &#10092;
                    </Button>
                    <input
                      type="text"
                      placeholder="Page"
                      outline="none"
                      value={this.state.currentPages}
                      onChange={e =>
                        this.setState({
                          currentPages: e.target.value,
                        })
                      }
                      onKeyPress={e => this.enterPressedPageList(e)}
                      style={{
                        height: '38px',
                        width: '75px',
                        textAlign: 'center',
                      }}
                    />
                    <Button
                      name="NextButton"
                      value={this.state.currentPages}
                      onClick={e =>
                        this.paginationButtonList(e, 1, this.state.maxPages)
                      }
                    >
                      &#10093;
                    </Button>
                    <Button
                      name="LastButton"
                      value={this.state.maxPages}
                      onClick={e =>
                        this.paginationButtonList(e, 0, this.state.maxPages)
                      }
                    >
                      &#10093;&#10093;
                    </Button>
                  </ButtonGroup>
                </Card>
              </Col>
            </Row>
          </ModalFooter> */}
        </Modal>
        {/* Modal List Pelapak Edit Masal */}

        {/* Modal Edit */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_edit}
          toggle={this.toggle('nested_parent_edit')}
          className={this.props.className}
        >
          <ModalHeader toggle={this.toggle('nested_parent_edit')}>
            Edit Pembelian Per-Outlet
          </ModalHeader>
          <ModalBody>
            <Form>
              {/* {console.log('EDIT DIMEN', this.state.editDimen)} */}
              <FormGroup>
                <Label>Procod</Label>
                <Input
                  type="text"
                  disabled={true}
                  value={this.state.editDimen && this.state.editDimen.procod}
                />
                <Label>Nama Produk</Label>
                <Input
                  type="text"
                  disabled
                  name="nama"
                  value={
                    this.state.editDimen && this.state.editDimen.productname
                  }
                />
                <Label>Batas Bawah</Label>
                <Input
                  type="number"
                  name="limitpriceecommerce"
                  placeholder="Batas Bawah"
                  min="0"
                  style={{ textAlign: 'right' }}
                  value={
                    this.state.editDimen &&
                    this.state.editDimen.limitpriceecommerce
                  }
                  onChange={evt =>
                    this.updateInputValue(
                      evt.target.value,
                      evt.target.name,
                      'editDimen',
                    )
                  }
                />
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              disabled={!isEnabledEdit}
              onClick={this.toggle('nested_edit')}
            >
              Simpan
            </Button>
            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_nested_edit}
              toggle={this.toggle('nested_edit')}
            >
              <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  id="btnEdit"
                  color="primary"
                  onClick={() => this.updateDataHeader(this.state.editDimen)}
                  disabled={loading}
                >
                  {!loading && 'Ya'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>
                {!loading && (
                  <Button
                    color="secondary"
                    onClick={this.toggle('nested_edit')}
                  >
                    Tidak
                  </Button>
                )}
              </ModalFooter>
            </Modal>
            <Button
              color="secondary"
              onClick={this.toggle('nested_parent_edit')}
            >
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* KHUSUS MODAL */}
      </Page>
    );
  }

  canBeSubmittedDomisili() {
    const { pilihProvinsi, pilihKotaKab, pilihKecamatan } = this.state;
    console.log(
      'DISABLE',
      pilihProvinsi !== '',
      pilihKotaKab !== '',
      pilihKecamatan !== '',
    );
    return pilihProvinsi !== '' && pilihKotaKab !== '' && pilihKecamatan !== '';
  }

  canBeSubmitted() {
    const {
      currentDimenBatasStandar,
      nilaiLamaPharos,
      nilaiLamaNonPharos,
    } = this.state;
    var nilaiPharosLama =
      currentDimenBatasStandar && currentDimenBatasStandar.dividerlnbupripi;
    var nilaiNonPharosLama =
      currentDimenBatasStandar && currentDimenBatasStandar.dividerlnbuprinonpi;
    var nilaiNonPharosLama2 =
      nilaiNonPharosLama && nilaiNonPharosLama.toString();
    var nilaiPharosLama2 = nilaiPharosLama && nilaiPharosLama.toString();
    var nilaiLama = nilaiLamaPharos && nilaiLamaPharos.toString();
    var nilaiNonLama = nilaiLamaNonPharos && nilaiLamaNonPharos.toString();

    return (
      (nilaiNonPharosLama2 !== nilaiNonLama ||
        nilaiPharosLama2 !== nilaiLama) &&
      nilaiPharosLama2 !== '' &&
      nilaiNonPharosLama2 !== ''
    );
  }

  canBeSubmittedEdit() {
    const { currentDimen, editDimen } = this.state;
    const nilaiLama = currentDimen && currentDimen.qty;
    const nilaiBaru = editDimen && editDimen.qty;

    return nilaiLama === nilaiBaru;
  }

  canBeSubmittedAddProduct() {
    const { resultDataProcod, currentDimen } = this.state;
    const procod = resultDataProcod && resultDataProcod.ProductID;
    const nama = resultDataProcod && resultDataProcod.ProductName;
    const qty = currentDimen && currentDimen.qtyBatasBawah;
    return (
      procod !== '' &&
      nama !== '' &&
      qty !== '' &&
      procod !== undefined &&
      nama !== undefined &&
      qty !== undefined &&
      parseFloat(qty) !== 0
    );
  }

  canBeSubmittedSaveAddProduct() {
    const { listEditMasal, startDate, endDate, pelapakDetail } = this.state;
    var d1 = Date.parse(startDate);
    var d2 = Date.parse(endDate);
    var today = Date.parse(new Date().toJSON().slice(0, 10));

    return (
      listEditMasal.length !== 0 &&
      pelapakDetail.length !== 0 &&
      startDate !== '' &&
      endDate !== '' &&
      d2 >= d1 &&
      d1 >= today &&
      d2 >= today
    );
  }

  canBeSubmittedEditMassalEdit() {
    const { editBatasBawah, listEditMasal } = this.state;
    const nilaiLama = listEditMasal && listEditMasal[0];
    var nilaiCurr = nilaiLama && nilaiLama.qtybatasbawah;
    var nilaiBaru = editBatasBawah && editBatasBawah.qtybatasbawah;

    return (
      nilaiCurr !== nilaiBaru && nilaiBaru !== '' && parseFloat(nilaiBaru) !== 0
    );
  }
  canBeSubmittedEditBatasPerPelapak() {
    const { editBatasPerPelapak, tempEditBatasPerPelapak } = this.state;
    var nilaiNonPharosBaru =
      tempEditBatasPerPelapak && tempEditBatasPerPelapak[0];
    var nilaiPharosBaru = tempEditBatasPerPelapak && tempEditBatasPerPelapak[1];

    var nilaiPharosLama =
      editBatasPerPelapak && editBatasPerPelapak.dividerlnbupripi;
    var nilaiNonPharosLama =
      editBatasPerPelapak && editBatasPerPelapak.dividerlnbuprinonpi;

    return (
      (parseFloat(nilaiNonPharosLama) !== parseFloat(nilaiNonPharosBaru) ||
        parseFloat(nilaiPharosLama) !== parseFloat(nilaiPharosBaru)) &&
      nilaiPharosLama !== '' &&
      nilaiNonPharosLama !== '' &&
      parseFloat(nilaiPharosLama) !== 0 &&
      parseFloat(nilaiNonPharosLama) !== 0
    );
  }

  updateInputValue(value, field, Dimen) {
    let currentDimen = this.state[Dimen];
    currentDimen[field] = value;
    this.setState(
      { currentDimen },
      // () =>
      // console.log('CURRA', this.state.currentDimen),
    );
  }

  numValidate(e) {
    // console.log('MASUK', e.keyCode);
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    if (/\+|-/.test(keyValue)) e.preventDefault();
  }

  inputBarcode = event => {
    this.setState({
      procod: event.target.value,
    });
  };

  updateSearchValue(evt) {
    this.setState({
      keyword: evt.target.value,
    });
  }

  updateSearchValueList(evt) {
    this.setState({
      keywordList: evt.target.value,
    });
  }
}
export default showTransaction;
