import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Eye, EyeOff, Keyboard, Palette, Shield, Info, Mail } from 'lucide-react';
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
      // Ctrl + Shift + Z to toggle transparency
      if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
        event.preventDefault();
        toggleTransparency();
      }
      // Ctrl + Shift + D to disable transparency
      if (event.ctrlKey && event.shiftKey && event.key === 'D' && isTransparent) {
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
    const b = parseInt(hex.slice(5, 7), 16);
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
      {/* Desktop simulation pattern - enhanced visibility */}
      {isTransparent && (
        <div className="absolute inset-0" style={{ opacity: Math.max(0.3, opacity[0] / 100) }}>
          <div className="grid grid-cols-12 grid-rows-8 h-full gap-1 p-4">
            {Array.from({ length: 96 }).map((_, i) => (
              <div 
                key={i} 
                className="bg-gradient-to-br from-white/40 to-white/20 rounded-sm animate-pulse-custom border border-white/10"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  opacity: Math.max(0.4, opacity[0] / 150),
                  backgroundColor: `rgba(255, 255, 255, ${Math.max(0.1, opacity[0] / 300)})`
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
              Web transparency simulator - Press Ctrl+Shift+T or use controls below
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

          {/* Information Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Keyboard Shortcuts Card */}
            <Card className={`transition-all duration-300 ${
              isTransparent ? 'bg-white/5 backdrop-blur-sm border-white/20' : 'bg-white'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Keyboard className={`w-5 h-5 ${isTransparent ? 'text-white/80' : 'text-gray-500'}`} />
                  <h3 className={`text-xl font-semibold ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                    Keyboard Shortcuts
                  </h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className={`flex justify-between items-center ${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                    <span>Toggle Transparency:</span>
                    <code className="bg-gray-100/20 px-2 py-1 rounded font-mono text-xs">Ctrl+Shift+Z</code>
                  </div>
                  <div className={`flex justify-between items-center ${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                    <span>Disable Mode:</span>
                    <code className="bg-gray-100/20 px-2 py-1 rounded font-mono text-xs">Ctrl+Shift+D</code>
                  </div>
                  <div className={`text-xs mt-3 p-2 rounded ${isTransparent ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <p className={isTransparent ? 'text-white/70' : 'text-gray-500'}>
                      Note: Extension shortcuts work globally across all browser tabs when the extension is installed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* How to Use Card */}
            <Card className={`transition-all duration-300 ${
              isTransparent ? 'bg-white/5 backdrop-blur-sm border-white/20' : 'bg-white'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Settings className={`w-5 h-5 ${isTransparent ? 'text-white/80' : 'text-gray-500'}`} />
                  <h3 className={`text-xl font-semibold ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                    How to Use
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className={`${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                    <p className="mb-2">1. Install the extension in Chrome Developer Mode</p>
                    <p className="mb-2">2. Click the extension icon or use Ctrl+Shift+T</p>
                    <p className="mb-2">3. Adjust opacity and color themes as needed</p>
                    <p className="mb-2">4. Use Ctrl+Shift+D to quickly disable</p>
                  </div>
                  <div className={`text-xs mt-3 p-2 rounded ${isTransparent ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <p className={isTransparent ? 'text-white/70' : 'text-gray-500'}>
                      Perfect for screenshot transparency, design overlays, or creative presentations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Privacy Benefits Card */}
            <Card className={`transition-all duration-300 ${
              isTransparent ? 'bg-white/5 backdrop-blur-sm border-white/20' : 'bg-white'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Shield className={`w-5 h-5 ${isTransparent ? 'text-white/80' : 'text-gray-500'}`} />
                  <h3 className={`text-xl font-semibold ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                    Privacy & Benefits
                  </h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className={`${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                    <p className="mb-2">• <strong>Screen Privacy:</strong> Hide sensitive content during screen sharing</p>
                    <p className="mb-2">• <strong>Presentation Mode:</strong> Create clean overlays for demos</p>
                    <p className="mb-2">• <strong>Local Processing:</strong> All effects run locally, no data sent</p>
                    <p className="mb-2">• <strong>Quick Toggle:</strong> Instant on/off for any situation</p>
                  </div>
                  <div className={`text-xs mt-3 p-2 rounded ${isTransparent ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <p className={isTransparent ? 'text-white/70' : 'text-gray-500'}>
                      No tracking, no data collection - your browsing stays private.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About & Contact Card */}
            <Card className={`transition-all duration-300 ${
              isTransparent ? 'bg-white/5 backdrop-blur-sm border-white/20' : 'bg-white'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Info className={`w-5 h-5 ${isTransparent ? 'text-white/80' : 'text-gray-500'}`} />
                  <h3 className={`text-xl font-semibold ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                    About & Contact
                  </h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className={`${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                    <p className="mb-3">Ghostify Tab is a web transparency extension that simulates transparent browser windows for enhanced privacy and presentation capabilities.</p>
                  </div>
                  <div className={`flex items-center space-x-2 p-2 rounded ${isTransparent ? 'bg-white/5' : 'bg-gray-50'}`}>
                    <Mail className={`w-4 h-4 ${isTransparent ? 'text-white/70' : 'text-gray-500'}`} />
                    <span className={`text-xs ${isTransparent ? 'text-white/80' : 'text-gray-600'}`}>
                      Support & Feedback:
                    </span>
                    <a 
                      href="mailto:saymyname355601@gmail.com"
                      className={`text-xs underline ${isTransparent ? 'text-blue-300 hover:text-blue-200' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                      saymyname355601@gmail.com
                    </a>
                  </div>
                  <div className={`text-xs ${isTransparent ? 'text-white/70' : 'text-gray-500'}`}>
                    Version 1.0.0 • Open source project • MIT License
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransparencyApp;
