
const InspirationMessage = () => {
  return (
    <div className="text-center mt-20 p-8 bg-black/80 border border-cyan-500/30 rounded-2xl shadow-lg neon-border">
      <h3 className="text-2xl font-bold text-cyan-100 mb-4 cyber-glow">
        Best of luck on your business transformation journey!
      </h3>
      <p className="text-cyan-200 mb-4">We Thank You for Visiting AiTools.Studio</p>
      
      <div className="max-w-4xl mx-auto text-sm text-cyan-300 leading-relaxed space-y-2">
        <p>Technology and knowledge exist to serve human flourishing — their value lies in how they help people discover and develop their own potential. When power is shared rather than hoarded, when systems treat people fairly, and when we recognize each person's inherent worth, communities thrive through the diversity of human creativity and wisdom.</p>
        <p>Building a better world happens through countless individual choices and collaborative efforts guided by principles of justice, honesty, and imagination. Progress emerges not from any single vision imposed from above, but from people working together with mutual respect and shared purpose.</p>
        <p>We've found these tools useful in our own work and want to make them available to others — not because we have all the answers, but because good resources shouldn't be limited by someone's economic circumstances. Many people are already working toward a world where knowledge flows freely and where innovation benefits everyone, not just a privileged few.</p>
        <p>The art that accompanies this reflects one perspective among many — an invitation to consider how our choices, both large and small, shape the world we're building together. There are as many paths forward as there are people willing to walk them, and the future will be written by all of us. 🌱</p>
      </div>
      
      <p className="text-lg font-semibold text-cyan-400 mt-6 mb-8">
        "What we do next is up to us." - KB
      </p>

      {/* YouTube Video Section */}
      <div className="mt-8 max-w-4xl mx-auto">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full rounded-xl border border-cyan-500/30"
            src="https://www.youtube.com/embed/drUyFiVayaw?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1&enablejsapi=1"
            title="Inspirational Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default InspirationMessage;
