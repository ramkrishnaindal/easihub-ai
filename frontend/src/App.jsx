import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Button } from './components/ui/button';
import Home from './components/Home';
import Questions from './components/Questions';

export default function App() {

  return (
    <Router>
      <div className="min-h-screen bg-white" style={{fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: '14px', fontWeight: 400, lineHeight: 1.6}}>
        <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur">
          <div className="mx-auto" style={{maxWidth: '1200px', padding: '0 20px'}}>
            <div className="flex items-center justify-between" style={{padding: '16px 0'}}>
              <Link to="/" className="text-2xl font-extrabold text-primary tracking-tighter">EASIHUB</Link>
              <nav className="flex items-center gap-6">
                <Link to="/" className="text-gray-600 hover:text-primary transition-colors">Home</Link>
                <Link to="/questions" className="text-gray-600 hover:text-primary transition-colors">Questions</Link>
                <div className="flex gap-3">
                  <Button variant="ghost" className="bg-primary/10 text-primary">Log In</Button>
                  <Button className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">Sign Up</Button>
                </div>
              </nav>
            </div>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questions" element={<Questions />} />
        </Routes>
      </div>
    </Router>
  );
}