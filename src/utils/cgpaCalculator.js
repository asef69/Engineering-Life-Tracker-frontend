/**
 * Calculate CGPA using weighted formula:
 * CGPA = Σ(course grade point × credit hour) / Σ(credit hour)
 * 
 * @param {Array} courses - Array of course objects with cgpa and credit_hour properties
 * @returns {number|null} - Calculated CGPA or null if no valid courses
 */
export const calculateCGPA = (courses) => {
  if (!courses || courses.length === 0) {
    return null;
  }

  // Filter out courses without valid CGPA or credit hours
  const validCourses = courses.filter(
    (course) =>
      course.cgpa != null &&
      course.cgpa !== '' &&
      !isNaN(parseFloat(course.cgpa)) &&
      course.credit_hour != null &&
      course.credit_hour !== '' &&
      !isNaN(parseFloat(course.credit_hour)) &&
      parseFloat(course.credit_hour) > 0
  );

  if (validCourses.length === 0) {
    return null;
  }

  // Calculate weighted sum: Σ(course grade point × credit hour)
  const weightedSum = validCourses.reduce((sum, course) => {
    const gradePoint = parseFloat(course.cgpa);
    const creditHour = parseFloat(course.credit_hour);
    return sum + gradePoint * creditHour;
  }, 0);

  // Calculate total credit hours: Σ(credit hour)
  const totalCreditHours = validCourses.reduce((sum, course) => {
    return sum + parseFloat(course.credit_hour);
  }, 0);

  // CGPA = weighted sum / total credit hours
  if (totalCreditHours === 0) {
    return null;
  }

  return weightedSum / totalCreditHours;
};

