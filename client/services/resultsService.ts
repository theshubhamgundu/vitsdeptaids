import { tables } from "@/lib/supabase";

export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  hallTicket: string;
  examType: 'Mid-term' | 'End-term' | 'Internal Assessment' | 'Project' | 'Quiz';
  subject: string;
  year: string;
  semester: string;
  marks: number;
  maxMarks: number;
  grade: string;
  examDate: string;
  publishedDate: string;
  uploadedBy: string;
  uploadedByName: string;
  published: boolean;
}

class ResultsService {
  private getResults(): StudentResult[] {
    try {
      const results = localStorage.getItem('studentResults');
      return results ? JSON.parse(results) : [];
    } catch (error) {
      console.error('Error getting results from localStorage:', error);
      return [];
    }
  }

  private saveResults(results: StudentResult[]): void {
    try {
      localStorage.setItem('studentResults', JSON.stringify(results));
    } catch (error) {
      console.error('Error saving results to localStorage:', error);
    }
  }

  // Get all results
  getAllResults(): StudentResult[] {
    return this.getResults();
  }

  // Get results by student ID
  getResultsByStudent(studentId: string): StudentResult[] {
    const results = this.getResults();
    return results.filter(result => result.studentId === studentId);
  }

  // Get results by subject
  getResultsBySubject(subject: string): StudentResult[] {
    const results = this.getResults();
    return results.filter(result => result.subject === subject);
  }

  // Get results by year
  getResultsByYear(year: string): StudentResult[] {
    const results = this.getResults();
    return results.filter(result => result.year === year);
  }

  // Add new result
  addResult(result: Omit<StudentResult, 'id'>): StudentResult {
    const results = this.getResults();
    const newResult: StudentResult = {
      ...result,
      id: crypto.randomUUID(),
      published: false
    };
    
    results.push(newResult);
    this.saveResults(results);
    return newResult;
  }

  // Update result
  updateResult(id: string, updates: Partial<StudentResult>): StudentResult | null {
    const results = this.getResults();
    const index = results.findIndex(result => result.id === id);
    
    if (index === -1) return null;
    
    results[index] = { ...results[index], ...updates };
    this.saveResults(results);
    return results[index];
  }

  // Delete result
  deleteResult(id: string): boolean {
    const results = this.getResults();
    const filteredResults = results.filter(result => result.id !== id);
    
    if (filteredResults.length === results.length) {
      return false; // No result was deleted
    }
    
    this.saveResults(filteredResults);
    return true;
  }

  // Publish result
  publishResult(id: string): boolean {
    const result = this.updateResult(id, { 
      published: true, 
      publishedDate: new Date().toISOString() 
    });
    return result !== null;
  }

  // Bulk upload results from CSV/Excel data
  bulkUploadResults(resultsData: {
    studentId: string;
    studentName: string;
    hallTicket: string;
    subject: string;
    marks: number;
    maxMarks: number;
    examType: string;
    examDate: string;
  }[], uploadedBy: string, uploadedByName: string): StudentResult[] {
    const results = this.getResults();
    const newResults: StudentResult[] = [];
    
    resultsData.forEach(data => {
      const newResult: StudentResult = {
        id: crypto.randomUUID(),
        studentId: data.studentId,
        studentName: data.studentName,
        hallTicket: data.hallTicket,
        examType: data.examType as any,
        subject: data.subject,
        year: '3rd Year', // Default, should be extracted from data
        semester: '6th Semester', // Default, should be extracted from data
        marks: data.marks,
        maxMarks: data.maxMarks,
        grade: this.calculateGrade((data.marks / data.maxMarks) * 100),
        examDate: data.examDate,
        publishedDate: new Date().toISOString(),
        uploadedBy,
        uploadedByName,
        published: false
      };
      
      newResults.push(newResult);
      results.push(newResult);
    });
    
    this.saveResults(results);
    return newResults;
  }

  // Calculate grade based on percentage
  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'F';
  }

  // Get result statistics
  getResultStats(): {
    total: number;
    published: number;
    unpublished: number;
    bySubject: Record<string, number>;
    byYear: Record<string, number>;
  } {
    const results = this.getResults();
    
    const stats = {
      total: results.length,
      published: results.filter(r => r.published).length,
      unpublished: results.filter(r => !r.published).length,
      bySubject: {} as Record<string, number>,
      byYear: {} as Record<string, number>
    };
    
    results.forEach(result => {
      stats.bySubject[result.subject] = (stats.bySubject[result.subject] || 0) + 1;
      stats.byYear[result.year] = (stats.byYear[result.year] || 0) + 1;
    });
    
    return stats;
  }
}

export const resultsService = new ResultsService();
export default resultsService;
