export const FONTCOLOR = 'black'
export const FONTSIZE = 1
export const FONTOFFSET = 22

export const AXISCOLOR = '#888888'
export const AXISSIZE = 2
export const AXISGAP = 0
export const MAXNUMAXIS = 6

export const OPACITYNOTSELECTED = 0.3

export const SVGMARGIN = 100

export const STRUCTURESIZE = 18
export const STRUCTURESTROKE = 0
export const STRUCTUREFILLCOLOR = '#ECF0F1'
export const STRUCTURESTROKECOLOR = '#2C3E50'

export const FEATUREWIDTH = 0.5
export const FEATURESIZE = 18
export const FEATURESTROKE = 0
export const FEATUREFILLCOLOR = '#E74C3C'
export const FEATUREFILLCOLORS = ['#18247e', '#2870b8', '#4ebcd7', '#bbe4c6']
export const FEATURESTROKECOLOR = '#2C3E50'

export const VARIANTWIDTH = 5
export const VARIANTDIST = 5
export const VARIANTCIRCLER = 6
export const VARIANTFONTSIZE = '10px'
export const VARIANTFONTCENTER = [6, 3]
export const VARIANTSYMBOLSIZE = 30
export const PATHSIZE = 4
export const KNOWNCOLOR = 'rgb(153, 0, 0)'

export const INITIAL_ORDER = ['Chain', 'Site', 'Region of interest', 'Metal ion-binding site']

export function queriesToString(queries) {
  return `${queries.protein}#${queries.structure}#${queries.chain}`
}

// TODO Check more extencively
export function isValidSequence(queries) {
  if (queries.protein !== 'undefined' && queries.structure !== 'undefined'
      && queries.chain !== 'undefined'
      && queries.protein && queries.structure && queries.chain
      && queries.protein.length > 0 && queries.structure.length > 0
      && queries.chain.length > 0) {
    return true
  }
  return false
}
