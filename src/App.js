import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import PrivateRoute from 'components/Layout/PrivateRoute';
import PageSpinner from 'components/PageSpinner';
import AuthPage from 'pages/template/AuthPage';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './styles/reduction.scss';
import * as firebase from 'firebase/app';
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

const showTransactionDetail = React.lazy(() =>
  import('pages/template/showTransactionDetail'),
);

const showTransactionAlert = React.lazy(() =>
  import('pages/template/showTransactionAlert'),
);

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};

class App extends React.Component {
  state = {
    title: '',
    color: '',
  };

  setTitle = (title, color) => {
    this.setState({ title: title, color: color });
  };

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
                <Route
                  exact
                  setTitle={this.setTitle}
                  path="/"
                  component={Dashboard}
                />
                <Route
                  exact
                  setTitle={this.setTitle}
                  path="/showtransaction"
                  component={showTransaction}
                />
                <Route
                  exact
                  setTitle={this.setTitle}
                  path="/showtransactionAlert"
                  component={showTransactionAlert}
                />
                <Route
                  exact
                  setTitle={this.setTitle}
                  path="/showtransaction/farmer=:farmer_id"
                  component={showTransactionDetail}
                />
                <Route
                  exact
                  setTitle={this.setTitle}
                  path="/showtransaction/upja=:upja_id"
                  component={showTransactionDetail}
                />
                <Route
                  exact
                  setTitle={this.setTitle}
                  path="/showtransaction/farmer/:farmer_id"
                  component={showTransactionDetail}
                />
                <Route
                  exact
                  setTitle={this.setTitle}
                  path="/showtransaction/upja/:upja_id"
                  component={showTransactionDetail}
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
