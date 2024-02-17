'use client'
import './Links.scss'
import { useState,useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import API_URL from '@/config';
import ModalE from './ModalEducations/ModalEducation'
import ModalC from './ModalCertificates/ModalCertificate'
import ModalL from './ModalLinks/ModalLink'

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

    const [nameEducation,setNameEducation] = useState('')
    const [nameCertificate,setNameCertificate] = useState('')
    const [nameLink,setNameLink] = useState('')
    const [domain,setDomain] = useState('')
    const [school,setSchool] = useState('')
    const [urlEducation,setUrlEducation] = useState('')
    const [urlCertificate,setUrlCertificate] = useState('')
    const [urlLink,setUrlLink] = useState('')
    const [descEducation,setDescEducation] = useState('')
    const [descCertificate,setDescCertificate] = useState('')
    const [descLink,setDescLink] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [educationsData,setEducationsData] = useState<education[]>([])
    const [certificatesData,setCertificatesData] = useState<certificate[]>([])
    const [other_linksData,setOther_LinksData] = useState<other_link[]>([])

    const handleAddEducation = async (e:any)  =>{
        e.preventDefault()
        const id = Cookies.get("id");
        axios.post(API_URL+'/api/v1/educations', {
          "name": nameEducation,
          "url": urlEducation,
          "description": descEducation,
          "candidate": {
            "id": id
          },
          "school": school,
          "startDate": startDate,
          "endDate": endDate,
          }/*, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }*/)
          .then(function (response) {
            setEducationsData(prevEducationData => [...prevEducationData, response.data]);
          console.log(response);
          alert("Your post had been sent to admin ")
          })
          .catch(function (error) {
          alert(error.message);
          });
      }

      const handleAddCertificate = async (e:any)  =>{
        e.preventDefault()
        const id = Cookies.get("id");
        axios.post(API_URL+'/api/v1/certificates', {
          "name": nameCertificate,
          "url": urlCertificate,
          "decription": descCertificate,
          "candidate": {
            "id": id
          },
          "domain": domain
          }/*, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }*/)
          .then(function (response) {
          setCertificatesData(prevCertificatesData => [...prevCertificatesData, response.data]);
          console.log(response);
          alert("Your post had been sent to admin ")
          })
          .catch(function (error) {
          alert(error.message);
          });
      }

      const handleAddOther_Link = async (e:any)  =>{
        e.preventDefault()
        const id = Cookies.get("id");
        axios.post(API_URL+'/api/v1/other_links', {
          "name": nameLink,
          "url": urlLink,
          "decription": descLink,
          "candidate": {
            "id": id
          }
          }/*, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }*/)
          .then(function (response) {
            setOther_LinksData(prevOthersData => [...prevOthersData, response.data]);
          console.log(response);
          alert("Your post had been sent to admin ")
          })
          .catch(function (error) {
          alert(error.message);
          });
      }
  
      const handleDeleteEducation = async (e:any, id:number) =>{
        e.preventDefault()
        try{
        axios.delete(API_URL+'/api/v1/educations/'+String(id))
        const updatedEducationsData = educationsData.filter(ed => ed.id !== id)
        setEducationsData(updatedEducationsData)
        }
        catch(error) {
          console.log(error);
        };
      }

      const handleDeleteCertificate = async (e:any, id:number) =>{
        e.preventDefault()
        try{
        axios.delete(API_URL+'/api/v1/certificates/'+String(id))
        const updatedCertificatesData = certificatesData.filter(cer => cer.id !== id)
        setCertificatesData(updatedCertificatesData)
        }
        catch(error) {
          console.log(error);
        };
      }
      const handleDeleteLink = async (e:any, id:number) =>{
        e.preventDefault()
        try{
        axios.delete(API_URL+'/api/v1/other_links/'+String(id))
        const updatedOtherData = other_linksData.filter(o => o.id !== id)
        setOther_LinksData(updatedOtherData)
        }
        catch(error) {
          console.log(error);
        };
      }

      const [modalEOpen, setModalEOpen] = useState(false);
      const handleEducationClick = () => {
        setModalEOpen(true);
      };
      const [modalCOpen, setModalCOpen] = useState(false);
    const handleCertificateClick = () => {
      setModalCOpen(true);
    };
    const [modalLOpen, setModalLOpen] = useState(false);
    const handleLinkClick = () => {
      setModalLOpen(true);
    };

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
              <button onClick={(e) => handleDeleteEducation(e, education.id)}>Delete</button>
              <button onClick={() => handleEducationClick()}>Modify</button>
              <ModalE isOpen={modalEOpen} id={education.id} name={education.name} url={education.url} school={education.school} startDate={education.startDate} endDate={education.endDate} description={education.description} onClose={() => setModalEOpen(false)} />
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
                  <button onClick={(e) => handleDeleteCertificate(e, certificate.id)}>Delete</button>
                  <button onClick={() => handleCertificateClick()}>Modify</button>
              <ModalC isOpen={modalCOpen} id={certificate.id} name={certificate.name} url={certificate.url}  description={certificate.description} domain={certificate.domain} onClose={() => setModalCOpen(false)} />
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
                    <button onClick={(e) => handleDeleteLink(e, link.id)}>Delete</button>
                    <button onClick={() => handleLinkClick()}>Modify</button>
                    <ModalL isOpen={modalLOpen} id={link.id} name={link.name} url={link.url}  description={link.description} onClose={() => setModalLOpen(false)} />
                  </div>
                  ))}
                  </>
                )
              }
    
        useEffect(() => {
            const fetchData = async () => {
              try {
                Cookies.set("id","1")
                const id = Cookies.get("id");
                const response = await axios.get(API_URL+'/api/v1/educations');         
                setEducationsData(response.data);
                const response1 = await axios.get(API_URL+'/api/v1/certificates');
                setCertificatesData(response1.data);
                const response2 = await axios.get(API_URL+'/api/v1/other_links');
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
                    <div className="education">
                        <h1>Education</h1>
                        <div className='add'>
                            <div className='part1'>
                                <label htmlFor="name">Name:</label>
                                <input type="text" placeholder='Enter name education' value={nameEducation} onChange={(e) => setNameEducation(e.target.value)}/>
                                <label htmlFor="url">Url:</label>
                                <input type="text" placeholder='Enter  url education' value={urlEducation} onChange={(e) => setUrlEducation(e.target.value)}/>
                                <label htmlFor="name">School:</label>
                                <input type="text" placeholder='Enter school education' value={school} onChange={(e) => setSchool(e.target.value)}/>
                                <label htmlFor="startDate">Start Date:</label>
                                <input 
                                    type="date" 
                                    id="startDate" 
                                    value={startDate} 
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                <label htmlFor="CloseDate">End Date:</label>
                                <input 
                                    type="date" 
                                    id="CloseDate" 
                                    value={endDate} 
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                                <label htmlFor="description">Description:</label>
                                <textarea className='desc' placeholder='Enter description' value={descEducation} onChange={(e) => setDescEducation(e.target.value)}/>
                                <button onClick={handleAddEducation}>add education</button>
                            </div>
                            <div className='part2'>
                                <div className='lists' id='ls1'>
                                    <Educations className="list" n={educationsData.length} educationsData={educationsData} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="certificats">
                        <h1>Certificates</h1>
                        <div className='add'>
                            <div className='part1'>
                                <label htmlFor="name">Name:</label>
                                <input type="text" placeholder='Enter name certificate' value={nameCertificate} onChange={(e) => setNameCertificate(e.target.value)}/>
                                <label htmlFor="url">Url:</label>
                                <input type="text" placeholder='Enter  url certificate' value={urlCertificate} onChange={(e) => setUrlCertificate(e.target.value)}/>
                                <label htmlFor="url">Domain:</label>
                                <input type="text" placeholder='Enter  url certificate' value={domain} onChange={(e) => setDomain(e.target.value)}/>
                                <label htmlFor="description">Description:</label>
                                <textarea className='desc' placeholder='Enter description' value={descCertificate} onChange={(e) => setDescCertificate(e.target.value)}/>
                                <button onClick={handleAddCertificate}>add certificate</button>
                            </div>
                            <div className='part2'>
                                <div className='lists' id='ls2'>
                                    <Certificates className="list" n={certificatesData.length} certificatesData={certificatesData} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="others">
                        <h1>Other links</h1>
                        <div className='add'>
                            <div className='part1'>
                                <label htmlFor="name">Name:</label>
                                <input type="text" placeholder='Enter name' value={nameLink} onChange={(e) => setNameLink(e.target.value)}/>
                                <label htmlFor="name">Url:</label>
                                <input type="text" placeholder='Enter url' value={urlLink} onChange={(e) => setUrlLink(e.target.value)}/>
                                <label htmlFor="description">Description:</label>
                                <textarea className='desc' placeholder='Enter description' value={descLink} onChange={(e) => setDescLink(e.target.value)}/>
                                <button onClick={handleAddOther_Link}>add link</button>
                            </div>
                            <div className='part2'>
                                <div className='lists' id='ls3'>
                                    <Other_Links className="list" n={other_linksData.length} other_linksData={other_linksData} />
                                </div>
                            </div>
                        </div>
                </div>
            </div>
        </>
    )
  }


export default Links;