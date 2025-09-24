const features = [
    { title: "Expert Coaches", icon: "🏏" },
    { title: "Flexible Slots", icon: "⏰" },
    { title: "Modern Facilities", icon: "🏟" },
    { title: "Affordable Pricing", icon: "💰" },
  ];
  
  export default function WhyJoinUs() {
    return (
      <section className="bg-gray-100 py-12 px-6">
        <h2 className="text-2xl font-bold text-center mb-8 text-black">
          Why Join Us?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="p-4 bg-white shadow-lg rounded-xl border border-gray-200"
            >
              <div className="text-3xl mb-2">{f.icon}</div>
              <h3 className="font-medium text-black">{f.title}</h3>
            </div>
          ))}
        </div>
      </section>
    );
  }
  