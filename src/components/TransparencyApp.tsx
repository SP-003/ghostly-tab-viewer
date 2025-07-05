
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Eye, EyeOff, Keyboard, Palette, Mail, Info, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const TransparencyApp = () => {
  const [isTransparent, setIsTransparent] = useState(false);
  const [opacity, setOpacity] = useState([50]);
  const [enableKeyboard, setEnableKeyboard] = useState(true);
  const [customColor, setCustomColor] = useState('#4169E1');

  const toggleTransparency = useCallback(() => {
    setIsTransparent(prev => {
      const newState = !prev;
      toast(newState ? "Transparency activated" : "Transparency deactivated", {
        icon: newState ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />
      });
      return newState;
    });
  }, []);

  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Alt + F12 to toggle transparency (uncommon browser shortcut)
      if (event.altKey && event.key === 'F12') {
        event.preventDefault();
        toggleTransparency();
      }
      // Alt + F11 to disable transparency
      if (event.altKey && event.key === 'F11' && isTransparent) {
        event.preventDefault();
        setIsTransparent(false);
        toast("Transparency disabled");
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enableKeyboard, isTransparent, toggleTransparency]);

  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const backgroundStyle = isTransparent ? {
    background: `linear-gradient(45deg, 
      ${hexToRgba(customColor, opacity[0] / 200)} 0%, 
      ${hexToRgba(customColor, opacity[0] / 300)} 25%, 
      ${hexToRgba('#FFD700', opacity[0] / 200)} 50%, 
      ${hexToRgba('#FF6B6B', opacity[0] / 200)} 75%, 
      ${hexToRgba('#4ECDC4', opacity[0] / 200)} 100%)`,
    backdropFilter: 'blur(2px)',
    transition: 'all 0.3s ease-in-out'
  } : {
    background: `linear-gradient(135deg, ${customColor} 0%, #764ba2 100%)`,
    transition: 'all 0.3s ease-in-out'
  };

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={backgroundStyle}
    >
      {/* Desktop simulation pattern */}
      {isTransparent && (
        <div className="absolute inset-0 opacity-30">
          <div className="grid grid-cols-12 grid-rows-8 h-full gap-1 p-4">
            {Array.from({ length: 96 }).map((_, i) => (
              <div 
                key={i} 
                className="bg-gradient-to-br from-blue-100 to-green-100 rounded-sm opacity-50 animate-pulse-custom"
                style={{
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Ghostify Tab - Web Extension
            </h1>
            <p className="text-white/80 text-lg">
              Web transparency simulator - Press Alt+F12 or use controls below
            </p>
          </div>

          {/* Control Panel */}
          <Card className={`mb-8 transition-all duration-300 ${
            isTransparent ? 'bg-white/10 backdrop-blur-md border-white/20' : 'bg-white/95'
          }`}>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="space-y-2">
                  <label className={`font-medium ${isTransparent ? 'text-white' : 'text-gray-700'}`}>
                    Transparency Mode
                  </label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isTransparent}
                      onCheckedChange={setIsTransparent}
                    />
                    <span className={`text-sm ${isTransparent ? 'text-white/80' : 'text-gray-600'}`}>
                      {isTransparent ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`font-medium ${isTransparent ? 'text-white' : 'text-gray-700'}`}>
                    Opacity Level
                  </label>
                  <Slider
                    value={opacity}
                    onValueChange={setOpacity}
                    max={100}
                    min={5}
                    step={5}
                    className="w-full"
                  />
                  <span className={`text-sm ${isTransparent ? 'text-white/80' : 'text-gray-600'}`}>
                    {opacity[0]}%
                  </span>
                </div>

                <div className="space-y-2">
                  <label className={`font-medium ${isTransparent ? 'text-white' : 'text-gray-700'}`}>
                    Color Theme
                  </label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="color"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className="w-12 h-8 p-1 rounded cursor-pointer"
                    />
                    <Input
                      type="text"
                      value={customColor}
                      onChange={(e) => setCustomColor(e.target.value)}
                      className={`text-xs ${isTransparent ? 'bg-white/10 text-white border-white/30' : ''}`}
                      placeholder="#4169E1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`font-medium ${isTransparent ? 'text-white' : 'text-gray-700'}`}>
                    Keyboard Controls
                  </label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={enableKeyboard}
                      onCheckedChange={setEnableKeyboard}
                    />
                    <Keyboard className={`w-4 h-4 ${isTransparent ? 'text-white/80' : 'text-gray-600'}`} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`font-medium ${isTransparent ? 'text-white' : 'text-gray-700'}`}>
                    Quick Actions
                  </label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTransparency}
                    className={isTransparent ? 'border-white/30 text-white hover:bg-white/10' : ''}
                  >
                    {isTransparent ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
                    Toggle
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* How to Use */}
            <Card className={`transition-all duration-300 ${
              isTransparent ? 'bg-white/5 backdrop-blur-sm border-white/20' : 'bg-white'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <HelpCircle className={`w-5 h-5 mt-1 ${isTransparent ? 'text-white/80' : 'text-blue-500'}`} />
                  <div>
                    <h3 className={`text-xl font-semibold mb-4 ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                      How to Use
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className={`${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                        <strong>1. Install Extension:</strong> Load the extension folder in Chrome Developer Mode
                      </div>
                      <div className={`${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                        <strong>2. Toggle Mode:</strong> Use Alt+F12 or click the extension icon
                      </div>
                      <div className={`${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                        <strong>3. Customize:</strong> Adjust opacity and colors via popup
                      </div>
                      <div className={`${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                        <strong>4. Disable:</strong> Press Alt+F11 to quickly turn off
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About Extension */}
            <Card className={`transition-all duration-300 ${
              isTransparent ? 'bg-white/5 backdrop-blur-sm border-white/20' : 'bg-white'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Info className={`w-5 h-5 mt-1 ${isTransparent ? 'text-white/80' : 'text-green-500'}`} />
                  <div>
                    <h3 className={`text-xl font-semibold mb-4 ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                      About Extension
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className={`${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                        Ghostify Tab simulates browser transparency by overlaying colorful gradients on web pages.
                      </p>
                      <div className={`${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                        <strong>Features:</strong>
                        <ul className="list-disc list-inside mt-1 ml-2 space-y-1">
                          <li>Adjustable opacity (5-100%)</li>
                          <li>Custom color themes</li>
                          <li>Keyboard shortcuts</li>
                          <li>Works on all websites</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact */}
            <Card className={`transition-all duration-300 ${
              isTransparent ? 'bg-white/5 backdrop-blur-sm border-white/20' : 'bg-white'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <Mail className={`w-5 h-5 mt-1 ${isTransparent ? 'text-white/80' : 'text-purple-500'}`} />
                  <div>
                    <h3 className={`text-xl font-semibold mb-4 ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                      Contact & Support
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className={`${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                        Need help or have feedback?
                      </p>
                      <div className={`${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                        <strong>Developer:</strong> Ghostify Team
                      </div>
                      <div className={`${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                        <strong>Email:</strong>{' '}
                        <a 
                          href="mailto:saymyname355601@gmail.com" 
                          className={`underline hover:opacity-80 ${isTransparent ? 'text-blue-300' : 'text-blue-600'}`}
                        >
                          saymyname355601@gmail.com
                        </a>
                      </div>
                      <p className={`text-xs mt-3 ${isTransparent ? 'text-white/70' : 'text-gray-500'}`}>
                        We appreciate your feedback and suggestions for improvement!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Deployment Instructions */}
          <Card className={`transition-all duration-300 ${
            isTransparent ? 'bg-white/5 backdrop-blur-sm border-white/20' : 'bg-white'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Settings className={`w-5 h-5 mt-1 ${isTransparent ? 'text-white/80' : 'text-gray-500'}`} />
                <div>
                  <h4 className={`font-semibold mb-3 ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                    Chrome Extension Installation Guide
                  </h4>
                  <div className={`text-sm space-y-2 ${isTransparent ? 'text-white/80' : 'text-gray-600'}`}>
                    <p><strong>Step 1:</strong> Open Chrome and go to <code className="bg-gray-100/20 px-1 rounded">chrome://extensions/</code></p>
                    <p><strong>Step 2:</strong> Enable "Developer mode" toggle in the top right</p>
                    <p><strong>Step 3:</strong> Click "Load unpacked" button</p>
                    <p><strong>Step 4:</strong> Select the <code className="bg-gray-100/20 px-1 rounded">public</code> folder containing manifest.json</p>
                    <p><strong>Step 5:</strong> The extension should now appear in your extensions list</p>
                    <p className="mt-3 text-xs opacity-80">
                      <strong>Note:</strong> For Chrome Web Store publication, you'll need to package the extension, 
                      create developer account, and follow Google's review process.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TransparencyApp;
