import React from 'react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'

interface LogoLetterProps {
  letter: string
  color?: string
}

export const LogoLetter: React.FC<LogoLetterProps> = ({ letter, color = 'text-green-600' }) => (
  <div className={`self-stretch my-auto ${color}`}>{letter}</div>
)

type LogoProps = {
  href?: string
}

const Logo: React.FC<LogoProps> = ({ href = '/' }) => {
  const letters = [
    { letter: 'F', color: 'text-green-600' },
    { letter: 'M', color: 'text-amber-500' },
    { letter: 'V', color: 'text-green-600' },
  ]

  const navigate = useNavigate()

  return (
    <Button onClick={() => navigate(href)} variant={'custom'} className="flex flex-col leading-none">
      <h1 className="flex items-center self-start text-5xl whitespace-nowrap">
        {letters.map((item, index) => (
          <LogoLetter key={index} letter={item.letter} color={item.color} />
        ))}
      </h1>
      <p className="text-base text-black">Food, Beverages & Treats</p>
    </Button>
  )
}

export default Logo
