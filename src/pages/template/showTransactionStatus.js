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
  ModalHeader,
  Input,
  Label,
  ButtonGroup,
  InputGroup,
  InputGroupAddon,
} from 'reactstrap';
import { MdSearch, MdList } from 'react-icons/md';
import { MdLoyalty } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from 'pages/urlLink.js';
import LoadingSpinner from 'pages/LoadingSpinner.js';
class showTransaction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      realCurrentPage: 1,
      maxPage: 1,
      loading: false,
      resultTransaction: [],
      resultTransactionAll: [],
      resultTransactionStatus: [],
      namaStatus: '',
      loadingPage: false,
      pilihType: '',
      pilihStatus: '',
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
          this.getStatus(this.state.currentPage);
        },
      );
    }
  }

  enterPressedSearch = event => {
    var code = event.keyCode || event.which;
    if (code === 13) {
      event.preventDefault();
      this.setState(
        {
          currentPage: 1,
          realCurrentPage: 1,
        },
        () => {
          this.getStatus(this.state.currentPage);
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

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
      },
    };
    fetch(url, option)
      .then(response => {
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
        var message = data.result.message;
        console.log('data jalan GetlistByPaging upja', data);
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPageTransaction: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
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
          });
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

  getDetailTransactionAlsin() {
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

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
      },
    };
    fetch(url, option)
      .then(response => {
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
        var status = data.status;
        var resultTransactionAlsinItem = data.result.alsin_items;
        var message = data.result.message;
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPageTransactionAlsinItem: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
            resultTransactionAlsinItem: resultTransactionAlsinItem.data,
            loadingPageTransactionAlsinItem: false,
          });
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

  getDetailTransactionAlsinOtherService() {
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

    const option = {
      method: 'GET',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
      },
    };
    fetch(url, option)
      .then(response => {
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
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPageTransactionAlsinItem: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
            resultTransactionAlsinItemOtherService: resultTransactionAlsinItem,
            loadingPageTransactionAlsinItem: false,
          });
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

  // Get getStatus
  getStatus(currPage) {
    var pilihStatus = this.state.pilihStatus;
    const urlA =
      myUrl.url_showAllTransaction +
      '?status=' +
      pilihStatus +
      '&page=' +
      currPage;
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
            resultTransactionStatus: data.result.transactions.data,
            maxPage: data.result.max_page,
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
    this.getStatus(this.state.currentPage);
  }

  // untuk pilih Type
  setType = event => {
    var nama = this.state.resultType.find(function (element) {
      return element.status_id === event.target.value;
    });
    this.setState({
      pilihStatus: event.target.value,
      namaStatus: nama.status_name,
      namaStatusTemp: nama.status_name,
      modal_nested_parent_list_provinsi: false,
      domisiliDisabled: false,
    });
  };

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        realCurrentPage: 1,
        maxPage: 1,
        currentPage: 1,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      realCurrentPage: 1,
      maxPage: 1,
      currentPage: 1,
    });
  };

  handleCloseStatus = () => {
    this.setState({
      namaStatus: '',
      pilihStatus: '',
      modal_nested_parent_list_domisili: false,
    });
  };

  handleClose = () => {};

  SearchAllList() {
    const { pilihStatus } = this.state;
    return pilihStatus !== '';
  }

  findData() {
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

  setModalStatus() {
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

  render() {
    const {
      loading,
      loadingPage,
      loadingPageTransaction,
      loadingPageTransactionAlsinItem,
    } = this.state;
    const typeTodos = this.state.resultType;
    const TransactionAllTodos = this.state.resultTransactionStatus;
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
          </tr>
        );
      });

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
                    <InputGroupAddon addonType="append">
                      <Button onClick={() => this.setModalStatus()}>
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
              <CardBody>
                <Table responsive striped id="tableUtama">
                  <thead>
                    {
                      <tr>
                        <td
                          colSpan="10"
                          className="text-right"
                          style={{ border: 'none' }}
                        >
                          <Label style={{ width: '50%', textAlign: 'right' }}>
                            {' '}
                            {'Halaman : ' +
                              this.state.realCurrentPage +
                              ' / ' +
                              this.state.maxPage}
                          </Label>
                        </td>
                      </tr>
                    }
                    {
                      <tr>
                        <th>Status</th>
                        <th>UPJA</th>
                        <th>Waktu Pesan</th>
                        <th>Waktu Kirim</th>
                        <th>Harga Transport</th>
                        <th>Total Harga</th>
                      </tr>
                    }
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
              <CardBody>
                <Row>
                  <Col md="9" sm="12" xs="12"></Col>
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
                          disabled={true}
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
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* KHUSUS MODAL */}

        {/* Modal List Status */}
        <Modal
          onExit={this.handleCloseStatus}
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
        {/* Modal List Status */}

        {/* Modal Transaction */}
        <Modal
          size="xl"
          onExit={this.handleCloseStatus}
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
          onExit={this.handleCloseStatus}
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
          onExit={this.handleCloseStatus}
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

  updateSearchValue(evt) {
    this.setState({
      keyword: evt.target.value,
    });
  }
}
export default showTransaction;
