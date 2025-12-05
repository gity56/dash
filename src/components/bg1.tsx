// Filename: bg1.tsx
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  // FIX 1: Enforce 100vw and overflow: hidden to prevent white space/scroll
  html, body {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 0;
  }

  #root {
    width: 100%;
    height: 100vh;
  }
`;

const Pattern = () => {
  return (
    <>
      <GlobalStyle />
      <StyledWrapper>
        <div className="container " />
      </StyledWrapper>
    </>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

.container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    // FIX 2: Use positioning to stretch across entire viewport
    width: 100vw; 
    height: 100vh;
    min-width: 100vw;
    --c: 7px;
    background-color: #000;
    background-image: radial-gradient(
        circle at 50% 50%,
        #0000 1.5px,
        #000 0 var(--c),
        #0000 var(--c)
      ),
      radial-gradient(
        circle at 50% 50%,
        #0000 1.5px,
        #000 0 var(--c),
        #0000 var(--c)
      ),
      radial-gradient(circle at 50% 50%, #f00, #f000 60%),
      radial-gradient(circle at 50% 50%, #ff0, #ff00 60%),
      radial-gradient(circle at 50% 50%, #0f0, #0f00 60%),
      radial-gradient(ellipse at 50% 50%, #00f, #00f0 60%);
    background-size:
      12px 20.7846097px,
      12px 20.7846097px,
      200% 200%,
      200% 200%,
      200% 200%,
      200% 20.7846097px;
    --p: 0px 0px, 6px 10.39230485px;
    background-position:
      var(--p),
      0% 0%,
      0% 0%,
      0% 0px;
    animation:
      wee 40s linear infinite,
      filt 6s linear infinite;
  }

  @keyframes filt {
    0% {
      filter: hue-rotate(0deg);
    }
    to {
      filter: hue-rotate(360deg);
    }
  }

  @keyframes wee {
    // FIX 3: Adjusted values to ensure the colorful gradients remain visible on all edges
    0% {
      background-position:
        var(--p),
        300% 300%,
        -400% -400%,
        200% 200%,
        100% 41.5692194px;
    }
    to {
      background-position:
        var(--p),
        0% 0%,
        0% 0%,
        0% 0%,
        0% 0%;
    }
  }
`;

export default Pattern;