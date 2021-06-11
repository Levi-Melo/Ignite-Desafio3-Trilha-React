import styles from './header.module.scss';
export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <a href="/">
          <img
            className={styles.logoImage}
            src="/images/logo.svg"
            alt="ig.news"
          />
          <img src="/images/spacetraveling.svg" alt="ig.news" />
          <img src="/images/point.svg" alt="ig.news" />
        </a>
      </div>
    </header>
  );
}
