'use client';
import { useState, useRef, useEffect } from 'react';
import '../../../app/(accounts)/register/style.scss';
import './Profile.scss';
import Image from 'next/image';
import RegisterImg from '@/public/images/registeration.png';
import API_URL from '@/config';
import swal from 'sweetalert';
import { useCandidateContext } from '@/contexts/CandidateContext';
import { useAPIMutation } from '@/hooks/useOptimizedAPI';
import axios from 'axios';

type Candidate = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  country: string;
  address: string;
  accountStatus: string;
  phoneNumber: string;
  jobStatus: string;
  expectedSalary: string;
  linkedIn: string;
  gitHub: string;
  portfolio: string;
  blog: string;
  description: string;
  resumeLink?: string;
  photoLink?: string;
};

const Profile = () => {
  const { profile, candidateId, refreshProfile } = useCandidateContext();
  
  const [candidate, setCandidate] = useState<Candidate>(profile || {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    city: '',
    country: '',
    address: '',
    accountStatus: '',
    phoneNumber: '',
    jobStatus: '',
    expectedSalary: '',
    linkedIn: '',
    gitHub: '',
    portfolio: '',
    blog: '',
    description: '',
    resumeLink: '',
    photoLink: ''
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeName, setResumeName] = useState<string>('');
  const resumeInputRef = useRef<HTMLInputElement | null>(null);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  // Mutation pour mettre à jour le profil
  const updateProfileMutation = useAPIMutation(
    async (data: { candidate: Candidate; resumeFile?: File; photoFile?: File }) => {
      const token = localStorage.getItem("token");
      
      // 1. Mettre à jour les données du profil
      await axios.put(`${API_URL}/api/v1/profiles/candidates/${candidateId}`, {
        firstName: data.candidate.firstName,
        lastName: data.candidate.lastName,
        email: data.candidate.email,
        description: data.candidate.description,
        address: data.candidate.address,
        city: data.candidate.city,
        country: data.candidate.country,
        accountStatus: data.candidate.accountStatus,
        phoneNumber: data.candidate.phoneNumber,
        jobStatus: data.candidate.jobStatus,
        linkedIn: data.candidate.linkedIn,
        gitHub: data.candidate.gitHub,
        portfolio: data.candidate.portfolio,
        blog: data.candidate.blog,
        expectedSalary: data.candidate.expectedSalary,
        resumeLink: data.candidate.resumeLink,
        photoLink: data.candidate.photoLink
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // 2. Upload du CV si changé
      if (data.resumeFile) {
        const formData = new FormData();
        formData.append('file', data.resumeFile);
        await axios.post(`${API_URL}/api/v1/profiles/files/upload/${candidateId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      // 3. Upload de la photo si changée
      if (data.photoFile) {
        const formData = new FormData();
        formData.append('file', data.photoFile);
        await axios.post(`${API_URL}/api/v1/profiles/files/uploadImg/${candidateId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      return data;
    },
    {
      onSuccess: async () => {
        await refreshProfile();
        swal('Profile updated successfully!', '', 'success');
      },
      onError: (error) => {
        console.error('Error updating profile:', error);
        swal('Failed to update profile.', '', 'error');
      },
      invalidatePatterns: ['candidates', 'profile']
    }
  );

  const handleFileSelect = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setResumeFile(file);
      setResumeName(file.name);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setPhotoFile(file);
      setPhotoBlob(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCandidate({ ...candidate, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!candidateId) {
      swal('Please log in again.', '', 'error');
      return;
    }

    await updateProfileMutation.mutate({
      candidate,
      resumeFile: resumeFile || undefined,
      photoFile: photoFile || undefined
    });
  };

  useEffect(() => {
  if (profile) {
    setCandidate(profile);

    // If profile has a photo link, show it initially
    if (profile.photoLink) {
      setPhotoBlob(profile.photoLink);
    }

    // If profile has a resume, show file name
    if (profile.resumeLink) {
      const fileName = profile.resumeLink.split('/').pop();
      setResumeName(fileName || '');
    }
  }
}, [profile]);

  return (
    <form className="form-candidate" onSubmit={handleSubmit}>
      <div className='div1'>
        <h1>Profile</h1>
        <br />
        <label htmlFor="firstname">First name</label>
        <input
          type="text"
          name="firstName"
          id="firstname"
          placeholder="Enter your first name"
          value={candidate.firstName}
          autoFocus
          onChange={handleInputChange}
        />
        <label htmlFor="lastname">Last name</label>
        <input
          type="text"
          name="lastName"
          id="lastname"
          placeholder="Enter your last name"
          value={candidate.lastName}
          onChange={handleInputChange}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={candidate.email}
          onChange={handleInputChange}
        />
        <label htmlFor="city">City</label>
        <input
          type="text"
          name="city"
          id="city"
          placeholder="Enter your city"
          value={candidate.city}
          onChange={handleInputChange}
        />
        <label htmlFor="country">Country</label>
        <input
          type="text"
          name="country"
          id="country"
          placeholder="Enter your country"
          value={candidate.country}
          onChange={handleInputChange}
        />
        <label htmlFor="address">Address</label>
        <input
          type="text"
          name="address"
          id="address"
          placeholder="Enter your address"
          value={candidate.address}
          onChange={handleInputChange}
        />
        <label htmlFor="accountStatus">Account status</label>
        <input
          type="text"
          name="accountStatus"
          placeholder="Enter your account status"
          value={candidate.accountStatus}
          onChange={handleInputChange}
        />
        <label htmlFor="phone">Phone</label>
        <input
          type="tel"
          name="phoneNumber"
          placeholder="Enter your phone number"
          value={candidate.phoneNumber}
          onChange={handleInputChange}
        />
        <label htmlFor="jobStatus">Job status</label>
        <input
          type="text"
          name="jobStatus"
          placeholder="Enter your job status"
          value={candidate.jobStatus}
          onChange={handleInputChange}
        />
        <label htmlFor="expectedSalary">Expected salary</label>
        <input
          type="number"
          name="expectedSalary"
          placeholder="Enter your expected salary"
          value={candidate.expectedSalary}
          min="0"
          step="any"
          onChange={handleInputChange}
        />
      </div>

      <div className='div2'>
        <div className="upload-section">
          <label htmlFor="image">Image</label>
          <input
            type="file"
            ref={photoInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
          <div onClick={() => handleFileSelect(photoInputRef)} style={{ cursor: 'pointer', textAlign: 'center' }}>
  {photoFile ? (
    // New uploaded photo
    <img
      src={URL.createObjectURL(photoFile)}
      alt="Candidate Photo"
      style={{ marginLeft: '40px', borderRadius: '20px', width: '250px', height: '280px' }}
    />
  ) : candidate.photoLink ? (
    // Existing photo from API
    <img
  src={
    candidate.photoLink
      ? candidate.photoLink.startsWith('http')
        ? candidate.photoLink
        : `${API_URL}/uploads/${candidate.photoLink.split('\\').pop()?.split('/').pop()}`
      : '/default-avatar.png'
  }
  alt="Candidate Photo"
  style={{ marginLeft: '40px', borderRadius: '20px', width: '250px', height: '280px' }}
/>

  ) : (
    // No photo yet
    <button type="button" style={{ backgroundColor: 'rgb(108, 162, 209)' }}>
      Choose Image
    </button>
  )}
</div>

        </div>

        <div className="upload-section">
  <label htmlFor="resume">Resume CV</label>
  <input
    type="file"
    ref={resumeInputRef}
    accept=".pdf,.doc,.docx"
    style={{ display: 'none' }}
    onChange={handleResumeChange}
  />
{/*   
  {candidate.resumeLink ? (
    <a
      href={candidate.resumeLink.startsWith('http') 
        ? candidate.resumeLink 
        : `${API_URL}/${candidate.resumeLink}`}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'inline-block', marginBottom: '10px' }}
    >
      📄 View Current Resume
    </a>
  ) : null} */}

  <button
    type="button"
    style={{ backgroundColor: 'rgb(108, 162, 209)' }}
    onClick={() => handleFileSelect(resumeInputRef)}
  >
    {resumeName || 'Choose Resume'}
  </button>
</div>


        <label htmlFor="linkedin">LinkedIn</label>
        <input
          type="text"
          name="linkedIn"
          placeholder="Enter your LinkedIn"
          value={candidate.linkedIn}
          onChange={handleInputChange}
        />
        <label htmlFor="github">GitHub</label>
        <input
          type="text"
          name="gitHub"
          placeholder="Enter your GitHub"
          value={candidate.gitHub}
          onChange={handleInputChange}
        />
        <label htmlFor="portfolio">Portfolio</label>
        <input
          type="text"
          name="portfolio"
          placeholder="Enter your portfolio"
          value={candidate.portfolio}
          onChange={handleInputChange}
        />
        <label htmlFor="blog">Blog</label>
        <input
          type="text"
          name="blog"
          placeholder="Enter your blog"
          value={candidate.blog}
          onChange={handleInputChange}
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="Enter your description"
          value={candidate.description}
          onChange={handleInputChange}
        ></textarea>

        <input className='inline checkbox' type="checkbox" name="term-of-use" id="term-of-use" />
        <p className='error terms-error'></p>
        <button 
          className='block' 
          type="submit"
          disabled={updateProfileMutation.loading}
        >
          {updateProfileMutation.loading ? 'Updating...' : 'Modify'}
        </button>
      </div>
      <div className="div-image">
        <Image
          src={RegisterImg}
          width={400}
          height={600}
          alt="register image"
        />
      </div>
    </form>
  );
}

export default Profile;