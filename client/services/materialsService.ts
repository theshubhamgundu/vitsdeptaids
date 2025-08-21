export interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  subject: string;
  fileType: 'pdf' | 'doc' | 'ppt' | 'video' | 'image' | 'other';
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

const MATERIALS_STORAGE_KEY = 'studyMaterials';

class MaterialsService {
  private getMaterials(): StudyMaterial[] {
    try {
      const materials = localStorage.getItem(MATERIALS_STORAGE_KEY);
      return materials ? JSON.parse(materials) : [];
    } catch (error) {
      console.error('Error loading materials:', error);
      return [];
    }
  }

  private saveMaterials(materials: StudyMaterial[]): void {
    try {
      localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(materials));
    } catch (error) {
      console.error('Error saving materials:', error);
    }
  }

  private generateId(): string {
    return 'material_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getFileType(fileName: string): 'pdf' | 'doc' | 'ppt' | 'video' | 'image' | 'other' {
    const extension = fileName.toLowerCase().split('.').pop();
    
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'doc':
      case 'docx':
        return 'doc';
      case 'ppt':
      case 'pptx':
        return 'ppt';
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
        return 'video';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'image';
      default:
        return 'other';
    }
  }

  uploadMaterial(
    title: string,
    description: string,
    subject: string,
    year: string,
    semester: string,
    file: File,
    uploadedBy: string,
    uploadedByName: string,
    tags: string[] = []
  ): StudyMaterial {
    const materials = this.getMaterials();

    // In a real app, you would upload the file to a server/cloud storage
    // For this demo, we'll create a mock file URL
    const fileUrl = `https://demo-storage.com/materials/${file.name}`;

    const newMaterial: StudyMaterial = {
      id: this.generateId(),
      title,
      description,
      subject,
      fileType: this.getFileType(file.name),
      fileName: file.name,
      fileSize: file.size,
      fileUrl,
      uploadedBy,
      uploadedByName,
      uploadDate: new Date().toISOString(),
      year,
      semester,
      isActive: true,
      downloadCount: 0,
      tags
    };

    materials.push(newMaterial);
    this.saveMaterials(materials);
    
    return newMaterial;
  }

  getAllMaterials(): StudyMaterial[] {
    return this.getMaterials().filter(m => m.isActive);
  }

  getMaterialsBySubject(subject: string): StudyMaterial[] {
    return this.getMaterials().filter(m => 
      m.subject.toLowerCase() === subject.toLowerCase() && m.isActive
    );
  }

  getMaterialsByYear(year: string): StudyMaterial[] {
    return this.getMaterials().filter(m => 
      m.year === year && m.isActive
    );
  }

  getMaterialsByUploader(uploadedBy: string): StudyMaterial[] {
    return this.getMaterials().filter(m => 
      m.uploadedBy === uploadedBy && m.isActive
    );
  }

  getMaterialById(id: string): StudyMaterial | null {
    return this.getMaterials().find(m => m.id === id && m.isActive) || null;
  }

  updateMaterial(id: string, updates: Partial<StudyMaterial>): boolean {
    const materials = this.getMaterials();
    const index = materials.findIndex(m => m.id === id);
    
    if (index !== -1) {
      materials[index] = { ...materials[index], ...updates };
      this.saveMaterials(materials);
      return true;
    }
    return false;
  }

  deleteMaterial(id: string): boolean {
    const materials = this.getMaterials();
    const index = materials.findIndex(m => m.id === id);
    
    if (index !== -1) {
      materials[index].isActive = false;
      this.saveMaterials(materials);
      return true;
    }
    return false;
  }

  incrementDownloadCount(id: string): void {
    const materials = this.getMaterials();
    const material = materials.find(m => m.id === id);
    
    if (material) {
      material.downloadCount += 1;
      this.saveMaterials(materials);
    }
  }

  searchMaterials(
    query: string,
    filters: {
      subject?: string;
      year?: string;
      semester?: string;
      fileType?: string;
      uploadedBy?: string;
    } = {}
  ): StudyMaterial[] {
    let materials = this.getAllMaterials();

    // Apply text search
    if (query) {
      const searchTerm = query.toLowerCase();
      materials = materials.filter(m =>
        m.title.toLowerCase().includes(searchTerm) ||
        m.description.toLowerCase().includes(searchTerm) ||
        m.subject.toLowerCase().includes(searchTerm) ||
        m.uploadedByName.toLowerCase().includes(searchTerm) ||
        m.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Apply filters
    if (filters.subject) {
      materials = materials.filter(m => 
        m.subject.toLowerCase() === filters.subject!.toLowerCase()
      );
    }

    if (filters.year) {
      materials = materials.filter(m => m.year === filters.year);
    }

    if (filters.semester) {
      materials = materials.filter(m => m.semester === filters.semester);
    }

    if (filters.fileType) {
      materials = materials.filter(m => m.fileType === filters.fileType);
    }

    if (filters.uploadedBy) {
      materials = materials.filter(m => m.uploadedBy === filters.uploadedBy);
    }

    // Sort by upload date (newest first)
    return materials.sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    );
  }

  getSubjects(): string[] {
    const materials = this.getAllMaterials();
    const subjects = Array.from(new Set(materials.map(m => m.subject)));
    return subjects.sort();
  }

  getYears(): string[] {
    const materials = this.getAllMaterials();
    const years = Array.from(new Set(materials.map(m => m.year)));
    return years.sort();
  }

  getSemesters(): string[] {
    const materials = this.getAllMaterials();
    const semesters = Array.from(new Set(materials.map(m => m.semester)));
    return semesters.sort();
  }

  // Initialize with some demo data
  initializeDemoData(): void {
    const existingMaterials = this.getMaterials();
    if (existingMaterials.length === 0) {
      const demoMaterials: StudyMaterial[] = [
        {
          id: 'demo_1',
          title: 'Introduction to Machine Learning',
          description: 'Comprehensive guide to ML fundamentals and algorithms',
          subject: 'Machine Learning',
          fileType: 'pdf',
          fileName: 'ML_Introduction.pdf',
          fileSize: 2048000,
          fileUrl: 'https://demo-storage.com/ml-intro.pdf',
          uploadedBy: 'faculty_1',
          uploadedByName: 'Dr. Smith',
          uploadDate: '2024-01-15T10:00:00Z',
          year: '3rd Year',
          semester: '6th Semester',
          isActive: true,
          downloadCount: 25,
          tags: ['machine learning', 'algorithms', 'fundamentals']
        },
        {
          id: 'demo_2',
          title: 'Data Structures and Algorithms',
          description: 'Complete notes on DSA with examples',
          subject: 'Data Structures',
          fileType: 'pdf',
          fileName: 'DSA_Notes.pdf',
          fileSize: 1536000,
          fileUrl: 'https://demo-storage.com/dsa-notes.pdf',
          uploadedBy: 'faculty_2',
          uploadedByName: 'Prof. Johnson',
          uploadDate: '2024-01-20T14:30:00Z',
          year: '2nd Year',
          semester: '4th Semester',
          isActive: true,
          downloadCount: 42,
          tags: ['data structures', 'algorithms', 'programming']
        },
        {
          id: 'demo_3',
          title: 'Neural Networks Lecture',
          description: 'Video lecture on neural network architectures',
          subject: 'Deep Learning',
          fileType: 'video',
          fileName: 'Neural_Networks.mp4',
          fileSize: 15728640,
          fileUrl: 'https://demo-storage.com/neural-networks.mp4',
          uploadedBy: 'faculty_1',
          uploadedByName: 'Dr. Smith',
          uploadDate: '2024-01-25T09:15:00Z',
          year: '4th Year',
          semester: '8th Semester',
          isActive: true,
          downloadCount: 18,
          tags: ['neural networks', 'deep learning', 'video lecture']
        }
      ];

      this.saveMaterials(demoMaterials);
    }
  }
}

export const materialsService = new MaterialsService();
