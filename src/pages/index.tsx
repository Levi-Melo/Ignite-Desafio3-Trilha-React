import { GetStaticProps } from 'next';
import Header from '../components/Header';
import Head from 'next/head';
import { FiCalendar } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { AiOutlineUser } from 'react-icons/ai';
import { getPrismicClient } from '../services/prismic';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  return (
    <>
      <Head>
        <title>home | spacetraveling</title>
      </Head>
      <Header />
      <main className={styles.container}>
        <div className={styles.posts}>
          {postsPagination.results.map(post => {
            return (
              <a key={post.uid} href={`post/${post.uid}`}>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <span>
                  <time>
                    <FiCalendar className={styles.icon} />
                    {post.first_publication_date}
                  </time>
                  <p>
                    <AiOutlineUser className={styles.icon} />
                    {post.data.author}
                  </p>
                </span>
              </a>
            );
          })}
        </div>
        {postsPagination.next_page ? <button>Carregar mais posts</button> : ''}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'challengpost')],
    {
      fetch: [
        'challengpost.uid',
        'challengpost.title',
        'challengpost.subtitle',
        'challengpost.content',
        'challengpost.author',
      ],
      pageSize: 100,
    }
  );
  const posts = await response.results.map((post: Post) => {
    return {
      uid: post.uid,
      first_publication_date: new Date(
        post.first_publication_date
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });
  return {
    props: {
      postsPagination: {
        next_page: response.next_page,
        results: posts,
      },
    },
  };
};
