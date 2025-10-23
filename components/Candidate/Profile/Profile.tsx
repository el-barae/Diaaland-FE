'use client';
import { useState, useRef, useEffect } from 'react';
import '../../../app/(accounts)/register/style.scss';
import './Profile.scss';
import axios from 'axios';
import Image from 'next/image';
import RegisterImg from '@/public/images/registeration.png';
import API_URL from '@/config';
import swal from 'sweetalert';

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
    const [candidate, setCandidate] = useState<Candidate>({
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
    const [resumeURL, setResumeURL] = useState<string>('');
    const resumeInputRef = useRef<HTMLInputElement | null>(null);

    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoName, setPhotoName] = useState<string>('');
    const [photoURL, setPhotoURL] = useState<string>('');
    const photoInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const fetchCandidate = async () => {
            const id = localStorage.getItem('ID');
            const token = localStorage.getItem('token');
            if (!id || !token) {
                console.error('ID or token is missing');
                return;
            }

            try {
                const response = await axios.get<Candidate>(API_URL + `/api/v1/profiles/candidates/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setCandidate(response.data);
                setResumeURL(API_URL + `/api/v1/profiles/candidates/resumefile/${id}`);
                setPhotoURL(API_URL + `/api/v1/profiles/candidates/image/${id}`);
            } catch (error) {
                console.error('Error fetching candidate data:', error);
            }
        };

        fetchCandidate();
    }, []);

    useEffect(() => {
        const fetchResumeFile = async () => {
            const token = localStorage.getItem('token');
            if (!token || !resumeURL) {
                return;
            }

            try {
                const response = await fetch(resumeURL, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const blob = await response.blob();
                const fileName = String(candidate.resumeLink); 
                const file = new File([blob], String(fileName.split('/').pop()), { type: 'application/pdf' });
                setResumeFile(file);
                setResumeName(file.name);
            } catch (error) {
                console.error('Error fetching resume file:', error);
            }
        };

        fetchResumeFile();
    }, [resumeURL]);

    const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);

    useEffect(() => {
      const fetchPhotoFile = async () => {
        const token = localStorage.getItem('token');
        if (!token || !photoURL) {
            return;
        }
    
        try {
            console.log('Fetching photo file with token:', token);
            const response = await fetch(photoURL, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
            console.log('Photo file fetch response:', response);
    
            if (!response.ok) {
                console.error('Error fetching photo file - response not ok:', response);
                throw new Error('Network response was not ok');
            }
            
            const blob = await response.blob();
            setPhotoBlob(blob);
            const fileName = String(candidate.photoLink); 
            const file = new File([blob], String(fileName.split('/').pop()) , { type: 'image/jpeg' });
            setPhotoFile(file);
            setPhotoName(file.name);
        } catch (error) {
            console.error('Error fetching photo file:', error);
        }
    };    
  
      fetchPhotoFile();
  }, [photoURL]);
  
    const handleFileSelect = (inputRef: React.RefObject<HTMLInputElement>) => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>, setName: React.Dispatch<React.SetStateAction<string>>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setFile(file);
            setName(file.name);
        }
    };

    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>,setBlob: React.Dispatch<React.SetStateAction<Blob | null>> , setName: React.Dispatch<React.SetStateAction<string>>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setFile(file);
            setName(file.name);
            setBlob(file);
        }
    };

    const handleResumeSelect = () => handleFileSelect(resumeInputRef);
    const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, setResumeFile, setResumeName);
    const handlePhotoSelect = () => handleFileSelect(photoInputRef);
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => handleImgChange(e, setPhotoFile, setPhotoBlob, setPhotoName);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCandidate({ ...candidate, [e.target.name]: e.target.value });
    };

    const uploadFile = async (file: File | null, id: string, endpoint: string) => {
        if (!file) return null;

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post<string>(API_URL + `/api/v1/users/files/${endpoint}/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error uploading ${endpoint}:`, error);
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const id = localStorage.getItem('ID');
        const token = localStorage.getItem('token');
        try {
          await axios.put(API_URL + `/api/v1/profiles/candidates/${id}`, {
              "firstName": candidate.firstName,
              "lastName": candidate.lastName,
              "email": candidate.email,
              "description": candidate.description,
              "address": candidate.address,
              "city": candidate.city,
              "country": candidate.country,
              "accountStatus": candidate.accountStatus,
              "phoneNumber": candidate.phoneNumber,
              "jobStatus": candidate.jobStatus,
              "linkedIn": candidate.linkedIn,
              "gitHub": candidate.gitHub,
              "portfolio": candidate.portfolio,
              "blog": candidate.blog,
              "expectedSalary": candidate.expectedSalary,
              "resumeLink": candidate.resumeLink,
              "photoLink": candidate.photoLink 
          }, {
              headers: {
                  Authorization: `Bearer ${token}`,
                  'Content-Type': 'application/json'
              }
          });
          swal('Profile updated successfully!','','success');
      } catch (error) {
          console.error('Error updating profile:', error);
          swal('Failed to update profile.','','error');
      }
        if (!id || !token) {
            swal('Missing ID or token. Please log in again.','','error');
            return;
        }

        let resumeLink = candidate.resumeLink;
        let photoLink = candidate.photoLink;

        if (resumeFile) {
            const uploadedResume = await uploadFile(resumeFile, id, 'upload');
            if (uploadedResume) resumeLink = uploadedResume;
        }

        if (photoFile) {
            //const photo= new File([photoBlob], photoName, { type: 'image/jpeg' });
            const uploadedPhoto = await uploadFile(photoFile, id, 'uploadImg');
            if (uploadedPhoto) {
                photoLink = uploadedPhoto;
                setPhotoURL(API_URL + `/api/v1/profiles/candidates/image/${id}`); 
            }
        }
    };


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
                <p className="error username-error"></p>
                <label htmlFor="lastname">Last name</label>
                <input
                    type="text"
                    name="lastName"
                    id="lastname"
                    placeholder="Enter your last name"
                    value={candidate.lastName}
                    onChange={handleInputChange}
                />
                <p className="error username-error"></p>
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={candidate.email}
                    onChange={handleInputChange}
                />
                <p className="error email-error"></p>
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
                    //pattern="\d*"
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
                    <div onClick={handlePhotoSelect} style={{ cursor: 'pointer', textAlign: 'center' }}>
                    {photoBlob ? (
                    <img
                        src={URL.createObjectURL(photoBlob)}
                        alt="Candidate Photo"
                        style={{ marginLeft: '40px', borderRadius: '20px', width: '250px', height: '280px' }}
                    />
                    ) : (
                    <button
                        type="button"
                        onClick={handlePhotoSelect}
                        style={
                        {backgroundColor: 'rgb(108, 162, 209)'}
                        }
                    >
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
                    <button type="button" style={{backgroundColor: 'rgb(108, 162, 209)'}} onClick={handleResumeSelect}>
                        {resumeName ? resumeName : 'Choose Resume'}
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
                <button className='block' type="submit">Modify</button>
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
