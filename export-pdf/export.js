import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import Vue from 'vue'
import {
  DPR,
  isArray,
  mergeObject,
  cloneAllCanvas
} from './utils'
import {
  PRINT_FORMATS,
  DEFAULT_MARGIN,
  DEFAULT_OPTIONS,
  IMAGE_TYPES,
  IGNORE_ATTRIBUTE,
  DISPLAY_CLASS_NAME,
  BREAK_BEFORE_CLASS_NAME,
  CONTAINER_POSITION_TOP
} from './constants'

/**
 * Handler margin
 * <number> =>
 *   { top: <number>, bottom: <number>, left: <number>, right: <number> }
 * [<vertical>, <horizontal>] =>
 *   { top: <vertical>, bottom: <vertical>, left: <horizontal>, right: <horizontal> }
 * @param {Object} options
 */
function getNormalMargin (options) {

  const marginMaps = new Map([
    [
      typeof options.margin === 'number',
      () => {
        const num = options.margin
        options.margin = {}
        Object.keys(DEFAULT_MARGIN).forEach(key => {
          options.margin[key] = num
        })
      }
    ],
    [
      isArray(options.margin),
      () => {
        const [vertical, horizontal] = options.margin
        options.margin = {}
        Object.keys(DEFAULT_MARGIN).forEach((key, i) => {
          options.margin[key] = i % 2 ? horizontal : vertical
        })
      }
    ]
  ])

  for (const [key, fn] of marginMaps) {
    key && fn()
  }
}

function setDisplayBlockStyle (dom) {
  Array.from(dom.querySelectorAll(`.${DISPLAY_CLASS_NAME}`)).forEach(elm => {
    elm.style.display = 'block'
  })
}


/**
 * Get images type
 * @param   {String} type jpeg/png/webp
 * @returns {String} JPEG/PNG/WEBP
 */
function images (type) {
  return IMAGE_TYPES[`image/${type}`]
}

/**
 * Add ignore attribute to ignore elements
 * @param {Object} options
 */
function setIgnoreElements (options) {
  const ignoreEle = options.ignoreElements instanceof Node
    ? [options.ignoreElements]
    : options.ignoreElements

  for (const $ele of ignoreEle) {
    $ele instanceof Node && $ele.setAttribute(IGNORE_ATTRIBUTE, '')
  }
}

function getPrintPageInfo (width) {
  const relDPR = width * DPR()
  // sort ASC according to the distance with the target width
  const printFormats = PRINT_FORMATS
    .sort((a, b) => Math.abs(a.width - relDPR) - Math.abs(b.width - relDPR))

  return PRINT_FORMATS.find((item) => item.width === printFormats[0].width)
}

function getPdfInfo(options) {
  const { margin } = options
  const pageInfo = Object.assign(
    {},
    options.jsPDF.format
      ? PRINT_FORMATS.find(v => v.name === options.jsPDF.format)
      : getPrintPageInfo(options.dom.width)
  )

  // If landscape orientation layout, exchange width and height
  if (options.jsPDF.orientation === 'l') {
    [ pageInfo.width,  pageInfo.height ] = [ pageInfo.height, pageInfo.width ]
  }

  const pdf = new jsPDF({
    ...options.jsPDF,
    format: pageInfo.name
  })

  const [paperWidth, paperHeight] = [pageInfo.width, pageInfo.height]

  const [contentWidth, contentHeight] = [
    paperWidth - margin.left - margin.right,
    paperHeight - margin.top - margin.bottom
  ]

  return {
    pdf,
    paperWidth,
    paperHeight,
    contentWidth,
    contentHeight
  }
}

function renderPdf(canvas, pdfConfig, opts) {
  const { margin } = opts
  const {
    pdf,
    contentWidth,
    contentHeight,
    paperWidth,
    paperHeight
  } = pdfConfig
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  const pageData = canvas.toDataURL(`image/${opts.imageType}`, opts.imageQuality)
  const imgWidth = contentWidth

  // Height of the entire image
  const imgHeight = imgWidth / canvasWidth * canvasHeight

  // Every page height
  const pageHeight = contentHeight

  // The remaining un-rendered image height
  let leftHeight = imgHeight

  let position = 0
  let currentPage = 1
  while (leftHeight > 0) {
    pdf.addImage(
      pageData,
      images(opts.imageType),
      margin.left,
      position +
        margin.top * currentPage +
        margin.bottom * (currentPage - 1),
      imgWidth,
      imgHeight
    )

    // Cover margin
    pdf.setFillColor(opts.html2canvas.backgroundColor)
    pdf.rect(0, 0, paperWidth, margin.top, 'F') // top
    pdf.rect(0, paperHeight - margin.bottom, paperWidth, margin.bottom, 'F') // bottom
    pdf.rect(0, 0, margin.left, paperHeight, 'F') // left
    pdf.rect(paperWidth - margin.right, 0, margin.right, paperHeight, 'F') // right

    // Check remaining un-rendered content
    if (leftHeight < pageHeight) {
      break
    } else {
      leftHeight -= pageHeight
      position -= paperHeight
      pdf.addPage()
      currentPage += 1
    }
  }

  return pdf
}

