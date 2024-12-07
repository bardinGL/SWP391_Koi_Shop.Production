import CardPromotion from './CardPromotion'
import CustomerReview from './CustomerReview'
import LorealPromotion from './LorealPromotion'
import NewProduct from './NewProduct'
import Payment from './Payment'
import Promotion from './Promotion'
import Sponsors from './Sponsors'
import SubPromotion from './SubPromotion'
import Subscription from './Subscription'

const HomePageContainer = () => {
  return (
    <div className=" flex justify-center flex-col items-center w-full">
      <div className="w-[1280px] flex flex-col gap-20">
        <Promotion />
        <Sponsors />
      </div>
      <LorealPromotion />
      <div className="bg-[#F5F5F5] w-full flex  flex-col justify-center items-center">
        <div className="w-[1280px] flex flex-col">
          <NewProduct />
        </div>
      </div>
      <CardPromotion />
      <div className="w-full flex  flex-col justify-center items-center">
        <div className="w-[1280px] flex flex-col">
          <SubPromotion />
        </div>
      </div>
      <Payment />
      <CustomerReview />
      <Subscription />
    </div>
  )
}

export default HomePageContainer
