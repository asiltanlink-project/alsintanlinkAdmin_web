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
      currentPage: 1,
      realCurrentPage: 1,
      maxPage: 1,
      loading: false,
      resultProvinsi: [],
      resultTransactionAll: [],
      loadingPage: false,
      pilihProvinsi: '',
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
          this.getListbyPagingTransaksi(this.state.currentPage);
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
          this.getListbyPagingTransaksi(this.state.currentPage);
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

  // get data Transaksi
  getListbyPagingTransaksi(currPage, currLimit) {
    // const trace = perf.trace('getBundling');
    var province_id = this.state.pilihProvinsi;
    const url =
      myUrl.url_getAllUpjaTransaction +
      '?provinces=' +
      province_id +
      '&page=' +
      currPage;
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
        // var resultTransaction = data.result.transactions;
        var resultTransactionAll = data.result.transactions_all;
        var message = data.result.message;
        console.log('data jalan GetlistByPaging', data);
        if (status === 0) {
          this.showNotification(message, 'error');
        } else {
          if (resultTransactionAll.length === 0) {
            this.showNotification(
              `${'Data UPJA '} ${this.state.namaProvinsiSave.toLowerCase()} ${', tidak ditemukan!'} `,
              'error',
            );
            this.setState({
              loading: false,
            });
          } else {
            this.showNotification('Data ditemukan!', 'info');
            this.setState({
              // resultTransaction: resultTransaction,
              resultTransactionAll: resultTransactionAll.data,
              maxPage: data.result.max_page,
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

  // Send Alert
  sendAlert() {
    const urlA = myUrl.url_sendUpjaAlert;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('jalan kecamatan', urlA);
    this.setState({ loadingPage: true });
    var payload = {};
    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
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
        // console.log('data Alert', data);
        if (data.status === 0) {
          this.showNotification(data.result.message, 'error');
          this.setState({
            loadingPage: false,
          });
        } else {
          this.showNotification(data.result.message, 'info');
          this.setState({
            loadingPage: false,
            modal_nested_parent_list: false,
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
    this.getProvinsi(this.state.currentPages);
  }

  // untuk pilih Provinsi
  setProvinsi = event => {
    var nama = this.state.resultProvinsi.find(function (element) {
      return element.id === parseInt(event.target.value);
    });

    this.setState({
      pilihProvinsi: event.target.value,
      namaProvinsi: nama.name,
      modal_nested_parent_list_provinsi: false,
      keywordList: '',
      domisiliDisabled: false,
    });
  };
  // untuk pilih Provinsi

  toggle = modalType => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
        keywordList: '',
        realCurrentPages: 1,
        maxPages: 1,
        currentPages: 1,
        ecommerceIDtemp: this.state.ecommerceID,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      keywordList: '',
      realCurrentPages: 1,
      maxPages: 1,
      currentPages: 1,
    });
  };

  handleCloseDomisili = () => {
    this.setState({
      namaProvinsi: '',
      pilihProvinsi: '',
      modal_nested_parent_list_domisili: false,
    });
  };

  handleClose = () => {};

  SearchAllList() {
    const { pilihProvinsi } = this.state;
    return pilihProvinsi !== '';
  }

  findData() {
    // console.log('KLIK FIND DATA');
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = true;
    this.setState(
      {
        namaProvinsiSave: this.state.namaProvinsi,
        resultUpja: [],
      },
      () =>
        this.setState(
          {
            namaProvinsi: '',
          },
          () => this.getListbyPagingTransaksi(this.state.currentPage),
        ),
    );
  }

  setModalProvinsi() {
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = false;
    this.setState(
      {
        periodeDisabled: false,
        typeDisabled: true,
      },
      this.toggle('nested_parent_list_provinsi'),
    );
  }

  render() {
    const { loading, loadingPage } = this.state;
    const provinsiTodos = this.state.resultProvinsi;
    const TransactionAllTodos = this.state.resultTransactionAll;
    const isSearch = this.SearchAllList();

    const renderTransactionAll =
      TransactionAllTodos &&
      TransactionAllTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.city}</td>
            <td>{todo.district}</td>
            <td>{todo.village}</td>
            <td>{todo.leader_name}</td>
            <td>{todo.upja_name}</td>
            <td>{todo.email}</td>
            <td>{todo.class}</td>
            <td>{todo.legality}</td>
            <td>{todo.total_transaction}</td>
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
                      placeholder="Pilih Provinsi"
                      style={{ fontWeight: 'bold' }}
                      value={this.state.namaProvinsi}
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
                      color="warning"
                      disabled={
                        this.state.resultTransactionAll.length === 0 ||
                        loadingPage
                      }
                      onClick={this.toggle('nested_parent_list')}
                    >
                      <MdAddAlert />
                    </Button>
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
                <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                  <Col>
                    <Row style={{ paddingBottom: 0, marginBottom: 0 }}>
                      <Col sm={2} style={{ paddingBottom: 0, marginBottom: 0 }}>
                        <Label style={{ fontWeight: 'bold' }}>Provinsi: </Label>
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
                </Row>

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
                        <th>Kota/Kab</th>
                        <th>Kecamatan</th>
                        <th>Desa</th>
                        <th>Kepala UPJA</th>
                        <th>UPJA</th>
                        <th>E-Mail UPJA</th>
                        <th>Kelas</th>
                        <th>Badan Hukum</th>
                        <th>Total Transaksi</th>
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
        {/* Modal Send Alert */}
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
        {/* Modal Send Alert */}

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

        {/* KHUSUS MODAL */}
      </Page>
    );
  }
}
export default showTransaction;
