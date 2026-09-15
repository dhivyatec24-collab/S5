// Curated high-resolution academic and student imagery with soft tones
export const IMAGES = {
  // Hero: Engineering student with laptop
  heroStudent: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
  heroEngineering: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
  
  // Login / Signup: Student with books & laptop
  loginStudent: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80",
  
  // Dashboard: Academic study / campus setting
  dashboardAcademic: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1000&q=80",
  
  // Cutoff Predictor: Graduation cap & academic degree
  degreeGraduation: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80",
  
  // Recommendations: Students celebrating graduation
  celebratingGraduates: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1000&q=80",
  
  // College Campuses
  campusGeneric: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80",
  libraryGeneric: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1000&q=80",
  labGeneric: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
  classroomGeneric: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80"
};

export const handleImageError = (e, fallback = IMAGES.campusGeneric) => {
  e.target.onerror = null;
  e.target.src = fallback;
};
