import {useEffect, useRef, useState} from 'react';
import {pagePath} from './routes';
const videoUrl =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_094145_4a271a6c-3869-4f1c-8aa7-aeb0cb227994.mp4';
export function CinematicHero() {
  const [playing, setPlaying] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      setAllowed(!media.matches);
      if (media.matches) {
        video.current?.pause();
        setPlaying(false);
      }
    };
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  async function toggle() {
    if (!video.current) return;
    if (playing) {
      video.current.pause();
      setPlaying(false);
    } else {
      try {
        await video.current.play();
        setPlaying(true);
      } catch {
        setFailed(true);
      }
    }
  }
  return (
    <section className="cinema-hero" aria-labelledby="cinema-title">
      <div className="cinema-atmosphere" aria-hidden="true" />
      {allowed && !failed && (
        <video
          ref={video}
          className="cinema-video"
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => {
            setFailed(true);
            setPlaying(false);
          }}
        />
      )}
      <div className="cinema-scrim" aria-hidden="true" />
      <div className="cinema-content">
        <div className="platform-badges">
          <span>React Web</span>
          <span>React Native</span>
          <span>iOS + Android</span>
        </div>
        <h1 id="cinema-title">
          One language.
          <br />
          Web & Native.
        </h1>
        <p className="cinema-lead">
          웹에서도, 앱에서도.
          <br />
          같은 API로 만드는 좋은 화면.
        </p>
        <p className="cinema-description">
          React와 React Native를 위한 50개의 컴포넌트.
          <br />
          Paper & Ink의 색, 여백, 디테일을 모든 화면에.
        </p>
        <div className="cinema-actions">
          <a className="action light" href={pagePath('/components')}>
            50개 컴포넌트 탐색 <span>↗</span>
          </a>
          <a className="cinema-native-link" href={pagePath('/react-native')}>
            React Native로 시작하기 ↗
          </a>
        </div>
      </div>
      <div className="cinema-bottom">
        <a href="#shared-api" className="cinema-scroll">
          같은 코드, 다른 화면 <span>↓</span>
        </a>
        <span className="cinema-version">woosign-system / v0.6.0</span>
        {allowed && !failed && (
          <button
            className="cinema-motion"
            onClick={toggle}
            aria-label={playing ? '배경 영상 일시정지' : '배경 영상 재생'}>
            {playing ? 'Ⅱ' : '▷'} <span>{playing ? '일시정지' : '재생'}</span>
          </button>
        )}
      </div>
    </section>
  );
}
