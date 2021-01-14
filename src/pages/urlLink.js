/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */

//URL LOGIN
var url_login = 'https://alsintanlink.com/api/admin/login';

// ShowTransaction
var url_getProvince = 'https://alsintanlink.com/api/location/province';
var url_getCity = 'https://alsintanlink.com/api/location/city';
var url_getDistrict = 'https://alsintanlink.com/api/location/district';
var url_getAllData = 'https://alsintanlink.com/api/admin/';
var url_showDetailFarmer =
  'https://alsintanlink.com/api/admin/show_detail_farmer';
var url_showDetailUpja = 'https://alsintanlink.com/api/admin/show_detail_upja';
var url_getDetailAlsin = 'https://alsintanlink.com/api/admin/show_detail_alsin';
var url_getDetailAlsinItem =
  'https://alsintanlink.com/api/admin/show_detail_alsin_item';

var url_getEcommerce =
  'https://staging-api.cfu.pharmalink.id/support/getEcommerceData';
var url_getPelapakID =
  'https://staging-api.cfu.pharmalink.id/support/getEcommerceData?';
var url_getPelapak =
  'https://api.cfu.pharmalink.id/support/getOutletData?type=getPelapakList';
var url_scanProcod =
  'https://staging-api.cfu.pharmalink.id/product-bundling/getProductByProductId';

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
  url_showDetailFarmer,
  url_showDetailUpja,
  url_getAllData,
  url_getDetailAlsin,
  url_getDetailAlsinItem,
  // showTransaction
  url_getProvince,
  url_getCity,
  url_getDistrict,
  url_getListPerOulet,
  url_getLimitDefault,
  url_editLimitDefault,
  url_editLimitPerPelapak,
  url_deleteBatasPerPelapak,
  url_getOutletEcommerce,
  url_editDataHeader,
  url_deleteHeaderData,
  url_insertDataOutlet,
  url_getEcommerce,
  url_getPelapak,
  url_getPelapakID,
  url_scanProcod,
};
