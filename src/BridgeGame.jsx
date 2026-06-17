import { useState } from "react";

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
const RANK_VALUES = { 'A': 14, 'K': 13, 'Q': 12, 'J': 11, '10': 10, '9': 9, '8': 8, '7': 7, '6': 6, '5': 5, '4': 4, '3': 3, '2': 2 };
const RED = new Set(['♥', '♦']);
const sOrd = Object.fromEntries(SUITS.map((s, i) => [s, i]));
const rOrd = Object.fromEntries(RANKS.map((r, i) => [r, i]));

function createHands() {
  const deck = SUITS.flatMap(s => RANKS.map(r => ({ s, r })));
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  const sort = arr => [...arr].sort((a, b) => sOrd[a.s] - sOrd[b.s] || rOrd[a.r] - rOrd[b.r]);
  return {
    North: sort(deck.slice(0, 13)),
    East: sort(deck.slice(13, 26)),
    South: sort(deck.slice(26, 39)),
    West: sort(deck.slice(39)),
  };
}

const Card = ({ card, fanned = false, fanIndex = 0, selected = false, onClick = null }) => {
  const isRed = RED.has(card.s);
  const fanAngle = fanned ? (fanIndex - 6) * 8 : 0;
  const fanY = fanned ? Math.abs(fanIndex - 6) * 15 : 0;
  
  return (
    <div
      onClick={onClick}
      style={{
        transform: `rotate(${fanAngle}deg) translateY(${fanY}px)`,
        cursor: onClick ? 'pointer' : 'default',
        opacity: selected ? 1 : 0.9,
        filter: selected ? 'brightness(1.1)' : 'none',
      }}
    >
      <div
        style={{
          width: 60,
          height: 85,
          border: '2px solid #333',
          borderRadius: 6,
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px',
          fontWeight: 'bold',
          color: isRed ? '#e31e24' : '#000',
          fontSize: 11,
          fontFamily: 'Arial, sans-serif',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }}
      >
        <span style={{ fontSize: 14 }}>{card.r}</span>
        <span style={{ fontSize: 18 }}>{card.s}</span>
        <span style={{ fontSize: 14, transform: 'rotate(180deg)' }}>{card.r}</span>
      </div>
    </div>
  );
};

const PlayerHand = ({ cards, position }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  
  const isBottom = position === 'South';
  const isTop = position === 'North';
  const isLeft = position === 'West';
  const isRight = position === 'East';
  
  return (
    <div
      style={{
        position: 'absolute',
        ...(isBottom && { bottom: 20, left: '50%', transform: 'translateX(-50%)' }),
        ...(isTop && { top: 20, left: '50%', transform: 'translateX(-50%)' }),
        ...(isLeft && { left: 20, top: '50%', transform: 'translateY(-50%)' }),
        ...(isRight && { right: 20, top: '50%', transform: 'translateY(-50%)' }),
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: isLeft || isRight ? 0 : -15,
          justifyContent: isBottom || isTop ? 'center' : 'flex-start',
          flexDirection: isLeft || isRight ? 'column' : 'row',
          perspective: '1000px',
        }}
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              transformStyle: 'preserve-3d',
            }}
          >
            <Card
              card={card}
              fanned={isBottom || isTop}
              fanIndex={idx}
              selected={selectedCard === idx}
              onClick={isBottom ? () => setSelectedCard(selectedCard === idx ? null : idx) : null}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const BidBox = ({ position, bid }) => {
  const positions = {
    'North': { top: 60, left: '50%', transform: 'translateX(-50%)' },
    'East': { top: '50%', right: 60, transform: 'translateY(-50%)' },
    'South': { bottom: 140, left: '50%', transform: 'translateX(-50%)' },
    'West': { top: '50%', left: 60, transform: 'translateY(-50%)' },
  };

  return (
    <div
      style={{
        position: 'absolute',
        ...positions[position],
        background: 'rgba(255, 255, 255, 0.95)',
        border: '2px solid #333',
        borderRadius: 6,
        padding: '8px 12px',
        fontSize: 16,
        fontWeight: 'bold',
        minWidth: 50,
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        color: RED.has(bid.split('')[1]) ? '#e31e24' : '#000',
      }}
    >
      {bid}
    </div>
  );
};

