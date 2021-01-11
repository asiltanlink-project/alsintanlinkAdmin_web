/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */

//URL LOGIN
var url_login = 'http://alsintanlink.com/api/admin/login';
// var url_login = 'https://api.cfu.pharmalink.id/auth/login';
var url_changeForgottenPassword =
  'https://staging-api.cfu.pharmalink.id/auth/forgotpassword';
var url_verifyOTP = 'https://staging-api.cfu.pharmalink.id/auth/verifyotp';
var url_changePassword =
  'https://staging-api.cfu.pharmalink.id/auth//changePassword';

// ShowTransaction
var url_getEcommerce =
  'https://staging-api.cfu.pharmalink.id/support/getEcommerceData';
var url_getPelapakID =
  'https://staging-api.cfu.pharmalink.id/support/getEcommerceData?';
var url_getPelapak =
  'https://api.cfu.pharmalink.id/support/getOutletData?type=getPelapakList';
var url_scanProcod =
  'https://staging-api.cfu.pharmalink.id/product-bundling/getProductByProductId';
var url_getAllData =
  'https://staging-api.cfu.pharmalink.id/master-plafond-ecommerce/integra/getlimitproduct?';
var url_getListPerOulet =
  'https://staging-api.cfu.pharmalink.id/master-plafond-ecommerce/integra/getlimitoutlet?';
var url_getLimitDefault =
  'https://staging-api.cfu.pharmalink.id/master-plafond-ecommerce/integra/getlimitdefault';
var url_editLimitDefault =
  'https://staging-api.cfu.pharmalink.id/master-plafond-ecommerce/integra/setlimitdefault';
var url_editLimitPerPelapak =
  'https://staging-api.cfu.pharmalink.id/master-plafond-ecommerce/integra/setlimitoutlet';
var url_deleteBatasPerPelapak =
  'https://staging-api.cfu.pharmalink.id/master-plafond-ecommerce/integra/resetlimitoutlet';
var url_deleteHeaderData =
  'https://staging-api.cfu.pharmalink.id/master-plafond-ecommerce/integra/forceendlimitproduct';
var url_editDataHeader =
  'https://staging-api.cfu.pharmalink.id/master-plafond-ecommerce/integra/editlimitproduct';
var url_getOutletEcommerce =
  'https://staging-api.cfu.pharmalink.id/support/getOutletData?type=getOutletPelapak';
var url_insertDataOutlet =
  'https://staging-api.cfu.pharmalink.id/master-plafond-ecommerce/integra/setlimitproduct';

export {
  url_login,
  url_changeForgottenPassword,
  url_verifyOTP,
  url_changePassword,
  // showTransaction
  url_getListPerOulet,
  url_getLimitDefault,
  url_editLimitDefault,
  url_editLimitPerPelapak,
  url_deleteBatasPerPelapak,
  url_getOutletEcommerce,
  url_editDataHeader,
  url_deleteHeaderData,
  url_getAllData,
  url_insertDataOutlet,
  url_getEcommerce,
  url_getPelapak,
  url_getPelapakID,
  url_scanProcod,
};
