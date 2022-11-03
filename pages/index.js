import imageUrlBuilder from '@sanity/image-url'

const sanityClient = require('@sanity/client')

const PROJECT_ID = "79dyci0b";
const DATASET = "production";

export async function getStaticProps() {
  const url = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=*[_type == "book"]`
  const res = await fetch(url)
  const posts = await res.json()

  return {
    props: {
      posts,
    },
  }
}

export default function Home({posts}) {

  const client = sanityClient({
    projectId: PROJECT_ID,
    dataset: DATASET,
    apiVersion: '2022-11-02', // use current UTC date - see "specifying API version"!
    useCdn: true, // `false` if you want to ensure fresh data
  })

  const builder = imageUrlBuilder(client);

  function urlFor(source) {
    console.log(source);
    return builder.image(source)
  }

  return (
    <div>
      {console.log("posts", posts)}
      <h1>Welcome to my blog!</h1>
      {posts.result.map((post) => {
        if(post.cover){
          console.log("COVER", post.cover, " -- ", urlFor(post.cover).width(200).url())
        }
        })
      }
      {posts.result.map((post) => 
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.description}</p>
          {post.cover && <img src={urlFor(post.cover).width(200).url()} />}
        </div>
      )}
    </div>
  )
}
