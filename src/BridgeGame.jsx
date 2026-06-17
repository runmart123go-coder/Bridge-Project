import { useState } from "react";

const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
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
    East:  sort(deck.slice(13, 26)),
    South: sort(deck.slice(26, 39)),
    West:  sort(deck.slice(39)),
  };
}

const MiniCard = ({ s, r }) => (
  <span style={{
    display: 'inline-flex', flexDirection: 'column', justifyContent: 'space-between',
    width: 30, height: 43, border: '1.5px solid #bbb', borderRadius: 4,
    background: 'white', color: RED.has(s) ? '#dc2626' : '#111',
    fontSize: 9, fontWeight: 700, padding: '1px 2px', margin: '1.5px 1px',
    boxShadow: '1px 2px 4px rgba(0,0,0,0.3)', fontFamily: 'Arial,sans-serif',
    flexShrink: 0, userSelect: 'none', position: 'relative',
  }}>
    <span style={{ lineHeight: 1 }}>{r}</span>
    <span style={{ fontSize: 14, alignSelf: 'center', lineHeight: 1 }}>{s}</span>
    <span style={{ lineHeight: 1, alignSelf: 'flex-end', transform: 'rotate(180deg)' }}>{r}</span>
  </span>
);

const HandPanel = ({ label, cards, icon }) => {
  const bySuit = SUITS.map(s => ({ s, cs: cards.filter(c => c.s === s) }));
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(0,0,0,0.35), rgba(0,0,0,0.2))',
      border: '1.5px solid rgba(255,215,0,0.3)',
      borderRadius: 10, padding: '10px 12px',
      backdropFilter: 'blur(4px)',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
    }}>
      <div style={{
        fontWeight: 'bold', fontSize: 13, color: '#ffd700',
        marginBottom: 7, textAlign: 'center', letterSpacing: 0.5,
        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
      }}>
        {icon} {label}
        <span style={{ fontSize: 10, opacity: 0.65, marginLeft: 6 }}>• 13 cards</span>
      </div>
      {bySuit.map(({ s, cs }) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', marginBottom: 3, minHeight: 22 }}>
          <span style={{
            color: RED.has(s) ? '#ff7070' : '#d0d0d0',
            fontSize: 17, width: 22, lineHeight: 1, flexShrink: 0,
          }}>{s}</span>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {cs.length > 0
              ? cs.map((c, i) => <MiniCard key={i} s={c.s} r={c.r} />)
              : <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, paddingLeft: 4 }}>—</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

const CenterTable = () => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    minWidth: 90,
  }}>
    <div style={{
      background: 'radial-gradient(ellipse at center, rgba(0,140,0,0.5), rgba(0,70,0,0.85))',
      border: '3px solid rgba(255,215,0,0.45)',
      borderRadius: '50%', width: 84, height: 84,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4), 0 4px 15px rgba(0,0,0,0.5)',
    }}>
      <div style={{ fontSize: 26 }}>🃏</div>
      <div style={{ color: 'rgba(255,215,0,0.5)', fontSize: 9, fontWeight: 'bold', letterSpacing: 1 }}>BRIDGE</div>
    </div>
  </div>
);

export default function BridgeGame() {
  const [hands, setHands] = useState(null);
  const [anim, setAnim] = useState(false);

  const handleDeal = () => {
    setAnim(true);
    setHands(null);
    setTimeout(() => { setHands(createHands()); setAnim(false); }, 700);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0b3d0b 0%, #14661a 45%, #0b3d0b 100%)',
      fontFamily: 'Georgia, serif',
      padding: 16, boxSizing: 'border-box',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <h1 style={{
          color: '#ffd700', margin: '0 0 3px', fontSize: 22,
          textShadow: '0 2px 10px rgba(0,0,0,0.7)', letterSpacing: 1,
        }}>♠ ♥ Bridge Card Game ♦ ♣</h1>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, margin: '0 0 12px' }}>
          4 Players &nbsp;|&nbsp; 52 Cards &nbsp;|&nbsp; 13 Cards Each
        </p>
        <button onClick={handleDeal} disabled={anim} style={{
          background: anim
            ? '#777'
            : 'linear-gradient(135deg, #c07c0a, #f2cc30)',
          color: '#1a1a1a', border: 'none', borderRadius: 9,
          padding: '10px 30px', fontSize: 15, fontWeight: 'bold',
          cursor: anim ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 14px rgba(0,0,0,0.45)',
          transition: 'all 0.2s', letterSpacing: 0.3,
        }}>
          {anim ? '🔀 Shuffling...' : '🃏 Deal Cards'}
        </button>
      </div>

      {/* Card Table */}
      {hands ? (
        <div style={{ maxWidth: 820, margin: '0 auto' }}>

          {/* NORTH */}
          <div style={{ marginBottom: 10 }}>
            <HandPanel label="NORTH" icon="⬆️" cards={hands.North} />
          </div>

          {/* WEST · CENTER · EAST */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              <HandPanel label="WEST" icon="⬅️" cards={hands.West} />
            </div>
            <CenterTable />
            <div style={{ flex: '1 1 0', minWidth: 0 }}>
              <HandPanel label="EAST" icon="➡️" cards={hands.East} />
            </div>
          </div>

          {/* SOUTH */}
          <HandPanel label="SOUTH" icon="⬇️" cards={hands.South} />

          {/* Footer */}
          <div style={{
            textAlign: 'center', marginTop: 14,
            color: 'rgba(255,215,0,0.4)', fontSize: 11,
          }}>
            ♠ ♥ ♦ ♣ &nbsp; Cards sorted by suit &nbsp; ♣ ♦ ♥ ♠
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: 55 }}>
          <div style={{ fontSize: 70, marginBottom: 14 }}>🃏</div>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 16 }}>
            {anim ? 'Dealing cards to all players...' : 'Press "Deal Cards" to begin!'}
          </p>
        </div>
      )}
    </div>
  );
}