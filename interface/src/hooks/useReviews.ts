import { ApolloClient, gql, InMemoryCache, NormalizedCacheObject } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { Entity, ReviewEvent } from 'types/types'
import { SUBGRAPH_URL } from 'config'
import { CHAIN_ID } from 'config'

const reviewsQuery721 = gql`
  query ReviewsQuery721($token: String!) {
    commentERC721Events(token: $token) {
      id
      token
      sender
      cid
    }
  }
`

const reviewsQuery1155 = gql`
  query ReviewsQuery1155($token: String!) {
    commentERC1155Events(token: $token) {
      id
      token
      tokenId
      sender
      cid
    }
  }
`

const reviewsQuery20 = gql`
  query ReviewsQuery20($token: String!) {
    commentERC20Events(token: $token) {
      id
      token
      sender
      cid
    }
  }
`

const query721 = async (client: ApolloClient<NormalizedCacheObject>, entity: Entity) => {
  const { data } = await client.query({
    query: reviewsQuery721,
    variables: { token: entity.tokenAddress[CHAIN_ID] }
  })

  return data.commentERC721Events as ReviewEvent[]
}

const query1155 = async (client: ApolloClient<NormalizedCacheObject>, entity: Entity) => {
  const { data } = await client.query({
    query: reviewsQuery1155,
    variables: { token: entity.tokenAddress[CHAIN_ID] }
  })

  return data.commentERC1155Events as ReviewEvent[]
}

const query20 = async (client: ApolloClient<NormalizedCacheObject>, entity: Entity) => {
  const { data } = await client.query({
    query: reviewsQuery20,
    variables: { token: entity.tokenAddress[CHAIN_ID] }
  })

  return data.commentERC20Events as ReviewEvent[]
}

export default function useReviews(entity: Entity) {
  const client = new ApolloClient({
    uri: SUBGRAPH_URL,
    cache: new InMemoryCache()
  })

  return useQuery(['reviews'], async () => {
    switch (entity.tokenStandard) {
      case 'ERC721':
        return await query721(client, entity)
      case 'ERC1155':
        return await query1155(client, entity)
      case 'ERC20':
        return await query20(client, entity)
      default:
        return []
    }
  })
}
