import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.inner}>
        <Link to="/blog" style={styles.brand}>BlogApp</Link>
        <div style={styles.links}>
          <Link to="/blog" style={styles.link}>Blog</Link>
          {user ? (
            <>
              <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              <span style={styles.role}>{user.role}</span>
              <button onClick={handleLogout} style={styles.btn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/register" style={styles.link}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: { background: '#1a1a2e', padding: '14px 0' },
  inner: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brand: { color: '#e94560', fontWeight: 700, fontSize: '22px', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '20px' },
  link: { color: '#fff', textDecoration: 'none', fontSize: '15px' },
  role: { color: '#e94560', fontSize: '13px', textTransform: 'uppercase', fontWeight: 600 },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', fontSize: '14px' },
};

export default Navbar;