import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader } from './ui/card';
import { Send, ExternalLink, Calendar, User } from 'lucide-react';
import api from '../lib/api';

export default function Questions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [resultsDiscourse, setResultsDiscourse] = useState([]);
  const [resultsPerplexity, setResultsPerplexity] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    // http://localhost:5678/webhook/d43d97ef-9405-4dad-94e9-ad4f4564077d
    // http://localhost:5678/webhook/d43d97ef-9405-4dad-94e9-ad4f4564077d
    // http://localhost:5678/webhook/d43d97ef-9405-4dad-94e9-ad4f4564077d
    // http://localhost:5678/webhook/d43d97ef-9405-4dad-94e9-ad4f4564076d
    console.log(process.env.REACT_APP_API_BASE_URL);
    console.log(process.env.REACT_APP_DISCOURSE_BASE_URL);
    try {
      const response = await api.post('/webhook/d43d97ef-9405-4dad-94e9-ad4f4564077d', {
        message: searchQuery
      });
      debugger;
      setResultsDiscourse(response.data.map(result => ({
        
        ...result,
        post_url:result.post_url.map(url => `${process.env.REACT_APP_DISCOURSE_BASE_URL}/${url}`)
      })));
    
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
    try {
      const response = await api.post('/webhook/d43d97ef-9405-4dad-94e9-ad4f4564076d', {
        message: searchQuery
      });
      
      setResultsPerplexity(response.data);      
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleQuestion = () => {
    setSearchQuery('Generate architecture for PLM-ERP');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <section className="text-center" style={{ marginBottom: '50px' }}>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
        AI Copilot for Enterprise Developers, Architects, and Consultants
      </h1>
      <p className="text-gray-600 max-w-2xl mx-auto mb-8">
        Find Answers to your technical questions
        with AI—all in one place.
      </p>
      
      <div className="relative max-w-2xl mx-auto mb-8">
        <Input
          type="text"
          placeholder="e.g. How to integrate SAP with Salesforce? or Generate architecture for PLM-ERP"
          className="pl-4 pr-12 py-6 rounded-full border-2 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button 
          size="icon" 
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full h-10 w-10"
          onClick={handleSearch}
          disabled={loading}
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="mb-4">
        <Button 
          variant="outline" 
          className="bg-blue-50 text-primary border-blue-100"
          onClick={handleSampleQuestion}
        >
          Try Sample: "Generate architecture for PLM-ERP"
        </Button>
      </div>
      
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Searching...</p>
        </div>
      )}
      
      {resultsDiscourse.length > 0 && (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Results Discourse</h2>
          <div className="space-y-6">
            {resultsDiscourse.map((result, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{result.title}</h3>
                    {result.post_url && result.post_url[0] && (
                      <a 
                        href={result.post_url[0]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      <span>{result.created_by}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{result.created_at}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 text-left"
                    dangerouslySetInnerHTML={{ __html: result.description }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      {resultsPerplexity.length > 0 && (
        <div className="max-w-4xl mx-auto mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Search Results Perplexity</h2>
          <div className="space-y-6">
            {resultsPerplexity.map((result, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{result.title}</h3>
                    {result.post_url && result.post_url[0] && (
                      <a 
                        href={result.post_url[0]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      <span>{result.created_by}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{result.created_at}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div 
                    className="text-gray-700 leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 text-left"
                    dangerouslySetInnerHTML={{ __html: result.description }}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}