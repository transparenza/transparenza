import { Chain, Entity } from 'types/types'

const entities: Entity[] = [
  {
    slug: 'bored-ape-yacht-club',
    name: 'Bored Ape Yacht Club',
    logoUrl: 'https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&dpr=1&w=256',
    tokenStandard: 'ERC721',
    tokenAddress: {
      [Chain.Polygon]: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      [Chain.PolygonMumbai]: '0x5D4effd4A4610Fb5d895aa910AB7FD8775B18211'
    }
  },
  {
    slug: 'porsche',
    name: 'Porsche',
    logoUrl: 'https://i.seadn.io/gcs/files/52104c37d3649416ff628ec0a0518493.png?auto=format&dpr=1&w=3840',
    tokenStandard: 'ERC721',
    tokenAddress: {
      [Chain.Polygon]: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      [Chain.PolygonMumbai]: '0x5D4effd4A4610Fb5d895aa910AB7FD8775B18211'
    }
  },
  {
    slug: 'milady',
    name: 'Milady Maker',
    logoUrl: 'https://i.seadn.io/gae/a_frplnavZA9g4vN3SexO5rrtaBX_cBTaJYcgrPtwQIqPhzgzUendQxiwUdr51CGPE2QyPEa1DHnkW1wLrHAv5DgfC3BP-CWpFq6BA?auto=format&dpr=1&w=3840',
    tokenStandard: 'ERC721',
    tokenAddress: {
      [Chain.Polygon]: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      [Chain.PolygonMumbai]: '0x5D4effd4A4610Fb5d895aa910AB7FD8775B18211'
    }
  },
  {
    slug: 'nouns',
    name: 'Nouns',
    logoUrl: 'https://pbs.twimg.com/profile_images/1467601380567359498/oKcnQo_S_400x400.jpg',
    tokenStandard: 'ERC721',
    tokenAddress: {
      [Chain.Polygon]: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      [Chain.PolygonMumbai]: '0x5D4effd4A4610Fb5d895aa910AB7FD8775B18211'
    }
  },
]
export default entities
