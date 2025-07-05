
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Settings, Eye, EyeOff, Keyboard } from 'lucide-react';
import { toast } from 'sonner';

const TransparencyApp = () => {
  const [isTransparent, setIsTransparent] = useState(false);
  const [opacity, setOpacity] = useState([50]);
  const [showSettings, setShowSettings] = useState(true);
  const [enableKeyboard, setEnableKeyboard] = useState(true);

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
      // Ctrl + Shift + T to toggle transparency
      if (event.ctrlKey && event.shiftKey && event.key === 'T') {
        event.preventDefault();
        toggleTransparency();
      }
      // Escape to disable transparency
      if (event.key === 'Escape' && isTransparent) {
        event.preventDefault();
        setIsTransparent(false);
        toast("Transparency disabled");
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [enableKeyboard, isTransparent, toggleTransparency]);

  const backgroundStyle = isTransparent ? {
    background: `linear-gradient(45deg, 
      rgba(0, 123, 255, ${opacity[0] / 200}) 0%, 
      rgba(40, 167, 69, ${opacity[0] / 200}) 25%, 
      rgba(255, 193, 7, ${opacity[0] / 200}) 50%, 
      rgba(220, 53, 69, ${opacity[0] / 200}) 75%, 
      rgba(108, 117, 125, ${opacity[0] / 200}) 100%)`,
    backdropFilter: 'blur(2px)',
    transition: 'all 0.3s ease-in-out'
  } : {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                className="bg-gradient-to-br from-blue-100 to-green-100 rounded-sm opacity-50"
                style={{
                  animationDelay: `${i * 0.1}s`,
                  animation: isTransparent ? 'pulse 2s infinite' : 'none'
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
              Ghostly Tab Viewer
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

          {/* Demo Content Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className={`transition-all duration-300 ${
              isTransparent ? 'bg-white/5 backdrop-blur-sm border-white/20' : 'bg-white'
            }`}>
              <CardContent className="p-6">
                <h3 className={`text-xl font-semibold mb-4 ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                  Keyboard Shortcuts
                </h3>
                <div className="space-y-2 text-sm">
                  <div className={`flex justify-between ${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                    <span>Toggle Transparency:</span>
                    <code className="bg-gray-100/20 px-2 py-1 rounded">Ctrl+Shift+T</code>
                  </div>
                  <div className={`flex justify-between ${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                    <span>Disable Mode:</span>
                    <code className="bg-gray-100/20 px-2 py-1 rounded">Escape</code>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={`transition-all duration-300 ${
              isTransparent ? 'bg-white/5 backdrop-blur-sm border-white/20' : 'bg-white'
            }`}>
              <CardContent className="p-6">
                <h3 className={`text-xl font-semibold mb-4 ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                  Status
                </h3>
                <div className="space-y-2 text-sm">
                  <div className={`flex justify-between ${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                    <span>Mode:</span>
                    <span className={`font-medium ${isTransparent ? 'text-green-300' : 'text-blue-600'}`}>
                      {isTransparent ? 'Transparent' : 'Normal'}
                    </span>
                  </div>
                  <div className={`flex justify-between ${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                    <span>Opacity:</span>
                    <span>{opacity[0]}%</span>
                  </div>
                  <div className={`flex justify-between ${isTransparent ? 'text-white/90' : 'text-gray-600'}`}>
                    <span>Keyboard:</span>
                    <span>{enableKeyboard ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Info Section */}
          <Card className={`mt-8 transition-all duration-300 ${
            isTransparent ? 'bg-white/5 backdrop-blur-sm border-white/20' : 'bg-white'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Settings className={`w-5 h-5 mt-1 ${isTransparent ? 'text-white/80' : 'text-gray-500'}`} />
                <div>
                  <h4 className={`font-semibold mb-2 ${isTransparent ? 'text-white' : 'text-gray-800'}`}>
                    About This Demo
                  </h4>
                  <p className={`text-sm leading-relaxed ${isTransparent ? 'text-white/80' : 'text-gray-600'}`}>
                    This is a web-based simulation of browser transparency effects. While true desktop transparency 
                    requires browser extensions or native applications, this demo shows how such effects might 
                    look and feel. The transparency mode creates visual layers and blur effects to simulate 
                    seeing through the browser to the desktop beneath.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default TransparencyApp;
