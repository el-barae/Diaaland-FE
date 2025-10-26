'use client'
import './Links.scss'
import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import API_URL from '@/config';
import ModalE from './ModalEducations/ModalEducation'
import ModalC from './ModalCertificates/ModalCertificate'
import ModalL from './ModalLinks/ModalLink'
import { useCandidateContext } from '@/contexts/CandidateContext';
import { useAPIMutation } from '@/hooks/useOptimizedAPI';

interface education {
  id: number;
  name: string;
  url: string;
  school: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface certificate {
  id: number;
  name: string;
  url: string;
  domain: string;
  description: string;
}

interface other_link {
  id: number;
  name: string;
  url: string;
  description: string;
}

const Links = () => {
  const { educations, certificates, otherLinks, candidateId, refreshEducations, refreshCertificates, refreshOtherLinks } = useCandidateContext();

  const [nameEducation, setNameEducation] = useState('')
  const [nameCertificate, setNameCertificate] = useState('')
  const [nameLink, setNameLink] = useState('')
  const [domain, setDomain] = useState('')
  const [school, setSchool] = useState('')
  const [urlEducation, setUrlEducation] = useState('')
  const [urlCertificate, setUrlCertificate] = useState('')
  const [urlLink, setUrlLink] = useState('')
  const [descEducation, setDescEducation] = useState('')
  const [descCertificate, setDescCertificate] = useState('')
  const [descLink, setDescLink] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [modalEOpen, setModalEOpen] = useState(false);
  const [modalCOpen, setModalCOpen] = useState(false);
  const [modalLOpen, setModalLOpen] = useState(false);
  const [currentId, setCurrentId] = useState(0);
  const [currentName, setCurrentName] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentSchool, setCurrentSchool] = useState("");
  const [currentDomain, setCurrentDomain] = useState("");
  const [currentStartDate, setCurrentStartDate] = useState("");
  const [currentEndDate, setCurrentEndDate] = useState("");
  const [currentDescription, setCurrentDescription] = useState("");

  // Mutations pour les éducations
  const addEducationMutation = useAPIMutation(
    async (data: { name: string; url: string; description: string; school: string; startDate: string; endDate: string }) => {
      const token = localStorage.getItem("token");
      return axios.post(`${API_URL}/api/v1/profiles/educations`, {
        name: data.name,
        url: data.url,
        description: data.description,
        candidate: { id: candidateId },
        school: data.school,
        startDate: data.startDate,
        endDate: data.endDate,
      }, { headers: { Authorization: `Bearer ${token}` } });
    },
    {
      onSuccess: async () => {
        await refreshEducations();
        setNameEducation('');
        setUrlEducation('');
        setDescEducation('');
        setSchool('');
        setStartDate('');
        setEndDate('');
        alert("Education added successfully!");
      },
      invalidatePatterns: ['educations']
    }
  );

