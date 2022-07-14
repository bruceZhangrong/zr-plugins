/**
 * Utils for export PDF
 * @returns
 */

export function DPR () {
  if (window.devicePixelRatio && window.devicePixelRatio > 1) {
    return window.devicePixelRatio
  }
  return 1
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj).includes('Object')
}

export function isArray(obj) {
  return Object.prototype.toString.call(obj).includes('Array')
}

/**
 * Merge object
 * @param {Object} defaultOptions
 * @param {Object} options
 * @returns
 */
export function mergeObject(defaultOptions, options) {
  if (!isObject(options)) { throw (new Error('Configuration type invalid.')) }
  const merged = { ...defaultOptions, ...options }
  Object.entries(merged).forEach(([key, val]) => {
    isObject(val) &&
      isObject(options[key]) &&
      (merged[key] = mergeObject(defaultOptions[key], options[key]))
  })
  return merged
}


export function cloneAllCanvas (dom, newDom) {
  if (!(dom instanceof Node) || !(newDom instanceof Node)) {
    throw (new Error('The object of the operation is not a HTMLElement'))
  }

  const canvasDoms = newDom.querySelectorAll('canvas')
  if (canvasDoms?.length) {
    Array.from(canvasDoms).forEach(canvas => {
      let parents = canvas.parentNode
      let id = parents?.id
      let limit = 0 // prevent infinite loop
      while (!id && limit < 10) {
        parents = parents.parentNode
        id = parents?.id
        limit++
      }
      const parent = canvas.parentNode
      canvas.remove()
      const oldCanvas = dom.querySelector(`#${id}`).querySelector('canvas')
      const newCanvas = cloneCanvas(oldCanvas, parents.clientWidth, parents.clientHeight)
      parent.appendChild(newCanvas)
    })
  }
}

export function cloneCanvas (oldCanvas, width, height) {
  var newCanvas = document.createElement('canvas')
  var context = newCanvas.getContext('2d')
  newCanvas.width = width || oldCanvas.width
  newCanvas.height = height || oldCanvas.height
  context.drawImage(oldCanvas, 0, 0, width, height)
  return newCanvas
}
