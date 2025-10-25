'use client'
import './Links.scss'
import { useState,useEffect } from 'react';
import axios from 'axios';
import API_URL from '@/config';
import ModalE from './ModalEducations/ModalEducation'
import ModalC from './ModalCertificates/ModalCertificate'
import ModalL from './ModalLinks/ModalLink'
import { dom } from '@fortawesome/fontawesome-svg-core';
import { jwtDecode } from "jwt-decode";

interface MyToken {
  sub: string; // email
  id: number;
  name: string;
  role: string;
  exp: number;
}

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
    const [modalEOpen, setModalEOpen] = useState(false);
      const [currentId, setCurrentId] = useState(0);
      const [currentName, setCurrentName] = useState("");
      const [currentUrl, setCurrentUrl] = useState("");
      const [currentSchool, setCurrentSchool] = useState("");
      const [currentDomain, setCurrentDomain] = useState("");
      const [currentStartDate, setCurrentStartDate] = useState("");
      const [currentEndDate, setCurrentEndDate] = useState("");
      const [currentDescription, setCurrentDescription] = useState("");
      const handleEducationClick = (id:number, name:string, url:string, school:string, startDate: string, endDate:string, decription:string) => {
        setCurrentId(id);
        setCurrentName(name);
        setCurrentUrl(url);
        setCurrentSchool(school);
        setCurrentStartDate(startDate);
        setCurrentEndDate(endDate);
        setCurrentDescription(decription);
        setModalEOpen(true);
      };
      const [modalCOpen, setModalCOpen] = useState(false);
    const handleCertificateClick = (id:number, name:string, url:string, domain:string, description:string) => {
      setCurrentId(id);
        setCurrentName(name);
        setCurrentUrl(url);
        setCurrentDomain(domain);
        setCurrentDescription(description);
      setModalCOpen(true);
    };
    const [modalLOpen, setModalLOpen] = useState(false);
    const handleLinkClick = (id:number, name:string, url:string, description:string) => {
      setCurrentId(id);
        setCurrentName(name);
        setCurrentUrl(url);
        setCurrentDescription(description);
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
              <button onClick={() => handleEducationClick(education.id, education.name, education.url, education.school, education.startDate, education.endDate, education.description)}>Modify</button>
              <ModalE isOpen={modalEOpen} id={currentId} name={currentName} url={currentUrl} school={currentSchool} startDate={currentStartDate} endDate={currentEndDate} description={currentDescription} onClose={() => setModalEOpen(false)} />
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
                  <button onClick={() => handleCertificateClick(certificate.id, certificate.name, certificate.url, certificate.domain, certificate.description)}>Modify</button>
              <ModalC isOpen={modalCOpen} id={currentId} name={currentName} url={currentUrl}  description={currentDescription} domain={currentDomain} onClose={() => setModalCOpen(false)} />
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
                    <button onClick={() => handleLinkClick(link.id, link.name, link.url, link.description)}>Modify</button>
                    <ModalL isOpen={modalLOpen} id={currentId} name={currentName} url={currentUrl}  description={currentDescription} onClose={() => setModalLOpen(false)} />
                  </div>
                  ))}
                  </>
                )
              }
    

    const handleAddEducation = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const decoded = jwtDecode<MyToken>(token);

      const response = await axios.post(
        `${API_URL}/api/v1/profiles/educations`,
        {
          name: nameEducation,
          url: urlEducation,
          description: descEducation,
          candidate: { id: decoded.id },
          school,
          startDate,
          endDate,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEducationsData((prev) => [...prev, response.data]);
      alert("Education added successfully!");
    } catch (error: any) {
      alert(error.message || "Error adding education");
    }
  };

  // ============================
  //  🔹 Ajout d’un certificat
  // ============================
  const handleAddCertificate = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const decoded = jwtDecode<MyToken>(token);

      const response = await axios.post(
        `${API_URL}/api/v1/profiles/certificates`,
        {
          name: nameCertificate,
          url: urlCertificate,
          description: descCertificate,
          candidate: { id: decoded.id },
          domain,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCertificatesData((prev) => [...prev, response.data]);
      alert("Certificate added successfully!");
    } catch (error: any) {
      alert(error.message || "Error adding certificate");
    }
  };

  // ============================
  //  🔹 Ajout d’un lien externe
  // ============================
  const handleAddOther_Link = async (e: any) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      const decoded = jwtDecode<MyToken>(token);

      const response = await axios.post(
        `${API_URL}/api/v1/profiles/other_links`,
        {
          name: nameLink,
          url: urlLink,
          description: descLink,
          candidate: { id: decoded.id },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOther_LinksData((prev) => [...prev, response.data]);
      alert("Link added successfully!");
    } catch (error: any) {
      alert(error.message || "Error adding link");
    }
  };

  // ============================
  //  🔹 Suppressions
  // ============================
  const handleDeleteEducation = async (e: any, id: number) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/v1/profiles/educations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEducationsData((prev) => prev.filter((ed) => ed.id !== id));
    } catch (error) {
      console.error("Error deleting education:", error);
    }
  };

  const handleDeleteCertificate = async (e: any, id: number) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/v1/profiles/certificates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCertificatesData((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting certificate:", error);
    }
  };

  const handleDeleteLink = async (e: any, id: number) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/api/v1/profiles/other_links/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOther_LinksData((prev) => prev.filter((o) => o.id !== id));
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  // ============================
  //  🔹 Récupération des données
  // ============================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const [resEdu, resCert, resLink] = await Promise.all([
          axios.get(`${API_URL}/api/v1/profiles/educations`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/v1/profiles/certificates`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_URL}/api/v1/profiles/other_links`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setEducationsData(resEdu.data);
        setCertificatesData(resCert.data);
        setOther_LinksData(resLink.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
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