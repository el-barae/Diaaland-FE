'use client'
import { useState, useRef, useEffect } from 'react';
import '../../../app/(accounts)/register/style.scss';
import './Profile.scss'
import Image from 'next/image'
import RegisterImg from '@/public/images/registeration.png'
import axios from 'axios';
import swal from 'sweetalert';
import API_URL from '@/config';

type Customer={
		id: number,
        name: string,
        email: string,
        address: string,
        city: string,
        country: string,
        phoneNumber: string,
        url: string,
        description: string,
        logo?: string
}

const Profile = () => {
    const [customer, setCustomer] = useState<Customer>({
        id: 0,
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
        phoneNumber: '',
        url: '',
        description: '',
        logo: ''
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoBlob, setLogoBlob] = useState<Blob | null>(null);
    const [logoName, setLogoName] = useState<string>('');
    const logoInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            const id = localStorage.getItem('ID');
			const token = localStorage.getItem('token');
            if (!id || !token) {
                console.error('ID or token is missing');
                return;
            }

            try {
                const response = await axios.get<Customer>(API_URL+"/api/v1/customers/"+id, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setCustomer(response.data);

                if (response.data.logo) {
                    fetchLogoFile();
                }
            } catch (error) {
                console.error('Error fetching customer data:', error);
            }
        };

        fetchCustomer();
    }, []);

    const fetchLogoFile = async () => {
		const id = localStorage.getItem('ID')
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        try {
            const response = await fetch(API_URL+'/api/v1/customers/logo/'+id, {
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
            setLogoBlob(blob);
            const fileName = String(customer.logo);
            const file = new File([blob], String(fileName.split('/').pop()), { type: 'image/jpeg' });
            setLogoFile(file);
            setLogoName(file.name);
        } catch (error) {
            console.error('Error fetching logo file:', error);
        }
    };

    const handleFileSelect = (inputRef: React.RefObject<HTMLInputElement>) => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>, setBlob: React.Dispatch<React.SetStateAction<Blob | null>>, setName: React.Dispatch<React.SetStateAction<string>>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setFile(file);
            setName(file.name);
            setBlob(file);
        }
    };

    const handleLogoSelect = () => handleFileSelect(logoInputRef);
    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => handleImgChange(e, setLogoFile, setLogoBlob, setLogoName);

    const uploadFile = async (file: File | null, id: string) => {
        if (!file) return null;

        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post<string>(`${API_URL}/api/v1/files/uploadLogo/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Error uploading logo:`, error);
            return null;
        }
    };

    const uploadLogo = async (file: File | null, id: string) => {
        return uploadFile(file, id);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const id = localStorage.getItem('ID'); 

        try {
            let logo = customer.logo;
			const token = localStorage.getItem('token');
			await axios.put(`${API_URL}/api/v1/customers/${id}`, {
				"name": customer.name,
				"email": customer.email,
				"address": customer.address,
				"city": customer.city,
				"country": customer.country,
				"phoneNumber": customer.phoneNumber,
				"url": customer.url,
				"description": customer.description,
				"logo": customer.logo
		}, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});

            if (logoFile) {
                const uploadedLogo = await uploadLogo(logoFile, id!);
                if (uploadedLogo) {
                    logo = uploadedLogo;
                }
            }

            swal('Profile updated successfully!','','success');
        } catch (error) {
            console.error('Error updating profile:', error);
            swal('Failed to update profile.','','error');
        }
    };

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    return (
        <form onSubmit={handleSubmit} className="form-candidate">

<div className="div1">
                <h1>Profile</h1>
                <br />
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your name"
                    value={customer.name}
                    onChange={handleInputChange}
                />
                <label htmlFor="email">Email</label>
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={customer.email}
                    onChange={handleInputChange}
                    required
                />
                <label htmlFor="address">Address</label>
                <input
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Enter your address"
                    value={customer.address}
                    onChange={handleInputChange}
                />
                <label htmlFor="city">City</label>
                <input
                    type="text"
                    name="city"
                    id="city"
                    placeholder="Enter your city"
                    value={customer.city}
                    onChange={handleInputChange}

                />
                <label htmlFor="country">Country</label>
                <input
                    type="text"
                    name="country"
                    id="country"
                    placeholder="Enter your country"
                    value={customer.country}
                    onChange={handleInputChange}
                />
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    placeholder="Enter your phone number"
                    value={customer.phoneNumber}
                    onChange={handleInputChange}
                />
                <label htmlFor="url">Website URL</label>
                <input
                    type="text"
                    name="url"
                    id="url"
                    placeholder="Enter your website URL"
                    value={customer.url}
                    onChange={handleInputChange}
                />
            </div>
            <div className="div2">
                <label htmlFor="description">Description</label>
                <textarea
                    name="description"
                    id="description"
                    placeholder="Enter a description"
                    value={customer.description}
                    onChange={handleInputChange}
                ></textarea>
                <label htmlFor="logo">Logo</label>
                <input
                    type="file"
                    ref={logoInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleLogoChange}
                />
                <div onClick={handleLogoSelect} style={{ cursor: 'pointer', textAlign: 'center' }}>
                    {logoBlob ? (
                        <img
                            src={URL.createObjectURL(logoBlob)}
                            alt="Customer Logo"
                            style={{ marginLeft: '40px', borderRadius: '20px', width: '250px', height: '280px' }}
                        />
                    ) : (
                        <button
                            type="button"
                            onClick={handleLogoSelect}
                            style={{ backgroundColor: 'rgb(108, 162, 209)' }}
                        >
                            Choose Logo
                        </button>
                    )}
                </div>

				<button type="submit">Modify</button>
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
};

export default Profile;
