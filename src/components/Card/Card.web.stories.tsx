import type {Meta, StoryObj} from '@storybook/react';
import React from 'react';
import {Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter} from './Card';
import {Button} from '../Button';
import {Text} from '../Text';
import type {CardVariant} from './types';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {layout: 'centered'},
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outline', 'ghost', 'warm', 'ceramic', 'inverse', 'forest'],
    },
    fullWidth: {control: 'boolean'},
    disabled: {control: 'boolean'},
  },
};
export default meta;

type Story = StoryObj<typeof Card>;

const VARIANTS: CardVariant[] = [
  'default',
  'outline',
  'ghost',
  'warm',
  'ceramic',
  'inverse',
  'forest',
];

export const Default: Story = {
  render: () => (
    <Card variant="default" style={{width: 320}}>
      <CardHeader>
        <CardTitle>멤버십 카드</CardTitle>
        <CardDescription>cream 캔버스 위 흰 섬.</CardDescription>
      </CardHeader>
      <CardContent>
        <Text>본문 콘텐츠 영역입니다.</Text>
      </CardContent>
      <CardFooter>
        <Button>확인</Button>
      </CardFooter>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16, width: 320}}>
      {VARIANTS.map(v => (
        <Card key={v} variant={v} style={{padding: 16}}>
          <Text>{v}</Text>
        </Card>
      ))}
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <Card variant="default" onPress={() => undefined} style={{width: 320, padding: 16}}>
      <Text>탭 가능한 카드 (role=button)</Text>
    </Card>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Card variant="default" onPress={() => undefined} disabled style={{width: 320, padding: 16}}>
      <Text>비활성 카드</Text>
    </Card>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <Card variant="ceramic" fullWidth style={{padding: 16}}>
      <Text>fullWidth 카드</Text>
    </Card>
  ),
};
