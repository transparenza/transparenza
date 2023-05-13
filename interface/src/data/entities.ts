import { Entity, Chain } from 'types/types'

const entities: Entity[] = [
  {
    slug: 'nouns',
    name: 'Nouns',
    logoUrl: 'https://pbs.twimg.com/profile_images/1467601380567359498/oKcnQo_S_400x400.jpg',
    tokenStandard: 'ERC721',
    address: {
      [Chain.Polygon]: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      [Chain.PolygonMumbai]: '0x3d1d4E623Ddc6Cc990DeD3c563A675D79E570Bf2'
    }
  },
  {
    slug: 'adidas',
    name: 'Adidas',
    logoUrl: '',
    tokenStandard: 'ERC721',
    address: {
      [Chain.Polygon]: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      [Chain.PolygonMumbai]: '0x3d1d4E623Ddc6Cc990DeD3c563A675D79E570Bf2'
    }
  },
  {
    slug: 'lens',
    name: 'Lens',
    logoUrl: '',
    tokenStandard: 'ERC721',
    address: {
      [Chain.Polygon]: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      [Chain.PolygonMumbai]: '0x3d1d4E623Ddc6Cc990DeD3c563A675D79E570Bf2'
    }
  },
  {
    // https://decrypt.co/114494/nike-swoosh-web3-platform-polygon-nfts
    slug: 'nike',
    name: 'Nike',
    logoUrl: '',
    tokenStandard: 'ERC721',
    address: {
      [Chain.Polygon]: '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85',
      [Chain.PolygonMumbai]: '0x3d1d4E623Ddc6Cc990DeD3c563A675D79E570Bf2'
    }
  }
]
export default entities
