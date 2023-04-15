import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletAuthWrapper } from './context/WalletAuthContext';
import Home from './pages/Home';
import NotFoundPage from './pages/404';
import Crash from './pages/Crash';
// import Raffles from './pages/Raffles';
// import RaffleDetails from './pages/RaffleDetails';
// import Jackpot from './pages/Jackpot';
// import Coinflip from './pages/Coinflip';
// import PVPJackpot from './pages/PVPJackpot';
// import Roulette from './pages/Roulette';
// import NFTsBattles from './pages/NFTsBattles';

import { ToastContainer } from 'react-toastify';

function App(): JSX.Element {
  return (
    <WalletAuthWrapper>
        <ToastContainer
          position="bottom-left"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          // zIndex={9999}
        />
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/crash" element={<Crash />} />
            {/* // <Route exact path="/raffles" element={<Raffles />} />
            // <Route path="/raffles/:id" element={<RaffleDetails />} />
            // <Route path="/jackpot" element={<Jackpot />} />
            // <Route path="/coinflip" element={<Coinflip />} />
            // <Route path="/pvp-jackpot" element={<PVPJackpot />} />
            // <Route path="/roulette" element={<Roulette />} />
            // <Route exact path="/nfts-battles" element={<NFTsBattles />} /> */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
    </WalletAuthWrapper>
  );
}

export default App;
