import Link from 'next/link';

export default function Home() {
  return (
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
  )
}
