import AuthForm from 'components/AuthForm';
import React from 'react';
import { Card, Col, Row } from 'reactstrap';
import * as myUrl from 'pages/urlLink';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import Page from 'components/Page';

import { MdLoyalty } from 'react-icons/md';

class AuthPage extends React.Component {
  requestLogin = async (username, password) => {
    const urlA = myUrl.url_login;
    //console.log("url", urlA);

    var payload = {
      username: username,
      password: password,
    };

    console.log('PAYLOAD', payload);
    const option = {
      method: 'POST',
      json: true,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: '',
      },
      body: JSON.stringify(payload),
    };
    //console.log(option);
    let data = await fetch(urlA, option)
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          if (response.status === 401) {
            this.showNotification('Username/Password salah!', 'error');
          } else if (response.status === 500) {
            this.showNotification('Internal Server Error', 'error');
          } else {
            // console.log("FETCHING DONE");
            this.showNotification('Koneksi ke server gagal 1', 'error');
          }
          return true;
        }
      })
      .catch(() => {
        //console.log(err);
        this.showNotification('Koneksi ke server gagal!', 'error');
        return true;
      });

    if (data === true) {
      return true;
    }
    if (data) {
      var token = data.headers.get('Authorization');
      data = await data.json();

      console.log('DATA LOGIN', data);
      var data1 = data.data;
      var error = data.error;
      var metadata = data.metadata;

      if (error.status === false) {
        if (metadata.status === true) {
          window.localStorage.setItem('tokenCookies', token);
          window.localStorage.setItem(
            'accessList',
            JSON.stringify(data1.mem_access),
          );
          window.localStorage.setItem('profile', JSON.stringify(data1));
          //console.log("TOKEN", window.localStorage.getItem('tokenCookies'));
          //console.log("accessList", window.localStorage.getItem('accessList'));

          if (data1.mem_forcechangepasswordyn === 'Y') {
            //console.log("FORE CHANGE YES");
            this.props.history.push({
              pathname: '/',
              state: { ok: true },
            });
          } else {
            window.location.replace('/');
          }
        } else {
          this.showNotification(metadata.message, 'error');
          //console.log(metadata.message);
        }
      } else {
        this.showNotification(error.msg, 'error');
      }
    } else {
      //console.log("FETCHING DONE");
      this.showNotification('Koneksi ke server gagal', 'error');
    }

    return true;
  };

  // untuk menampilkan notifikasi
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

  render() {
    return (
      <Page>
        <Row
          style={{
            height: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Col md={6} lg={4}>
            <Card body>
              {/* untuk notifikasi */}
              <NotificationSystem
                dismissible={false}
                ref={notificationSystem =>
                  (this.notificationSystem = notificationSystem)
                }
                style={NOTIFICATION_SYSTEM_STYLE}
              />

              {/* untuk get props dari authform  */}
              <AuthForm
                onButtonClick={this.requestLogin}
                showNotification={this.showNotification}
              />
            </Card>
          </Col>
        </Row>
      </Page>
    );
  }
}
export default AuthPage;
