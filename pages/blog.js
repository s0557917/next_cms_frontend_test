
import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';

const sanityClient = require('@sanity/client')

const PROJECT_ID = "79dyci0b";
const DATASET = "production";

export async function getStaticProps() {
    const url = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=*[_type == "post"]`
    const res = await fetch(url)
    const posts = await res.json()
  
    return {
      props: {
        posts,
      },
    }
  }

export default function Blog({ posts }) {

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
        <>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/blog">Blog</Link>
                </li>
                <li>
                    <Link href="/books">Books</Link>
                </li>
            </ul>
            <div className='mg-2'>
                <h1>Blog</h1>

                {posts.result.map((post) => 
                    <div key={post._id}>
                        <h2>{post.title}</h2>
                        <p>{post.post}</p>
                        {post.cover && <img src={urlFor(post.cover).width(200).url()} />}
                    </div>
                )}
            </div>
        </>
    )
}