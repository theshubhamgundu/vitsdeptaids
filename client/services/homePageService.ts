// Service to fetch homepage data that's uploaded by admin
export interface PlacementRecord {
  id: string;
  studentName: string;
  hallTicket: string;
  company: string;
  position: string;
  package: string;
  placementDate: string;
  location: string;
  featured: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  recipient: string;
  featured: boolean;
  imageUrl?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  uploadDate: string;
  featured: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  type: string;
  venue: string;
  organizer: string;
  status: string;
  featured: boolean;
}

// Get placement data from localStorage (where admin stores it)
export const getPlacementData = (): PlacementRecord[] => {
  try {
    const placements = localStorage.getItem("adminPlacements");
    return placements ? JSON.parse(placements) : [];
  } catch (error) {
    console.error("Error loading placement data:", error);
    return [];
  }
};

// Get achievement data from localStorage
export const getAchievementData = (): Achievement[] => {
  try {
    const achievements = localStorage.getItem("adminAchievements");
    return achievements ? JSON.parse(achievements) : [];
  } catch (error) {
    console.error("Error loading achievement data:", error);
    return [];
  }
};

// Get gallery data from localStorage
export const getGalleryData = (): GalleryItem[] => {
  try {
    const gallery = localStorage.getItem("adminGallery");
    return gallery ? JSON.parse(gallery) : [];
  } catch (error) {
    console.error("Error loading gallery data:", error);
    return [];
  }
};

// Get events data from localStorage
export const getEventsData = (): Event[] => {
  try {
    const events = localStorage.getItem("adminEvents");
    return events ? JSON.parse(events) : [];
  } catch (error) {
    console.error("Error loading events data:", error);
    return [];
  }
};

// Calculate placement statistics from the placement data
export const getPlacementStats = () => {
  const placements = getPlacementData();

  if (placements.length === 0) {
    return {
      placementRate: 0,
      totalStudents: 0,
      companiesCount: 0,
      highestPackage: 0,
    };
  }

  const uniqueCompanies = new Set(placements.map((p) => p.company)).size;
  const packages = placements
    .map((p) => parseFloat(p.package))
    .filter((p) => !isNaN(p));
  const highestPackage = packages.length > 0 ? Math.max(...packages) : 0;

  return {
    placementRate: 100, // Assuming all entries are placed students
    totalStudents: placements.length,
    companiesCount: uniqueCompanies,
    highestPackage: highestPackage,
  };
};

// Get featured placements for display
export const getFeaturedPlacements = (limit: number = 6): PlacementRecord[] => {
  const placements = getPlacementData();
  return placements
    .filter((p) => p.featured)
    .slice(0, limit)
    .sort(
      (a, b) =>
        new Date(b.placementDate).getTime() -
        new Date(a.placementDate).getTime(),
    );
};

// Get featured achievements for display
export const getFeaturedAchievements = (limit: number = 3): Achievement[] => {
  const achievements = getAchievementData();
  return achievements
    .filter((a) => a.featured)
    .slice(0, limit)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Get featured gallery items for display
export const getFeaturedGallery = (limit: number = 6): GalleryItem[] => {
  const gallery = getGalleryData();
  return gallery
    .filter((g) => g.featured)
    .slice(0, limit)
    .sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime(),
    );
};

// Get featured events for display
export const getFeaturedEvents = (limit: number = 3): Event[] => {
  const events = getEventsData();
  return events
    .filter((e) => e.featured)
    .slice(0, limit)
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(), // Upcoming events first
    );
};

// Get all active events for display
export const getActiveEvents = (): Event[] => {
  const events = getEventsData();
  return events
    .filter((e) => e.status === "Active")
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
};
