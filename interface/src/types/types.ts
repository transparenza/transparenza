export enum Chain {
  Polygon = 137,
  PolygonMumbai = 80001
}

export type TokenStandard = 'ERC20' | 'ERC721' | 'ERC1155'

export interface Entity {
  address: { [key in Chain | number]: string }
  tokenStandard: TokenStandard
  name: string
  slug: string
  logoUrl: string
}

export interface ReviewEvent {
  sender: string
  cid: string
  token: string
  id?: string
}

export interface Review {
  title: string
  rating: number
  text: string
  url: string
}
