export interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  hallTicket: string;
  examType: 'Mid-term' | 'End-term' | 'Internal' | 'Assignment';
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
}

export interface StudentPerformance {
  studentId: string;
  overallCGPA: number;
  semesterGPA: number;
  totalCredits: number;
  currentSemester: string;
  results: StudentResult[];
  subjectWisePerformance: {
    subject: string;
    totalMarks: number;
    maxMarks: number;
    percentage: number;
    grade: string;
  }[];
}

const RESULTS_STORAGE_KEY = 'studentResults';

class ResultsService {
  private getResults(): StudentResult[] {
    try {
      const results = localStorage.getItem(RESULTS_STORAGE_KEY);
      return results ? JSON.parse(results) : [];
    } catch (error) {
      console.error('Error loading results:', error);
      return [];
    }
  }

  private saveResults(results: StudentResult[]): void {
    try {
      localStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(results));
    } catch (error) {
      console.error('Error saving results:', error);
    }
  }

  private generateId(): string {
    return 'result_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  }

  addResult(
    studentId: string,
    studentName: string,
    hallTicket: string,
    examType: 'Mid-term' | 'End-term' | 'Internal' | 'Assignment',
    subject: string,
    year: string,
    semester: string,
    marks: number,
    maxMarks: number,
    examDate: string,
    uploadedBy: string,
    uploadedByName: string
  ): StudentResult {
    const results = this.getResults();
    const percentage = (marks / maxMarks) * 100;

    const newResult: StudentResult = {
      id: this.generateId(),
      studentId,
      studentName,
      hallTicket,
      examType,
      subject,
      year,
      semester,
      marks,
      maxMarks,
      grade: this.calculateGrade(percentage),
      examDate,
      publishedDate: new Date().toISOString(),
      uploadedBy,
      uploadedByName
    };

    results.push(newResult);
    this.saveResults(results);
    
    return newResult;
  }

  getStudentResults(studentId: string): StudentResult[] {
    return this.getResults().filter(r => r.studentId === studentId);
  }

  getStudentPerformance(studentId: string): StudentPerformance {
    const studentResults = this.getStudentResults(studentId);
    
    if (studentResults.length === 0) {
      return {
        studentId,
        overallCGPA: 0,
        semesterGPA: 0,
        totalCredits: 0,
        currentSemester: '',
        results: [],
        subjectWisePerformance: []
      };
    }

    // Calculate subject-wise performance
    const subjectMap = new Map<string, { totalMarks: number; maxMarks: number; count: number }>();
    
    studentResults.forEach(result => {
      const key = result.subject;
      const existing = subjectMap.get(key) || { totalMarks: 0, maxMarks: 0, count: 0 };
      
      subjectMap.set(key, {
        totalMarks: existing.totalMarks + result.marks,
        maxMarks: existing.maxMarks + result.maxMarks,
        count: existing.count + 1
      });
    });

    const subjectWisePerformance = Array.from(subjectMap.entries()).map(([subject, data]) => {
      const percentage = (data.totalMarks / data.maxMarks) * 100;
      return {
        subject,
        totalMarks: data.totalMarks,
        maxMarks: data.maxMarks,
        percentage,
        grade: this.calculateGrade(percentage)
      };
    });

    // Calculate overall performance
    const totalMarks = studentResults.reduce((sum, r) => sum + r.marks, 0);
    const totalMaxMarks = studentResults.reduce((sum, r) => sum + r.maxMarks, 0);
    const overallPercentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;
    
    // Convert percentage to CGPA (assuming 10-point scale)
    const overallCGPA = overallPercentage / 10;

    // Get current semester (latest)
    const currentSemester = studentResults.length > 0 ? 
      studentResults.sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime())[0].semester : '';

    return {
      studentId,
      overallCGPA: parseFloat(overallCGPA.toFixed(2)),
      semesterGPA: parseFloat(overallCGPA.toFixed(2)), // Simplified for demo
      totalCredits: studentResults.length * 3, // Assuming 3 credits per subject
      currentSemester,
      results: studentResults.sort((a, b) => new Date(b.examDate).getTime() - new Date(a.examDate).getTime()),
      subjectWisePerformance
    };
  }

  getResultsBySubject(subject: string): StudentResult[] {
    return this.getResults().filter(r => r.subject.toLowerCase() === subject.toLowerCase());
  }

  getResultsBySemester(semester: string): StudentResult[] {
    return this.getResults().filter(r => r.semester === semester);
  }

  getAllResults(): StudentResult[] {
    return this.getResults().sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
  }

  updateResult(id: string, updates: Partial<StudentResult>): boolean {
    const results = this.getResults();
    const index = results.findIndex(r => r.id === id);
    
    if (index !== -1) {
      results[index] = { ...results[index], ...updates };
      // Recalculate grade if marks changed
      if (updates.marks !== undefined || updates.maxMarks !== undefined) {
        const percentage = (results[index].marks / results[index].maxMarks) * 100;
        results[index].grade = this.calculateGrade(percentage);
      }
      this.saveResults(results);
      return true;
    }
    return false;
  }

  deleteResult(id: string): boolean {
    const results = this.getResults();
    const filteredResults = results.filter(r => r.id !== id);
    
    if (filteredResults.length !== results.length) {
      this.saveResults(filteredResults);
      return true;
    }
    return false;
  }

  // Initialize with demo data
  initializeDemoData(): void {
    const existingResults = this.getResults();
    if (existingResults.length === 0) {
      // Get some students from localStorage
      const storedStudents = localStorage.getItem('students');
      const students = storedStudents ? JSON.parse(storedStudents) : [];
      
      const demoResults: StudentResult[] = [];
      
      // Create demo results for first few students
      students.slice(0, 3).forEach((student: any, studentIndex: number) => {
        const subjects = ['Machine Learning', 'Data Structures', 'Database Systems', 'Computer Networks'];
        const examTypes: ('Mid-term' | 'End-term')[] = ['Mid-term', 'End-term'];
        
        subjects.forEach((subject, subjectIndex) => {
          examTypes.forEach((examType, examIndex) => {
            const baseMarks = 70 + (studentIndex * 5) + (subjectIndex * 2);
            const marks = Math.min(95, baseMarks + Math.floor(Math.random() * 15));
            const maxMarks = 100;
            
            demoResults.push({
              id: `demo_result_${studentIndex}_${subjectIndex}_${examIndex}`,
              studentId: student.id,
              studentName: student.name || student.fullName,
              hallTicket: student.hallTicket,
              examType,
              subject,
              year: student.year || '3rd Year',
              semester: student.semester || '6th Semester',
              marks,
              maxMarks,
              grade: this.calculateGrade((marks / maxMarks) * 100),
              examDate: new Date(2024, 0, 15 + (examIndex * 30)).toISOString(),
              publishedDate: new Date(2024, 0, 20 + (examIndex * 30)).toISOString(),
              uploadedBy: 'faculty_1',
              uploadedByName: 'Dr. Smith'
            });
          });
        });
      });

      this.saveResults(demoResults);
    }
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
    const newResults: StudentResult[] = [];
    
    resultsData.forEach(data => {
      const result = this.addResult(
        data.studentId,
        data.studentName,
        data.hallTicket,
        data.examType as any,
        data.subject,
        '3rd Year', // Default values
        '6th Semester',
        data.marks,
        data.maxMarks,
        data.examDate,
        uploadedBy,
        uploadedByName
      );
      newResults.push(result);
    });

    return newResults;
  }
}

export const resultsService = new ResultsService();
