import Image from 'next/image'
import Comp1 from '@/public/images/companie1.png'
import Comp2 from '@/public/images/companie2.png'
import Comp3 from '@/public/images/companie3.png'
import Comp4 from '@/public/images/companie4.png'
import Comp5 from '@/public/images/companie5.png'
import Comp6 from '@/public/images/companie6.png'
import Comp7 from '@/public/images/companie7.png'
import './Companies.scss'

const Companies = () => {
  return (
    <>
      <div className="companies">
        <div className="container">
          <div className="slider">
            <div className="slide-track">
              <Image
                src={Comp1}
                width={140}
                height={140}
                alt='partner logo'
              />

              <Image
                src={Comp2}
                width={140}
                height={140}
                alt='partner logo'
              />

              <Image
                src={Comp3}
                width={140}
                height={140}
                alt='partner logo'
              />

              <Image
                src={Comp4}
                width={140}
                height={140}
                alt='partner logo'
              />

              <Image
                src={Comp5}
                width={140}
                height={140}
                alt='partner logo'
              />

              <Image
                src={Comp6}
                width={140}
                height={140}
                alt='partner logo'
              />

              <Image
                src={Comp7}
                width={140}
                height={140}
                alt='partner logo'
              />
              
              <Image
                src={Comp1}
                width={140}
                height={140}
                alt='partner logo'
              />

              <Image
                src={Comp2}
                width={140}
                height={140}
                alt='partner logo'
              />

              <Image
                src={Comp3}
                width={140}
                height={140}
                alt='partner logo'
              />

              <Image
                src={Comp4}
                width={140}
                height={140}
                alt='partner logo'
              />

              <Image
                src={Comp5}
                width={140}
                height={140}
                alt='partner logo'
              />

              <Image
                src={Comp6}
                width={140}
                height={140}
                alt='partner logo'
              />

              <Image
                src={Comp7}
                width={140}
                height={140}
                alt='partner logo'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Companies;