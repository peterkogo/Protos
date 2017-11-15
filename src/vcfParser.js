
import vcf from 'vcf.js'

function parseInfo(info, header) {
  let headerCSQ = []
  header.INFO.forEach((info) => {
    if (info.ID === 'CSQ') {
      headerCSQ = info.Description.split(':')[1].split('|')
      headerCSQ = headerCSQ.map(h => h.trim())
    }
  })
  const annotations = info.split(';')
  const ret = {}
  annotations.forEach((annotation) => {
    const tmp = annotation.split('=')
    const key = tmp[0]
    if (tmp.length > 1) {
      const value = tmp[1].trim()

      if (key === 'CSQ') {
        const parts = value.split(',')
        const features = []
        parts.forEach((part) => {
          const feature = {}
          const values = part.split('|')
          if (values.length === headerCSQ.length) {
            values.forEach((value, i) => feature[headerCSQ[i]] = value)
          }
          features.push(feature)
        })
        ret.Features = features
      }
      ret[key] = value
    } else {
      ret[key] = true
    }
  })
  return ret
}

export const parseData = function parseData(data) {
  if (!data.hasOwnProperty('records')) {
    return []
  }
  const rows = []
  // console.log(data);
  const genes = {}
  for (let i = 0; i < data.records.length; i += 1) {
    const snv = data.records[i]
    for (let j = 0; j < snv.INFO.Features.length; j += 1) {
      const feature = snv.INFO.Features[j]
      if (feature.Feature_type === 'Transcript') {
        const row = {
          Ref: snv.REF,
          Alt: feature.Allele,
          Chr: snv.CHROM,
          Pos: snv.POS,
          Qual: snv.QUAL,
          Canonical: feature.CANONICAL,
          Biotype: feature.BIOTYPE,
          Consequence: feature.Consequence,
          Gene: feature.SYMBOL,
          HGNC_ID: feature.HGNC_ID,
          Protein: feature.HGVSp,
          Impact: feature.IMPACT,
          LoF: feature.LoF,
          Swissprot: feature.SWISSPROT,
          Transcript: feature.Feature,
        }
        if (!genes.hasOwnProperty(row.HGNC_ID)) {
          genes[row.HGNC_ID] = false
        }
        rows.push(row)
      }
    }
  }
  console.log(genes)
  // Object.keys(genes).forEach((key) => {
  //   const url = `${config.drivers_url}/genes?hgnc_id=${key}`;
  //   fetch(url)
  //    .then((response) => {
  //      genes[key] = response.json();
  //    });
  // });
  return rows
}

const vcfParser = vcf.parser()
  .parseChrom(chr => chr.substring(3))
  .parseInfo(parseInfo)

export default vcfParser
