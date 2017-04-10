import $ from 'jquery'
import uID from 'lodash.uniqueid'

const djb2Code = function (str, bins) {
  let hash = 5381
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) + hash) + char /* hash * 33 + c */
  }
  return Math.abs(hash % bins)
}

const featureColors = ['#253494', '#1162dc', '#7B87C2', '#8AAAD9', '#5BC48F',
  '#00AE95', '#76B043', '#AED477', '#E4C8A7', '#FFD64F', '#E6B222',
  '#818C43', '#D77D2A', '#F8AD7C', '#E39FC6', '#E34C94', '#993404']

function hasOwnProperty(obj, prop) {
  const proto = obj.__proto__ || obj.constructor.prototype
  return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop])
}

function capitaliseFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function deepParse(xml) {
  const data = {}
  $(xml).find('feature').each(function () {
    const type = capitaliseFirstLetter($(this).attr('type'))
    const feature = {}

    switch (type) {
      case 'Helix':
      case 'Strand':
      case 'Turn':
        return
    }

    if (!hasOwnProperty(data, type)) {
      data[type] = { Source: 'Uniprot', URL: 'http://www.uniprot.org', Features: [] }
      if (type === 'Sequence variant' ||
          type === 'Mutagenesis site' ||
          type === 'Modified residue' ||
          type === 'Site') {
        data[type].Color = featureColors[djb2Code(type.replace(/_/g, ' '), featureColors.length)]
      }
    }

    const description = $(this).attr('description') || ''

    let name
    const original = $(this).find('original')
    if (original.length) {
      name = original.first().text()
      const variation = $(this).find('variation')
      if (variation.length) {
        name += ` > ${variation.first().text()}`
      }
    }

    let residues = []
    const loc = $(this).find('location')
    loc.each(function () {
      const pos = $(this).children().map(function () {
        return $(this).attr('position')
      }).get()

      residues = residues.concat(pos)
    })
    if (residues.length === 1) {
      feature.Residue = residues
    } else {
      feature.Residues = residues
    }

    feature.Name = name || description
    feature.Description = name ? description : ''

    data[type].Features.push(feature)
  })

  return data
}

export default function (xml) {
  const parsed = deepParse(xml)
  const members = Object.getOwnPropertyNames(parsed)
  const chainLength = parseInt(parsed.Chain.Features[0].Residues[1], 10)
  const selectedAxis = ''

  const data = {}
  members.forEach((member) => {
    const id = uID('featureData')
    const features = {}
    parsed[member].Features.forEach((feature) => {
      const featureID = uID('feature')
      if (typeof feature.Residue !== 'undefined') {
        features[featureID] = [parseInt(feature.Residue[0], 10), parseInt(feature.Residue[0], 10)]
      } else if (typeof feature.Residues !== 'undefined') {
        features[featureID] = [parseInt(feature.Residues[0], 10), parseInt(feature.Residues[1], 10)]
      } else {
        features[featureID] = ['error', 'error']
      }
    })
    data[id] = {
      name: member,
      features,
      // features: parsed[member].Features.map((feature) => {
      //   if (typeof feature.Residue !== 'undefined') {
      //     return [parseInt(feature.Residue[0], 10), parseInt(feature.Residue[0], 10)]
      //   }
      //   if (typeof feature.Residues !== 'undefined') {
      //     return [parseInt(feature.Residues[0], 10), parseInt(feature.Residues[1], 10)]
      //   }
      //   return ['error']
      // }),
    }
  })

  return { chainLength, data, selectedAxis }
}
