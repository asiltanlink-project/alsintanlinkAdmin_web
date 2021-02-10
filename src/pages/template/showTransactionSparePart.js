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
import { MdLoyalty, MdRefresh, MdFileUpload } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from 'pages/urlLink.js';
import * as firebase from 'firebase/app';
import { Scrollbar } from 'react-scrollbars-custom';
import LoadingSpinner from 'pages/LoadingSpinner.js';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
class showTransactionSparePart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      resultAllAlsinType: [],
      loading: false,
      resultTransactionSparePart: [],
      loadingPage: false,
      typeDisabled: false,
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

  // Get getSparePart
  getSparePart(currPage, currLimit) {
    var offset = (currPage - 1) * currLimit;
    var keyword = this.state.keywordList;
    var pilihAlsin = this.state.pilihAlsin;
    const urlA = myUrl.url_showSparePartType + pilihAlsin;
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
            resultTransactionSparePart: data.result.spare_part_types,
            // maxPages: data.metadata.pages ? data.metadata.pages : 1,
            loading: false,
            loadingPage: false,
          });
        }
      });
  }

  // On file select (from the pop up)
  onFileChange = event => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  };

  // On file upload (click the upload button)
  onFileUpload = () => {
    // Create an object of formData
    const formData = new FormData();

    // Update the formData object
    formData.append(
      'myFile',
      this.state.selectedFile,
      this.state.selectedFile.name,
    );

    // Details of the uploaded file
    console.log('FILE YANG DIUPLOAD', this.state.selectedFile);
    // console.log("FILE YANG DIUPLOAD Detail ",formData);

    // Request made to the backend api
    // Send formData object
    axios.post('api/uploadfile', formData);
  };

  // File content to be displayed after
  // file upload is complete
  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <br></br>
          <Label style={{ color: 'black', fontWeight: 'bold' }}>
            Detail File
          </Label>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          {/* <p>
            Last Modified:{' '}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p> */}
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <Label style={{ color: 'red', fontSize: '0.8em' }}>
            *Pilih file Excel sebelum Upload!
          </Label>
        </div>
      );
    }
  };

  batalSimpanFile() {
    this.setState(
      { selectedFile: null },
      this.toggle('nested_parent_list_uploadExcel'),
    );
  }

  getAllAlsinType() {
    const url = myUrl.url_allAlsinType;
    var token = window.localStorage.getItem('tokenCookies');
    // console.log('URL GET LIST', url);

    this.setState({ loadingAlsin: true });
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
            loadingAlsin: false,
          });
        }
      })
      .then(data => {
        var status = data.status;
        var result = data.result.alsins;
        var message = data.result.message;
        // console.log('ALSIN TYPE DATA', data);
        if (status === 0) {
          this.showNotification(message, 'error');
        } else {
          this.showNotification('Data ditemukan!', 'info');
          this.setState(
            {
              resultAllAlsinType: result,
              loadingAlsin: false,
            },
            // () =>
            //   console.log('RESULT ALSIN ITEM', this.state.resultAllAlsinType),
          );
        }
      })
      .catch(err => {
        // console.log('ERRORNYA', err);
        this.showNotification('Error ke server!', 'error');
        this.setState({
          loadingAlsin: false,
        });
      });
  }

  componentDidMount() {
    var token = window.localStorage.getItem('tokenCookies');
    if (token === '' || token === null || token === undefined) {
      window.location.replace('/login');
    }
    // this.getSparePart(this.state.currentPages, this.state.todosPerPages);
    var alsinID = window.localStorage.getItem('alsinID');
    console.log('ALSIN ID', alsinID);
    if (alsinID !== null) {
      console.log('MASUK');
      this.setState(
        {
          pilihAlsin: alsinID,
        },
        () => this.findData(),
      );
    }
    this.getAllAlsinType();
  }

  // untuk pilih Alsin
  setType = event => {
    var nama = this.state.resultAllAlsinType.find(function (element) {
      return element.id === parseInt(event.target.value);
    });
    this.setState(
      {
        pilihAlsin: event.target.value,
        namaAlsin: nama.name,
        namaAlsinTemp: nama.name,
        modal_nested_parent_list_provinsi: false,
        domisiliDisabled: false,
      },
      () => window.localStorage.setItem('alsinID', this.state.pilihAlsin),
    );
  };

  // KHUSUS STATE MODAL

  toggle = (modalType, todo) => () => {
    if (!modalType) {
      return this.setState({
        modal: !this.state.modal,
      });
    }

    if (modalType === 'nested_parent_editSparePart') {
      this.setState({
        [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
        editSparePart: todo,
      });
    }

    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  handleClose = () => {
    this.setState({ loading: false, loadingPage: false });
  };

  SearchAllList() {
    const { pilihAlsin } = this.state;
    return pilihAlsin !== '';
  }

  findData() {
    // console.log('KLIK FIND DATA');
    var buttonSearch = document.getElementById('buttonSearch');
    buttonSearch.disabled = true;
    this.setState(
      {
        namaAlsinSave: this.state.namaAlsin,
      },
      () =>
        this.setState(
          {
            namaAlsin: '',
          },
          () => this.getSparePart(),
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

  backToHome() {
    window.localStorage.removeItem('alsinID');
    window.history.back();
  }

  render() {
    const { loading, loadingPage } = this.state;
    const typeTodos = this.state.resultAllAlsinType;
    const TransactionAllSparePart = this.state.resultTransactionSparePart;
    const isSearch = this.SearchAllList();

    var formatter = new Intl.NumberFormat('id-ID', {
      currency: 'IDR',
    });

    const renderTransactionAllSparePart =
      TransactionAllSparePart &&
      TransactionAllSparePart.map((todo, i) => {
        return (
          <tr key={i}>
            {/* {console.log("TODOS ISINYA", todo)} */}
            <td style={{ textAlign: 'left' }}>
              <Link
                to={`/showTransactionSparePart/spare_part_type_id=${todo.spare_part_type_id}`}
              >
                {
                  <Label
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#009688',
                    }}
                    onClick={()=>window.localStorage.removeItem('alsinID')}
                  >
                    {todo.spare_part_type_name}
                  </Label>
                }
              </Link>
            </td>
            <td>
              <Button
                style={{ margin: '0px' }}
                color="secondary"
                size="sm"
                onClick={this.toggle('nested_parent_editSparePart', {
                  ...todo,
                })}
              >
                <MdEdit />
              </Button>
            </td>
          </tr>
        );
      });

    const renderType =
      typeTodos &&
      typeTodos.map((todo, i) => {
        return (
          <tr key={i}>
            <td>{todo.name}</td>
            <td style={{ textAlign: 'right' }}>
              <Button
                color="primary"
                style={{ margin: '0px', fontSize: '15px' }}
                value={todo.id}
                onClick={this.setType}
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
                      placeholder="Pilih Alsin"
                      style={{ fontWeight: 'bold' }}
                      value={this.state.namaAlsin}
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
                      id="excelInfo"
                      color="warning"
                      style={{ float: 'right' }}
                      onClick={this.toggle('nested_parent_list_uploadExcel')}
                    >
                      <MdFileUpload />
                    </Button>
                    <Tooltip
                      placement="bottom"
                      isOpen={this.state.excelInfo}
                      target="excelInfo"
                      toggle={() =>
                        this.setState({ excelInfo: !this.state.excelInfo })
                      }
                    >
                      Halaman untuk mengupload Suku cadang dalam Bentuk Excel
                    </Tooltip>
                    <Button color="danger" onClick={() => this.backToHome()}>
                      Kembali
                    </Button>
                  </ButtonGroup>
                </Col>
              </CardHeader>
              <CardBody>
                <Table responsive striped id="tableUtama">
                  <thead>
                    <tr>
                      <th>Suku Cadang</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TransactionAllSparePart.length === 0 &&
                    loading === true ? (
                      <LoadingSpinner status={4} />
                    ) : loading === false &&
                      TransactionAllSparePart.length === 0 ? (
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
                      TransactionAllSparePart.length !== 0 ? (
                      <LoadingSpinner status={4} />
                    ) : (
                      renderTransactionAllSparePart
                    )}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* KHUSUS MODAL */}

        {/* Modal List Alsin */}
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
        {/* Modal List Alsin */}

        {/* Modal upload Excel */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_list_uploadExcel}
          toggle={this.toggle('nested_parent_list_uploadExcel')}
          className={this.props.className}
        >
          <ModalHeader>Upload Excel</ModalHeader>
          <ModalBody>
            <FormGroup>
              <div>
                <div>
                  <Input type="file" onChange={this.onFileChange} />
                  {/* <Button onClick={this.onFileUpload}>Upload!</Button> */}
                </div>
                {this.fileData()}
              </div>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            {/* <Button color="primary" onClick={() => this.uploadExcel()}>
              Simpan Excel
            </Button> */}
            <Button color="primary" onClick={this.onFileUpload}>
              Simpan Excel
            </Button>
            <Button onClick={() => this.batalSimpanFile()}>Batal</Button>
          </ModalFooter>
        </Modal>
        {/* Modal Upload Excel */}

        {/* Modal Edit Spare Part */}
        <Modal
          onExit={this.handleClose}
          isOpen={this.state.modal_nested_parent_editSparePart}
          toggle={this.toggle('nested_parent_editSparePart')}
          className={this.props.className}
        >
          <ModalHeader>Edit Spare Part</ModalHeader>
          <ModalBody>
            {/* {console.log("EDIT ALSIN", this.state.editSparePart)} */}
            <Label>Suku Cadang</Label>
            <Input
              autoComplete="off"
              type="text"
              name="spare_part_type_name"
              placeholder="Suku Cadang..."
              onChange={evt =>
                this.updateInputValue(
                  evt.target.value,
                  evt.target.name,
                  'editSparePart',
                )
              }
              value={
                this.state.editSparePart &&
                this.state.editSparePart.spare_part_type_name
              }
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={this.toggle('nested_editSparePart')}
            >
              Simpan Edit Spare Part
            </Button>
            <Modal
              // onExit={this.handleClose}
              isOpen={this.state.modal_nested_editSparePart}
              toggle={this.toggle('nested_editSparePart')}
            >
              <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
              <ModalBody>Apakah Anda yakin ingin menyimpan data ini?</ModalBody>
              <ModalFooter>
                <Button
                  id="btnEdit"
                  color="primary"
                  onClick={() =>
                    this.updateHeaderData(this.state.editSparePart)
                  }
                  disabled={loading}
                >
                  {!loading && 'Ya'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>
                {!loading && (
                  <Button
                    color="secondary"
                    onClick={this.toggle('nested_editSparePart')}
                  >
                    Tidak
                  </Button>
                )}
              </ModalFooter>
            </Modal>
            <Button
              color="secondary"
              onClick={this.toggle('nested_parent_editSparePart')}
            >
              Batal
            </Button>
          </ModalFooter>
        </Modal>
        {/* Modal Edit Spare Part */}
        {/* KHUSUS MODAL */}
      </Page>
    );
  }

  updateHeaderData = first_param => {
    var url = myUrl.url_updateSparePart;
    const updateHeaderData = first_param;
    var token = window.localStorage.getItem('tokenCookies');
    console.log('DATA HEADER', updateHeaderData);
    console.log('DATA HEADER', this.state.editSparePart);

    this.setState({ loading: true });
    var payload = {
      spare_part_type_id: updateHeaderData.spare_part_type_id,
      name: updateHeaderData.spare_part_type_name,
    };

    console.log('PAYLOAD EDIT', payload);

    const option = {
      method: 'PUT',
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
            modal_nested_parent_editSparePart: false,
            modal_nested_editSparePart: false,
          });
        }
      })
      .then(data => {
        console.log('DATA EDIT', data);
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
              loadingPage: false,
              loading: false,
              modal_nested_parent_editSparePart: false,
              modal_nested_editSparePart: false,
            },
            () => this.componentDidMount(),
          );
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

  updateInputValue(value, field, fill) {
    let input = this.state[fill];
    input[field] = value;
    this.setState(
      { input },
      // () =>
      // console.log('EDIT ALSIN ', this.state.editSparePart),
    );
  }
}
export default showTransactionSparePart;
