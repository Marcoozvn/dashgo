import { Stack } from '@chakra-ui/react';
import { NavSection } from './NavSession';
import { NavLink } from './NavLink';
import { RiDashboardLine, RiChat3Line } from 'react-icons/ri';
import { BsCardChecklist } from 'react-icons/bs';
import { FaCube } from 'react-icons/fa';

export function SidebarNav() {
  return (
    <Stack spacing='12' align='flex-start'>
      <NavSection title='GERAL'>
        <NavLink href='/dashboard' icon={RiDashboardLine}>Dashboard</NavLink>
        <NavLink href='/products' icon={FaCube}>Produtos</NavLink>
      </NavSection>
      <NavSection title='PEDIDOS'>
        <NavLink href='/orders' icon={BsCardChecklist}>Pedidos abertos</NavLink>
        <NavLink href='/chats' icon={RiChat3Line}>Chats de pedidos</NavLink>
      </NavSection>
    </Stack>
  )
}