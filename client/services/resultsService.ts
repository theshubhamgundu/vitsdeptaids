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

export interface StudentPerformance {
  overallCGPA: number;
  currentSemester: string;
  results: StudentResult[];
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

  // Compute performance view for a student
  getStudentPerformance(studentId: string): StudentPerformance {
    const results = this.getResultsByStudent(studentId);

    // Basic aggregates from available results
    const overallCGPA = results.length > 0
      ? this.calculateCGPA(results)
      : 0;

    const currentSemester = results.length > 0
      ? (results[results.length - 1].semester || "1st Semester")
      : "1st Semester";

    return {
      overallCGPA: parseFloat(overallCGPA.toFixed(2)),
      currentSemester,
      results,
    };
  }

  private calculateCGPA(results: StudentResult[]): number {
    // Simple mapping by grade or percentage
    const gradePoints = (r: StudentResult) => {
      const pct = (r.marks / r.maxMarks) * 100;
      if (pct >= 90) return 10;
      if (pct >= 80) return 9;
      if (pct >= 70) return 8;
      if (pct >= 60) return 7;
      if (pct >= 50) return 6;
      if (pct >= 40) return 5;
      return 4;
    };

    if (results.length === 0) return 0;
    const total = results.reduce((sum, r) => sum + gradePoints(r), 0);
    return total / results.length;
  }

  // Get results by subject
  getResultsBySubject(subject: string): StudentResult[] {
    const results = this.getResults();
    return results.filter(result => result.subject === subject);
  }

  // Get results by hall ticket number
  async getStudentResultsByHallTicket(hallTicket: string): Promise<StudentResult[]> {
    try {
      // First try to get from Supabase if available
      const resultsTable = tables.results();
      if (resultsTable) {
        const { data, error } = await resultsTable
          .select("*")
          .eq("hall_ticket", hallTicket)
          .order("exam_date", { ascending: false });
        
        if (error) {
          console.log("Supabase error, falling back to localStorage:", error);
        } else if (data) {
          return data.map(result => ({
            id: result.id,
            studentId: result.student_id,
            studentName: result.student_name,
            hallTicket: result.hall_ticket,
            examType: result.exam_type,
            subject: result.subject,
            year: result.year,
            semester: result.semester,
            marks: result.marks,
            maxMarks: result.max_marks,
            grade: result.grade,
            examDate: result.exam_date,
            publishedDate: result.published_date,
            uploadedBy: result.uploaded_by,
            uploadedByName: result.uploaded_by_name,
            published: result.published
          }));
        }
      }
      
      // Fallback to localStorage
      const results = this.getResults();
      return results.filter(result => result.hallTicket === hallTicket);
    } catch (error) {
      console.error('Error getting results by hall ticket:', error);
      // Fallback to localStorage
      const results = this.getResults();
      return results.filter(result => result.hallTicket === hallTicket);
    }
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