function getCloneDom(options, dom) {
  const isExportDom = dom instanceof Node
  const template = `
    <div
      id="cloned-exported-content"
      style="position: fixed; top: ${CONTAINER_POSITION_TOP}px; z-index: -99999; width: ${options.pdfContentWidth}px; ${!isExportDom ? 'background: #fff;' : ''};"
    ></div>
  `
  const exportedDomParser = new DOMParser().parseFromString(template, 'text/html')
  const exportedDom = exportedDomParser.querySelector('#cloned-exported-content')
  if (isExportDom) {
    const clonedDom = dom.cloneNode(true)
    exportedDom.appendChild(clonedDom)
    document.body.appendChild(exportedDom)
    cloneAllCanvas(dom, clonedDom) // clone canvas
  } else {
    exportedDom.innerHTML = dom
    document.body.appendChild(exportedDom)
  }

  return exportedDom
}

function setBreakBefore(dom, params) {
  const { domWidth, width, height } = params
  const perPageDomHeight = domWidth / width * height
  Array.from(dom.querySelectorAll(`.${BREAK_BEFORE_CLASS_NAME}`)).forEach((elm, index) => {
    const pageNumber = index + 1
    const rect = elm.getBoundingClientRect()
    const div = document.createElement('div')
    const offsetTop = rect.top - CONTAINER_POSITION_TOP
    div.style.width = '100%'
    div.style.height = `${Math.ceil(perPageDomHeight * pageNumber - offsetTop)}px`
    elm.parentNode.insertBefore(div, elm)
  })

  return dom
}

function previewPdf(options, pdf, fileName) {
  const sModal = Vue.options.components['s-modal']
  const Modal = Vue.extend({
    ...sModal.options,
    data () {
      return {
        ...Object.assign({}, sModal.options.data()),
      }
    }
  })
  const iframe = document.createElement('iframe')
  iframe.width = '100%'
  iframe.style.height = 'calc(100vh - 240px)'
  iframe.src = window.URL.createObjectURL(pdf.output('blob', {
    filename: fileName
  }))

  const confirmVM = new Modal({
    created () {
      this.size = 'xl'
      this.title = 'PREVIEW PDF'
      this.id = 'preview-pdf'
      this.$slots.footer = []
    },
    mounted () {
      const button = document.createElement('button')
      button.innerText = 'DOWNLOAD'
      button.className = 's-btn s-btn-outline-secondary s-btn-default'
      button.type = 'button'
      button.style.borderWidth = '1px'
      button.style.cursor = 'pointer'
      button.onclick = () => {
        return options.success
          ? options.success.call(opts, pdf)
          : pdf.save(fileName)
      }
      this.$nextTick(() => {
        document
          .querySelector(`#${this.id}-s-modal-outer-body`)
          .appendChild(iframe)

        document
          .querySelector(`#${this.id}-s-modal-footer`)
          .appendChild(button)
      })
    },
    methods: {
      closeModal() {
        this.visible = false
      }
    }
  }).$mount()

  document.body.appendChild(confirmVM.$el)
  confirmVM.visible = true
}

async function exportPdf(dom, options = {}) {
  getNormalMargin(options)
  const opts = mergeObject(DEFAULT_OPTIONS, options)
  if (dom instanceof Node) {
    // set display none to block, if content show in pdf
    setDisplayBlockStyle(dom)
    // ignore elements
    opts.ignoreElements && setIgnoreElements(opts)
  }

  // clone export dom to another container
  const clonedDom = getCloneDom(opts, dom)
  const width = clonedDom.clientWidth
  const pdfConfig = getPdfInfo({ dom: { width }, ...opts })
  const exportedDom = setBreakBefore(clonedDom, {
    domWidth: opts.pdfContentWidth,
    width: pdfConfig.contentWidth,
    height: pdfConfig.contentHeight
  })
  const canvas = await html2canvas(exportedDom, opts.html2canvas)
  const pdf = renderPdf(canvas, pdfConfig, opts)
  const fileName = opts.output || `${(new Date()).toDateString()}.pdf`
  // After generate pdf, remove export content and container
  exportedDom.remove()

  if (opts.preview) {
    previewPdf(opts, pdf, fileName)
    return
  }

  return opts.success
    ? opts.success.call(opts, pdf)
    : pdf.save(fileName)
}

export default exportPdf
