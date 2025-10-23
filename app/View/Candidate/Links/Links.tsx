'use client'
import './Links.scss'
import { useState,useEffect } from 'react';
import axios from 'axios';
import API_URL from '@/config';

interface education{
    id: number;
    name : string;
    url: string;
    school: string;
    startDate : string;
    endDate : string;
    description: string;
}

interface certificate{
    id: number;
    name: string;
    url: string;
    domain: string;
    description: string;
}

interface other_link{
    id: number;
    name: string;
    url: string;
    description: string;
}

interface Education {
    className: string;
    n: number;
    educationsData: education[];
  }

  interface Certificate {
    className: string;
    n: number;
    certificatesData: certificate[];
  }

  interface Other_link {
    className: string;
    n: number;
    other_linksData: other_link[];
  }

const Links = () => {
    const [educationsData,setEducationsData] = useState<education[]>([])
    const [certificatesData,setCertificatesData] = useState<certificate[]>([])
    const [other_linksData,setOther_LinksData] = useState<other_link[]>([])
    const Educations: React.FC<Education> = ({ className, n, educationsData }) => {
        if(educationsData.length != 0)
          return(
            <>
            {educationsData.map((education) => (
              <div key={education.id} className={className}>
              <h1>{education.name} :</h1>
              <p>Url: {education.url}</p>
              <p>School: {education.school}</p>
              <p>Start date: {education.startDate}</p>
              <p>Close date: {education.endDate}</p>
            </div>
            ))}
            </>
          )
        }
        
        const Certificates: React.FC<Certificate> = ({ className, n, certificatesData }) => {
            if(certificatesData.length != 0)
              return(
                <>
                {certificatesData.map((certificate) => (
                  <div key={certificate.id} className={className}>
                  <h1>{certificate.name} :</h1>
                  <p>Url: {certificate.url}</p>
                  <p>Domain: {certificate.domain}</p>
                </div>
                ))}
                </>
              )
            }

            const Other_Links: React.FC<Other_link> = ({ className, n, other_linksData }) => {
              if(other_linksData.length != 0)
                return(
                  <>
                  {other_linksData.map((link) => (
                    <div key={link.id} className={className}>
                    <h1>{link.name} :</h1>
                    <p>
                      Url: {link.url}
                    </p>
                  </div>
                  ))}
                  </>
                )
              }
    
        useEffect(() => {
            const fetchData = async () => {
              try {
                const id = localStorage.getItem("ID");
                const token = localStorage.getItem("token");
                const response = await axios.get(API_URL+'/api/v1/profiles/educations', {
                  headers: {
                    'Authorization': 'Bearer ' + token
                  }
                });        
                setEducationsData(response.data);
                const response1 = await axios.get(API_URL+'/api/v1/profiles/certificates', {
                  headers: {
                    'Authorization': 'Bearer ' + token
                  }
                });
                setCertificatesData(response1.data);
                const response2 = await axios.get(API_URL+'/api/v1/profiles/other_links', {
                  headers: {
                    'Authorization': 'Bearer ' + token
                  }
                });
                setOther_LinksData(response2.data);
              } catch (error) {
                console.error('Erreur lors de la récupération des données :', error);
              }
            };
            fetchData();
      }, []);

    return(
        <>
            <div className="jobs">

  {/* Ligne 1 : Education + Certificates */}
  <div className="grid-class">
    <div className="part1">
      <h1>Educations</h1>
      <div className="lists" id="ls1">
        <Educations className="list" n={educationsData.length} educationsData={educationsData} />
      </div>
    </div>

    <div className="part2">
      <h1>Certificates</h1>
      <div className="lists" id="ls2">
        <Certificates className="list" n={certificatesData.length} certificatesData={certificatesData} />
      </div>
    </div>
  </div>

  {/* Ligne 2 : Other links seul */}
  <div className="grid-class">
    <div className="part2">
      <h1>Other links</h1>
      <div className="lists" id="ls3">
        <Other_Links className="list" n={other_linksData.length} other_linksData={other_linksData} />
      </div>
    </div>
  </div>

</div>

        </>
    )
  }


export default Links;