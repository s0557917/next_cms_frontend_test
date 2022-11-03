import imageUrlBuilder from '@sanity/image-url';
import Link from 'next/link';
import { useRouter } from 'next/router';

const sanityClient = require('@sanity/client')

const PROJECT_ID = "79dyci0b";
const DATASET = "production";

export async function getStaticProps() {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=*[_type == "book"]`
  const res = await fetch(url)
  const books = await res.json()

  return {
    props: {
      books,
    },
  }
}

export default function Books({ books }) {

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

    const handleClick = (event, key) => {
        console.log(event.target);
        console.log('key index: ', key);
        <Link href="/">Home</Link>
      };

    return (
        <div className="m-2">
            <ul className=''>
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
            <div className=''>
                <h1 className='text-5xl my-2 font-semibold'>Books</h1>

                {books.result.map((post) => 
                    <Link 
                        href={`/books/${post._id}`}
                        key={post._id}
                    >
                        <div 
                            onClick={(e) => handleClick(e, post._id)}
                            className='my-2 p-2 px-5 bg-gray-200 rounded cursor-pointer hover:bg-gray-300 active:scale-95 transition-all' 
                        >
                            <h2 className='text-3xl my-4 font-semibold'>{post.title}</h2>
                            {post.cover && <img src={urlFor(post.cover).width(400).url()} className="my-4"/>}
                            <p>{post.description.length > 500 ? `${post.description.substring(0, 500)}...` : post.description}</p>
                        </div>
                    </Link>
                )}
            </div>
        </div>
    )
}