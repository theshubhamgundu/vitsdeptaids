import { tables } from "@/lib/supabase";

export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  subject: string;
  fileType: 'pdf' | 'doc' | 'ppt' | 'video' | 'link';
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadDate: string;
  year: string;
  semester: string;
  isActive: boolean;
  downloadCount: number;
  tags: string[];
}

class MaterialsService {
  private getMaterials(): StudyMaterial[] {
    try {
      const materials = localStorage.getItem('studyMaterials');
      return materials ? JSON.parse(materials) : [];
    } catch (error) {
      console.error('Error getting materials from localStorage:', error);
      return [];
    }
  }

  private saveMaterials(materials: StudyMaterial[]): void {
    try {
      localStorage.setItem('studyMaterials', JSON.stringify(materials));
    } catch (error) {
      console.error('Error saving materials to localStorage:', error);
    }
  }

  // Get all materials
  getAllMaterials(): StudyMaterial[] {
    return this.getMaterials().filter(material => material.isActive);
  }

  // Get materials by subject
  getMaterialsBySubject(subject: string): StudyMaterial[] {
    const materials = this.getMaterials();
    return materials.filter(material => 
      material.subject.toLowerCase() === subject.toLowerCase() && 
      material.isActive
    );
  }

  // Get materials by year
  getMaterialsByYear(year: string): StudyMaterial[] {
    const materials = this.getMaterials();
    return materials.filter(material => 
      material.year === year && 
      material.isActive
    );
  }

  // Get materials by semester
  getMaterialsBySemester(semester: string): StudyMaterial[] {
    const materials = this.getMaterials();
    return materials.filter(material => 
      material.semester === semester && 
      material.isActive
    );
  }

  // Get materials by faculty
  getMaterialsByFaculty(facultyId: string): StudyMaterial[] {
    const materials = this.getMaterials();
    return materials.filter(material => 
      material.uploadedBy === facultyId && 
      material.isActive
    );
  }

  // Add new material
  addMaterial(material: Omit<StudyMaterial, 'id' | 'uploadDate' | 'downloadCount'>): StudyMaterial {
    const materials = this.getMaterials();
    const newMaterial: StudyMaterial = {
      ...material,
      id: crypto.randomUUID(),
      uploadDate: new Date().toISOString(),
      downloadCount: 0
    };
    
    materials.push(newMaterial);
    this.saveMaterials(materials);
    return newMaterial;
  }

  // Update material
  updateMaterial(id: string, updates: Partial<StudyMaterial>): StudyMaterial | null {
    const materials = this.getMaterials();
    const index = materials.findIndex(material => material.id === id);
    
    if (index === -1) return null;
    
    materials[index] = { ...materials[index], ...updates };
    this.saveMaterials(materials);
    return materials[index];
  }

  // Delete material (soft delete)
  deleteMaterial(id: string): boolean {
    const material = this.updateMaterial(id, { isActive: false });
    return material !== null;
  }

  // Increment download count
  incrementDownloadCount(id: string): boolean {
    const material = this.getMaterials().find(m => m.id === id);
    if (!material) return false;
    
    material.downloadCount += 1;
    this.saveMaterials(this.getMaterials());
    return true;
  }

  // Search materials
  searchMaterials(query: string): StudyMaterial[] {
    const materials = this.getMaterials();
    const searchTerm = query.toLowerCase();
    
    return materials.filter(material => 
      material.title.toLowerCase().includes(searchTerm) ||
      material.description.toLowerCase().includes(searchTerm) ||
      material.subject.toLowerCase().includes(searchTerm) ||
      material.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Get available subjects
  getSubjects(): string[] {
    const materials = this.getMaterials();
    if (materials.length === 0) {
      return [
        "Machine Learning",
        "Deep Learning", 
        "Data Structures",
        "Algorithms",
        "Database Systems",
        "Computer Networks",
        "Operating Systems",
        "Software Engineering"
      ];
    }
    const subjects = new Set(materials.map(material => material.subject));
    return Array.from(subjects).sort();
  }

  // Get available years
  getYears(): string[] {
    const materials = this.getMaterials();
    if (materials.length === 0) {
      return ["1st Year", "2nd Year", "3rd Year", "4th Year"];
    }
    const years = new Set(materials.map(material => material.year));
    return Array.from(years).sort();
  }

  // Get available semesters
  getSemesters(): string[] {
    const materials = this.getMaterials();
    const semesters = new Set(materials.map(material => material.semester));
    return Array.from(semesters).sort();
  }

  // Get material statistics
  getMaterialStats(): {
    total: number;
    bySubject: Record<string, number>;
    byYear: Record<string, number>;
    byFileType: Record<string, number>;
    totalDownloads: number;
  } {
    const materials = this.getMaterials();
    
    const stats = {
      total: materials.length,
      bySubject: {} as Record<string, number>,
      byYear: {} as Record<string, number>,
      byFileType: {} as Record<string, number>,
      totalDownloads: 0
    };
    
    materials.forEach(material => {
      stats.bySubject[material.subject] = (stats.bySubject[material.subject] || 0) + 1;
      stats.byYear[material.year] = (stats.byYear[material.year] || 0) + 1;
      stats.byFileType[material.fileType] = (stats.byFileType[material.fileType] || 0) + 1;
      stats.totalDownloads += material.downloadCount;
    });
    
    return stats;
  }

  // Get popular materials (by download count)
  getPopularMaterials(limit: number = 10): StudyMaterial[] {
    const materials = this.getMaterials();
    return materials
      .sort((a, b) => b.downloadCount - a.downloadCount)
      .slice(0, limit);
  }

  // Get recent materials
  getRecentMaterials(limit: number = 10): StudyMaterial[] {
    const materials = this.getMaterials();
    return materials
      .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
      .slice(0, limit);
  }
}

export const materialsService = new MaterialsService();
export default materialsService;
