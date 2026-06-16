import type {Meta, StoryObj} from '@storybook/react';
import React, {useState} from 'react';
import {Drawer} from './Drawer';
import {Button} from '../Button';

const meta: Meta<typeof Drawer> = {
  title: 'Components/Drawer',
  component: Drawer,
  parameters: {layout: 'centered'},
};
export default meta;

type Story = StoryObj<typeof Drawer>;

function DrawerDemo({width}: {width?: number}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onPress={() => setOpen(true)}>Drawer 열기</Button>
      <Drawer open={open} onClose={() => setOpen(false)} width={width}>
        <Drawer.Header>
          <Drawer.Title>메뉴</Drawer.Title>
          <Drawer.Description>원하는 항목을 선택하세요.</Drawer.Description>
        </Drawer.Header>
        <Drawer.Body>
          {['홈', '주문 내역', '즐겨찾기', '설정', '고객센터'].map(label => (
            <div key={label} style={{padding: '12px 0'}}>
              {label}
            </div>
          ))}
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="secondary" onPress={() => setOpen(false)}>
            닫기
          </Button>
        </Drawer.Footer>
      </Drawer>
    </>
  );
}

export const Default: Story = {render: () => <DrawerDemo />};
export const CustomWidth: Story = {render: () => <DrawerDemo width={420} />};
