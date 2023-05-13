export enum Chain {
  Polygon = 137,
  PolygonMumbai = 80001
}

export type TokenStandard = 'ERC20' | 'ERC721' | 'ERC1155'

export interface Entity {
  tokenAddress: { [key in Chain | number]: string }
  tokenId?: { [key in Chain | number]: string }
  tokenStandard: TokenStandard
  name: string
  slug: string
  logoUrl: string
}

export interface Review {
  title: string
  rating: number
  text: string
}

export interface ReviewWithUrl extends Review {
  url: string
}

export interface ReviewEvent {
  token: string
  id?: string
  sender: string
  cid: string
}
