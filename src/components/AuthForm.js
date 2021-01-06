import logoImage from 'assets/img/logo/logo.jpg';
import React from 'react';
import { Button, Form, FormGroup, Input, Label, Col } from 'reactstrap';
import 'firebase/performance';
import 'firebase/auth';
import { MdAutorenew } from 'react-icons/md';
// global grecaptcha
class AuthForm extends React.Component {
  state = {
    username: '',
    password: '',
    loading: false,
    enterButton: false,
  };

  // mematikan fungsi asli dari event
  handleSubmit = event => {
    event.preventDefault();
  };

  // function untuk validasi masuk ke halaman dashboard
  nextStep = async () => {
    const { username, password } = this.state;
    const { buttonText } = this.props;

    this.setState({ enterButton: true, loading: true });

    if (!buttonText) {
      if (true) {
        console.log(await this.props.onButtonClick(username, password));
        setTimeout(() => {
          this.setState({ loading: false, enterButton: false });
        }, 500);
      }
    }
  };

  // validasi untuk masuk
  canBeSubmittedLogin() {
    const { username, password } = this.state;
    return username.length !== 0 && password.length !== 0;
  }

  // update input value untuk menampung hasil ketikan
  updateValue = event => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  // function show password
  myFunction() {
    var x = document.getElementById('myInput');
    if (x.type === 'password') {
      document.getElementById('checkbox').checked = true;
      x.type = 'text';
    } else {
      document.getElementById('checkbox').checked = false;
      x.type = 'password';
    }
  }

  render() {
    const { loading } = this.state;
    const isEnabledLogin = this.canBeSubmittedLogin();

    return (
      <Form onSubmit={this.handleSubmit}>
        {/* untuk logo */}
        <div className="text-center pb-4">
          <img
            src={logoImage}
            className="rounded"
            style={{ width: 320, height: 80 }}
            alt="logo"
          />
        </div>
        {/* untuk username */}
        <FormGroup>
          <Label>Username</Label>
          <Input
            type="input"
            placeholder="Username..."
            name="username"
            value={this.state.username.toLowerCase()}
            onChange={this.updateValue}
            autoComplete="off"
          />
        </FormGroup>
        {/* untuk password */}
        <FormGroup>
          <Label>Password</Label>
          <Input
            type="password"
            placeholder="Password..."
            name="password"
            autoComplete="off"
            id="myInput"
            value={this.state.password.toLowerCase()}
            onChange={this.updateValue}
          />
        </FormGroup>
        {/* untuk checkbox showpassword */}
        <Col>
          <Col>
            <Input
              type="checkbox"
              id="checkbox"
              onClick={this.myFunction}
            ></Input>
            <Label>Show Password (F1)</Label>
          </Col>
        </Col>
        <br />
        <hr />
        {/* button login */}
        <Button
          color="orange"
          disabled={!isEnabledLogin || loading}
          size="lg"
          className="bg-gradient-theme-left border-0"
          block
          style={{ color: 'white' }}
          onClick={this.nextStep}
        >
          {!loading && 'Masuk'}
          {loading && <MdAutorenew />}
          {loading && 'Sedang diproses'}
        </Button>

        {/* untuk shortkey function */}
        <script>
          {
            (document.onkeydown = e => {
              e = e || window.event;
              switch (e.key) {
                // enter untuk masuk
                case 'Enter':
                  if (
                    isEnabledLogin === true &&
                    this.state.enterButton === false
                  ) {
                    this.nextStep();
                  }
                  break;

                // untuk show password
                case 'F1':
                  this.myFunction();
                  e.preventDefault();
                  break;
              }
            })
          }
        </script>
      </Form>
    );
  }
}

export default AuthForm;
