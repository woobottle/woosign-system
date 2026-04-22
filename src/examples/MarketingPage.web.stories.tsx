/**
 * Marketing UI kit — WooBottle.com-style page composed from the library.
 * Demonstrates the color-block rhythm: cream canvas → white card islands →
 * deep-ink feature band → ceramic utility strip → ink footer.
 */

import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Button} from '../components/Button';
import {Card} from '../components/Card';
import {FeatureBand} from '../components/FeatureBand';
import {Eyebrow} from '../components/Eyebrow';
import {Progress} from '../components/Progress';
import {Divider} from '../components/Divider';
import {colors, typography} from '../core/theme/tokens';

const WordMark = ({inverse = false}: {inverse?: boolean}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: inverse ? colors.card : colors.inverse,
        color: inverse ? colors.inverse : colors.card,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontStyle: 'italic',
        fontFamily: typography.fontFamily.serif,
      }}>
      W
    </div>
    <div style={{fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em'}}>
      WooBottle
    </div>
  </div>
);

const Nav = () => (
  <nav
    style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: colors.card,
      boxShadow:
        '0 1px 3px rgba(0,0,0,0.10), 0 2px 2px rgba(0,0,0,0.06), 0 0 2px rgba(0,0,0,0.07)',
      display: 'flex',
      alignItems: 'center',
      gap: 32,
      padding: '14px 40px',
    }}>
    <WordMark />
    <div style={{display: 'flex', gap: 24}}>
      {['Menu', 'Rewards', 'Gift cards', 'Stores', 'Stories'].map(x => (
        <span
          key={x}
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.textPrimary,
            cursor: 'pointer',
          }}>
          {x}
        </span>
      ))}
    </div>
    <div style={{flex: 1}} />
    <span style={{fontSize: 14, color: colors.textPrimary, cursor: 'pointer'}}>
      Sign in
    </span>
    <Button size="sm">Join rewards</Button>
  </nav>
);

