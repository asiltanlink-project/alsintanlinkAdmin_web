/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */

// url local efath
var url_alsintanlinkLocal = 'https://alsintanlink.com';
var url_alsintanlinkProduction =
  'http://alsintanlink-api.litbang.pertanian.go.id';

//URL LOGIN
var url_login = url_alsintanlinkProduction + '/api/admin/login';

// ShowTransaction
var url_getProvince = url_alsintanlinkProduction + '/api/location/province';
var url_getCity = url_alsintanlinkProduction + '/api/location/city';
var url_getDistrict = url_alsintanlinkProduction + '/api/location/district';
var url_getAllData = url_alsintanlinkProduction + '/api/admin/';
var url_showDetailFarmer =
  url_alsintanlinkProduction + '/api/admin/show_detail_farmer';
var url_showDetailUpja =
  url_alsintanlinkProduction + '/api/admin/show_detail_upja';
var url_getDetailAlsin =
  url_alsintanlinkProduction + '/api/admin/show_detail_alsin';
var url_getDetailAlsinItem =
  url_alsintanlinkProduction + '/api/admin/show_detail_alsin_item';
var url_getDetailTransaction =
  url_alsintanlinkProduction + '/api/admin/show_detail_transaction';
var url_getDetailTransactionItem =
  url_alsintanlinkProduction + '/api/admin/show_detail_transaction_alsin';
var url_getAllUpjaTransaction =
  url_alsintanlinkProduction + '/api/admin/show_all_upja_traction';
var url_sendUpjaAlert = 'http://alsintanlink.com/api/admin/send_upja_alert';
var url_showAllTransaction =
  url_alsintanlinkProduction + '/api/admin/show_all_transaction';
var url_getVillage = url_alsintanlinkProduction + '/api/location/village';
var url_allAlsinType =
  url_alsintanlinkProduction + '/api/upja/show_all_alsin_type';
var url_showSparePartType =
  url_alsintanlinkProduction + '/api/admin/show_spare_part_type?alsin_type_id=';
var url_showSparePart =
  url_alsintanlinkProduction + '/api/admin/show_spare_part?spare_part_type_id=';
var url_deleteSparePart =
  url_alsintanlinkProduction + '/api/admin/delete_spare_part';
var url_updateSparePart =
  url_alsintanlinkProduction + '/api/admin/update_spare_part_type';

var url_uploadExcel =
  url_alsintanlinkProduction + '/api/admin/import_spare_part';
var url_manual_book = 'http://alsintanlink.com/api/manual_book/admin';

export {
  url_login,
  url_showDetailFarmer,
  url_showDetailUpja,
  url_getAllData,
  url_getDetailAlsin,
  url_getDetailAlsinItem,
  url_getDetailTransaction,
  url_getDetailTransactionItem,
  url_getProvince,
  url_getCity,
  url_getDistrict,
  url_getAllUpjaTransaction,
  url_sendUpjaAlert,
  url_showAllTransaction,
  url_getVillage,
  url_allAlsinType,
  url_showSparePartType,
  url_showSparePart,
  url_deleteSparePart,
  url_updateSparePart,
  url_uploadExcel,
  url_manual_book,
};
