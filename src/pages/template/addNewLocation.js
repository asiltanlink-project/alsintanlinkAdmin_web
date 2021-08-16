import React, { Component } from 'react';
import Page from 'components/Page';
import { Card, Col, Row, CardHeader, CardBody, Modal, ModalHeader, ModalBody, ModalFooter, Input, Label, Button, Table, InputGroup, InputGroupAddon} from 'reactstrap';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from 'pages/urlLink.js';
import LoadingSpinner from 'pages/LoadingSpinner.js';
import FormGroup from 'reactstrap/lib/FormGroup';
import { MdAdd, MdAutorenew, MdList, MdLoyalty } from 'react-icons/md';
import _ from 'lodash'

class addNewLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          resultProvinsi: null,
          resultKotaKab: null,
          resultKecamatan: null,
          loadingPage: false,
          pilihProvinsi: '',
          pilihKotaKab: '',
          pilihKecamatan: '',
          modal_addKota: false,
          modal_addKecamatan: false,
          modal_addDesa: false,
          namaKotaKab: '',
          namaKecamatan: '',
          namaDesa: ''
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

      toggle = modalType => () => {
        if (!modalType) {
          return this.setState(
            {
              modal: !this.state.modal,
            },
          );
        }
    
        this.setState(
          {
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
          },
        );
      };

      handleCloseDomisili = () => {
        this.setState({loading: false, modal_addDesa: false, modal_addKecamatan: false, modal_addKota: false, pilihProvinsi: '', pilihKotaKab: '', pilihKecamatan: '', namaKotaKab: '', namaKecamatan: '', namaDesa: '', namaProvinsi: ''})
      }

       // Get Provinsi
  getProvinsi() {
    const urlA = myUrl.url_getProvince
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
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState({
            resultProvinsi: data.result.provinces,
            loading: false,
          });
        }
      });
  }

  // Get KotaKab
  getKotaKab() {
    const urlA = myUrl.url_getCity + '?province_id=' + this.state.pilihProvinsi;
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
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState({
            resultKotaKab: data.result.citys,
            loading: false,
          });
        }
      });
  }

  // Get Kecamatan
  getKecamatan() {
    const urlA = myUrl.url_getDistrict + '?city_id=' + this.state.pilihKotaKab;
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
        if (data.status === 0) {
          this.showNotification('Data tidak ditemukan!', 'error');
        } else {
          this.setState({
            resultKecamatan: data.result.districts,
            loading: false,
          });
        }
      });
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
      },
      () => this.getKotaKab(),
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
      },
      () =>
        this.getKecamatan(),
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
      },
    );
  };
  // untuk pilih Kecamatan

  handleChange = field => {
    return event => {
      const newState = {}
      newState[field] = event.target.value
      this.setState(newState)
    }
  };

  saveData = () => {
    const { pilihProvinsi, pilihKotaKab, pilihKecamatan, namaKotaKab, namaKecamatan, namaDesa } = this.state
    var url = myUrl.url_add_location
    var token = window.localStorage.getItem('tokenCookies')

    let saveName = ''
    if (_.isEmpty(namaKecamatan) && _.isEmpty(namaDesa) && !_.isEmpty(namaKotaKab)){
      saveName = namaKotaKab
    } else if  (!_.isEmpty(namaKecamatan) && _.isEmpty(namaDesa) && !_.isEmpty(namaKotaKab)){
      saveName = namaKecamatan
    } else if (!_.isEmpty(namaKecamatan) && !_.isEmpty(namaDesa) && !_.isEmpty(namaKotaKab)){
      saveName = namaDesa
    }

    this.setState({ loading: true })
    var payload = {
      province_id : pilihProvinsi,
      city_id : pilihKotaKab,
      district_id: pilihKecamatan,
      name: saveName.toUpperCase()
    }

    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: `${'Bearer'} ${token}`
      },
      body: JSON.stringify(payload)
    }
    fetch(url, option)
      .then(response => {
        if (response.ok) {
          return response.json()
        } else {
            this.showNotification('Response ke server gagal!', 'error')
          this.setState({
            loading: false
          })
        }
      })
      .then(data => {
        var status = data.status
        var message = data.result.message
        if (status === 0) {
          this.showNotification(message, 'error')
          this.setState({
            loading: false
          })
        } else {
          this.showNotification(message, 'info')
          this.setState({
            loading: false,
            modal_addDesa: false,
            modal_addKecamatan: false,
            modal_addKota: false,
            pilihProvinsi: '', pilihKotaKab: '', pilihKecamatan: '', namaKotaKab: '', namaKecamatan: '', namaDesa: '', namaProvinsi: ''
          })
        }
      })
      .catch(err => {
        this.showNotification('Error ke server 1!', 'error')
        this.setState({
          loading: false
        })
      })
  };

  componentDidMount(){
    this.getProvinsi()
  }
      
    render() {
      const {modal_addKota, modal_addKecamatan, modal_addDesa, loading, resultKecamatan, resultProvinsi, resultKotaKab} = this.state
      const renderProvinsi =
      resultProvinsi &&
      resultProvinsi.map((todo, i) => {
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
      resultKotaKab &&
      resultKotaKab.map((todo, i) => {
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
      resultKecamatan &&
      resultKecamatan.map((todo, i) => {
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

        return (
            <Page
        title='Alsintanlink Admin'
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
                // className="d-flex justify-content-between"
                style={{ paddingBottom: 0 }}
              >
                <Row>
                <Col>
                    <Button
                    style={{ float: 'right' }}
                      color="danger"
                      onClick={() => window.history.back()}
                    >
                      Kembali
                    </Button>
                </Col>
                </Row>
              </CardHeader>
              <CardBody>
                  <Row>
                    <Col>
                    <Label>
                        Tambah Kota
                    </Label>
                    </Col>
                    <Col>
                    <Button style={{float:'right'}} onClick={this.toggle('addKota')}><MdAdd/></Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                    <Label>
                        Tambah Kecamatan
                    </Label>
                    </Col>
                    <Col>
                    <Button style={{float:'right'}} onClick={this.toggle('addKecamatan')}><MdAdd/></Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                    <Label>
                        Tambah Desa
                    </Label>
                    </Col>
                    <Col>
                    <Button style={{float:'right' }} onClick={this.toggle('addDesa')}><MdAdd/></Button>
                    </Col>
                  </Row>
              </CardBody>
            </Card>
            </Col>
            </Row>

            {/* Modal Add Kota */}
            <Modal
              isOpen={modal_addKota}
              toggle={this.toggle('addKota')}
              className={this.props.className}
            >
              <ModalHeader toggle={this.handleCloseDomisili}>
                Tambah Kota
              </ModalHeader>
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
                  <InputGroupAddon addonType="append">
                    <Button onClick={this.toggle('nested_parent_list_provinsi')}>
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
                    disabled={!this.state.pilihProvinsi}
                    placeholder="Nama Kota..."
                    style={{ fontWeight: 'bold' }}
                    value={this.state.namaKotaKab.toUpperCase()}
                    type='text'
                    name='namaKotaKab'
                    id='namaKotaKab'
                    autocomplete='off'
                    onChange={this.handleChange('namaKotaKab')}
                  />
                </InputGroup>
              </Col>
            </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  disabled={loading}
                  color='primary'
                  onClick={() => this.saveData()}
                >
                  {!loading && 'Simpan'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>
              </ModalFooter>
            </Modal>
            {/* Modal Add Kota */}

            {/* Modal Add Kecamatan */}
            <Modal
              isOpen={modal_addKecamatan}
              toggle={this.toggle('addKecamatan')}
              className={this.props.className}
            >
              <ModalHeader toggle={this.handleCloseDomisili}>
                Tambah Kota
              </ModalHeader>
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
                  <InputGroupAddon addonType="append">
                    <Button onClick={this.toggle('nested_parent_list_provinsi')}>
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
                    <Button onClick={this.toggle('nested_parent_list_kotakab')}>
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
                    disabled={!this.state.pilihKotaKab}
                    placeholder="Nama Kecamatan..."
                    style={{ fontWeight: 'bold' }}
                    value={this.state.namaKecamatan.toUpperCase()}
                    type='text'
                    name='namaKecamatan'
                    id='namaKecamatan'
                    autocomplete='off'
                    onChange={this.handleChange('namaKecamatan')}
                  />
                </InputGroup>
              </Col>
            </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  disabled={loading}
                  color='primary'
                  onClick={() => this.saveData()}
                >
                  {!loading && 'Simpan'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>
              </ModalFooter>
            </Modal>
            {/* Modal Add Kecamatan */}

            {/* Modal Add Desa */}
            <Modal
              isOpen={modal_addDesa}
              toggle={this.toggle('addDesa')}
              className={this.props.className}
            >
              <ModalHeader toggle={this.handleCloseDomisili}>
                Tambah Kota
              </ModalHeader>
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
                  <InputGroupAddon addonType="append">
                    <Button onClick={this.toggle('nested_parent_list_provinsi')}>
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
                    <Button onClick={this.toggle('nested_parent_list_kotakab')}>
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
                    <Button onClick={this.toggle('nested_parent_list_kecamatan')}>
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
                  Desa:&nbsp;
                </Label>
              </Col>
              <Col sm={9}>
                <InputGroup style={{ float: 'right' }}>
                  <Input
                    disabled={!this.state.pilihKecamatan}
                    placeholder="Nama Desa..."
                    style={{ fontWeight: 'bold' }}
                    value={this.state.namaDesa.toUpperCase()}
                    type='text'
                    name='namaDesa'
                    id='namaDesa'
                    autocomplete='off'
                    onChange={this.handleChange('namaDesa')}
                  />
                </InputGroup>
              </Col>
            </Row>
              </ModalBody>
              <ModalFooter>
                <Button
                  disabled={loading}
                  color='primary'
                  onClick={() => this.saveData()}
                >
                  {!loading && 'Simpan'}
                  {loading && <MdAutorenew />}
                  {loading && 'Sedang diproses'}
                </Button>
              </ModalFooter>
            </Modal>
            {/* Modal Add Desa */}

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
                {resultProvinsi === null && loading === true ? (
                  <LoadingSpinner status={4} />
                ) : loading === false && resultProvinsi === null? (
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
                ) : loading === true && resultProvinsi !== null ? (
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
                {resultKotaKab === null && loading === true ? (
                  <LoadingSpinner status={4} />
                ) : loading === false && resultKotaKab === null ? (
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
                ) : loading === true && renderKotakab !== null ? (
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
                {resultKecamatan === null && loading === true ? (
                  <LoadingSpinner status={4} />
                ) : loading === false && resultKecamatan === null ? (
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
                ) : loading === true && resultKecamatan !== null ? (
                  <LoadingSpinner status={4} />
                ) : (
                  renderKecamatan
                )}
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        {/* Modal List Kecamatan */}

          </Page>
        );
    }
}

export default addNewLocation;