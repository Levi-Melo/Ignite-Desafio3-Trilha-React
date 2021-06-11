import styles from './header.module.scss';
export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <a href="/">
          <img className={styles.logoImage} src="/images/logo.svg" alt="Logo" />
          <img src="/images/spacetraveling.svg" alt="spacetraveling" />
          <img src="/images/point.svg" alt="." />
        </a>
      </div>
    </header>
  );
}
