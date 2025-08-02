import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  Users,
  Award,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Brain,
  Database,
  Cpu,
  BarChart,
  Network,
  Zap,
  Target,
  BookOpen,
  Eye,
  X
} from "lucide-react";

const HomePage = () => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const events = [
    {
      id: 1,
      title: "AI/ML Workshop Series",
      date: "March 15-17, 2025",
      description: "Hands-on workshop covering machine learning fundamentals and practical applications",
      type: "Workshop",
      featured: true
    },
    {
      id: 2,
      title: "Tech Talk: Future of Data Science",
      date: "March 22, 2025",
      description: "Industry experts discuss emerging trends in data science and AI",
      type: "Seminar",
      featured: false
    },
    {
      id: 3,
      title: "Annual Project Exhibition",
      date: "April 5-6, 2025",
      description: "Showcase of innovative student projects in AI and Data Science",
      type: "Exhibition",
      featured: true
    }
  ];

  const faculty = [
    {
      name: "Dr. Priya Sharma",
      designation: "Professor & HOD",
      specialization: "Machine Learning, Neural Networks",
      image: "/api/placeholder/150/150",
      experience: "15+ years"
    },
    {
      name: "Dr. Rajesh Kumar",
      designation: "Associate Professor",
      specialization: "Data Mining, Big Data Analytics",
      image: "/api/placeholder/150/150",
      experience: "12+ years"
    },
    {
      name: "Dr. Anita Verma",
      designation: "Assistant Professor",
      specialization: "Computer Vision, Deep Learning",
      image: "/api/placeholder/150/150",
      experience: "8+ years"
    },
    {
      name: "Dr. Suresh Reddy",
      designation: "Assistant Professor",
      specialization: "Natural Language Processing",
      image: "/api/placeholder/150/150",
      experience: "6+ years"
    }
  ];

  const achievements = [
    {
      title: "Best Department Award 2024",
      description: "Recognized for excellence in AI & Data Science education",
      icon: Award,
      year: "2024"
    },
    {
      title: "100% Placement Record",
      description: "All eligible students placed in top companies",
      icon: GraduationCap,
      year: "2024"
    },
    {
      title: "Research Publications",
      description: "50+ papers published in international journals",
      icon: BarChart,
      year: "2024"
    }
  ];

  const specializations = [
    {
      icon: Brain,
      title: "Artificial Intelligence",
      description: "Machine Learning, Deep Learning, Neural Networks"
    },
    {
      icon: Database,
      title: "Data Science",
      description: "Data Analytics, Big Data, Statistical Modeling"
    },
    {
      icon: Cpu,
      title: "Computer Vision",
      description: "Image Processing, Pattern Recognition, Visual AI"
    },
    {
      icon: Network,
      title: "Natural Language Processing",
      description: "Text Analytics, Language Models, Chatbots"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentEventIndex((prev) => (prev + 1) % events.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [events.length]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Cpu className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">AI & DS</span>
              </div>
              <span className="text-sm text-gray-600 hidden md:block">
                Vignan Institute of Technology & Science
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#events" className="text-gray-700 hover:text-blue-600 transition-colors">Events</a>
              <a href="#faculty" className="text-gray-700 hover:text-blue-600 transition-colors">Faculty</a>
              <a href="#gallery" className="text-gray-700 hover:text-blue-600 transition-colors">Gallery</a>
              <a href="#placements" className="text-gray-700 hover:text-blue-600 transition-colors">Placements</a>
              <a href="#achievements" className="text-gray-700 hover:text-blue-600 transition-colors">Achievements</a>
            </div>
            <div className="flex items-center space-x-3">
              <Link to="/demo-logins">
                <Button variant="ghost" size="sm" className="text-sm">Demo Logins</Button>
              </Link>
              <Link to="/login/student">
                <Button variant="outline" size="sm">Student Login</Button>
              </Link>
              <Link to="/login/faculty">
                <Button size="sm">Faculty Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Department of
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Artificial Intelligence & Data Science
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Shaping the future with cutting-edge AI and Data Science education. 
              Empowering students to become tomorrow's tech leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600">
                    <Eye className="mr-2 h-5 w-5" />
                    Vision & Mission
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <span>Vision & Mission</span>
                    </DialogTitle>
                    <DialogDescription>
                      Our department's vision and mission statements
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-600 mb-3">Vision</h3>
                      <p className="text-gray-700">
                        To empower individuals to acquire advanced knowledge and skills with cutting edge combination in
                        Artificial Intelligence and Data Science with Analytical Visualization Technologies to address the
                        challenges of the society and contribute to the nation building.
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-purple-600 mb-3">Mission</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          Provide strong AI & DS foundations through comprehensive curriculum and hands-on learning experiences
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          Create tech-enabled learning environments that foster innovation and critical thinking
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          Develop state-of-the-art research labs for advanced AI and Data Science exploration
                        </li>
                        <li className="flex items-start">
                          <span className="text-purple-600 mr-2">•</span>
                          Nurture leadership qualities through co-curricular and extra-curricular activities
                        </li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Program Outcomes
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      <span>Program Outcomes</span>
                    </DialogTitle>
                    <DialogDescription>
                      Our Artificial Intelligence & Data Science program is designed to achieve the following 12 Program Outcomes:
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    {[
                      { id: "PO1", title: "Engineering Knowledge" },
                      { id: "PO2", title: "Problem Analysis" },
                      { id: "PO3", title: "Design/Development of Solutions" },
                      { id: "PO4", title: "Conduct Investigations of Complex Problems" },
                      { id: "PO5", title: "Modern Tool Usage" },
                      { id: "PO6", title: "The Engineer and Society" },
                      { id: "PO7", title: "Environment and Sustainability" },
                      { id: "PO8", title: "Ethics" },
                      { id: "PO9", title: "Individual and Team Work" },
                      { id: "PO10", title: "Communication" },
                      { id: "PO11", title: "Project Management and Finance" },
                      { id: "PO12", title: "Life-long Learning" }
                    ].map((outcome, index) => (
                      <div key={index} className="border rounded-lg p-3 hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">{outcome.id}</span>
                          </div>
                          <h4 className="font-medium text-gray-900">{outcome.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Specializations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive curriculum covering the latest in AI and Data Science technologies
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {specializations.map((spec, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <spec.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{spec.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{spec.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section id="events" className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <p className="text-xl text-gray-600">Stay updated with our latest events and activities</p>
          </div>
          <div className="relative">
            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant={events[currentEventIndex].featured ? "default" : "outline"}>
                    {events[currentEventIndex].type}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {currentEventIndex + 1} of {events.length}
                  </span>
                </div>
                <CardTitle className="text-2xl">{events[currentEventIndex].title}</CardTitle>
                <CardDescription className="flex items-center text-lg">
                  <Calendar className="h-5 w-5 mr-2" />
                  {events[currentEventIndex].date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{events[currentEventIndex].description}</p>
              </CardContent>
            </Card>
            <div className="flex justify-center mt-6 space-x-2">
              {events.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEventIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentEventIndex ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Section */}
      <section id="faculty" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Faculty</h2>
            <p className="text-xl text-gray-600">Learn from industry experts and renowned academicians</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {faculty.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <Users className="h-16 w-16 text-white" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.designation}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-2">{member.specialization}</p>
                  <Badge variant="outline">{member.experience}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Gallery</h2>
            <p className="text-xl text-gray-600">Department photos and videos</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-blue-400 to-purple-500 rounded-t-lg flex items-center justify-center">
                  <span className="text-white font-semibold">Gallery Item {item}</span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">Event/Activity {item}</h3>
                  <p className="text-sm text-gray-600">Description of the event or activity</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Placements Section */}
      <section id="placements" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Placements</h2>
            <p className="text-xl text-gray-600">Outstanding placement records and industry partnerships</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl font-bold text-green-600 mb-2">95%</div>
                <CardTitle>Placement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Students successfully placed in top companies</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                <CardTitle>Partner Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Leading tech companies for placements</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="text-4xl font-bold text-purple-600 mb-2">₹12L</div>
                <CardTitle>Highest Package</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Maximum package offered to our students</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Achievements</h2>
            <p className="text-xl text-gray-600">Recognition of our excellence in education and research</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <achievement.icon className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <CardTitle className="text-xl">{achievement.title}</CardTitle>
                  <Badge className="mb-2">{achievement.year}</Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">400+</div>
              <div className="text-blue-200">Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-blue-200">Faculty Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-200">Placement Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-200">Research Projects</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get In Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-3 text-blue-400" />
                  <span>Vignan Institute of Technology & Science, Hyderabad</span>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-blue-400" />
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-blue-400" />
                  <span>aids@vignanits.ac.in</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-4">
                <Link to="/admissions" className="text-gray-300 hover:text-white transition-colors">
                  Admissions
                </Link>
                <Link to="/research" className="text-gray-300 hover:text-white transition-colors">
                  Research
                </Link>
                <Link to="/placements" className="text-gray-300 hover:text-white transition-colors">
                  Placements
                </Link>
                <a href="https://vignanits.ac.in/" target="_blank" rel="noopener noreferrer" 
                   className="text-gray-300 hover:text-white transition-colors">
                  College Website
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Department of Artificial Intelligence & Data Science, Vignan Institute of Technology & Science
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
