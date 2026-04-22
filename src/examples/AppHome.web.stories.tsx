/**
 * Mobile ordering app — Home screen composed from the library.
 * Illustrates Chip, Pill, Card, Badge, FeatureBand, Progress, Eyebrow,
 * StatusDot, and Fab working together inside a phone frame.
 */

import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {Badge} from '../components/Badge';
import {Button} from '../components/Button';
import {Card} from '../components/Card';
import {Chip} from '../components/Chip';
import {Eyebrow} from '../components/Eyebrow';
import {Fab} from '../components/Fab';
import {FeatureBand} from '../components/FeatureBand';
import {Pill} from '../components/Pill';
import {Progress} from '../components/Progress';
import {StatusDot} from '../components/StatusDot';
import {Toast} from '../components/Toast';
import {colors, typography} from '../core/theme/tokens';

const PhoneFrame = ({children}: {children: React.ReactNode}) => (
  <div
    style={{
      width: 390,
      height: 844,
      background: '#000',
      borderRadius: 52,
      padding: 12,
      boxShadow: '0 30px 80px rgba(0,0,0,0.30), 0 12px 24px rgba(0,0,0,0.20)',
    }}>
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 40,
        background: colors.canvas,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
      {children}
    </div>
  </div>
);

const ProductBlob = ({tint}: {tint: string}) => (
  <div
    style={{
      aspectRatio: '1',
      borderRadius: 12,
      background: tint,
      position: 'relative',
      overflow: 'hidden',
    }}>
    <div
      style={{
        position: 'absolute',
        inset: '18%',
        borderRadius: '50% 50% 50% 50% / 22% 22% 60% 60%',
        background: 'rgba(255,255,255,0.35)',
        border: '1px solid rgba(255,255,255,0.4)',
      }}
    />
  </div>
);

const Home = () => {
  const [category, setCategory] = useState('all');
  const cats = [
    {k: 'all', label: 'All'},
    {k: 'hot', label: 'Hot'},
    {k: 'cold', label: 'Cold'},
    {k: 'food', label: 'Food'},
  ];
  return (
    <>
      <div
        style={{
          padding: '20px 20px 0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <div>
          <div style={{fontSize: 14, color: colors.textSecondary}}>Good morning,</div>
          <div style={{fontSize: 22, fontWeight: 600, letterSpacing: '-0.16px'}}>
            Jae.
          </div>
        </div>
        <Badge variant="gold">3 new</Badge>
      </div>

      <div style={{padding: '16px 20px 0'}}>
        <FeatureBand tone="ember" style={{padding: 20}}>
          <Eyebrow tone="gold">★ Members</Eyebrow>
          <div
            style={{
              fontSize: 22,
              fontWeight: 600,
              marginTop: 6,
              letterSpacing: '-0.16px',
              color: colors.textInverse,
            }}>
            125 / 250 stars
          </div>
          <div style={{marginTop: 12}}>
            <Progress value={0.5} tone="gold" surface="inverse" />
          </div>
          <div
            style={{
              marginTop: 10,
              fontSize: 13,
              color: colors.textInverseSecondary,
            }}>
            125 to your next handcrafted drink
          </div>
        </FeatureBand>
      </div>

      <div style={{padding: '20px 20px 0'}}>
        <Eyebrow>Pickup store</Eyebrow>
        <Card style={{marginTop: 8, flexDirection: 'row', gap: 12, alignItems: 'center'} as React.CSSProperties}>
          <StatusDot tone="success" size="sm">
            ●
          </StatusDot>
          <div style={{flex: 1}}>
            <div style={{fontSize: 16, fontWeight: 600}}>Hongdae Ave.</div>
            <div style={{fontSize: 13, color: colors.textSecondary}}>
              Open · Ready in 5 min
            </div>
          </div>
          <Button variant="ghost" size="sm">
            Change
          </Button>
        </Card>
      </div>

      <div
        style={{
          padding: '24px 20px 0',
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
        }}>
        {cats.map(c => (
          <Pill
            key={c.k}
            active={category === c.k}
            onPress={() => setCategory(c.k)}>
            {c.label}
          </Pill>
        ))}
      </div>

      <div style={{padding: '16px 20px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12}}>
        {[
          {title: 'Brown sugar oat', meta: '4 min · $5.45', tint: 'linear-gradient(180deg,#C9B79B,#9B7F5C)'},
          {title: 'Ink matcha', meta: '5 min · $5.25', tint: 'linear-gradient(180deg,#C9C2B2,#3F3A34)'},
          {title: 'Citrus cold brew', meta: '3 min · $4.95', tint: 'linear-gradient(180deg,#E4C58A,#7A5A2E)'},
          {title: 'Hazelnut latte', meta: '4 min · $5.15', tint: 'linear-gradient(180deg,#D9B98A,#7A5A3E)'},
        ].map(x => (
          <Card key={x.title}>
            <ProductBlob tint={x.tint} />
            <div style={{fontSize: 14, fontWeight: 600, marginTop: 10}}>{x.title}</div>
            <div style={{fontSize: 12, color: colors.textSecondary, marginTop: 2}}>
              {x.meta}
            </div>
          </Card>
        ))}
      </div>

      {/* FAB + Toast overlays */}
      <div style={{position: 'absolute', right: 20, bottom: 96}}>
        <Fab accessibilityLabel="Quick order">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </Fab>
      </div>

      {/* Bottom tab bar */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 78,
          padding: '10px 8px 24px',
          background: colors.card,
          borderTop: `1px solid ${colors.borderDefault}`,
          display: 'flex',
        }}>
        {['Order', 'Menu', 'Rewards', 'You'].map((t, i) => (
          <div
            key={t}
            style={{
              flex: 1,
              textAlign: 'center',
              fontSize: 11,
              fontWeight: i === 0 ? 600 : 500,
              color: i === 0 ? colors.actionPrimary : colors.textSecondary,
              fontFamily: typography.fontFamily.sans,
            }}>
            {t}
          </div>
        ))}
      </div>
    </>
  );
};

const meta: Meta = {
  title: 'Examples/Mobile app',
  parameters: {
    layout: 'centered',
    backgrounds: {default: 'section'},
  },
};
export default meta;

export const Home_: StoryObj = {
  name: 'Home screen',
  render: () => (
    <PhoneFrame>
      <Home />
    </PhoneFrame>
  ),
};

export const ToastStack: StoryObj = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        width: 360,
      }}>
      <Toast tone="success" title="Order placed" description="Ready in 5 min at Hongdae." />
      <Toast tone="brand" title="+15 stars" description="You're 125 away from a free drink." />
      <Toast tone="danger" title="Payment declined" description="Try a different card." />
    </div>
  ),
};
