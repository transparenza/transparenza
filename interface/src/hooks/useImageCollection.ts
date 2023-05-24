import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Response {
    image: string;
}

export default function useImageCollection(_uri: string | null, contract: string) {

    return useQuery({
        enabled: !!_uri,
        queryKey: ['image', contract],
        queryFn: async () => {
            const uri = _uri.replace('ipfs://', 'https://ipfs.io/ipfs/');

            if (uri) {
                const { data } = await axios.get<Response>(uri);
                const { image } = data;
                if (image) {
                    const type = image.slice(0, 4);

                    if (type === 'data' || type === 'http') {
                        return data;
                    }

                    data.image = `https://ipfs.io/ipfs/${image}`;

                    return data;
                }
            }
        }
    });
}
