function getChainAlignments(aquaria) {
  const regEx = new RegExp('.*:.*:(.*):.*:(.*):')
  const aligns = aquaria.alignment.split(';')
  aligns.pop()
  const chains = {}

  aligns.forEach((align, i) => {
    const frac = align.split(',')[0].match(regEx)
    const chain = aquaria.pdb_chain[i]
    Object.assign(chains, {
      [chain]: {
        start: frac[1],
        end: frac[2],
      },
    })
  })

  return chains
}

export default function getAquariaData(aquaria) {
  const chains = getChainAlignments(aquaria)
  return { chains }
}
