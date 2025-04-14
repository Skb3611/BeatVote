import { CheckCircle, Music, ThumbsUp, Users } from "lucide-react";

const WorkflowSection = () => {
  const steps = [
    {
      icon: <Music className="h-10 w-10 text-white" />,
      title: "Create a Room",
      description: "Set up your music room with a theme, name, and optional password for private sessions.",
      bgColor: "bg-primary",
    },
    {
      icon: <Users className="h-10 w-10 text-white" />,
      title: "Invite Friends",
      description: "Share your room link with friends so they can join your musical journey.",
      bgColor: "bg-secondary",
    },
    {
      icon: <Music className="h-10 w-10 text-white" />,
      title: "Add Songs",
      description: "Everyone can add their favorite tracks to the collaborative playlist.",
      bgColor: "bg-primary",
    },
    {
      icon: <ThumbsUp className="h-10 w-10 text-white" />,
      title: "Vote & Enjoy",
      description: "Vote on songs to determine what plays next, and enjoy the crowd-sourced playlist.",
      bgColor: "bg-secondary",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-music-accent/30">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How <span className="gradient-text">VibeRoom</span> Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Creating a collaborative music experience has never been easier.
            Follow these simple steps to get started with VibeRoom.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="absolute left-1/2 top-8 bottom-8 w-1 bg-card-foreground/20 -translate-x-1/2 hidden md:block"></div>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-16">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`relative card-hover mx-5 ${index % 2 === 0 ? 'md:translate-x-8' : 'md:-translate-x-8 md:mt-24'}`}
              >
                <div className="absolute left-1/2 top-1/3 w-6 h-6 -translate-x-1/2 -translate-y-1/2 hidden md:block">
                  <div className="w-6 h-6 rounded-full bg-card border-4 border-card-foreground"></div>
                </div>
                
                <div className="bg-card border border-card-foreground p-6 rounded-xl shadow-md relative z-10">
                  <div className="mb-4">
                    <div className={`w-16 h-16 rounded-2xl ${step.bgColor} flex items-center justify-center mb-4`}>
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{step.description}</p>
                  <div className="absolute -top-3 -right-3 bg-white rounded-full shadow p-1">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkflowSection;