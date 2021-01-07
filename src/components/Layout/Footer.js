import React from 'react';

import { Navbar, Nav, NavItem } from 'reactstrap';

//import SourceLink from 'components/SourceLink';

const Footer = () => {
  return (
    <Navbar>
      <Nav navbar>
        <NavItem>© {new Date().getFullYear()}, Alsintanlink Admin</NavItem>
      </Nav>
    </Navbar>
  );
};

export default Footer;
