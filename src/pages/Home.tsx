import HeroContent from '../components/HeroContent';
import BrainScene from '../components/BrainScene';
import ParticleText from '../components/ParticleText';

export default function Home() {
  return (
    <>
      <div className="relative z-0">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <BrainScene />

          {/* "AI" forms out of particles inside/over the brain on hover,
              layered above the (now transparent) brain canvas so the code
              backdrop still shows through around it. */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ParticleText
              text="AI"
              trigger="hover"
              color="#bfe4ff"
              highlightColor="#3b82f6"
              fontSize="clamp(4rem, 16vw, 11rem)"
              fontWeight={700}
              particleSize={2.5}
              density={3}
              scatter={140}
              gatherDuration={1400}
              stagger={360}
              pointerRepel={36}
              repelRadius={110}
              idleDrift={0.5}
              glow
              className="w-full h-full max-w-xl max-h-64"
            />
          </div>

          <div className="absolute inset-x-0 bottom-0 h-[40%] pointer-events-none bg-gradient-to-b from-transparent to-neuron-black" />
        </div>
      </div>

      <div className="relative z-10 -mt-[100vh]">
        <HeroContent />
      </div>
    </>
  );
}
