import React, { useEffect, useState, useCallback } from "react";
import { db, collection } from "../firebase";
import { getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import Certificate from "../components/Certificate";
import { Code, Award, Boxes, GraduationCap } from "lucide-react";

// Separate ShowMore/ShowLess button component
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-red-700 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const techStacks = [
  { icon: "html.svg", language: "HTML5" },
  { icon: "css.svg", language: "CSS3" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "java-icon.svg", language: "Java" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "springio-icon.svg", language: "Spring" },
  { icon: "springio-icon.svg", language: "Spring Boot" },
  { icon: "hibernate-icon.svg", language: "Hibernate" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "jquery-icon.svg", language: "jQuery" },
];

const EducationCard = ({ degree, years, description, cgpa }) => (
  <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg transition-all duration-300 hover:scale-105 hover:border-white/20 hover:shadow-lg">
    <div className="absolute inset-0 bg-gradient-to-tr from-red-400/5 to-red-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="p-6 relative z-10">
      <div className="flex flex-col space-y-3">
        <h3 className="text-xl font-semibold text-white group-hover:text-red-300 transition-colors duration-300">{degree}</h3>
        <div className="space-y-1">
          <p className="text-sm text-gray-400">{years}</p>
          {cgpa && <p className="text-sm text-red-300 font-medium">CGPA: {cgpa}</p>}
        </div>
        <p className="text-gray-400 text-sm mt-2">{description}</p>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-red-700 group-hover:w-full transition-all duration-500"></div>
  </div>
);

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const isMobile = windowWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  // Education data
  const educationData = [
    {
      degree: "Java Full Stack Developer Certification",
      years: "2024",
      description: "Comprehensive training in Java ecosystem including Spring Boot, Hibernate, and modern front-end technologies, with practical project implementation."
    },
    {
      degree: "Master of Computer Application (MCA)",
      years: "2022 - 2024",
      description: "Advanced studies in software development, computer systems, and application design with focus on modern programming techniques.",
      cgpa: "8.8"
    },
    {
      degree: "Bachelor of Computer Application (BCA)",
      years: "2019 - 2022",
      description: "Fundamentals of computer science covering programming languages, database management, and software development.",
      cgpa: "9.9"
    }
  ];

  // Force clear localStorage on mount to ensure fresh data
  useEffect(() => {
    localStorage.removeItem("projects");
    localStorage.removeItem("certificates");
  }, []);

  useEffect(() => {
    // Initialize AOS once
    AOS.init({
      once: false, // This will make animations occur only once
    });

    // Add window resize listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Check for active tab in localStorage
  useEffect(() => {
    const activeTab = localStorage.getItem("portfolioActiveTab");
    if (activeTab !== null) {
      setValue(parseInt(activeTab, 10));
      localStorage.removeItem("portfolioActiveTab");
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      // Clear localStorage first to ensure fresh data
      localStorage.removeItem("projects");
      localStorage.removeItem("certificates");

      // Create a React Dashboard project
      const dashboardProject = {
        id: "react-dashboard",
        Title: "React Admin Dashboard",
        Description: "A comprehensive admin dashboard built with React, featuring data visualization, theme switching, and responsive design for effective data management and monitoring.",
        Img: "/DashboardSc.png",
        Link: "https://react-dashboard-rouge-two.vercel.app/",
        TechStack: ["React", "Material UI", "Chart.js", "JavaScript"],
        Features: ["Responsive Design", "Dark/Light Theme", "Interactive Charts", "Data Tables", "User Authentication"],
        Github: "https://github.com/umeshhpatil/react-dashboard"
      };

      // Create PortfolioV5 project
      const portfolioV5Project = {
        id: "portfolio-v4",
        Title: "Portfolio V4",
        Description: "Modern portfolio website built with HTML5, CSS3, and Bootstrap, featuring a clean and responsive design with integrated email functionality using EmailJS.",
        Img: "/PortfolioV4.png",
        Link: "https://umeshpatil-portfolio.netlify.app/",
        TechStack: ["HTML5", "CSS3", "Bootstrap", "EmailJS"],
        Features: ["Responsive Design", "Clean UI", "Contact Form with EmailJS", "Project Showcase", "Smooth Animations"],
        Github: "https://github.com/umeshhpatil/Portfolio-V4"
      };

      // Create Car Dealership project
      const carDealershipProject = {
        id: "car-dealership",
        Title: "Car Dealership",
        Description: "A comprehensive car dealership management system with inventory management, customer portal, and admin dashboard built using Java Servlets and MySQL.",
        Img: "/JavaProject.png",
        Link: null,
        TechStack: ["Java", "MySQL", "HTML5", "CSS3", "Bootstrap", "Servlet"],
        Features: ["Inventory Management", "Customer Portal", "Admin Dashboard", "Booking System", "Search Functionality"],
        Github: "https://github.com/umeshhpatil/car-dealership"
      };

      // Create a single certificate with local image
      const singleCertificate = {
        id: "full-stack-certification",
        Title: "Full Stack Developer Certification",
        Img: "/Umesh Ganeshrao Patil - Full Stack (1)_page-0001.jpg",
        Date: "2023-05-15",
        Issuer: "Full Stack Academy"
      };

      // Set projects and certificate
      setProjects([dashboardProject, portfolioV5Project, carDealershipProject]);
      setCertificates([singleCertificate]);

      // Store in localStorage
      localStorage.setItem("projects", JSON.stringify([dashboardProject, portfolioV5Project, carDealershipProject]));
      localStorage.setItem("certificates", JSON.stringify([singleCertificate]));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    try {
      // Try to get projects from localStorage first
      const storedProjects = localStorage.getItem("projects");
      const storedCertificates = localStorage.getItem("certificates");

      if (storedProjects && storedCertificates) {
        setProjects(JSON.parse(storedProjects));
        setCertificates(JSON.parse(storedCertificates));
      } else {
        // If not in localStorage, fetch them
        fetchData();
      }
    } catch (error) {
      console.error("Error retrieving data from localStorage:", error);
      // If error, fetch data
      fetchData();
    }
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback((type) => {
    if (type === 'projects') {
      setShowAllProjects(prev => !prev);
    } else {
      setShowAllCertificates(prev => !prev);
    }
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);
  const displayedCertificates = showAllCertificates ? certificates : certificates.slice(0, initialItems);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" id="Portfolio">
      {/* Header section - unchanged */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#ff5757] to-[#b91c1c]">
          <span style={{
            color: '#ff5757',
            backgroundImage: 'linear-gradient(45deg, #ff5757 10%, #b91c1c 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Portfolio Showcase
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects, certifications, and technical expertise.
          Each section represents a milestone in my continuous learning path.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(255, 87, 87, 0.03) 0%, rgba(185, 28, 28, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          {/* Updated Tabs with Education tab */}
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant={windowWidth < 768 ? "scrollable" : "fullWidth"}
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.8rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: { xs: "20px 12px", md: "20px 0" },
                zIndex: 1,
                margin: { xs: "4px", md: "8px" },
                borderRadius: "12px",
                minWidth: { xs: "auto", md: "0" },
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(255, 87, 87, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(255, 87, 87, 0.2), rgba(185, 28, 28, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(255, 87, 87, 0.2)",
                  "& .lucide": {
                    color: "#fca5a5",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Projects"
              {...a11yProps(0)}
            />
            <Tab
              icon={<Award className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Certificates"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Tech Stack"
              {...a11yProps(2)}
            />
            <Tab
              icon={<GraduationCap className="mb-2 w-5 h-5 transition-all duration-300" />}
              label="Education"
              {...a11yProps(3)}
              sx={{
                "&.Mui-selected": {
                  "& .lucide": {
                    color: "#dc2626",
                  },
                },
                "&:hover": {
                  "& .lucide": {
                    color: "#ef4444",
                  },
                },
              }}
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <CardProject
                      Img={project.Img}
                      Title={project.Title}
                      Description={project.Description}
                      Link={project.Link}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 md:gap-5 gap-4">
                {displayedCertificates.map((certificate, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <Certificate ImgSertif={certificate.Img} />
                  </div>
                ))}
              </div>
            </div>
            {certificates.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('certificates')}
                  isShowingMore={showAllCertificates}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>

          <TabPanel value={value} index={3} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {educationData.map((education, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={(index + 1) * 300 + 700}
                  >
                    <EducationCard
                      degree={education.degree}
                      years={education.years}
                      description={education.description}
                      cgpa={education.cgpa}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    </div>
  );
} 