// components/CTA.js
const CTA = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4">Ready to Start?</h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of users who convert their files with confidence and ease
        </p>
        <button className="bg-white text-purple-500 px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 font-bold text-lg">
          Start Converting for Free
        </button>
      </div>
    </section>
  );
};

export default CTA;