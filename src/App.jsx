import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  ScrollControls,
  useScroll,
  PositionalAudio,
} from '@react-three/drei';
import React, { useMemo, useState, useEffect, Suspense, useRef } from 'react';

import { getProject, val } from '@theatre/core';

import {
  SheetProvider,
  PerspectiveCamera,
  useCurrentSheet,
} from '@theatre/r3f';

import FantasyBook from './modelComponents/FantasyBook';
import MobileOverlay from './helpers/MobileOverlay';
import CameraPositionLogger from './helpers/CameraPositionLogger';

import StartScreen from './StartScreen';
import ScenePopUp from './scenePopUps/ScenePopUp';
import MasterVolumeControl from './MasterVolumeControl';

import flyThroughState from './fly4.json';

export default function App() {
  //
  // ****************************
  // *****************Theatre.js
  // ****************************
  //
  const sheet = useMemo(
    () => getProject('Fly Through', { state: flyThroughState }).sheet('Scene'),
    []
  );
  //
  // ****************************
  // *****************AUDIO
  // ****************************

  const [audioReady, setAudioReady] = useState(false);

  useEffect(() => {
    const createAudioContext = () => {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContext();
      context.resume().then(() => {
        setAudioReady(true);
      });
    };

    const handleClick = () => {
      createAudioContext();
      document.removeEventListener('click', handleClick);
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const [isMuted, setIsMuted] = useState(true);
  const audio = useRef(new Audio('./audio/track1.wav'));
  const playbackPosition = useRef(0);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleSoundToggle = () => {
    setIsMuted((prevState) => !prevState);
  };

  const handleSoundToggleOnStart = () => {
    if (isMuted) {
      setIsMuted(false);
    }
  };

  const handlePause = () => {
    playbackPosition.current = audio.current.currentTime;
  };

  const handleEnded = () => {
    playbackPosition.current = 0;
  };

  const loadNewTrack = (trackPath) => {
    audio.current.src = trackPath;
  };

  useEffect(() => {
    audio.current.loop = true;

    audio.current.addEventListener('pause', handlePause);
    audio.current.addEventListener('ended', handleEnded);

    if (!isMuted) {
      audio.current.currentTime = playbackPosition.current;
      audio.current.play().catch((error) => {
        console.error('Error playing audio:', error);
      });
    } else {
      audio.current.pause();
    }

    return () => {
      audio.current.removeEventListener('pause', handlePause);
      audio.current.removeEventListener('ended', handleEnded);
      audio.current.pause();
    };
  }, [isMuted]);

  //
  //
  // ****************************
  // *****************SCENES
  // ****************************
  //
  // Initiate the currentPageValue state
  const [currentPageValue, setCurrentPageValue] = useState(0);
  //
  const [scene0, setScene0] = useState(false);
  const [scene1, setScene1] = useState(false);

  useEffect(() => {
    if (currentPageValue >= 0 && currentPageValue <= 2) {
      if (!scene0 && audioReady) {
        setScene0(true);
        setScene1(false);
      }
    } else if (currentPageValue >= 3 && currentPageValue <= 5) {
      if (!scene1) {
        setScene0(false);
        setScene1(true);
      }
    } else {
      setScene0(false);
      setScene1(false);
    }
  }, [currentPageValue]);

  useEffect(() => {
    if (scene0 && audioReady) {
      console.log('Scene0 is now true!');
      handlePause(); // Pause the current track
      loadNewTrack('./audio/track1.wav'); // Load track1.wav
      audio.current.currentTime = playbackPosition.current; // Set the playback position of track1.wav
      audio.current.play(); // Start playing track1.wav
    } else {
      console.log('Scene0 is now false!');
    }
  }, [scene0]);

  useEffect(() => {
    if (scene1) {
      console.log('Scene1 is now true!');
      handlePause(); // Pause the current track
      loadNewTrack('./audio/track2.wav'); // Load track2.wav
      audio.current.currentTime = playbackPosition.current; // Set the playback position of track2.wav
      audio.current.play(); // Start playing track2.wav
    } else {
      console.log('Scene1 is now false!');
    }
  }, [scene1]);

  //

  const [scene2, setScene2] = useState(false);

  useEffect(() => {
    if (currentPageValue === 6) {
      setScene2(true);
    } else {
      setScene2(false);
    }
  }, [currentPageValue]);

  useEffect(() => {
    if (scene2) {
      console.log('Scene2 is now true!');
    } else {
      console.log('Scene2 is now false!');
    }
  }, [scene2]);

  return (
    <>
      <div onClick={handleSoundToggleOnStart}>
        <StartScreen />
      </div>
      <button className='mute-button' onClick={handleSoundToggle}>
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
      {scene1 && <ScenePopUp header='The Windmill' />}
      {scene2 && <ScenePopUp header='Deers' />}
      <Canvas gl={{ preserveDrawingBuffer: true }}>
        <color attach='background' args={['black']} />
        <ScrollControls pages={90} damping={0.5} maxSpeed={0.005}>
          <SheetProvider sheet={sheet}>
            <Scene
              isMuted={isMuted}
              currentPageValue={currentPageValue}
              setCurrentPageValue={setCurrentPageValue}
            />
          </SheetProvider>
        </ScrollControls>
      </Canvas>

      {/* <MobileOverlay /> */}
    </>
  );
}

function Scene({ isMuted, currentPageValue, setCurrentPageValue }) {
  const sheet = useCurrentSheet();
  const scroll = useScroll();

  //
  // *********** POSITIONAL AUDIO  ***************
  //

  //
  //
  //
  //This is for theatre.js

  // Calculate the sequenceLength
  const sequenceLength = val(sheet.sequence.pointer.length);

  function logCurrentPageCallback(scroll, callback) {
    // Calculate the current page based on the scroll offset and total pages
    const currentPage = Math.floor(scroll.offset * scroll.pages) + 1;
    console.log('Current Page:', currentPage);

    // Use the callback to update the state
    callback(currentPage);
  }

  useFrame(() => {
    if (scroll) {
      // Call the logCurrentPageCallback function, pass in the setCurrentPageValue as the callback
      logCurrentPageCallback(scroll, setCurrentPageValue);

      // Update the sequence position
      sheet.sequence.position = scroll.offset * sequenceLength;
    }
  });

  return (
    <>
      {/* <fog attach='fog' color={bgColor} near={-4} far={10} /> */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} />

      <FantasyBook />
      <PerspectiveCamera
        theatreKey='Camera'
        makeDefault
        position={[0, 0, 0]}
        fov={90}
        near={0.1}
        far={70}
      />
    </>
  );
}
