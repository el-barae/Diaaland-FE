import Image from 'next/image'
import Link from 'next/link'
import headline from '@/public/images/headline-image.svg'
import './HeadlineContent.scss'
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const HeadlineContent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const hidePost = () => {
    const postDiv = document.querySelector('.post');
    if (postDiv instanceof HTMLElement) {
      postDiv.style.display = 'none';
    }
  }

  const hideFind = () => {
    const findDiv = document.querySelector('.find');
    if (findDiv instanceof HTMLElement) {
      findDiv.style.display = 'none';
    }
  }

  const onclick = (s:String) =>{
    setLoading(true);
    if(s=='p'){
      hidePost();
      router.push('/addPost')
    }else{
      hideFind();
      router.push('/listJobs')
    }
  }

  return (
    <div className="content">
      <div className="container">
        <div className="intro">
          <h2>discover your perfect <span>match</span> </h2>
          <p>DiaaLand is a recruitment and IT services platform. We assist companies in finding suitable candidates and empower individuals to secure the best opportunities based on their technical and general skills. We provide a range of services for both candidates and recrtuiters.</p>
          <div className="links">
            <div className="post">
              <Link href='/addPost' onClick={() =>onclick('p')}>post opportunity</Link>
            </div>
            <div className="find">
              <Link href='/listJobs' onClick={() =>onclick('f')}>find opportunity</Link>
            </div>
            {loading && <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>}
          </div>
        </div>

        <div className="img">
          <Image 
            src={headline}
            width={500}
            height={500}
            alt='We will see'
          />
        </div>
      </div>
    </div>
  );
}

export default HeadlineContent;
