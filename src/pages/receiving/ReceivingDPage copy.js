/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable default-case */
import * as firebase from 'firebase/app';
import React from 'react';
import { MdAutorenew, MdLoyalty } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
} from 'reactstrap';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from '../urlLinkReceiving';
import Page from 'components/Page';
import { set } from 'react-ga';

// const perf = firebase.performance();

const initialCurrentData = {
  procod: '',
  prodes: '',
  ed: '',
  batch: '',
  qty: '',
};

class ReceivingDPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      currentData: { ...initialCurrentData },
      active_user_id: '10',
      loading: false,
      checked: false,
      barcode: '',
      enterButton: false,
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

  redirect = () =>
    this.props.history.push({
      pathname: '/login',
    });

  changePageState = (pageState, data = {}) => () => {
    if (pageState === 'HEADER') {
      if (this.props.location.state.group == 2) {
        this.props.history.push({
          pathname: '/receivingFloor',
        });
      } else if (this.props.location.state.group == 1) {
        this.props.history.push({
          pathname: '/receivingApotek',
        });
      }
    } else if (pageState === 'DETAIL') {
      this.props.history.push({
        pathname: '/receivingDetail',
        state: {
          data: data,
          ok: true,
        },
      });
    } else if (pageState === 'NEW') {
      this.props.history.push({
        pathname: '/receivingNew',
        state: {
          ok: true,
        },
      });
    }
  };

  getListbyPaging(kodeGudang, noRecv, group) {
    // const trace = perf.trace('getDetail_Receiving');
    // trace.start();
    // console.log('LOGS 2', noRecv);
    const urlA =
      myUrl.url_getDetailReceiving +
      kodeGudang +
      '/' +
      noRecv +
      '?group=' +
      group;
    // "http://10.0.111.75:5555/CHCGudang/Receiving/Detail/254/254191223100001";

    // console.log('LOGS URL', urlA);

    const option = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: window.localStorage.getItem('tokenCookies'),
      },
    };
    // console.log('LOGS OPTION', option);
    fetch(urlA, option)
      .then(response => {
        // trace.stop();
        if (response.ok) {
          return response.json();
        } else {
          this.showNotification('Koneksi ke server gagal 1!', 'error');
          this.setState({
            loading: false,
          });
        }
      })
      .then(data => {
        // console.log('HILIH', data);

        var allData = data;

        var data1 = allData.data;
        var header = data1.header;
        var detail = data1.detail;
        var metadata = allData.metadata;
        var error = allData.error;

        if (data.responseMessage === 'FALSE') {
          this.showNotification(data.responseDescription, 'error');
          if (data.responseDescription.toLowerCase().includes('expired')) {
            window.localStorage.removeItem('tokenCookies');
            window.localStorage.removeItem('accessList');
            this.props.history.push({
              pathname: '/login',
            });
          }
        } else {
          this.setState(
            {
              result: data1,
              maxPage: data.page ? data.page : 1,
              loading: false,
            },
            () => this.calculateQty(),
          );
        }
      })
      .catch(err => {
        this.showNotification(err.message, 'error');
        console.log('ERRRORRRR', err);
        this.setState({
          loading: false,
        });
      });
  }

  calculateQty() {
    var qtyPO = this.state.result;
    var qtyPODetail = qtyPO.detail;
    var totalQty = 0;
    var totalQtyBonusPO = 0;
    // console.log('QTY PO LENGTH: ', qtyPODetail);
    if (qtyPODetail === undefined) {
      return;
    } else {
      for (let i = 0; i < qtyPODetail.length; i++) {
        var currObj = qtyPODetail[i];
        totalQty += parseInt(currObj['rcvd_quantityrecv']);
        totalQtyBonusPO += parseInt(currObj['rcvd_quantitybonus']);
      }
      // console.log('TOTAL QTY: ', totalQty, 'TOTAL BONUS: ', totalQtyBonusPO);
      this.setState({ qtyPOMAX: totalQty, qtyBonusPOMAX: totalQtyBonusPO });
      return;
    }
  }

  componentDidMount() {
    const { group, data } = this.props.location.state;
    var labelGroup = group == 2 ? 'FLOOR' : 'APOTEK';
    this.props.setTitle('DETAIL RECEIVING PO NORMAL ' + labelGroup, 'red');
    var gudangID = window.localStorage.getItem('gID');
    var noRecv = data.rcvh_norecv;
    // console.log('LOGS', data, gudangID);
    this.getListbyPaging(gudangID, noRecv, group);
  }

  //modal Tambah
  state = {
    modal: false,
    modal_backdrop: false,
    modal_nested_parent: false,
    modal_nested: false,
    backdrop: true,
  };

  toggle = modalType => () => {
    this.setState({
      [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
    });
  };

  fetchData = () => {
    this.setState({ loading: true });
  };

  formatTabel(result) {
    console.log("ISI DETAIL: ", result);
    if (result.detail.length > 1) {
      var objBatchRecv = result.detail.map(function (detail) {
        console.log("ISI DETAIL DALAM: ", detail);
        return detail.rcvd_nobatch + '(' + detail.rcvd_quantityrecv + ')';
      });
      // Result: [154(2), 110(3), 156(4)]
      result['rcvd_nobatch'] = objBatchRecv.join();

      var objQtyRecv = result.detail.map(function (detail) {
        console.log("ISI DETAIL DALAM 2", detail);
        return detail.rcvd_quantityrecv;
      });
      result['rcvd_quantityrecv'] = objQtyRecv.reduce(function (acc, score) {
        return acc + score;
      }, 0);
    } else {
      result['rcvd_nobatch'] = result.detail[0]['rcvd_nobatch'];
      result['rcvd_quantityrecv'] = result.detail[0]['rcvd_quantityrecv'];
    }
    return result;
  }

  setDate(efDate) {
    var tglEfektifYear = efDate.substring(0, 4);
    var tglEfektifMonth = efDate.substring(5, 7);
    var tglEfektifDate = efDate.substring(8, 10);
    var tglEfektif =
      tglEfektifYear + '-' + tglEfektifMonth + '-' + tglEfektifDate;
    return tglEfektif;
  }

  render() {
    const { loading, isDetail, currentData, result } = this.state;
    const { group, data } = this.props.location.state;
    var labelGroup = group == 2 ? 'FLOOR' : 'APOTEK';

    var header = result.header;
    var currentTodos = result.detail;
    var currentTodoshead = result;
    // console.log('header', header);
    // console.log('DATA DATA', data);

    // console.log('ERSULT', result);

    const isEnabled = this.canBeSubmitted();

    const renderTodos =
      currentTodos &&
      currentTodos.map((todo, i) => {
        this.formatTabel(result);
        return (
          <tr key={i}>
            {console.log('DETAIL TODOS', result)}
            {true && (
              <th style={{ textAlign: 'center' }} scope="row">
                <Label> {todo.rcvd_procode}</Label>
              </th>
            )}
            <td style={{ textAlign: 'left' }}>{todo.rcvd_proname}</td>
            {/* <td style={{ textAlign: 'right' }}>{this.state.qtyPOMAX}</td>
            <td style={{ textAlign: 'right' }}>{this.state.qtyBonusPOMAX}</td> */}
            <td style={{ textAlign: 'right' }}>{todo.rcvd_quantityrecv}</td>
            <td style={{ textAlign: 'right' }}>{todo.rcvd_quantitybonus}</td>
            <td style={{ textAlign: 'left' }}>{todo.rcvd_buypack}</td>
            <td style={{ textAlign: 'right' }}>{todo.rcvd_sellunit}</td>
            <td style={{ textAlign: 'left' }}>{todo.rcvd_nobatch}</td>
            <td style={{}}>{new Date(todo.rcvd_ed).toDateString()}</td>
          </tr>
        );
      });

    return (
      <Page
        // title={`DETAIL RECEIVING PO NORMAL ` + labelGroup}
        // breadcrumbs={[{ name: 'receiving', active: true }]}
        className="ReceivingHPage"
      >
        <Row>
          <Col>
            <Modal
              onExit={this.handleClose}
              isOpen={this.state.modal_nested_parent}
              toggle={this.toggle('nested_parent')}
              className={this.props.className}
            >
              {/* Modal Tambah*/}
              <ModalHeader toggle={this.toggle('nested_parent')}>
                Tambah Detail Receiving
              </ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Label>Procod</Label>
                  <Input
                    type="text"
                    autoComplete="off"
                    id="procod"
                    value={currentData.procod}
                    onChange={e =>
                      this.updateInputValue(
                        e.target.value,
                        'procod',
                        'currentData',
                      )
                    }
                    name="namaunit"
                    placeholder="Isi Procod"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>E.D</Label>
                  <Input
                    type="text"
                    autoComplete="off"
                    id="ed"
                    value={currentData.ed}
                    onChange={e =>
                      this.updateInputValue(e.target.value, 'ed', 'currentData')
                    }
                    name="namaunit"
                    placeholder="Isi Expire Date"
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Batch</Label>
                  <Input
                    type="text"
                    autoComplete="off"
                    id="batch"
                    value={currentData.batch}
                    onChange={e =>
                      this.updateInputValue(
                        e.target.value,
                        'batch',
                        'currentData',
                      )
                    }
                    name="namaunit"
                    placeholder="Isi Batch"
                  />
                </FormGroup>

                <Label style={{ fontSize: '12px' }}>CTRL+S untuk simpan</Label>
              </ModalBody>
              <ModalFooter>
                <Button
                  disabled={!isEnabled}
                  color="primary"
                  onClick={this.toggle('nested')}
                >
                  Simpan
                </Button>
                <Modal
                  onExit={this.handleClose}
                  isOpen={this.state.modal_nested}
                  toggle={this.toggle('nested')}
                >
                  <ModalHeader>Konfirmasi Penyimpanan</ModalHeader>
                  <ModalBody>
                    <strong>Nama Unit: {this.state.inputtedName}</strong>
                    <br />
                    <br></br>
                    Apakah Anda yakin ingin menyimpan data ini?
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onClick={/*insert Data*/ this.toggle('nested')}
                      disabled={loading}
                    >
                      {!loading && <span>Ya</span>}
                      {loading && <MdAutorenew />}
                      {loading && <span>Sedang diproses</span>}
                    </Button>{' '}
                    {!loading && (
                      <Button color="secondary" onClick={this.toggle('nested')}>
                        Tidak
                      </Button>
                    )}
                  </ModalFooter>
                </Modal>{' '}
                <Button
                  color="secondary"
                  onClick={this.toggle('nested_parent')}
                >
                  Batal
                </Button>
              </ModalFooter>
            </Modal>
            <NotificationSystem
              dismissible={false}
              ref={notificationSystem =>
                (this.notificationSystem = notificationSystem)
              }
              style={NOTIFICATION_SYSTEM_STYLE}
            />
            {/* {console.log('GET DATA  ', data)} */}
            <Card style={{ marginBottom: '1%' }}>
              <CardHeader>
                <FormGroup>
                  <CardBody>
                    <Row md="1" sm="3" xs="3" style={{ marginBottom: '10px' }}>
                      <Label
                        className="text-left"
                        style={{ width: '15%', fontWeight: 'bold' }}
                      >
                        NO RECV
                      </Label>
                      <Input
                        disabled
                        style={{ width: '20%' }}
                        value={data.rcvh_norecv}
                      ></Input>
                      <Label
                        className="text-left"
                        style={{
                          width: '8%',
                          fontWeight: 'bold',
                          marginLeft: '2%',
                        }}
                      >
                        NO PO
                      </Label>
                      <Input
                        disabled
                        style={{ width: '20%' }}
                        value={data.rcvh_nopo}
                      ></Input>
                      <Label
                        className="text-left"
                        style={{
                          width: '10%',
                          fontWeight: 'bold',
                          marginLeft: '2%',
                        }}
                      >
                        TGL RECV
                      </Label>
                      <Input
                        disabled
                        style={{ width: '20%' }}
                        value={new Date(data.rcvh_tglrecv).toDateString()}
                      ></Input>
                    </Row>
                    <Row md="2" sm="6" xs="6" style={{ marginBottom: '10px' }}>
                      <Label
                        className="text-left"
                        style={{ width: '15%', fontWeight: 'bold' }}
                      >
                        SUPPLIER
                      </Label>
                      <Input
                        disabled
                        style={{ width: '82%' }}
                        value={data.rcvh_nosup + ' - ' + data.rcvh_suppliername}
                      ></Input>
                    </Row>
                    <Row md="1" sm="3" xs="3" style={{ marginBottom: '10px' }}>
                      <Label
                        className="text-left"
                        style={{ width: '15%', fontWeight: 'bold' }}
                      >
                        FAKTUR SUPPLIER
                      </Label>
                      <Input
                        disabled
                        style={{ width: '20%' }}
                        value={data.rcvh_nofaktur}
                      ></Input>
                      <Label
                        className="text-left"
                        style={{
                          width: '31%',
                          fontWeight: 'bold',
                        }}
                      ></Label>
                      <Label
                        className="text-left"
                        style={{
                          width: '10%',
                          fontWeight: 'bold',
                          marginLeft: '1%',
                        }}
                      >
                        TGL FAKTUR
                      </Label>
                      <Input
                        disabled
                        style={{ width: '20%' }}
                        value={new Date(
                          header && header.rcvh_tglfaktur,
                        ).toDateString()}
                      ></Input>
                    </Row>
                    <Row md="1" sm="3" xs="3" style={{ marginBottom: '10px' }}>
                      <Label
                        className="text-left"
                        style={{ width: '15%', fontWeight: 'bold' }}
                      >
                        SURAT JALAN
                      </Label>
                      <Input
                        disabled
                        style={{ width: '20%' }}
                        value={header && header.rcvh_nodo}
                      ></Input>
                      <Label
                        className="text-left"
                        style={{
                          width: '31%',
                          fontWeight: 'bold',
                        }}
                      ></Label>
                      <Label
                        className="text-left"
                        style={{
                          width: '10%',
                          fontWeight: 'bold',
                          marginLeft: '1%',
                        }}
                      >
                        TGL SURAT
                      </Label>
                      <Input
                        disabled
                        style={{ width: '20%' }}
                        value={new Date(
                          header && header.rcvh_tgldo,
                        ).toDateString()}
                      ></Input>
                    </Row>
                    <Row md="1" sm="3" xs="3">
                      <Label
                        className="text-left"
                        style={{ width: '15%', fontWeight: 'bold' }}
                      >
                        PENGECEK FISIK
                      </Label>
                      <Input
                        disabled
                        style={{ width: '82%' }}
                        value={header && header.rcvh_niprecv}
                      ></Input>
                    </Row>
                    {/* <Row md="1" sm="3" xs="3">
                                    <Label className="text-left" style={{ width: '15%', fontWeight: "bold" }}>SCAN MESIN</Label>
                                    <Input className="text-left" style={{ width: '25%' }}></Input>
                                    <Label style={{ width: '50%' }}></Label>
                                </Row> */}
                  </CardBody>
                </FormGroup>
              </CardHeader>
            </Card>
            <Card className="mb-3">
              <CardBody>
                <Table responsive striped>
                  <thead>
                    {
                      <tr>
                        <th style={{ textAlign: 'center' }}>Procod</th>
                        <th style={{ textAlign: 'left' }}>Prodes</th>
                        {/* <th style={{ textAlign: 'right' }}>Total Qty PO</th>
                        <th style={{ textAlign: 'right' }}>Total Qty Bns PO</th> */}
                        <th style={{ textAlign: 'right' }}>Qty Recv</th>
                        <th style={{ textAlign: 'right' }}>Qty Bonus</th>
                        <th style={{ textAlign: 'left' }}>Buypack</th>
                        <th style={{ textAlign: 'right' }}>Sellunit</th>
                        <th style={{ textAlign: 'left' }}>Batch</th>
                        <th style={{ textAlign: 'left' }}>E.D</th>
                      </tr>
                    }
                  </thead>
                  <tbody>
                    {renderTodos}
                    {!currentTodos && (
                      <tr>
                        <td
                          style={{ backgroundColor: 'white' }}
                          colSpan="15"
                          className="text-center"
                        >
                          TIDAK ADA DATA
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </CardBody>
              <CardBody width={100}>
                <Button
                  style={{ float: 'right', textAlign: 'center' }}
                  onClick={this.changePageState('HEADER')}
                >
                  Kembali
                </Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }

  canBeSubmitted() {
    const { currentData } = this.state;
    const { barcode } = this.state;
    return barcode.length > 0 && barcode.trim() !== '';
  }

  updateInputValue(value, field, Data) {
    console.log(Data);

    let currentData = this.state[Data];
    console.log('currData  ', currentData);

    currentData[field] = value;
    this.setState({ currentData });
  }

  updateSearchValue(evt) {
    this.setState({
      keyword: evt.target.value,
    });
  }
}
export default ReceivingDPage;
