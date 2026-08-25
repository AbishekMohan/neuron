import HeroContent from '../components/HeroContent';
import BrainScene from '../components/BrainScene';
import ParticleText from '../components/ParticleText';
import LetterGlitch from '../components/LetterGlitch';
import PixelSnow from '../components/PixelSnow';

export default function Home() {
  return (
    <>
      <div className="relative z-0">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          {/* Deepest background layer: faint, blue-only glitching letters,
              well behind the brain and CodeBackdrop's own text/binary
              layer. Low opacity wrapper (cheap alpha blend, not extra
              compute) keeps it from competing with the actual content. */}
          <div className="absolute inset-0 opacity-[0.14]">
            <LetterGlitch glitchColors={['#0c1f3d', '#1e3a5f', '#38bdf8']} glitchSpeed={70} centerVignette outerVignette smooth />
          </div>

          {/* Gentle blue pixel-snow drifting across the hero. See
              PixelSnow.tsx for why its defaults are already turned down;
              this opacity wrapper turns it down further still. */}
          <div className="absolute inset-0 opacity-60 pointer-events-none">
            <PixelSnow color="#7dd3fc" direction={110} />
          </div>

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

          {/* Fades to fully solid black well before the hero's own hard
              bottom edge (h-screen + overflow-hidden clips at a hard
              pixel line), so the brain's bloom/glow never gets abruptly
              cut off right at that boundary. That hard clip-on-glow was
              the actual seam, not a color mismatch with the content
              below. Multiple stops (rather than a single via-color) ease
              the curve in gradually instead of ramping linearly, so there's
              no point where the eye can pick out a "line": it reaches
              solid black well before the edge and stays there. */}
          <div className="absolute inset-x-0 bottom-0 h-[70%] pointer-events-none bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.25)_30%,rgba(0,0,0,0.6)_50%,rgba(0,0,0,0.9)_68%,#000_82%,#000_100%)]" />
        </div>
      </div>

      <div className="relative z-10 -mt-[100vh]">
        <HeroContent />
      </div>
    </>
  );
}
