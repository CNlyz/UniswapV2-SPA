import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { Trade } from './pages/Trade';
import { Liquidity } from './pages/Liquidity';
import { History } from './pages/History';
import { Navigation } from './components/Navigation';

function App() {
  return (
    <ChakraProvider value={defaultSystem}>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/liquidity" element={<Liquidity />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
