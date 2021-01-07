import Page from 'components/Page';
import logo200Image from 'assets/img/logo/logo.jpg';
import React from 'react';
import { Col, Row, Label, Button } from 'reactstrap';

class DashboardPage extends React.Component {
  state = {
    nama: '',
  };

  setProfileData() {
    var profileName = JSON.parse(window.localStorage.getItem('profile'));
    // console.log('PROFILE', profileName);

    if (profileName === null) {
      return profileName;
    } else {
      this.setState(
        {
          nip: profileName.mem_nip,
          nama: profileName.mem_username,
        },
        // () => console.log('profile name', profileName.mem_access),
      );
    }
  }

  refreshPage() {
    if (window.location.search.length < 1) {
      window.top.location = window.top.location + '?reload';
      // console.log('LOG');
    }
    // console.log('LOKASI', location);
  }

  componentDidMount() {
    this.setProfileData();
    // alert("Jika menu tidak keluar silahkan refresh page")
  }

  render() {
    return (
      <Page>
        <Row>
          <Col style={{ textAlign: 'center', marginTop: '15%' }}>
            <img
              src={logo200Image}
              width="380"
              height="100"
              className="pr-2"
              alt=""
            />
            <br></br>
            <br></br>
            <Label style={{ fontWeight: 'bold' }}>
              Selamat Datang {this.state.nama} di Halaman Alsintanlink Admin
            </Label>
            <br></br>
            <Button onClick={() => this.props.history.push('/showTransaction')}>
              Masuk Ke Detail
            </Button>
          </Col>
        </Row>
      </Page>
    );
  }
}
export default DashboardPage;
