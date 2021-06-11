import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import React from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { FiCalendar } from 'react-icons/fi';
import Header from '../../components/Header';

import { getPrismicClient } from '../../services/prismic';

import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  let key = 0;
  return (
    <>
      <Head>
        <title>{post.data.title} | Ignews</title>
      </Head>
      <Header />
      <img className={styles.banner} src={post.data.banner.url} alt="banner" />
      <div className={styles.container}>
        <h1>{post.data.title}</h1>
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
        {post.data.content.map(content => {
          return (
            <>
              <h2 key={content.heading}>{content.heading}</h2>
              {content.body.map(body => {
                return (
                  <div
                    key={`content key: ${key++}`}
                    className={styles.postContent}
                    dangerouslySetInnerHTML={{ __html: body.text }}
                  />
                );
              })}
            </>
          );
        })}
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('challengpost', String(slug), {});
  const post: Post = {
    first_publication_date: new Date(
      response.first_publication_date
    ).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    data: {
      title: response.data.title,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => {
        return {
          heading: content.heading,
          body: content.body.map(body => {
            return {
              text: body.text,
            };
          }),
        };
      }),
    },
  };

  return {
    props: {
      post,
    },
    revalidate: 60 * 60, //1 hour
  };
};
