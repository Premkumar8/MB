"use client";

import React, { useState, useRef, useEffect } from "react";
import { Camera, Image as ImageIcon, Sliders, Play, Sparkles, Download, Share2, HelpCircle } from "lucide-react";

interface RoomTemplate {
  id: string;
  name: string;
  beforeUrl: string;
  afterUrls: { [key: string]: string };
}

export default function VisualizerPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("kitchen");
  const [selectedStone, setSelectedStone] = useState<string>("Carrara Gold");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Visualizer processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [showResult, setShowResult] = useState(true);

  // Split-screen slider coordinate state
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 - 100)
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const roomTemplates: RoomTemplate[] = [
    {
      id: "kitchen",
      name: "Luxury Kitchen Island",
      beforeUrl: "/static/seed/blog2.jpg", // Gray minimalist room base
      afterUrls: {
        "Carrara Gold": "/static/seed/carrara_gold.jpg",
        "Nero Marquina": "/static/seed/nero_marquina.jpg",
        "Emerald Onyx": "/static/seed/emerald_onyx.jpg",
        "Calacatta Viola": "/static/seed/calacatta_viola.jpg",
        "Taj Mahal": "/static/seed/taj_mahal.jpg",
      },
    },
    {
      id: "bathroom",
      name: "Boutique Guest Bathroom",
      beforeUrl: "/static/seed/blog1.jpg",
      afterUrls: {
        "Carrara Gold": "/static/seed/carrara_gold.jpg",
        "Nero Marquina": "/static/seed/nero_marquina.jpg",
        "Emerald Onyx": "/static/seed/emerald_onyx.jpg",
        "Calacatta Viola": "/static/seed/calacatta_viola.jpg",
        "Taj Mahal": "/static/seed/taj_mahal.jpg",
      },
    },
  ];

  const stoneTextures = [
    { name: "Carrara Gold", color: "bg-[#f5edd9]" },
    { name: "Nero Marquina", color: "bg-black" },
    { name: "Emerald Onyx", color: "bg-[#1b4d3e]" },
    { name: "Calacatta Viola", color: "bg-[#4a1525]" },
    { name: "Taj Mahal", color: "bg-[#e8e5dc]" },
  ];

  const activeTemplateData = roomTemplates.find((t) => t.id === selectedTemplate);

  // AI Pipeline text sequence
  const processingSteps = [
    "Reading room structural points...",
    "Isolating backsplash and island surfaces...",
    "Calibrating diffuse refraction mappings...",
    "Compositing high-resolution marble veins...",
    "Finalizing lighting vector shadows...",
  ];

  const runVisualizer = () => {
    setIsProcessing(true);
    setProcessingStep(0);
    setShowResult(false);
  };

  useEffect(() => {
    if (!isProcessing) return;

    const interval = setInterval(() => {
      setProcessingStep((prev) => {
        if (prev < processingSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          setIsProcessing(false);
          setShowResult(true);
          return 0;
        }
      });
    }, 900);

    return () => clearInterval(interval);
  }, [isProcessing]);

  // Handle slider events
  const handleMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      isDragging.current = false;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      handleMove(e.clientX);
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      if (e.touches[0]) {
        handleMove(e.touches[0].clientX);
      }
    };

    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchend", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchend", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setSelectedTemplate("custom");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 space-y-12">
      {/* Header */}
      <div className="space-y-4 text-center">
        <span className="text-[10px] tracking-[0.3em] text-gold-500 uppercase font-bold">
          Neural Rendering
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light tracking-wide">
          AI Room <span className="font-bold text-gold-gradient">Visualizer</span>
        </h1>
        <p className="text-xs text-black/50 dark:text-white/40 max-w-xl mx-auto leading-relaxed">
          Instantly replace countertops and flooring with custom natural stone. Select a workspace template or upload an image, configure your desired slab lot, and trigger our segmentation models.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Controls Panel */}
        <div className="lg:col-span-4 glass-premium p-6 space-y-6">
          
          {/* Template Selectors */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-black/50 dark:text-white/40">
              1. Choose Environment
            </label>
            <div className="grid grid-cols-2 gap-2">
              {roomTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTemplate(t.id);
                    setUploadedImage(null);
                  }}
                  className={`px-3 py-2 text-[10px] uppercase tracking-widest font-semibold border text-center transition-all ${
                    selectedTemplate === t.id && !uploadedImage
                      ? "border-gold-500 text-gold-500 bg-gold-500/5"
                      : "border-black/10 dark:border-white/10 text-black/60 dark:text-white/60 hover:border-gold-500/30"
                  }`}
                >
                  {t.name.split(" ")[1]} Room
                </button>
              ))}
            </div>
          </div>

          {/* Image Uploader */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-black/50 dark:text-white/40">
              OR Upload Custom Photograph
            </label>
            <div className="relative border border-dashed border-black/25 dark:border-white/10 p-4 text-center group cursor-pointer hover:border-gold-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center space-y-2">
                <Camera className="w-5 h-5 text-black/40 dark:text-white/40 group-hover:text-gold-500" />
                <span className="text-[10px] uppercase tracking-widest text-black/50 dark:text-white/40">
                  {uploadedImage ? "Replace Image" : "Upload JPEG / PNG"}
                </span>
              </div>
            </div>
          </div>

          {/* Stone Selector */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-widest font-semibold text-black/50 dark:text-white/40">
              2. Select Natural Stone Lot
            </label>
            <div className="grid grid-cols-1 gap-2">
              {stoneTextures.map((stone) => (
                <button
                  key={stone.name}
                  onClick={() => setSelectedStone(stone.name)}
                  className={`flex items-center space-x-3 px-3 py-2.5 border text-left transition-all ${
                    selectedStone === stone.name
                      ? "border-gold-500 text-gold-500 bg-gold-500/5"
                      : "border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:border-gold-500/30"
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${stone.color} border border-white/20`} />
                  <span className="text-[10px] tracking-widest uppercase font-semibold">{stone.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trigger button */}
          <button
            onClick={runVisualizer}
            disabled={isProcessing}
            className="w-full btn-gold-solid text-center flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isProcessing ? "Processing..." : "Run AI Visualizer"}</span>
          </button>
        </div>

        {/* Workspace Canvas Container */}
        <div className="lg:col-span-8 flex flex-col items-center">
          
          {/* Canvas Box */}
          <div
            ref={sliderContainerRef}
            className="w-full aspect-[4/3] bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 relative overflow-hidden select-none"
          >
            {isProcessing && (
              <div className="absolute inset-0 bg-black/75 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-4 text-white">
                <Sparkles className="w-8 h-8 text-gold-500 animate-spin" />
                <div className="space-y-1 text-center">
                  <p className="text-xs uppercase tracking-widest font-semibold text-gold-500">
                    Compositing Texture Lot
                  </p>
                  <p className="text-[10px] text-white/50 tracking-wider transition-all duration-300">
                    {processingSteps[processingStep]}
                  </p>
                </div>
              </div>
            )}

            {!isProcessing && showResult && activeTemplateData ? (
              // Split comparison slider component
              <div className="w-full h-full relative">
                {/* Background: Original Before view */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${uploadedImage || activeTemplateData.beforeUrl})`,
                  }}
                >
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 text-[9px] uppercase tracking-widest text-white font-semibold">
                    Original Surface
                  </div>
                </div>

                {/* Foreground: Visualized After view (clipped width) */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${activeTemplateData.afterUrls[selectedStone]})`,
                    width: `${sliderPosition}%`,
                  }}
                >
                  {/* Keep text absolute based on full container width by using a fixed parent size */}
                  <div className="absolute bottom-4 left-4 w-[200px] pointer-events-none">
                    <div className="bg-gold-500 text-black px-3 py-1.5 text-[9px] uppercase tracking-widest font-bold whitespace-nowrap">
                      {selectedStone} applied
                    </div>
                  </div>
                </div>

                {/* Draggable Divider Handle */}
                <div
                  className="absolute inset-y-0 w-[2px] bg-gold-500 cursor-ew-resize z-20 flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleMouseDown}
                >
                  <div className="w-8 h-8 rounded-full bg-gold-500 text-black shadow-lg flex items-center justify-center border border-white">
                    <Sliders className="w-3.5 h-3.5 rotate-90" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-black/40 dark:text-white/30 space-y-3">
                <ImageIcon className="w-8 h-8" />
                <span className="text-[10px] uppercase tracking-widest">Select environment to visualize</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {showResult && !isProcessing && (
            <div className="w-full flex justify-between items-center mt-4">
              <span className="text-[10px] uppercase tracking-wider text-black/50 dark:text-white/40 flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-gold-500" />
                <span>Drag center bar to compare texture overlaps</span>
              </span>

              <div className="flex space-x-3">
                <button
                  onClick={() => alert("Image download prepared in high resolution.")}
                  className="p-2 border border-black/10 dark:border-white/10 hover:border-gold-500 text-black dark:text-white flex items-center space-x-1.5 text-[10px] uppercase tracking-widest font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => alert("Visualizer comparison share link copied to clipboard.")}
                  className="p-2 border border-black/10 dark:border-white/10 hover:border-gold-500 text-black dark:text-white flex items-center space-x-1.5 text-[10px] uppercase tracking-widest font-semibold transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
