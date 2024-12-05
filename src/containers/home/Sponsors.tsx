import Cocacola from '@/assets/cocacola.png'
import KitKat from '@/assets/kitkat.png'
import Loreal from '@/assets/loreal.png'
import Oreo from '@/assets/oreo.png'
import MandM from '@/assets/mandm.png'

const sponsorItems = [
  {
    id: 1,
    name: 'Coca Cola',
    image: Cocacola,
  },
  {
    id: 2,
    name: 'KitKat',
    image: KitKat,
  },
  {
    id: 3,
    name: 'Loreal',
    image: Loreal,
  },
  {
    id: 4,
    name: 'Oreo',
    image: Oreo,
  },
  {
    id: 5,
    name: 'M&M',
    image: MandM,
  },
]

const Sponsors = () => {
  return (
    <div className="flex justify-between h-[76px]">
      {sponsorItems.map((sponsor) => (
        <img className="" src={sponsor.image} alt={sponsor.name} key={sponsor.id} />
      ))}
    </div>
  )
}

export default Sponsors