const BiddingTable = ({ bids }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        background: 'rgba(255, 255, 255, 0.9)',
        border: '2px solid #333',
        borderRadius: 8,
        padding: '12px',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 8, textAlign: 'center', color: '#333' }}>
        Bids
      </div>
      <table style={{ fontSize: 14, borderCollapse: 'collapse' }}>
        <tbody>
          {bids.map((row, i) => (
            <tr key={i}>
              {row.map((bid, j) => {
                const isRed = bid && RED.has(bid.split('')[1]);
                return (
                  <td
                    key={j}
                    style={{
                      border: '1px solid #ccc',
                      padding: '6px 12px',
                      textAlign: 'center',
                      minWidth: 40,
                      color: isRed ? '#e31e24' : '#000',
                      fontWeight: bid ? 'bold' : 'normal',
                    }}
                  >
                    {bid || '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Trick = ({ cards, position }) => {
  const positions = {
    'North': { top: '35%', left: '50%', transform: 'translate(-50%, -50%)' },
    'East': { top: '50%', left: '60%', transform: 'translate(-50%, -50%)' },
    'South': { top: '60%', left: '50%', transform: 'translate(-50%, -50%)' },
    'West': { top: '50%', left: '40%', transform: 'translate(-50%, -50%)' },
  };

  if (!cards) return null;

  return (
    <div
      style={{
        position: 'absolute',
        ...positions[position],
        width: 60,
        height: 85,
        border: '2px solid rgba(255, 215, 0, 0.5)',
        borderRadius: 6,
        background: 'rgba(255, 255, 255, 0.7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 'bold',
        color: RED.has(cards.s) ? '#e31e24' : '#000',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
      }}
    >
      <span style={{ fontSize: 16 }}>{cards.r}</span>
      <span style={{ fontSize: 20 }}>{cards.s}</span>
    </div>
  );
};

export default function BridgeGame() {
  const [hands, setHands] = useState(null);
  const [anim, setAnim] = useState(false);
  const [tricks, setTricks] = useState({ North: null, East: null, South: null, West: null });
  const [bids] = useState([
    ['1♦', '1♥', '1♦', '1♣'],
    ['2♦', '2♥', '2♦', '2♣'],
    ['3♦', '3♥', '3♦', '3♣'],
  ]);

  const handleDeal = () => {
    setAnim(true);
    setHands(null);
    setTricks({ North: null, East: null, South: null, West: null });
    setTimeout(() => {
      const newHands = createHands();
      setHands(newHands);
      setAnim(false);
    }, 700);
  };

  const handlePlayCard = (position, cardIdx) => {
    if (hands && hands[position]) {
      const card = hands[position][cardIdx];
      setTricks({ ...tricks, [position]: card });
      setHands({
        ...hands,
        [position]: hands[position].filter((_, i) => i !== cardIdx),
      });
    }
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #0d5a0d 0%, #1a7a1a 50%, #0d5a0d 100%)',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {/* Bidding Box */}
      <BiddingTable bids={bids} />

      {/* Header */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          textAlign: 'right',
        }}
      >
        <h1
          style={{
            color: '#ffd700',
            margin: 0,
            fontSize: 28,
            textShadow: '0 2px 8px rgba(0,0,0,0.7)',
            fontWeight: 'bold',
          }}
        >
          Practice Bridge
        </h1>
        <p
          style={{
            color: 'rgba(255, 255, 255, 0.6)',
            margin: '4px 0 0 0',
            fontSize: 12,
          }}
        >
          Playing Bridge with cards
        </p>
      </div>

      {/* Central Table */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          height: 300,
          background: 'radial-gradient(ellipse at center, rgba(0, 100, 0, 0.4), rgba(0, 50, 0, 0.8))',
          border: '3px solid rgba(255, 215, 0, 0.3)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5)',
        }}
      >
        <div style={{ fontSize: 60, opacity: 0.3 }}>🃏</div>
      </div>

      {/* Trick Display */}
      {Object.keys(tricks).map(
        position =>
          tricks[position] && <Trick key={position} cards={tricks[position]} position={position} />
      )}

      {/* Player Hands */}
      {hands && (
        <>
          <PlayerHand cards={hands.North} position="North" />
          <PlayerHand cards={hands.East} position="East" />
          <PlayerHand cards={hands.South} position="South" />
          <PlayerHand cards={hands.West} position="West" />
        </>
      )}

      {/* Bid Display */}
      <BidBox position="North" bid="1♦" />
      <BidBox position="East" bid="1♥" />
      <BidBox position="South" bid="1♦" />
      <BidBox position="West" bid="1♣" />

      {/* Deal Button */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <button
          onClick={handleDeal}
          disabled={anim}
          style={{
            background: anim ? '#777' : 'linear-gradient(135deg, #c07c0a, #f2cc30)',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: 8,
            padding: '12px 40px',
            fontSize: 16,
            fontWeight: 'bold',
            cursor: anim ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            transition: 'all 0.2s',
          }}
        >
          {anim ? '🔀 Dealing...' : '🃏 New Hand'}
        </button>
      </div>

      {/* Instructions */}
      {!hands && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: 18,
          }}
        >
          {anim ? 'Dealing cards...' : 'Click "New Hand" to begin'}
        </div>
      )}
    </div>
  );
}