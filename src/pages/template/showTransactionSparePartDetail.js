import Page from 'components/Page';
import React from 'react';
import imageNotFound from 'assets/img/imageNotFound.jpg';
import {
  Button,
  Card,
  CardBody,
  Col,
  Row,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ButtonGroup,
  CardHeader,
  Label
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
import { MdLoyalty } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from 'pages/urlLink.js';
import * as firebase from 'firebase/app';
import LoadingSpinner from 'pages/LoadingSpinner.js';

class showTransactionSparePartDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultSparePart: [],
      loading: false,
      loadingPage: true,
      spare_part_type_id: props.match.params.spare_part_type_id,
      currentPage: 1,
      realCurrentPage: 1,
      maxPage: 1,
    };
  }

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

  // get data Spare Part
  getListbyPagingSparePart(currPage, currLimit) {
    var spare_part_type_id = this.state.spare_part_type_id;
    const url =
      myUrl.url_showSparePart + spare_part_type_id + '&page=' + currPage;
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
        var resultSparePart = data.result.spare_parts;
        var message = data.result.message;
        console.log('data jalan GetlistByPaging farmer', data);
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loadingPage: false,
          });
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState({
            resultSparePart: resultSparePart.data,
            maxPage: data.result.max_page,
            loadingPage: false,
          });
        }
      })
      .catch(err => {
        console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
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
    this.getListbyPagingSparePart(this.state.currentPage);
  }

  toggle = (modalType, todo) => () => {
    // console.log('TERPANGGIL');
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
      deleteAlsin: todo,
    });
  };

  handleClose = () => {
    this.setState({ loading: false, loadingPage: false });
  };

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
          this.getListbyPagingSparePart(this.state.currentPage);
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
          this.getListbyPagingSparePart(this.state.currentPage);
        },
      );
    }
  };

  render() {
    const { loading, loadingPage } = this.state;
    const currentTodosSparePart = this.state.resultSparePart;

    const renderTodosSparePart =
      currentTodosSparePart &&
      currentTodosSparePart.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.spare_part_name}</td>
            <td>{todo.kode_produk}</td>
            <td>{todo.part_number}</td>
            <td>
              <Button
                style={{ margin: '0px' }}
                color="danger"
                size="sm"
                onClick={this.toggle('nested_parent_nonaktifAlsin', {
                  ...todo,
                })}
              >
                <MdDelete />
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
                ></Col>
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
                        <th>Nama Suku Cadang</th>
                        <th>Kode Produk</th>
                        <th>Nomor Part</th>
                        <th>Hapus</th>
                      </tr>
                    }
                  </thead>

                  <tbody>
                    {currentTodosSparePart.length === 0 &&
                    loadingPage === true ? (
                      <LoadingSpinner status={4} />
                    ) : loadingPage === false &&
                      currentTodosSparePart.length === 0 ? (
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
                      currentTodosSparePart.length !== 0 ? (
                      <LoadingSpinner status={4} />
                    ) : (
                      renderTodosSparePart
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

        {/* Modal Delete Spare Part*/}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_nonaktifAlsin}
          toggle={this.toggle('nested_parent_nonaktifAlsin')}
          className={this.props.className}
        >
          <ModalHeader>Konfirmasi Penghapusan Data Suku Cadang</ModalHeader>
          <ModalBody>Apakah Anda yakin ingin menghapus data ini?</ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => this.deleteHeaderData(this.state.deleteAlsin)}
              disabled={loading}
            >
              {!loading && 'Ya'}
              {loading && <MdAutorenew />}
              {loading && 'Sedang diproses'}
            </Button>{' '}
            {!loading && (
              <Button
                color="secondary"
                onClick={this.toggle('nested_parent_nonaktifAlsin')}
              >
                Tidak
              </Button>
            )}
          </ModalFooter>
        </Modal>
        {/* Modal Delete Spare Part*/}
        {/* KHUSUS MODAL */}
      </Page>
    );
  }

  deleteHeaderData = first_param => {
    var url = myUrl.url_deleteSparePart;
    const deleteDataHeader = first_param;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('DATA HEADER', deleteDataHeader);
    this.setState({ loading: true });

    var payload = {
      spare_part_id: deleteDataHeader.spare_part_id,
    };

    console.log('PAYLOAD', payload);

    const option = {
      method: 'DELETE',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`,
      },
      body: JSON.stringify(payload),
    };
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
        console.log('DATA DELETE', data);
        var status = data.status;
        var message = data.result.message;
        if (status === 0) {
          this.showNotification(message, 'error');
          this.setState({
            loading: false,
          });
        } else {
          this.showNotification(message, 'info');
          this.setState(
            {
              loading: false,
              modal_nested_parent_nonaktifAlsin: false,
              nested_parent_nonaktifAlsin: false,
            },
            () => this.getListbyPagingSparePart(),
          );
          // firebase.analytics().logEvent('menghapus Data');
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loading: false,
        });
      });
  };
}
export default showTransactionSparePartDetail;
