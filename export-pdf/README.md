```javascript
const elm = document.querySelector('#exportPdf')
exportPdf(elm, {
  output: 'export_file_' + moment().format('MMDDYYYY'),
  html2canvas: {
    scale: 2,
    backgroundColor: '#0B1A48'
  },
  pdfContentWidth: 1800, //el.clientWidth
  margin: 20,
  preview: true,
  jsPDF: {
    unit: 'pt',
    orientation: 'p',
    format: 'a4',
    precision: '12',
    putOnlyUsedFonts: false,
    floatPrecision: 'smart', // default is 16
  }
}).then((res) => {
  // do something...
})

```
