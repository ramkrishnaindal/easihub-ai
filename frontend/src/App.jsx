import { useState } from 'react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Card, CardContent, CardHeader } from './components/ui/card';
import { ChevronDown, ChevronUp, Send } from 'lucide-react';

export default function App() {
  const [activeFeature, setActiveFeature] = useState(null);
  const [activeCapability, setActiveCapability] = useState(null);
  const [showCapabilities, setShowCapabilities] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFeatureToggle = (index) => {
    setActiveFeature(activeFeature === index ? null : index);
  };

  const handleCapabilityToggle = (index) => {
    setActiveCapability(activeCapability === index ? null : index);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchQuery);
    // Implement search functionality
  };

  const selectOption = (option) => {
    setSearchQuery(option);
    // Additional logic for option selection
  };

  const features = [
    {
      icon: '🔎',
      title: 'Find Answers',
      description: 'Instantly search similar questions and solutions using our AI-powered search engine tailored to enterprise systems.',
      options: [
        'Search SAP integration solutions',
        'Find PLM implementation guides',
        'Discover ERP best practices',
        'Explore architecture patterns'
      ]
    },
    {
      icon: '📘',
      title: 'Ask from Docs',
      description: 'Ask questions directly from enterprise PDFs or articles like TOGAF, Aras admin guide, and more.',
      options: [
        'Ask from TOGAF documentation',
        'Query Aras admin guide',
        'Search SAP documentation',
        'Upload custom enterprise docs'
      ]
    },
    {
      icon: '🤖',
      title: 'Copilot',
      description: 'AI assistant that helps users post questions, configure workflows, or generate starter scripts.',
      options: [
        'Generate integration workflows',
        'Create API scripts',
        'Configure system settings',
        'Optimize technical questions'
      ]
    },
    {
      icon: '🔍',
      title: 'Smart Post',
      description: 'Improves user questions using AI: suggests better titles, adds tags, and organizes by software.',
      options: [
        'Improve question title',
        'Add relevant tags',
        'Categorize by software',
        'Suggest similar questions'
      ]
    },
    {
      icon: '📚',
      title: 'Learning Path',
      description: 'Get guided learning plans for mastering enterprise tools or roles.',
      options: [
        'Enterprise Architect track',
        'SAP integration specialist',
        'PLM consultant pathway',
        'Custom learning from job trends'
      ]
    },
    {
      icon: '🧭',
      title: 'EA Strategy',
      description: 'Helps define EA models like federated or agile EA based on organization type and maturity.',
      options: [
        'Define federated EA model',
        'Design agile EA approach',
        'Assess EA maturity',
        'Create EA governance framework'
      ]
    }
  ];

  const capabilities = [
    {
      icon: '📤',
      title: 'Doc Upload & RAG',
      description: 'Upload your documents and use Retrieval-Augmented Generation (RAG) to power context-aware answers.',
      options: [
        'Upload enterprise PDFs',
        'Query uploaded documents',
        'RAG-powered search',
        'Context-aware responses'
      ]
    },
    {
      icon: '📖',
      title: 'Glossary Assistant',
      description: 'Explain enterprise acronyms and concepts like TOGAF, BOM, RFC instantly.',
      options: [
        'Define TOGAF concepts',
        'Explain BOM structures',
        'Clarify RFC processes',
        'Enterprise terminology'
      ]
    },
    {
      icon: '📐',
      title: 'Blueprint Generator',
      description: 'Auto-generate system architecture diagrams based on user prompts.',
      options: [
        'Generate ERP diagrams',
        'Create PLM blueprints',
        'Design integration flows',
        'Architecture templates'
      ]
    },
    {
      icon: '📚',
      title: 'EA Framework Explorer',
      description: 'Explore major EA frameworks and tools like TOGAF, ArchiMate, Zachman with use case walkthroughs.',
      options: [
        'TOGAF walkthrough',
        'ArchiMate modeling',
        'Zachman framework',
        'Framework comparison'
      ]
    },
    {
      icon: '🔍',
      title: 'Capability Mapper',
      description: 'Visualize business capabilities and link them to systems or EA roadmaps.',
      options: [
        'Map business capabilities',
        'Link to systems',
        'EA roadmap alignment',
        'Capability assessment'
      ]
    },
    {
      icon: '🔊',
      title: 'EA Chatroom',
      description: 'Join live expert discussions around EA, PLM, ERP, and integration strategy.',
      options: [
        'EA expert discussions',
        'PLM strategy talks',
        'ERP implementation chat',
        'Integration best practices'
      ]
    },
    {
      icon: '🔗',
      title: 'EASIHUB Content Insights',
      description: 'Enrich responses using EASIHUB articles, bulletins, and events based on your topic.',
      options: [
        'Article recommendations',
        'Bulletin insights',
        'Event suggestions',
        'Content enrichment'
      ]
    },
    {
      icon: '💼',
      title: 'Job-Aware Suggestions',
      description: 'Get job recommendations and role insights aligned with your technical questions.',
      options: [
        'Job recommendations',
        'Role insights',
        'Skill gap analysis',
        'Career path guidance'
      ]
    },
    {
      icon: '📊',
      title: 'Learning Path from Market Trends',
      description: 'Generate learning tracks based on skills extracted from real job listings.',
      options: [
        'Market trend analysis',
        'Skill extraction',
        'Learning recommendations',
        'Industry insights'
      ]
    },
    {
      icon: '🎓',
      title: 'Learning Track',
      description: 'Get guided learning plans for mastering enterprise tools or roles.',
      options: [
        'Guided learning plans',
        'Enterprise tool mastery',
        'Role-specific training',
        'Progress tracking'
      ]
    },
    {
      icon: '📎',
      title: 'Document Comparison',
      description: 'Compare versions of documents like specifications or checklists and highlight differences.',
      options: [
        'Version comparison',
        'Difference highlighting',
        'Specification analysis',
        'Checklist validation'
      ]
    },
    {
      icon: '📅',
      title: 'Integration Timeline Helper',
      description: 'Build rollout timelines for ERP/PLM projects with integration checkpoints.',
      options: [
        'Project timelines',
        'Integration checkpoints',
        'Milestone tracking',
        'Rollout planning'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white" style={{fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: '14px', fontWeight: 400, lineHeight: 1.6}}>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto" style={{maxWidth: '1200px', padding: '0 20px'}}>
          <div className="flex items-center justify-between" style={{padding: '16px 0'}}>
            <div className="text-2xl font-extrabold text-primary tracking-tighter">EASIHUB</div>
            <div className="flex gap-3">
              <Button variant="ghost" className="bg-primary/10 text-primary">Log In</Button>
              <Button className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto" style={{maxWidth: '1200px', padding: '60px 40px'}}>
        <section className="text-center" style={{marginBottom: '50px'}}>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            AI Copilot for Enterprise Developers, Architects, and Consultants
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Ask technical questions, generate architectures, explore learning paths, or analyze enterprise documents with AI—all in one place.
          </p>
          
          <div className="relative max-w-2xl mx-auto mb-8">
            <Input
              type="text"
              placeholder="e.g. How to integrate SAP with Salesforce? or Generate architecture for PLM-ERP"
              className="pl-4 pr-12 py-6 rounded-full border-2 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              size="icon" 
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full h-10 w-10"
              onClick={handleSearch}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mb-4">
            <Button 
              variant="outline" 
              className="bg-blue-50 text-primary border-blue-100"
              onClick={() => selectOption('Show me an ERP-PLM integration plan')}
            >
              Try Sample: "ERP-PLM Integration Plan"
            </Button>
          </div>
          
          <a href="#" className="text-primary font-medium text-sm">
            Sign in to unlock advanced features like Copilot and Ask from Docs →
          </a>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{gap: '20px', marginBottom: '50px'}}>
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md ${activeFeature === index ? 'border-primary shadow-md' : 'border-gray-200'}`}
              onClick={() => handleFeatureToggle(index)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    <span className="text-2xl">{feature.icon}</span>
                    {feature.title}
                  </div>
                  <div className={`text-primary transition-transform duration-300 ${activeFeature === index ? 'rotate-180' : ''}`}>
                    <ChevronDown size={18} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{feature.description}</p>
                
                {activeFeature === index && (
                  <div className="pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    {feature.options.map((option, optIndex) => (
                      <div 
                        key={optIndex}
                        className="flex justify-between items-center p-3 mb-1 text-sm bg-gray-50/70 border border-gray-100/60 rounded hover:bg-gray-100/85 hover:border-gray-200/80 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectOption(option);
                        }}
                      >
                        <span className="text-gray-600">{option}</span>
                        <span className="text-primary transition-transform group-hover:translate-x-0.5">→</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="text-center" style={{marginTop: '50px'}}>
          <div 
            className="flex items-center justify-center cursor-pointer rounded-xl hover:bg-primary/5 transition-colors"
            style={{gap: '16px', padding: '16px', marginBottom: '20px'}}
            onClick={() => setShowCapabilities(!showCapabilities)}
          >
            <h2 className="text-2xl font-bold text-gray-900">Explore More Capabilities</h2>
            <div className={`text-primary transition-transform duration-300 ${showCapabilities ? 'rotate-180' : ''}`}>
              <ChevronDown size={24} />
            </div>
          </div>

          {showCapabilities && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-top-4 duration-300" style={{gap: '16px', marginBottom: '30px'}}>
              {capabilities.map((capability, index) => (
                <div 
                  key={index}
                  className={`border border-[#e0e0e0] rounded-xl cursor-pointer transition-all hover:-translate-y-0.5 hover:border-[#4949fc] hover:shadow-md hover:bg-[rgba(255,255,255,0.6)] ${activeCapability === index ? 'border-[#4949fc] shadow-md bg-[rgba(255,255,255,0.8)]' : 'bg-transparent'}`}
                  style={{padding: '20px', fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}
                  onClick={() => handleCapabilityToggle(index)}
                  style={{fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}
                >
                  <div className="flex justify-between items-center" style={{marginBottom: '12px'}}>
                    <h3 className="flex items-center gap-2" style={{fontSize: '16px', fontWeight: 600, color: '#1a1a1a', fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>
                      <span className="text-xl">{capability.icon}</span>
                      {capability.title}
                    </h3>
                    <div className={`text-primary transition-transform duration-300 ${activeCapability === index ? 'rotate-180' : ''}`}>
                      <ChevronDown size={16} />
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-left" style={{color: '#666', fontSize: '14px', fontWeight: 400, lineHeight: 1.5, marginBottom: '16px', fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>{capability.description}</p>
                    
                    {activeCapability === index && (
                      <div className="border-t border-gray-100/40 animate-in fade-in slide-in-from-top-2 duration-300" style={{paddingTop: '16px', marginTop: '16px', borderTop: '1px solid rgba(73, 73, 252, 0.1)'}}>
                        {capability.options.map((option, optIndex) => (
                          <div 
                            key={optIndex}
                            className="flex justify-between items-center mb-1 bg-[rgba(248,250,252,0.7)] border border-[rgba(226,232,240,0.6)] rounded hover:bg-[rgba(241,245,249,0.85)] hover:border-[rgba(203,213,225,0.8)] cursor-pointer group"
                            style={{padding: '10px 14px', marginBottom: '4px', fontSize: '13px', fontWeight: 400, lineHeight: 1.2, color: '#475569', fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}
                            style={{fontSize: '13px', fontWeight: 400, lineHeight: 1.2, color: '#475569', fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}
                            onClick={(e) => {
                              e.stopPropagation();
                              selectOption(option);
                            }}
                          >
                            <span className="text-gray-600">{option}</span>
                            <span className="ml-2" style={{color: '#4949fc', fontWeight: 500, fontSize: '13px', fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"}}>→</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="text-center bg-gradient-to-r from-primary to-primary-dark text-white rounded-3xl shadow-xl" style={{marginTop: '60px', padding: '48px'}}>
          <h2 className="text-2xl font-bold mb-3">Ready to Transform Your Enterprise Development?</h2>
          <p className="mb-6 opacity-95">Join thousands of enterprise developers, architects, and consultants using EASIHUB AI</p>
          <Button 
            size="lg" 
            variant="secondary" 
            className="bg-white text-primary hover:bg-white/90 hover:-translate-y-0.5 transition-all shadow-md hover:shadow-lg px-7 py-3.5 font-semibold text-base"
          >
            Get Started Free
          </Button>
        </section>
      </main>
    </div>
  );
}