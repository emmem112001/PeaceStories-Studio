'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { LogOut, Settings, Plus, Folder, MoreVertical } from 'lucide-react';
import { logout } from '@/lib/auth';
import { useAuthStore } from '@/lib/stores/authStore';
import { useProjectStore } from '@/lib/stores/projectStore';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { projects, setProjects } = useProjectStore();
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`/api/projects?userId=${user.id}`);
      const data = await response.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error: any) {
      toast.error('Logout failed');
    }
  };

  const createNewProject = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: `Untitled Project ${projects.length + 1}`,
          description: 'A new creative project',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setProjects([data.project, ...projects]);
        toast.success('Project created!');
        router.push(`/editor/${data.project.id}`);
      }
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}?userId=${user?.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(projects.filter((p) => p.id !== projectId));
        toast.success('Project deleted');
      }
    } catch (error) {
      toast.error('Failed to delete project');
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">PeaceStories Studio</h1>
            <p className="text-slate-400 text-sm">Welcome, {user?.email}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={createNewProject}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-slate-700 border-t-indigo-500 rounded-full"></div>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center">
            <Folder className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No Projects Yet</h2>
            <p className="text-slate-400 mb-8">Create your first project to get started</p>
            <button
              onClick={createNewProject}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition"
            >
              Create Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-6 hover:border-indigo-500 transition group cursor-pointer"
              >
                <div className="aspect-video bg-slate-700 rounded-lg mb-4 flex items-center justify-center">
                  {project.thumbnail_url ? (
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Folder className="w-12 h-12 text-slate-500" />
                  )}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {project.description || 'No description'}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/editor/${project.id}`}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition text-center"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => setDeleteConfirm(project.id)}
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-2 rounded-lg transition"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {deleteConfirm === project.id && (
                  <div className="mt-4 p-4 bg-red-600/10 border border-red-600 rounded-lg">
                    <p className="text-red-400 text-sm mb-3">Delete this project?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
