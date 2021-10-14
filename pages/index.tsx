import Head from "next/head"
import React, { useEffect, useState } from "react"
import styles from "../styles/Home.module.scss"
import Script from 'next/script'
import Products from '../components/product/Products'

interface Props {
  products: Props[],
  node: {
    id: string,
    image: {
      mediaItemUrl: string
    },
    link: string,
    name: string,
    price: string, 
    slug: string
  }
}

export default function Home( { products } : Props ) {
  const [sampleProducts, setSampleProducts] = useState<Props[]>([])
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    let productImg = document.querySelectorAll(".products img"), i = 1;
    Array.prototype.forEach.call(productImg, (productImg) => { 
    setTimeout(() => { productImg.classList.add("img__visible") }, 200*i)
    i++;
    })
    setSampleProducts(products)

    setTimeout(() => {
      setIsLoading(true)
    }, 2000)    
  }, [products])

  return (
    <>
     <Script
        dangerouslySetInnerHTML={{
          __html: `document.body.classList.remove('Checkout__page')`
      }} />
      <Head>
        <title>Bonita Basics Productions</title>
        <meta name="description" content="Boom Bap HipHop producer from Bonita, California making sample packs with various musicians in his home studio." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.content}>
        <div className="container">

          <Products 
            products={products}
          />

        </div>
      </main>


    </>
  );
}

export async function getStaticProps() {

  const res = await fetch(process.env.SITE_URL as string, {
    method: 'POST',
    headers: { 
      'Content-type': 'application/json' 
    },
    body: JSON.stringify({
      query: `
      query MyQuery {
        products {
          edges {
            node {
              name
              link
              slug
              ... on SimpleProduct {
                id
                name
                price
              }
              image {
                mediaItemUrl
              }
            }
          }
        }
      }      
      `
    })
  });

  const json = await res.json()

  //  Take all the data and return it
  return {
    props: {
      products: json.data.products.edges
    }
  }
}