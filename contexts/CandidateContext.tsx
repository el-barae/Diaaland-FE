// ============================================
// 📁 contexts/CandidateContext.tsx - COMPLETE VERSION
// ============================================
'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import API_URL from '@/config';
import { jwtDecode } from "jwt-decode";

interface MyToken {
  sub: string;
  id: number;
  name: string;
  role: string;
  exp: number;
}

interface CandidateContextType {
  // Données de base
  candidateName: string;
  candidateEmail: string;
  candidateId: number | null;
  
  // Jobs et favoris
  jobs: any[];
  favoris: any[];
  refreshJobs: () => Promise<void>;
  refreshFavoris: () => Promise<void>;
  
  // Compétences
  skills: any[];
  refreshSkills: () => Promise<void>;
  
  // Projets
  projects: any[];
  refreshProjects: () => Promise<void>;
  
  // Expériences
  experiences: any[];
  refreshExperiences: () => Promise<void>;
  
  // Matchings
  matches: any[];
  refreshMatches: () => Promise<void>;
  
  // Profil
  profile: any;
  refreshProfile: () => Promise<void>;
  
  // Éducations, certificats, liens
  educations: any[];
  certificates: any[];
  otherLinks: any[];
  refreshEducations: () => Promise<void>;
  refreshCertificates: () => Promise<void>;
  refreshOtherLinks: () => Promise<void>;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

export const CandidateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [candidateName, setCandidateName] = useState<string>('');
  const [candidateEmail, setCandidateEmail] = useState<string>('');
  const [candidateId, setCandidateId] = useState<number | null>(null);
  
  const [jobs, setJobs] = useState<any[]>([]);
  const [favoris, setFavoris] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [educations, setEducations] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [otherLinks, setOtherLinks] = useState<any[]>([]);

  // Initialisation du context au montage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode<MyToken>(token);
      setCandidateName(decoded.name);
      setCandidateEmail(decoded.sub);
      setCandidateId(decoded.id);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  // Charger toutes les données quand l'ID est disponible
  useEffect(() => {
    if (candidateId) {
      loadAllData();
    }
  }, [candidateId]);

  const loadAllData = async () => {
    await Promise.all([
      refreshJobs(),
      refreshFavoris(),
      refreshSkills(),
      refreshProjects(),
      refreshExperiences(),
      refreshMatches(),
      refreshProfile(),
      refreshEducations(),
      refreshCertificates(),
      refreshOtherLinks()
    ]);
  };

  // ========================================
  // Fonctions de refresh pour chaque type
  // ========================================

  const refreshJobs = async () => {
    if (!candidateId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/jobs/candidate-jobs/byCandidate/${candidateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setJobs(response.data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const refreshFavoris = async () => {
    if (!candidateId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/jobs/favoris/${candidateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavoris(response.data);
    } catch (error) {
      console.error("Error fetching favoris:", error);
    }
  };

 const refreshSkills = async () => {
  if (!candidateId) return;
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${API_URL}/api/v1/profiles/candidate-skills/byCandidate/${candidateId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // 🧠 Ensure data is always an array
    const data = Array.isArray(response.data)
      ? response.data
      : response.data?.skills || [];

    setSkills(data);
  } catch (error) {
    console.error("Error fetching skills:", error);
    setSkills([]); // Prevent runtime errors
  }
};


  const refreshProjects = async () => {
    if (!candidateId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/profiles/projects/byCandidate/${candidateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(response.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const refreshExperiences = async () => {
    if (!candidateId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/profiles/experiences/byCandidate/${candidateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setExperiences(response.data);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    }
  };

  const refreshMatches = async () => {
    if (!candidateId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/jobs/matching/candidate/${candidateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMatches(response.data);
    } catch (error) {
      console.error("Error fetching matches:", error);
    }
  };

  const refreshProfile = async () => {
    if (!candidateId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/profiles/candidates/${candidateId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const refreshEducations = async () => {
    if (!candidateId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/profiles/educations`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEducations(response.data);
    } catch (error) {
      console.error("Error fetching educations:", error);
    }
  };

  const refreshCertificates = async () => {
    if (!candidateId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/profiles/certificates`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCertificates(response.data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const refreshOtherLinks = async () => {
    if (!candidateId) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/api/v1/profiles/other_links`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOtherLinks(response.data);
    } catch (error) {
      console.error("Error fetching other links:", error);
    }
  };

  const value: CandidateContextType = {
    candidateName,
    candidateEmail,
    candidateId,
    jobs,
    favoris,
    skills,
    projects,
    experiences,
    matches,
    profile,
    educations,
    certificates,
    otherLinks,
    refreshJobs,
    refreshFavoris,
    refreshSkills,
    refreshProjects,
    refreshExperiences,
    refreshMatches,
    refreshProfile,
    refreshEducations,
    refreshCertificates,
    refreshOtherLinks
  };

  return (
    <CandidateContext.Provider value={value}>
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidateContext = () => {
  const context = useContext(CandidateContext);
  if (context === undefined) {
    throw new Error('useCandidateContext must be used within a CandidateProvider');
  }
  return context;
};