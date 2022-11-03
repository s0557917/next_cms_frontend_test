import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
import { useRouter } from 'next/router';

const sanityClient = require('@sanity/client')

const PROJECT_ID = "79dyci0b";
const DATASET = "production";

export async function getStaticPaths() {
    const url = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=*[_type == "book"]`
    const res = await fetch(url)
    const books = await res.json()
    
    const paths = books.result.map((book) => ({
        params: { id: book._id },
    }))

    return { paths, fallback: false }
}

export async function getStaticProps({ params}) {

    const url = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=*[_id == "${params.id}"]`;
    const res = await fetch(url)
    const book = await res.json()

    return {
        props: {
            book,
        },
    }
}

export default function Book({ book }) {

    const client = sanityClient({
        projectId: PROJECT_ID,
        dataset: DATASET,
        apiVersion: '2022-11-02', // use current UTC date - see "specifying API version"!
        useCdn: true, // `false` if you want to ensure fresh data
    })

    const builder = imageUrlBuilder(client);

    function urlFor(source) {
        return builder.image(source)
    }

    return (
        <div>
            <h1>{book.result[0].title}</h1>
            <img src={urlFor(book.result[0].cover).width(500).url()} />
            <p>{book.result[0].description}</p>
        </div>
    )
} 