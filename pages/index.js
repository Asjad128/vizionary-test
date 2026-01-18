import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from 'html2canvas';
import { Camera, Mic, Play, Send, User, Briefcase, LogOut, ShieldCheck, ArrowLeft, ArrowRight, Sparkles, Download } from 'lucide-react';
import { useRouter } from 'next/router';

const SERVER_URL = 'https://izhanrahman1.pythonanywhere.com';

const pageVariants = {
  initial: { opacity: 0, x: "-50vw", scale: 0.8 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: "50vw", scale: 1.2 }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
};

const popInVariant = {
  hidden: { scale: 0, opacity: 0, rotate: -5 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.1
    }
  }
};

function CareerVisualizer({ role, onLogout }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const resultRef = useRef(null);

  const [stage, setStage] = useState("start");
  const [name, setName] = useState("");
  const [career, setCareer] = useState("");
  const [careerImage, setCareerImage] = useState(null);
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const [showValidation, setShowValidation] = useState(false);
  const [validationData, setValidationData] = useState({ name: "", career: "" });
  const [confirmedData, setConfirmedData] = useState({ name: "", career: "" });

  const transcriptRef = useRef("");
  const recognitionTimeoutRef = useRef(null);

  const careerImages = useMemo(() => ({
    actor: "/images/actor.jpeg", architect: "/images/architect.jpeg", artist: "/images/artist.jpeg",
    astronaut: "/images/astronaut.jpeg", athlete: "/images/athlete.jpeg", animator: "/images/animator.jpeg",
    baker: "/images/baker.jpeg", badmintonplayer: "/images/badmintonplayer.jpeg", barber: "/images/barber.jpeg",
    busdriver: "/images/busdriver.jpeg", chef: "/images/chef.jpeg", chiefminister: "/images/chief_minister.jpeg",
    coach: "/images/coach.jpeg", constructionworker: "/images/constructionworker.jpeg", cricketer: "/images/cricketer.jpeg",
    dancer: "/images/dancer.jpeg", dentist: "/images/dentist.jpeg", detective: "/images/detective.jpeg",
    doctor: "/images/doctor.jpeg", electrician: "/images/electrician.jpeg", engineer: "/images/engineer.jpeg",
    entrepreneur: "/images/entrepreneur.jpeg", farmer: "/images/farmer.jpeg", fashiondesigner: "/images/fashiondesigner.jpeg",
    florist: "/images/florist.jpeg", footballer: "/images/footballer.jpeg",
    gamer: "/images/gamer.jpeg", gamedeveloper: "/images/gamedeveloper.jpeg", gardener: "/images/gardener.jpeg",
    governor: "/images/governor.jpeg", graphicdesigner: "/images/graphicdesigner.jpeg", homeminister: "/images/home_minister.jpeg",
    judge: "/images/judge.jpeg", kabaddiplayer: "/images/kabaddiplayer.jpeg", lawyer: "/images/lawyer.jpeg",
    librarian: "/images/librarian.jpeg", mailcarrier: "/images/mailcarrier.jpeg", mayor: "/images/mayor.jpeg",
    mechanic: "/images/mechanic.jpeg", mla: "/images/mla.jpeg", mp: "/images/mp.jpeg",
    musician: "/images/musician.jpeg", nurse: "/images/nurse.jpeg", pharmacist: "/images/pharmacist.jpeg",
    photographer: "/images/photographer.jpeg", pilot: "/images/pilot.jpeg", plumber: "/images/plumber.jpeg",
    police: "/images/police.jpeg", president: "/images/president.jpeg", primeminister: "/images/prime_minister.jpeg",
    roboticsengineer: "/images/roboticsengineer.jpeg", scientist: "/images/scientist.jpeg",
    socialworker: "/images/socialworker.jpeg", softwareengineer: "/images/softwareengineer.jpeg",
    soldier: "/images/soldier.jpeg", teacher: "/images/teacher.jpeg", veterinarian: "/images/veterinarian.jpeg",
    writer: "/images/writer.jpeg", youtuber: "/images/youtuber.jpeg", accountant: "/images/Accountant.png",
    accupenturedoctor: "/images/Accupenture Doctor.png",
    advocate: "/images/Advocate.jpeg",
    agriculturalscientist: "/images/Agirculture_scientist.png",
    airtrafficcontroller: "/images/Air Traffic Controller.png",
    ambulancedriver: "/images/Ambulance_driver-image.png",
    archaeologist: "/images/Archaeologist.png",
    army: "/images/Army.png",
    astronomer: "/images/Astronomer.png",
    athletics: "/images/Athletics.png",
    auditor: "/images/Auditor-image.png",
    baber: "/images/Baber.jpeg",
    bankmanager: "/images/Bank Manager.png",
    bioscientist: "/images/Bio-Scientist.jpeg",
    blacksmith: "/images/Blacksmith.png",
    botanist: "/images/Botanist.jpeg",
    businessman: "/images/Business Man.png",
    butcher: "/images/Butcher_[Khasaayi].png",
    ceo: "/images/CEO.png",
    cto: "/images/CTO.png",
    carpenterwoodworker: "/images/Carpenter (Woodworker).png",
    carpenter: "/images/Carpenter.jpeg",
    ceramicdesigner: "/images/Ceramic Designer.png",
    chefpasty: "/images/Chef (Pastry).png",
    chemist: "/images/Chemist.png",
    civilengineer: "/images/Civil_engineer.jpeg",
    clerk: "/images/Clerk.png",
    collector: "/images/Collector.png",
    comedian: "/images/Comedian.png",
    commander: "/images/Commander.png",
    dataanalyst: "/images/Data Analyst.png",
    driver: "/images/Driver.jpeg",
    employee: "/images/Employee.jpeg",
    eventplanner: "/images/Event Planner.png",
    fashionmodel: "/images/Fashion Model.png",
    firefighter: "/images/Fire-fighter.png",
    hacker: "/images/Hacker.png",
    host: "/images/Host.png",
    ias: "/images/IAS.jpeg",
    ifsofficer: "/images/IFS Officer.png",
    ipsofficer: "/images/IPS officer-image.png",
    journalist: "/images/Journalist.jpeg",
    musicproducer: "/images/Music Producer.png",
    poet: "/images/Poet.png",
    professor: "/images/Professor.png",
    programmer: "/images/Programmer.png",
    psychologist: "/images/Psychologist.png",
    radiohost: "/images/Radio Host.png",
    reporter: "/images/Reporter.png",
    sailor: "/images/Sailor.png",
    singer: "/images/Singer.png",
    softwaredeveloper: "/images/Software_developer.jpeg",
    staff: "/images/Staff.jpeg",
    student: "/images/Student.png",
    surgeon: "/images/Surgeon.png",
    technician: "/images/Technician.png",
    therapist: "/images/Therapist.png",
    translator: "/images/Translator.png",
    traveler: "/images/Traveler.png",
    tutor: "/images/Tutor.png",
    videogamedesigner: "/images/Video Game Designer.png",
    waiter: "/images/Waiter.png",
    webdesigner: "/images/Web Designer.png",
    yogainstructor: "/images/Yoga Instructor.png",
    zoologist: "/images/Zoologist.png",
    politician: "/images/politician.jpeg",
  }), []);

  const getCareerData = useCallback((career, studentName) => {
    const key = (career || "").replace(/\s+/g, "").toLowerCase();
    const imagePath = careerImages[key];
    const displayName = studentName || "Student";

    if (imagePath) {
      return {
        title: `${displayName} wants to be a ${career}`,
        src: imagePath,
        isKnown: true
      };
    } else {
      return {
        title: `${displayName} wants to be a ${career}. Please ask your mentor for guidance.`,
        src: '/images/confused.jpeg',
        isKnown: false
      };
    }
  }, [careerImages]);

  const stableSaveRecord = useCallback(async (studentName, studentCareer) => {
    try {
      await fetch(`${SERVER_URL}/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: studentName, career: studentCareer }),
      });
      console.log('Record sent to server:', studentName, studentCareer);
    } catch (error) {
      console.error('Failed to send record:', error);
    }
  }, []);

  const cleanupTranscript = useCallback((text) => {
    // Find the last occurrence of sentence start patterns and keep only from there
    const patterns = [
      /my name is/i,
      /i am/i,
      /my dream/i,
      /name is/i
    ];

    let lastIndex = 0;
    
    for (const pattern of patterns) {
      const matches = text.matchAll(new RegExp(pattern, 'gi'));
      let lastMatch = null;
      
      for (const match of matches) {
        lastMatch = match;
      }
      
      if (lastMatch && lastMatch.index > lastIndex) {
        lastIndex = lastMatch.index;
      }
    }

    // Return from the last sentence start onwards
    return lastIndex > 0 ? text.substring(lastIndex) : text;
  }, []);

  const extractNameAndCareer = useCallback((text) => {
    // First, clean up duplicate transcripts - keep only the last/clearest sentence
    const cleanedText = cleanupTranscript(text);
    const cleanText = cleanedText.toLowerCase().replace(/[^a-z0-9\s]/g, "");
    let n = "";
    let c = "";

    const knownCareers = Object.keys(careerImages);

    // Try to match known careers
    for (const careerKey of knownCareers) {
      const regex = new RegExp(`\\b${careerKey}\\b`, 'i');
      if (regex.test(cleanText)) {
        c = careerKey;
        break;
      }
    }

    // Helper function to cleanup and validate career names
    const cleanupCareerName = (careerPhrase) => {
      const stopWords = ["doctor", "engineer", "good", "great", "my", "and", "to", "be", "a", "an", "the", "or", "want", "going", "is", "name"];
      let cleaned = careerPhrase
        .replace(/\s+(my|and|to|be|a|an|the|or|want|going|is|name)\s*$/i, "")
        .replace(/\s+my\s+name.*$/i, "")
        .trim();
      
      // Limit to first 3 words for career
      const words = cleaned.split(/\s+/).slice(0, 3).join(" ");
      
      if (!stopWords.includes(words) && words.length > 2) {
        return words;
      }
      return "";
    };

    // If no known career found, try to extract unknown careers
    if (!c) {
      // Pattern 1: "want to be a [career]" - stop at period or end
      let match = cleanText.match(/want\s+to\s+be\s+(?:a|an)?\s+([a-z\s]+?)(?:\.|$)/i);
      if (match && match[1]) {
        c = cleanupCareerName(match[1].trim());
      }
      
      // Pattern 2: "become [career]"
      if (!c) {
        match = cleanText.match(/become\s+(?:a|an)?\s+([a-z\s]+?)(?:\.|$)/i);
        if (match && match[1]) {
          c = cleanupCareerName(match[1].trim());
        }
      }
      
      // Pattern 3: any remaining text after "want to be" up to end
      if (!c) {
        match = cleanText.match(/want\s+to\s+be\s+([a-z\s]+)$/i);
        if (match && match[1]) {
          c = cleanupCareerName(match[1].trim());
        }
      }
    }

    // Extract name - look for "name is [word]"
    let nameMatch = cleanText.match(/name\s+is\s+([a-z]+)/i);
    
    if (nameMatch && nameMatch[1]) {
      n = nameMatch[1].trim();
    } else {
      // Try "i am [name]"
      nameMatch = cleanText.match(/i\s+am\s+([a-z]+)/i);
      if (nameMatch && nameMatch[1]) {
        n = nameMatch[1].trim();
      }
    }

    // Validate name - must be a real name, not a keyword
    const nameStopWords = ["a", "an", "the", "i", "and", "want", "going", "to", "become", "will", "student", "be", "career", "job", "is", "software", "engineer", "developer"];
    if (nameStopWords.includes(n.toLowerCase()) || n.length < 2) {
      n = "";
    }

    n = n ? n.charAt(0).toUpperCase() + n.slice(1) : "";
    return { name: n, career: c || null };
  }, [careerImages, cleanupTranscript]);

  const processVoiceCommand = useCallback((transcript) => {
    const { name: dName, career: dCareer } = extractNameAndCareer(transcript);
    if (dName) setName(dName);
    if (dCareer) setCareer(dCareer);

    if (dCareer) {
      const finalName = dName || name || "Student";
      const careerData = getCareerData(dCareer, finalName);
      setCareerImage(careerData);
      setStage("result");
      stableSaveRecord(finalName, dCareer);
    } else {
      setStage("manual");
    }
  }, [extractNameAndCareer, getCareerData, stableSaveRecord, name]);

  const handleDownload = async () => {
    if (!resultRef.current) return;
    try {
      const canvas = await html2canvas(resultRef.current, {
        backgroundColor: '#2e1065',
        scale: 2,
        useCORS: true
      });
      const link = document.createElement('a');
      link.download = `${name || 'career'}-vision.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  const startVoiceRecognition = useCallback(() => {
    const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      alert("Speech recognition not supported. Please use manual input.");
      setStage("manual");
      return;
    }

    const newRecognition = new SpeechRecognition();
    newRecognition.continuous = true;
    newRecognition.interimResults = true;
    newRecognition.lang = 'en-IN';

    transcriptRef.current = "";

    newRecognition.onstart = () => {
      setListening(true);
      if (recognitionTimeoutRef.current) clearTimeout(recognitionTimeoutRef.current);
      recognitionTimeoutRef.current = setTimeout(() => {
        newRecognition.abort();
        setListening(false);
        if (!transcriptRef.current.trim()) {
          setStage("manual");
        }
      }, 10000);
    };

    newRecognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const currentFullTranscript = transcriptRef.current + finalTranscript + interimTranscript;
      const check = extractNameAndCareer(currentFullTranscript);
      if (check.career && check.name) {
        transcriptRef.current = currentFullTranscript;
        if (recognitionTimeoutRef.current) clearTimeout(recognitionTimeoutRef.current);
        newRecognition.stop();
        setListening(false);
        return;
      }
      if (finalTranscript) {
        transcriptRef.current += finalTranscript;
      }
    };

    newRecognition.onerror = (event) => {
      if (event.error !== 'no-speech') {
        setListening(false);
        clearTimeout(recognitionTimeoutRef.current);
        setStage("manual");
      }
    };

    newRecognition.onend = () => {
      setListening(false);
      clearTimeout(recognitionTimeoutRef.current);
      if (transcriptRef.current && transcriptRef.current.trim().length > 0) {
        const extracted = extractNameAndCareer(transcriptRef.current.toLowerCase());
        // Show validation screen for user confirmation
        setRecognizedText(transcriptRef.current);
        setValidationData(extracted);
        setShowValidation(true);
      } else {
        setStage("manual");
      }
    };

    setRecognition(newRecognition);
    newRecognition.start();
    setStage("listen");
  }, [processVoiceCommand, extractNameAndCareer]);

  const speak = useCallback((text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text.trim()) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.2;
    utterance.volume = 1.0;
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
    }
  }, []);

  useEffect(() => {
    if (stage === 'result' && careerImage?.title) {
      speak(careerImage.title);
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stage, careerImage, speak]);

  useEffect(() => {
    let timer = null;
    const startCameraAndTimer = async () => {
      try {
        speak(" ");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        timer = setTimeout(() => {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          startVoiceRecognition();
        }, 3000);
      } catch (error) {
        console.error("Camera access error:", error);
        alert("Could not access camera. Please allow permissions.");
        setStage("start");
      }
    };

    if (stage === 'camera_demo') {
      startCameraAndTimer();
    }

    return () => {
      clearTimeout(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (recognition && listening) {
        recognition.stop();
      }
      clearTimeout(recognitionTimeoutRef.current);
    };
  }, [stage, startVoiceRecognition, speak, listening, recognition]);

  const goBackToStart = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (recognition && listening) {
      recognition.stop();
    }
    clearTimeout(recognitionTimeoutRef.current);
    setStage("start");
    setName("");
    setCareer("");
    setCareerImage(null);
  };

  const handleNextCandidate = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setName("");
    setCareer("");
    setCareerImage(null);
    setStage("camera_demo");
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    const studentName = name || "Student";
    const studentCareer = career;
    setName(studentName);
    const careerData = getCareerData(studentCareer, studentName);
    setCareerImage(careerData);
    setStage("result");
    stableSaveRecord(studentName, studentCareer);
  };

  return (
    <div style={{
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(to bottom right, #6b21a8, #312e81, #1e3a8a)'
    }}>
      <style>{`
        button:hover { opacity: 0.9; }
        input::placeholder { opacity: 0.7; }
        * { box-sizing: border-box; }
      `}</style>
      
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        zIndex: 10,
        flexWrap: 'wrap',
        justifyContent: 'flex-end'
      }}>
        {role === 'admin' && (
          <motion.button
            onClick={() => setStage('admin_panel')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'black',
              fontSize: '14px',
              fontWeight: '700',
              padding: '8px 16px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: '#eab308'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShieldCheck size={16} /> Admin Panel
          </motion.button>
        )}
        <motion.button
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            color: 'white',
            fontSize: '14px',
            padding: '8px 16px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LogOut size={16} /> Logout
        </motion.button>
      </div>

      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: 'clamp(28px, 8vw, 56px)',
          fontWeight: '900',
          color: 'white',
          textShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
          marginBottom: '8px'
        }}>
          Career Visualizer <span style={{ color: '#d8b4fe' }}>AI</span>
        </h1>
        <div style={{
          fontSize: '14px',
          color: 'white',
          marginTop: '8px',
          opacity: 0.7
        }}>✨ See Your Future Self! ✨</div>
      </div>

      <div style={{
        width: '100%',
        maxWidth: '500px',
        position: 'relative'
      }}>
        {listening && (
          <motion.div
            style={{
              position: 'absolute',
              inset: '-16px',
              borderRadius: '9999px',
              filter: 'blur(32px)',
              pointerEvents: 'none',
              backgroundColor: '#a855f7',
              opacity: 0.5
            }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        <div style={{
          position: 'relative',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          overflow: 'hidden',
          ...(stage === 'result' ? {} : {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          })
        }}>
          <AnimatePresence mode="wait">

            {stage === "start" && (
              <motion.div
                key="start"
                style={{
                  padding: '32px',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px'
                }}
                variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}
              >
                <p style={{ fontSize: '20px', color: 'white', opacity: 0.9 }}>Ready for your future?</p>
                <motion.button
                  onClick={() => setStage("camera_demo")}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    padding: '12px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    marginTop: '16px',
                    background: 'linear-gradient(to right, #9333ea, #4f46e5)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Camera size={24} /> Open Camera
                </motion.button>
              </motion.div>
            )}

            {stage === "camera_demo" && (
              <motion.div
                key="camera_demo"
                style={{
                  padding: '24px',
                  textAlign: 'center'
                }}
                variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}
              >
                <p style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: 'white',
                  opacity: 0.9
                }}>Hello! Smile!</p>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    transform: 'scaleX(-1)'
                  }}
                />
              </motion.div>
            )}

            {stage === "listen" && (
              <motion.div
                key="listen"
                style={{
                  padding: '32px',
                  textAlign: 'center'
                }}
                variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}
              >
                <p style={{
                  fontSize: '18px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: 0.9
                }}><Mic size={24} /> What do you want to be?</p>
                <p style={{
                  fontSize: '14px',
                  color: 'white',
                  marginBottom: '16px',
                  opacity: 0.7
                }}>e.g., "My name is John and I want to be a doctor"</p>
                {listening && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '16px',
                    marginBottom: '16px'
                  }}>
                    <motion.div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#ef4444'
                      }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <p style={{
                      marginLeft: '12px',
                      fontWeight: '600',
                      color: '#f87171'
                    }}>Listening...</p>
                  </div>
                )}
              </motion.div>
            )}

            {showValidation && !validationData.career && (
              <motion.div
                key="validation"
                style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  maxWidth: '600px',
                  width: '100%'
                }}
                variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}
              >
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  padding: '24px',
                  textAlign: 'center',
                  width: '100%'
                }}>
                  <p style={{
                    color: 'white',
                    fontSize: '16px',
                    marginBottom: '16px',
                    opacity: 0.9
                  }}>You said:</p>
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '16px',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    marginBottom: '16px',
                    minHeight: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    "{recognizedText}"
                  </div>
                  <p style={{
                    color: '#fbbf24',
                    fontSize: '14px',
                    marginTop: '8px'
                  }}>Couldn't extract career info. Please confirm or try again.</p>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  width: '100%'
                }}>
                  <motion.button
                    onClick={() => {
                      setShowValidation(false);
                      startVoiceRecognition();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(59, 130, 246, 0.5)',
                      transition: 'all 0.3s ease'
                    }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.7)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mic size={18} /> Try Again
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setShowValidation(false);
                      setStage("manual");
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(107, 114, 128, 0.5)',
                      transition: 'all 0.3s ease'
                    }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(107, 114, 128, 0.7)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={18} /> Type Manually
                  </motion.button>
                </div>
              </motion.div>
            )}

            {showValidation && validationData.career && (
              <motion.div
                key="validation-success"
                style={{
                  padding: '32px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  maxWidth: '600px',
                  width: '100%'
                }}
                variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}
              >
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  padding: '24px',
                  textAlign: 'center',
                  width: '100%'
                }}>
                  <p style={{
                    color: 'white',
                    fontSize: '16px',
                    marginBottom: '16px',
                    fontWeight: '600'
                  }}>You said:</p>
                  <div style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    padding: '16px',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    marginBottom: '24px'
                  }}>
                    "{recognizedText}"
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      borderRadius: '10px',
                      border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}>
                      <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>Name</p>
                      <p style={{ fontSize: '16px', fontWeight: '600', color: '#86efac' }}>{validationData.name || "—"}</p>
                    </div>
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      borderRadius: '10px',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}>
                      <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px' }}>Career</p>
                      <p style={{ fontSize: '16px', fontWeight: '600', color: '#93c5fd' }}>{validationData.career}</p>
                    </div>
                  </div>

                  <p style={{
                    color: '#fbbf24',
                    fontSize: '14px'
                  }}>Is this correct?</p>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  width: '100%'
                }}>
                  <motion.button
                    onClick={() => {
                      setShowValidation(false);
                      setConfirmedData(validationData);
                      setStage("confirm-name");
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      background: 'linear-gradient(to right, #22c55e, #059669)',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    ✓ Yes, Confirm
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setShowValidation(false);
                      startVoiceRecognition();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(59, 130, 246, 0.5)',
                      transition: 'all 0.3s ease'
                    }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.7)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Mic size={18} /> No, Try Again
                  </motion.button>

                  <motion.button
                    onClick={() => {
                      setShowValidation(false);
                      setStage("manual");
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: '600',
                      padding: '12px',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(107, 114, 128, 0.5)',
                      transition: 'all 0.3s ease'
                    }}
                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(107, 114, 128, 0.7)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Send size={18} /> Type Manually
                  </motion.button>
                </div>
              </motion.div>
            )}

            {stage === "confirm-name" && (
              <motion.form
                key="confirm-name"
                onSubmit={(e) => {
                  e.preventDefault();
                  const careerData = getCareerData(confirmedData.career, name);
                  setCareerImage(careerData);
                  setStage("result");
                  stableSaveRecord(name, confirmedData.career);
                }}
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
                variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}
              >
                <p style={{
                  textAlign: 'center',
                  color: 'white',
                  opacity: 0.9,
                  fontSize: '16px'
                }}>Please confirm your name spelling.</p>
                
                <div style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  <User size={20} style={{
                    color: 'white',
                    marginRight: '12px',
                    opacity: 0.7,
                    flex: '0 0 auto'
                  }} />
                  <input
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'transparent',
                      color: 'white',
                      padding: '8px 0',
                      border: 'none',
                      outline: 'none',
                      fontSize: '18px'
                    }}
                  />
                </div>

                <div style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  opacity: 0.6,
                  pointerEvents: 'none'
                }}>
                  <Briefcase size={20} style={{
                    color: 'white',
                    marginRight: '12px',
                    opacity: 0.7,
                    flex: '0 0 auto'
                  }} />
                  <input
                    type="text"
                    placeholder="Your dream career"
                    value={confirmedData.career}
                    disabled
                    style={{
                      width: '100%',
                      backgroundColor: 'transparent',
                      color: 'white',
                      padding: '8px 0',
                      border: 'none',
                      outline: 'none',
                      fontSize: '18px',
                      cursor: 'not-allowed',
                      opacity: 0.7
                    }}
                  />
                </div>

                <motion.button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    padding: '12px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    marginTop: '16px',
                    background: 'linear-gradient(to right, #22c55e, #059669)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  ✓ Confirm
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => {
                    setShowValidation(false);
                    startVoiceRecognition();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: '600',
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(59, 130, 246, 0.7)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mic size={18} /> Try Again
                </motion.button>
              </motion.form>
            )}

            {stage === "manual" && (
              <motion.form
                key="manual"
                onSubmit={handleManualSubmit}
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}
                variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}
              >
                <p style={{
                  textAlign: 'center',
                  color: 'white',
                  opacity: 0.9
                }}>Oops! Please type your career.</p>
                
                <div style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  <User size={20} style={{
                    color: 'white',
                    marginRight: '12px',
                    opacity: 0.7,
                    flex: '0 0 auto'
                  }} />
                  <input
                    required
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      backgroundColor: 'transparent',
                      color: 'white',
                      padding: '8px 0',
                      border: 'none',
                      outline: 'none',
                      fontSize: '18px'
                    }}
                  />
                </div>

                <div style={{
                  position: 'relative',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  borderBottom: '2px solid rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}>
                  <Briefcase size={20} style={{
                    color: 'white',
                    marginRight: '12px',
                    opacity: 0.7,
                    flex: '0 0 auto'
                  }} />
                  <input
                    type="text"
                    placeholder="Your dream career"
                    value={career}
                    onChange={(e) => setCareer(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      backgroundColor: 'transparent',
                      color: 'white',
                      padding: '8px 0',
                      border: 'none',
                      outline: 'none',
                      fontSize: '18px'
                    }}
                  />
                </div>

                <motion.button
                  type="submit"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: '600',
                    padding: '12px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    marginTop: '16px',
                    background: 'linear-gradient(to right, #9333ea, #4f46e5)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0px 8px 20px rgba(0,0,0,0.3)" }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Send size={20} /> Visualize!
                </motion.button>
              </motion.form>
            )}

            {stage === "result" && careerImage && (
              <motion.div
                key="result"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: '100%',
                  gap: '24px',
                  padding: '32px'
                }}
                variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}
              >
                <div
                  ref={resultRef}
                  style={{
                    padding: '24px',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: '24px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                    width: '100%',
                    maxWidth: '500px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <h2 style={{
                    fontSize: 'clamp(20px, 6vw, 36px)',
                    fontWeight: '700',
                    marginBottom: '24px',
                    paddingX: '16px',
                    color: 'white',
                    opacity: 0.9,
                    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
                  }}>
                    {careerImage.title}
                  </h2>

                  <motion.div
                    variants={popInVariant}
                    initial="hidden"
                    animate="visible"
                    style={{
                      position: 'relative',
                      width: '200px',
                      height: '200px',
                      marginBottom: '24px'
                    }}
                  >
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: '-24px',
                        right: '-24px',
                        zIndex: 10,
                        color: '#facc15'
                      }}
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles size={40} fill="currentColor" />
                    </motion.div>

                    <motion.div
                      style={{
                        position: 'absolute',
                        bottom: '-24px',
                        left: '-24px',
                        zIndex: 10,
                        color: '#fde047'
                      }}
                      animate={{ rotate: -360, scale: [1, 1.3, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    >
                      <Sparkles size={35} fill="currentColor" />
                    </motion.div>

                    <motion.img
                      src={careerImage.src}
                      alt={careerImage.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        padding: '8px',
                        borderRadius: '12px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
                        border: '4px solid white',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)'
                      }}
                    />
                  </motion.div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '12px',
                  width: '100%',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  maxWidth: '600px'
                }}>
                  <motion.button
                    onClick={goBackToStart}
                    style={{
                      flex: '1 1 120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '14px',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play size={18} /> Play Again
                  </motion.button>

                  <motion.button
                    onClick={handleDownload}
                    style={{
                      flex: '1 1 120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '14px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: '#9333ea'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Download size={18} /> Download
                  </motion.button>

                  <motion.button
                    onClick={handleNextCandidate}
                    style={{
                      flex: '1 1 120px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      fontWeight: '600',
                      fontSize: '14px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.3s ease',
                      border: 'none',
                      cursor: 'pointer',
                      background: 'linear-gradient(to right, #22c55e, #059669)'
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next <ArrowRight size={18} />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {stage === "admin_panel" && role === 'admin' && (
              <motion.div
                key="admin_panel"
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  borderRadius: '24px',
                  width: '100%',
                  maxWidth: '600px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
                variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition}
              >
                <h2 style={{
                  fontSize: 'clamp(20px, 6vw, 32px)',
                  fontWeight: '700',
                  marginBottom: '24px',
                  color: 'white',
                  opacity: 0.9
                }}>Admin Panel</h2>
                <div style={{
                  textAlign: 'left',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  opacity: 0.8,
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    marginBottom: '8px'
                  }}>How to Create New Users</h3>
                  <p style={{
                    fontSize: '14px',
                    marginBottom: '12px'
                  }}>To create a new user, you must contact the developer.</p>
                  <p style={{
                    fontSize: '14px'
                  }}>This is a manual process where the developer will add the new user's email and password directly to the server code to ensure security.</p>
                </div>
                <motion.button
                  onClick={goBackToStart}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={18} /> Back to App
                </motion.button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const logged = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn');
    const role = typeof window !== 'undefined' && localStorage.getItem('userRole');

    if (!logged) {
      router.push('/login');
    } else {
      setIsLoggedIn(true);
      setUserRole(role);
      setLoaded(true);
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
    }
    setIsLoggedIn(false);
    setUserRole(null);
    router.push('/login');
  };

  if (!loaded) {
    return <div style={{ background: 'linear-gradient(to bottom right, #6b21a8, #312e81, #1e3a8a)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Loading...</div>;
  }

  return <CareerVisualizer role={userRole} onLogout={handleLogout} />;
}
