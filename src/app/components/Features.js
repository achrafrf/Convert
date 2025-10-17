// components/Features.js
import { Shield, Zap, Sparkles } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "100% Secure",
      description: "Your files never reach our servers, processing happens directly in your browser"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Instant conversion without waiting, even for large files"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "High Quality",
      description: "Maintain your file quality with the best conversion algorithms"
    }
  ];

  return (
    <section className="py-16 bg-white/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 group hover:scale-105 transition-transform duration-300"
            >
              <div className="bg-gradient-to-r from-violet-500 to-violet-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                {feature.icon}
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;