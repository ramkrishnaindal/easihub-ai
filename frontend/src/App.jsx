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
    // Add more capabilities as needed
  ];

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/80 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="text-2xl font-extrabold text-primary tracking-tighter">EASIHUB</div>
            <div className="flex gap-3">
              <Button variant="ghost" className="bg-primary/10 text-primary">Log In</Button>
              <Button className="shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all">Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-12">
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

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`cursor-pointer transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md ${activeFeature === index ? 'border-primary shadow-md' : ''}`}
              onClick={() => handleFeatureToggle(index)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 font-semibold">
                    <span className="text-2xl">{feature.icon}</span>
                    {feature.title}
                  </div>
                  <div className="text-primary">
                    {activeFeature === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                
                {activeFeature === index && (
                  <div className="pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                    {feature.options.map((option, optIndex) => (
                      <div 
                        key={optIndex}
                        className="flex justify-between items-center p-3 mb-1 text-sm bg-gray-50/70 border border-gray-100/60 rounded hover:bg-gray-100/80 hover:border-gray-200/80 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectOption(option);
                        }}
                      >
                        <span className="text-gray-600">{option}</span>
                        <span className="text-primary">→</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="mt-16 text-center">
          <div 
            className="flex items-center justify-center gap-4 cursor-pointer p-4 rounded-xl hover:bg-primary/5 transition-colors mb-6"
            onClick={() => setShowCapabilities(!showCapabilities)}
          >
            <h2 className="text-2xl font-bold">Explore More Capabilities</h2>
            <div className="text-primary">
              {showCapabilities ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
            </div>
          </div>

          {showCapabilities && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
              {capabilities.map((capability, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-md ${activeCapability === index ? 'border-primary shadow-md' : ''}`}
                  onClick={() => handleCapabilityToggle(index)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2 font-semibold">
                        <span className="text-xl">{capability.icon}</span>
                        {capability.title}
                      </div>
                      <div className="text-primary">
                        {activeCapability === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{capability.description}</p>
                    
                    {activeCapability === index && (
                      <div className="pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                        {capability.options.map((option, optIndex) => (
                          <div 
                            key={optIndex}
                            className="flex justify-between items-center p-3 mb-1 text-sm bg-gray-50/70 border border-gray-100/60 rounded hover:bg-gray-100/80 hover:border-gray-200/80 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              selectOption(option);
                            }}
                          >
                            <span className="text-gray-600">{option}</span>
                            <span className="text-primary">→</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="mt-16 bg-gradient-to-r from-primary to-primary-dark text-white rounded-3xl p-12 shadow-xl">
          <h2 className="text-2xl font-bold mb-3">Ready to Transform Your Enterprise Development?</h2>
          <p className="mb-6 opacity-95">Join thousands of enterprise developers, architects, and consultants using EASIHUB AI</p>
          <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90">
            Get Started Free
          </Button>
        </section>
      </main>
    </div>
  );
}