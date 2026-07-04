import { create } from 'zustand';
import { Project, GeneratedAsset } from '../types';

interface ProjectStore {
  projects: Project[];
  currentProject: Project | null;
  assets: GeneratedAsset[];
  loading: boolean;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addAsset: (asset: GeneratedAsset) => void;
  setAssets: (assets: GeneratedAsset[]) => void;
  setLoading: (loading: boolean) => void;
}

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  currentProject: null,
  assets: [],
  loading: false,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (project) => set({ currentProject: project }),
  addAsset: (asset) => set((state) => ({ assets: [...state.assets, asset] })),
  setAssets: (assets) => set({ assets }),
  setLoading: (loading) => set({ loading }),
}));
