import { useQuery } from '@tanstack/react-query';
import infuraClient from 'services/infuraClient';
import { Collection } from 'types/infuraTypes';
import { useAccount } from 'wagmi';

interface Response {
    pageNumber: number;
    pageSize: number;
    network: string;
    total: number;
    cursor: string;
    account: string;
    collections: Collection[];
}

export default function useUserCollections() {
    const { address } = useAccount();

    return useQuery({
        queryKey: ['collections', address],
        queryFn: async () => {
            if (!address) {
                return [];
            }

            const { data } = await infuraClient.get<Response>(
                `/accounts/${address}/assets/collections`
            );
            return data;
        }
    });
}
