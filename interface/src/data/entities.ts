import { Entity, Chain } from 'types/types'

const entities: Entity[] = [
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
  {
    slug: 'adidas',
    name: 'Adidas',
    logoUrl: '',
    tokenStandard: 'ERC721',
    tokenAddress: {
      [Chain.Polygon]: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      [Chain.PolygonMumbai]: '0x5D4effd4A4610Fb5d895aa910AB7FD8775B18211'
    }
  },
  {
    slug: 'lens',
    name: 'Lens',
    logoUrl: '',
    tokenStandard: 'ERC721',
    tokenAddress: {
      [Chain.Polygon]: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      [Chain.PolygonMumbai]: '0x5D4effd4A4610Fb5d895aa910AB7FD8775B18211'
    }
  },
  {
    // https://decrypt.co/114494/nike-swoosh-web3-platform-polygon-nfts
    slug: 'nike',
    name: 'Nike',
    logoUrl: '',
    tokenStandard: 'ERC721',
    tokenAddress: {
      [Chain.Polygon]: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      [Chain.PolygonMumbai]: '0x5D4effd4A4610Fb5d895aa910AB7FD8775B18211'
    }
  }
]
export default entities