const Hero = () => (
  <section
    style={{
      padding: '64px 40px',
      display: 'grid',
      gridTemplateColumns: '1.1fr 0.9fr',
      gap: 48,
      alignItems: 'center',
    }}>
    <div>
      <Eyebrow tone="brand">This week</Eyebrow>
      <h1
        style={{
          margin: '14px 0 0',
          fontSize: 80,
          fontWeight: 600,
          letterSpacing: '-0.16px',
          lineHeight: 1.1,
        }}>
        A warmer kind of{' '}
        <span
          style={{
            fontFamily: typography.fontFamily.serif,
            fontStyle: 'italic',
            color: colors.textBrand,
          }}>
          morning.
        </span>
      </h1>
      <p
        style={{
          marginTop: 16,
          fontSize: 19,
          color: colors.textSecondary,
          maxWidth: 460,
          lineHeight: 1.75,
        }}>
        Order ahead from your local WooBottle. Skip the line, warm the hands,
        start slow. Ready in 5 minutes.
      </p>
      <div style={{display: 'flex', gap: 12, marginTop: 32}}>
        <Button size="lg">Order now</Button>
        <Button size="lg" variant="ghost">
          See the menu
        </Button>
      </div>
    </div>
    <div
      style={{
        aspectRatio: '4/5',
        borderRadius: 16,
        background: `radial-gradient(circle at 30% 20%, ${colors.section}, ${colors.inverse} 80%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    />
  </section>
);

const MenuStrip = () => {
  const items = [
    {title: 'Iced brown sugar oat', meta: 'Cold · 4 min · $5.45', tint: 'linear-gradient(180deg,#C9B79B,#9B7F5C)'},
    {title: 'Ink matcha latte', meta: 'Hot · 5 min · $5.25', tint: 'linear-gradient(180deg,#C9C2B2,#3F3A34)'},
    {title: 'Citrus cold brew', meta: 'Cold · 3 min · $4.95', tint: 'linear-gradient(180deg,#E4C58A,#7A5A2E)'},
  ];
  return (
    <section style={{padding: '40px 40px 64px'}}>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: 32,
        }}>
        <div>
          <Eyebrow>Menu</Eyebrow>
          <h2
            style={{
              margin: '6px 0 0',
              fontSize: 45,
              fontWeight: 600,
              letterSpacing: '-0.16px',
              lineHeight: 1.1,
            }}>
            Made to order, ready fast.
          </h2>
        </div>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: colors.textBrand,
            cursor: 'pointer',
          }}>
          See full menu →
        </span>
      </div>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
        {items.map(x => (
          <Card key={x.title}>
            <div
              style={{
                aspectRatio: '4/3',
                borderRadius: 12,
                background: x.tint,
                marginBottom: 16,
              }}
            />
            <div style={{fontSize: 18, fontWeight: 600}}>{x.title}</div>
            <div style={{fontSize: 13, color: colors.textSecondary, marginTop: 4}}>
              {x.meta}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

const Rewards = () => (
  <section style={{padding: '0 40px'}}>
    <FeatureBand>
      <div style={{display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 40, alignItems: 'center'}}>
        <div>
          <Eyebrow tone="gold">★ Members</Eyebrow>
          <h2
            style={{
              margin: '10px 0 0',
              fontSize: 58,
              fontWeight: 600,
              letterSpacing: '-0.16px',
              lineHeight: 1.1,
            }}>
            Warmer mornings,
            <br />
            on us.
          </h2>
          <p
            style={{
              marginTop: 16,
              fontSize: 19,
              maxWidth: 420,
              color: colors.textInverseSecondary,
            }}>
            Earn stars on every order. 125 stars unlock a free handcrafted
            drink — yours in about a week.
          </p>
          <div style={{display: 'flex', gap: 12, marginTop: 32}}>
            <Button size="lg">Join rewards</Button>
            <Button size="lg" variant="inverse">
              See benefits
            </Button>
          </div>
        </div>
        <div
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 12,
            padding: 32,
          }}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 14}}>
            <span style={{fontSize: 14, color: colors.textInverseSecondary}}>Your stars</span>
            <span style={{fontSize: 14, color: colors.gold, fontWeight: 600}}>125 to reward</span>
          </div>
          <div style={{fontSize: 56, fontWeight: 600, letterSpacing: '-0.16px', lineHeight: 1}}>
            125{' '}
            <span
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: colors.textInverseSecondary,
              }}>
              / 250
            </span>
          </div>
          <div style={{marginTop: 20}}>
            <Progress value={0.5} tone="gold" surface="inverse" />
          </div>
          <div style={{marginTop: 20, fontSize: 14, color: colors.textInverseSecondary}}>
            Next reward: Any handcrafted drink.
          </div>
        </div>
      </div>
    </FeatureBand>
  </section>
);

const Footer = () => (
  <footer
    style={{
      background: colors.inverse,
      color: colors.textInverseSecondary,
      padding: '56px 40px 32px',
      marginTop: 40,
    }}>
    <div style={{display: 'grid', gridTemplateColumns: '1.4fr repeat(3, 1fr)', gap: 40}}>
      <div>
        <WordMark inverse />
        <div style={{marginTop: 16, fontSize: 16, maxWidth: 280, lineHeight: 1.75}}>
          A warmer kind of morning, made to order.
        </div>
      </div>
      {[
        ['Order', ['Menu', 'Rewards', 'Gift cards', 'Store locator']],
        ['Company', ['About', 'Careers', 'Newsroom', 'Sustainability']],
        ['Support', ['Contact', 'FAQ', 'Accessibility', 'Terms']],
      ].map(([h, items]) => (
        <div key={h as string}>
          <Eyebrow tone="inverse">{h as string}</Eyebrow>
          <div style={{marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10}}>
            {(items as string[]).map(i => (
              <span key={i} style={{color: 'inherit', fontSize: 16, cursor: 'pointer'}}>
                {i}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
    <Divider tone="inverse" style={{marginTop: 40}} />
    <div style={{marginTop: 16, display: 'flex', justifyContent: 'space-between', fontSize: 13}}>
      <span>© 2026 WooBottle Coffee</span>
      <span>Seoul · Tokyo · Brooklyn</span>
    </div>
  </footer>
);

const meta: Meta = {
  title: 'Examples/Marketing page',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {default: 'canvas'},
  },
};
export default meta;

export const FullPage: StoryObj = {
  render: () => (
    <div style={{background: colors.canvas, minHeight: '100vh'}}>
      <Nav />
      <Hero />
      <MenuStrip />
      <Rewards />
      <Footer />
    </div>
  ),
};
