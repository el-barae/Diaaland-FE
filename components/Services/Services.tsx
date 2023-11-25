import Image from 'next/image'
import service1 from '@/public/images/service1.svg'
import service2 from '@/public/images/service2.svg'
import service3 from '@/public/images/service3.svg'
import './Services.scss'

const Services = () => {
  return (
    <div className="services">
      <div id="services-section" className="container">
        <h2>Unleash IT Potential through Elite Recruitment</h2>
        <p className='services-desc'>Our IT recruitment services go beyond traditional hiring processes, leveraging our expertise to find exceptional IT professionals who possess the perfect blend of technical skills and cultural fit</p>
        <div className="services-list">
          <div className="service">
            <h3>Consultance technique IT</h3>
            <p className="service-desc">Supporting companies in writing precise resource requirements. Matching companies with talented developers. .</p>
            <Image
              src={service1}
              width={100}
              height={100}
              alt='image of service'
            />
            <button>explore more</button>
          </div>
          <div className="service">
            <h3>Recrutement des profils IT</h3>
            <p className="service-desc">Aider les sociétés à bien rédiger leurs besoins en ressources. Aider les sociétés à trouver les bons</p>
            <Image
              src={service2}
              width={100}
              height={100}
              alt='image of service'
              />
              <button>explore more</button>
          </div>
          <div className="service">
            <h3>Recrutement des profils IT</h3>
            <p className="service-desc">Guiding youth to find needed training, offering support and follow-up throughout their educational journey</p>
            <Image
              src={service3}
              width={100}
              height={100}
              alt='image of service'
              />
              <button>explore more</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;
