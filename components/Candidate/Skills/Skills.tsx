'use client'
import './Skills.scss'
import { useState } from "react"
import React from 'react';
import { useCandidateContext } from '@/contexts/CandidateContext'
import { useAPIMutation, useAPIQuery } from '@/hooks/useOptimizedAPI'
import API_URL from '@/config';
import axios from "axios";

interface Skill {
  id: number;
  name: string;
  type: string;
}

interface RepeatClassNTimesProps {
  className: string;
  n: number;
  skillsData: Skill[];
}

interface RepeatClassNTimesProps1 {
  className: string;
  n: number;
  skillsAll: Skill[];
}

const Skills = () => {
  const [skill, setSkill] = useState('')
  const [score, setScore] = useState(0)
  const { skills, candidateId, refreshSkills } = useCandidateContext();

  // Récupérer toutes les compétences disponibles
  const { data: allSkills, loading: loadingAllSkills } = useAPIQuery<Skill[]>(
    `${API_URL}/api/v1/profiles/skills`,
    {
      cacheKey: 'all-skills',
      enabled: !!candidateId
    }
  );

  // Filtrer les compétences déjà ajoutées
  const safeSkills = Array.isArray(skills) ? skills : [];

const skillsAll = (allSkills || []).filter(
  (skill: Skill) => !safeSkills.some(
    (candidateSkill: Skill) => candidateSkill.id === skill.id
  )
);


  // Mutation pour ajouter une compétence
  const addSkillMutation = useAPIMutation(
    async (skillName: string) => {
      const token = localStorage.getItem("token");
      
      // Récupérer l'ID de la compétence
      const response = await axios.get(`${API_URL}/api/v1/profiles/skills/id/${skillName}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const skillId = response.data;

      // Ajouter la compétence au candidat
      return axios.post(`${API_URL}/api/v1/profiles/candidate-skills`, {
        score: score,
        candidate: { id: candidateId },
        skill: { id: skillId }
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    {
      onSuccess: async () => {
        await refreshSkills();
        setSkill('');
        setScore(0);
      },
      onError: (error: any) => {
        alert(error.message);
      },
      invalidatePatterns: ['candidate-skills', 'all-skills']
    }
  );

  // Mutation pour supprimer une compétence
  const deleteSkillMutation = useAPIMutation(
    async (skillId: number) => {
      const token = localStorage.getItem("token");
      return axios.delete(`${API_URL}/api/v1/profiles/candidate-skills/${candidateId}/${skillId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    {
      onSuccess: async () => {
        await refreshSkills();
      },
      onError: (error) => {
        console.error("Error deleting skill:", error);
      },
      invalidatePatterns: ['candidate-skills']
    }
  );

  const handleAddSkill = async (e: any, skillName: string) => {
    e.preventDefault();
    if (!candidateId) {
      alert("Please log in again.");
      return;
    }
    addSkillMutation.mutate(skillName);
  }

  const handleDelete = async (e: any, skillId: number) => {
    e.preventDefault();
    deleteSkillMutation.mutate(skillId);
  }

  const RepeatClassNTimes: React.FC<RepeatClassNTimesProps> = ({ className, n, skillsData }) => {
    if (skillsData.length !== 0)
      return (
        <>
          {skillsData.map((skill) => (
            <div key={skill.id} className={className}>
              <h1>{skill.name}:</h1>
              <p>type: {skill.type}</p>
              <button 
                onClick={(e) => handleDelete(e, skill.id)}
                disabled={deleteSkillMutation.loading}
              >
                {deleteSkillMutation.loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))}
        </>
      )
    return null;
  }

  const RepeatClassNTimes1: React.FC<RepeatClassNTimesProps1> = ({ className, n, skillsAll }) => {
    if (skillsAll.length !== 0)
      return (
        <>
          {skillsAll.map((skill) => (
            <option key={skill.name} value={skill.name}>{skill.name}</option>
          ))}
        </>
      )
    return null;
  }

  return (
    <div className="jobs">
      <h1>Add skills</h1>
      <div className="add">
        <select 
  id="skills" 
  name="skills" 
  value={skill} 
  onChange={(e) => setSkill(e.target.value)}
  disabled={loadingAllSkills}
>
  {skillsAll.length === 0 && <option value="">Loading skills...</option>}
  <RepeatClassNTimes1 className="list" n={skillsAll.length} skillsAll={skillsAll} />
</select>
        <button 
  onClick={(e) => handleAddSkill(e, skill)}
  disabled={addSkillMutation.loading || !skill || loadingAllSkills}  // ✅ Also disabled while loading skills
>
  {addSkillMutation.loading ? 'Adding...' : 'Add skill'}
</button>
      </div>
      <h1>My skills</h1>
      <div className='lists'>
        <RepeatClassNTimes className="list" n={skills.length} skillsData={skills} />
      </div>
    </div>
  )
}

export default Skills;