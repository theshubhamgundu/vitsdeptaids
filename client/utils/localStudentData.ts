// Local fallback student data for testing when database is unavailable
export const localStudentData = [
  { ht_no: "22891A7205", student_name: "BADINENI HEMANTH", year: "3rd Year" },
  {
    ht_no: "23891A7201",
    student_name: "AEMIREDDY DEEKSHITHA",
    year: "3rd Year",
  },
  {
    ht_no: "23891A7202",
    student_name: "AEMIREDDY DEEPAK REDDY",
    year: "3rd Year",
  },
  {
    ht_no: "23891A7203",
    student_name: "ALAMPALLY SAI KUMAR",
    year: "3rd Year",
  },
  { ht_no: "23891A7204", student_name: "ANANTHULA SHIVAJI", year: "3rd Year" },
  { ht_no: "24891A7201", student_name: "ADIMULAM RAGHU RAM", year: "2nd Year" },
  { ht_no: "24891A7202", student_name: "ALLAM CHARAN TEJA", year: "2nd Year" },
  { ht_no: "24891A7203", student_name: "ALLE HARSHAVARDHAN", year: "2nd Year" },
  // Add a few more for testing
];

export const validateStudentLocally = (
  hallTicket: string,
  name: string,
  year: string,
) => {
  const student = localStudentData.find(
    (s) =>
      s.ht_no === hallTicket &&
      s.student_name === name.toUpperCase() &&
      s.year === year,
  );
  return !!student;
};
