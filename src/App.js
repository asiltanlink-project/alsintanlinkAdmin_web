import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import PrivateRoute from 'components/Layout/PrivateRoute';
import PageSpinner from 'components/PageSpinner';
import AuthPage from 'pages/template/AuthPage';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Switch } from 'react-router-dom';
import './styles/reduction.scss';
import * as firebase from 'firebase/app';
// import 'firebase/performance';
// import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyALU66lM4mv9MRWVNsAgXTIQIvNdEYeXqU',
  authDomain: 'alsintanlinkadmin.firebaseapp.com',
  projectId: 'alsintanlinkadmin',
  storageBucket: 'alsintanlinkadmin.appspot.com',
  messagingSenderId: '772261001994',
  appId: '1:772261001994:web:d84c4f54d9c08ff47f98f3',
  measurementId: 'G-9NNSN7F2KF',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const Dashboard = React.lazy(() => import('pages/template/DashboardPage'));
const showTransaction = React.lazy(() =>
  import('pages/template/showTransaction'),
);

const getBasename = () => {
  console.log('PUBLIC URL: ', `/${process.env.PUBLIC_URL.split('/').pop()}`);
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};

class App extends React.Component {
  state = {
    title: '',
    color: '',
    menuID: '',
  };

  setTitle = (title, color) => {
    this.setState({ title: title, color: color });
  };

  getAccess() {
    var accessList = JSON.parse(window.localStorage.getItem('accessList'));
    if (accessList !== null && accessList !== undefined) {
      // console.log('MENU ID MASUK 1');
      if (Object.keys(accessList).includes('18')) {
        // console.log('MENU ID 18');
        this.setState({ menuID: '18' });
      } else if (Object.keys(accessList).includes('5')) {
        // console.log('MENU ID 5');
        this.setState({ menuID: '5' });
      } else if (Object.keys(accessList).includes('3')) {
        // console.log('MENU ID 3');
        this.setState({ menuID: '3' });
      } else {
        // console.log('MENU ID MASUK 2');
        return;
      }
    }
    // console.log('MENU ID MASUK 3');
    // return;
  }

  componentDidMount() {
    this.getAccess();
  }

  render() {
    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={props => <AuthPage {...props} />}
            />
            <MainLayout
              breakpoint={this.props.breakpoint}
              title={this.state.title}
              color={this.state.color}
            >
              <React.Suspense fallback={<PageSpinner />}>
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID={this.state.menuID}
                  path="/"
                  component={Dashboard}
                />
                <PrivateRoute
                  exact
                  setTitle={this.setTitle}
                  menuID={this.state.menuID}
                  path="/showtransaction"
                  component={showTransaction}
                />
              </React.Suspense>
            </MainLayout>
            <Redirect to="/" />
          </Switch>
        </GAListener>
      </BrowserRouter>
    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
