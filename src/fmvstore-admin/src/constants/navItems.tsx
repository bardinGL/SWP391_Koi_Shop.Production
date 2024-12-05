import {
  MdOutlineDashboard,
  MdOutlinePerson,
  MdOutlineVerifiedUser,
} from 'react-icons/md'
import { LuUsers2 } from 'react-icons/lu'
import { TbBorderAll, TbTruckDelivery } from 'react-icons/tb'
import { RiCoupon2Line } from 'react-icons/ri'
import { TbTag } from 'react-icons/tb'
import { TbBriefcase, TbRuler, TbColorFilter } from 'react-icons/tb'
import { MdOutlineShoppingCart } from 'react-icons/md'
import { RoleEnum } from './enum'

export const navItems = [
  {
    title: 'Dashboard',
    url: '/',
    icon: <MdOutlineDashboard />,
    role: [RoleEnum.MANAGER, RoleEnum.EMPLOYEE],
  },
  {
    title: 'Products',
    url: '/products',
    icon: <MdOutlineShoppingCart />,
    role: [RoleEnum.MANAGER, RoleEnum.EMPLOYEE],
  },
  {
    title: 'Categories',
    url: '/categories',
    icon: <TbTag />,
    role: [RoleEnum.MANAGER, RoleEnum.EMPLOYEE],
  },
  {
    title: 'Orders',
    url: '/orders',
    icon: <TbTruckDelivery />,
    role: [RoleEnum.MANAGER, RoleEnum.EMPLOYEE],
  },
  {
    title: 'Promotions',
    url: '/coupons',
    icon: <RiCoupon2Line />,
    role: [RoleEnum.MANAGER, RoleEnum.EMPLOYEE],
  },
  {
    title: 'Staff',
    url: '/staff',
    icon: <TbBriefcase />,
    role: [RoleEnum.MANAGER],
  },
]
