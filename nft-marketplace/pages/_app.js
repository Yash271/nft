import '../styles/globals.css'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCubes } from '@fortawesome/free-solid-svg-icons';

function App({ Component, pageProps }) {
  return (
    <div className="bg-gray-100" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999, backgroundImage: 'url(/neon3.gif)', backgroundSize: 'cover' }}>
      <nav className="rounded-b-lg bg-violet-700 shadow-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <p className="glitch mr-2">
              <FontAwesomeIcon icon={faCubes} />
            </p>
            <p className="glitch">NFT Marketplace</p>
          </div>
          <div className="flex items-center justify-between">
            <Link legacyBehavior href="/">
              <a className="link mx-10 font-bold">Home</a>
            </Link>
            <Link legacyBehavior href="/create-item">
              <a className="link mx-10 font-bold">Sell NFTs</a>
            </Link>
            <Link legacyBehavior href="/my-nfts">
              <a className="link mx-10 font-bold">View My NFTs</a>
            </Link>
            <Link legacyBehavior href="/creator-dashboard">
              <a className="link mx-10 font-bold">Dashboard</a>
            </Link>
            <Link legacyBehavior href="/faq">
              <a className="link mx-10 font-bold">FAQ</a>
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 bg-gray-200 rounded-b-lg shadow-xl" style={{ margin: '0 auto' }}>
        <Component {...pageProps} />
      </main>
    </div>
  )
}

export default App