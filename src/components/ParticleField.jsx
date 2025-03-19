import Particles from "react-tsparticles";

const ParticleField = () => {
  return (
    <Particles
      options={{
        background: {
          color: "transparent",
        },
        particles: {
          number: { value: 100 },
          color: { value: "#ffffff" },
          shape: { type: "circle" },
          opacity: { value: 0.3, random: true },
          size: { value: 2, random: true },
          move: {
            enable: true,
            speed: 0.6,
            direction: "none",
            random: true,
            straight: false,
          },
        },
      }}
    />
  );
};

export default ParticleField;