  const deleteEducationMutation = useAPIMutation(
    async (id: number) => {
      const token = localStorage.getItem("token");
      return axios.delete(`${API_URL}/api/v1/profiles/educations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: async () => {
        await refreshEducations();
      },
      invalidatePatterns: ['educations']
    }
  );

  // Mutations pour les certificats
  const addCertificateMutation = useAPIMutation(
    async (data: { name: string; url: string; description: string; domain: string }) => {
      const token = localStorage.getItem("token");
      return axios.post(`${API_URL}/api/v1/profiles/certificates`, {
        name: data.name,
        url: data.url,
        description: data.description,
        candidate: { id: candidateId },
        domain: data.domain,
      }, { headers: { Authorization: `Bearer ${token}` } });
    },
    {
      onSuccess: async () => {
        await refreshCertificates();
        setNameCertificate('');
        setUrlCertificate('');
        setDescCertificate('');
        setDomain('');
        alert("Certificate added successfully!");
      },
      invalidatePatterns: ['certificates']
    }
  );

  const deleteCertificateMutation = useAPIMutation(
    async (id: number) => {
      const token = localStorage.getItem("token");
      return axios.delete(`${API_URL}/api/v1/profiles/certificates/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: async () => {
        await refreshCertificates();
      },
      invalidatePatterns: ['certificates']
    }
  );

  // Mutations pour les liens
  const addLinkMutation = useAPIMutation(
    async (data: { name: string; url: string; description: string }) => {
      const token = localStorage.getItem("token");
      return axios.post(`${API_URL}/api/v1/profiles/other_links`, {
        name: data.name,
        url: data.url,
        description: data.description,
        candidate: { id: candidateId },
      }, { headers: { Authorization: `Bearer ${token}` } });
    },
    {
      onSuccess: async () => {
        await refreshOtherLinks();
        setNameLink('');
        setUrlLink('');
        setDescLink('');
        alert("Link added successfully!");
      },
      invalidatePatterns: ['other_links']
    }
  );

  const deleteLinkMutation = useAPIMutation(
    async (id: number) => {
      const token = localStorage.getItem("token");
      return axios.delete(`${API_URL}/api/v1/profiles/other_links/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    {
      onSuccess: async () => {
        await refreshOtherLinks();
      },
      invalidatePatterns: ['other_links']
    }
  );

  const handleAddEducation = (e: any) => {
    e.preventDefault();
    if (!candidateId) {
      alert("Please log in again.");
      return;
    }
    addEducationMutation.mutate({ 
      name: nameEducation, 
      url: urlEducation, 
      description: descEducation, 
      school, 
      startDate, 
      endDate 
    });
  };

  const handleDeleteEducation = (e: any, id: number) => {
    e.preventDefault();
    deleteEducationMutation.mutate(id);
  };

  const handleAddCertificate = (e: any) => {
    e.preventDefault();
    if (!candidateId) {
      alert("Please log in again.");
      return;
    }
    addCertificateMutation.mutate({ 
      name: nameCertificate, 
      url: urlCertificate, 
      description: descCertificate, 
      domain 
    });
  };

  const handleDeleteCertificate = (e: any, id: number) => {
    e.preventDefault();
    deleteCertificateMutation.mutate(id);
  };

  const handleAddOther_Link = (e: any) => {
    e.preventDefault();
    if (!candidateId) {
      alert("Please log in again.");
      return;
    }
    addLinkMutation.mutate({ 
      name: nameLink, 
      url: urlLink, 
      description: descLink 
    });
  };

  const handleDeleteLink = (e: any, id: number) => {
    e.preventDefault();
    deleteLinkMutation.mutate(id);
  };

  const handleEducationClick = (id: number, name: string, url: string, school: string, startDate: string, endDate: string, description: string) => {
    setCurrentId(id);
    setCurrentName(name);
    setCurrentUrl(url);
    setCurrentSchool(school);
    setCurrentStartDate(startDate);
    setCurrentEndDate(endDate);
    setCurrentDescription(description);
    setModalEOpen(true);
  };

  const handleCertificateClick = (id: number, name: string, url: string, domain: string, description: string) => {
    setCurrentId(id);
    setCurrentName(name);
    setCurrentUrl(url);
    setCurrentDomain(domain);
    setCurrentDescription(description);
    setModalCOpen(true);
  };

  const handleLinkClick = (id: number, name: string, url: string, description: string) => {
    setCurrentId(id);
    setCurrentName(name);
    setCurrentUrl(url);
    setCurrentDescription(description);
    setModalLOpen(true);
  };

  const Educations: React.FC<{ className: string; n: number; educationsData: education[] }> = ({ className, n, educationsData }) => {
    if (educationsData.length !== 0)
      return (
        <>
          {educationsData.map((education) => (
            <div key={education.id} className={className}>
              <h1>{education.name}:</h1>
              <p>Url: {education.url}</p>
              <p>School: {education.school}</p>
              <p>Start date: {education.startDate}</p>
              <p>Close date: {education.endDate}</p>
              <button 
                onClick={(e) => handleDeleteEducation(e, education.id)}
                disabled={deleteEducationMutation.loading}
              >
                {deleteEducationMutation.loading ? 'Deleting...' : 'Delete'}
              </button>
              <button onClick={() => handleEducationClick(education.id, education.name, education.url, education.school, education.startDate, education.endDate, education.description)}>
                Modify
              </button>
              <ModalE 
                isOpen={modalEOpen} 
                id={currentId} 
                name={currentName} 
                url={currentUrl} 
                school={currentSchool} 
                startDate={currentStartDate} 
                endDate={currentEndDate} 
                description={currentDescription} 
                onClose={() => setModalEOpen(false)} 
              />
            </div>
          ))}
        </>
      )
    return null;
  }

  const Certificates: React.FC<{ className: string; n: number; certificatesData: certificate[] }> = ({ className, n, certificatesData }) => {
    if (certificatesData.length !== 0)
      return (
        <>
          {certificatesData.map((certificate) => (
            <div key={certificate.id} className={className}>
              <h1>{certificate.name}:</h1>
              <p>Url: {certificate.url}</p>
              <p>Domain: {certificate.domain}</p>
              <button 
                onClick={(e) => handleDeleteCertificate(e, certificate.id)}
                disabled={deleteCertificateMutation.loading}
              >
                {deleteCertificateMutation.loading ? 'Deleting...' : 'Delete'}
              </button>
              <button onClick={() => handleCertificateClick(certificate.id, certificate.name, certificate.url, certificate.domain, certificate.description)}>
                Modify
              </button>
              <ModalC 
                isOpen={modalCOpen} 
                id={currentId} 
                name={currentName} 
                url={currentUrl} 
                description={currentDescription} 
                domain={currentDomain} 
                onClose={() => setModalCOpen(false)} 
              />
            </div>
          ))}
        </>
      )
    return null;
  }

  const Other_Links: React.FC<{ className: string; n: number; other_linksData: other_link[] }> = ({ className, n, other_linksData }) => {
    if (other_linksData.length !== 0)
      return (
        <>
          {other_linksData.map((link) => (
            <div key={link.id} className={className}>
              <h1>{link.name}:</h1>
              <p>Url: {link.url}</p>
              <button 
                onClick={(e) => handleDeleteLink(e, link.id)}
                disabled={deleteLinkMutation.loading}
              >
                {deleteLinkMutation.loading ? 'Deleting...' : 'Delete'}
              </button>
              <button onClick={() => handleLinkClick(link.id, link.name, link.url, link.description)}>
                Modify
              </button>
              <ModalL 
                isOpen={modalLOpen} 
                id={currentId} 
                name={currentName} 
                url={currentUrl} 
                description={currentDescription} 
                onClose={() => setModalLOpen(false)} 
              />
            </div>
          ))}
        </>
      )
    return null;
  }

  return (
    <>
      <div className="jobs">
        <div className="education">
          <h1>Education</h1>
          <div className='add'>
            <div className='part1'>
              <label htmlFor="name">Name:</label>
              <input type="text" placeholder='Enter name education' value={nameEducation} onChange={(e) => setNameEducation(e.target.value)} />
              <label htmlFor="url">Url:</label>
              <input type="text" placeholder='Enter url education' value={urlEducation} onChange={(e) => setUrlEducation(e.target.value)} />
              <label htmlFor="name">School:</label>
              <input type="text" placeholder='Enter school education' value={school} onChange={(e) => setSchool(e.target.value)} />
              <label htmlFor="startDate">Start Date:</label>
              <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <label htmlFor="CloseDate">End Date:</label>
              <input type="date" id="CloseDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              <label htmlFor="description">Description:</label>
              <textarea className='desc' placeholder='Enter description' value={descEducation} onChange={(e) => setDescEducation(e.target.value)} />
              <button 
                onClick={handleAddEducation}
                disabled={addEducationMutation.loading}
              >
                {addEducationMutation.loading ? 'Adding...' : 'Add education'}
              </button>
            </div>
            <div className='part2'>
              <div className='lists' id='ls1'>
                <Educations className="list" n={educations.length} educationsData={educations} />
              </div>
            </div>
          </div>
        </div>

        <div className="certificats">
          <h1>Certificates</h1>
          <div className='add'>
            <div className='part1'>
              <label htmlFor="name">Name:</label>
              <input type="text" placeholder='Enter name certificate' value={nameCertificate} onChange={(e) => setNameCertificate(e.target.value)} />
              <label htmlFor="url">Url:</label>
              <input type="text" placeholder='Enter url certificate' value={urlCertificate} onChange={(e) => setUrlCertificate(e.target.value)} />
              <label htmlFor="url">Domain:</label>
              <input type="text" placeholder='Enter domain certificate' value={domain} onChange={(e) => setDomain(e.target.value)} />
              <label htmlFor="description">Description:</label>
              <textarea className='desc' placeholder='Enter description' value={descCertificate} onChange={(e) => setDescCertificate(e.target.value)} />
              <button 
                onClick={handleAddCertificate}
                disabled={addCertificateMutation.loading}
              >
                {addCertificateMutation.loading ? 'Adding...' : 'Add certificate'}
              </button>
            </div>
            <div className='part2'>
              <div className='lists' id='ls2'>
                <Certificates className="list" n={certificates.length} certificatesData={certificates} />
              </div>
            </div>
          </div>
        </div>

        <div className="others">
          <h1>Other links</h1>
          <div className='add'>
            <div className='part1'>
              <label htmlFor="name">Name:</label>
              <input type="text" placeholder='Enter name' value={nameLink} onChange={(e) => setNameLink(e.target.value)} />
              <label htmlFor="name">Url:</label>
              <input type="text" placeholder='Enter url' value={urlLink} onChange={(e) => setUrlLink(e.target.value)} />
              <label htmlFor="description">Description:</label>
              <textarea className='desc' placeholder='Enter description' value={descLink} onChange={(e) => setDescLink(e.target.value)} />
              <button 
                onClick={handleAddOther_Link}
                disabled={addLinkMutation.loading}
              >
                {addLinkMutation.loading ? 'Adding...' : 'Add link'}
              </button>
            </div>
            <div className='part2'>
              <div className='lists' id='ls3'>
                <Other_Links className="list" n={otherLinks.length} other_linksData={otherLinks} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Links;