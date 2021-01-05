var url_getData_EkspedisiIntegra = ''
var url_getPdf  = ''
var url_getResi = ''

if (window.location.hostname.includes('staging-logistic')) {

    url_getData_EkspedisiIntegra = 'https://api.cfu.pharmalink.id/eksternal-ekspedisi/getorderekspedition?gudang_id='
    url_getPdf = 'https://staging-api.cfu.pharmalink.id/eksternal-ekspedisi/cetakpdf?invoice_num='
    url_getResi = 'https://staging-api.cfu.pharmalink.id/eksternal-ekspedisi/bookorderjnt?invoice_num='

  } else if (window.location.hostname.includes('localhost')) {

      url_getData_EkspedisiIntegra = 'https://staging-api.cfu.pharmalink.id/eksternal-ekspedisi/getorderekspedition?gudang_id='
      url_getPdf = 'https://staging-api.cfu.pharmalink.id/eksternal-ekspedisi/cetakpdf?invoice_num='
      url_getResi = 'https://staging-api.cfu.pharmalink.id/eksternal-ekspedisi/bookorderjnt?invoice_num='
  }
  
  export {
    url_getData_EkspedisiIntegra,
    url_getPdf,
    url_getResi
  };