import React, { useRef } from "react";
import styled from "styled-components";
import { withProp } from "styled-tools";
import { compose, path } from "ramda";
import { observer } from "mobx-react-lite";
import { withPaths } from "../utils/store";
import { media } from "../utils/media";
import SplashCounter from "./SplashCounter";
import ScrollDownIcon from "./ScrollDownIcon";

const Wrapper = styled("div")`
  height: 100vh;

  height: 100vh;
  overflow: scroll;
  width: 100%;
  display: grid;
  grid: 1fr/ 1fr;
  align-items: start;
  justify-items: center;
  border-bottom: 1px solid var(--color-faint);

  > div {
    width: 80%;
    ${media.phablet`
    
  overflow: scroll;
    width: 90%;
  `}
    display: grid;
    align-items: start;
    justify-items: left;
  }
  h3 {
    font-size: 40px;
    margin-top: 20px;
    font-weight: 600;
    font-style: italic;
    justify-self: center;
    @media (max-height: 627px) {
      font-size: 30px;
      margin-top: 10px;
    }
  }
  p {
    margin: 20px 0;
    ${media.phablet`
    font-size:14px;
    font-weight:normal;
    font-style:normal;
    margin: 10px 0;
  `}
    @media (max-height: 627px) {
      margin: 5px 0;
    }
    > span {
      font-weight: 800;
      font-style: italic;
      color: var(--color-highlight);
    }
  }
  h4 {
    font-size: 20px;
    justify-self: start;
    font-weight: 600;
    font-style: italic;
  }
`;

const Breakdown = ({
  countdownModel: { daysToHerd, sevenDayAverage, herdDate },
  pageHeight
}) => {
  console.log({ daysToHerd });
  return (
    <>
      <Wrapper pageHeight={pageHeight} className="wrapper">
        <div>
          <h3>About</h3>
          <p>
            I've calculated the <span>Freedom</span> date of{" "}
            <span>{herdDate}</span> as the date the UK could potentially reach
            herd immunity through vaccination of 80% of the population.
          </p>
          <p>
            This 80% figure is{" "}
            <a
              href="https://www.nytimes.com/2020/12/24/health/herd-immunity-covid-coronavirus.html?auth=login-google"
              target="_black"
              rel="noreferrer noopener"
            >
              based on comments Anthony Fauci made
            </a>
            {", "}
            and is an optimistic assumption that a single dose will give enough
            immunity.
          </p>
          <p>
            This date should be taken with a massive pinch of salt, no-one knows
            yet what will be needed to reach herd immunity. Also I'm a developer
            and not a epidemiologist. One thing we can say is that the success
            so far of the vaccination programme in the UK should be a source of
            great optimism and is a massive credit the the NHS. I built this as
            a way to celebrate that optimism.
          </p>
          <p>
            I recommend listening to the{" "}
            <a
              href="https://www.bbc.co.uk/programmes/m000py6s"
              target="_black"
              rel="noreferrer noopener"
            >
              How to Vaccinate the World
            </a>{" "}
            podcast if you want to hear from actual experts about the national
            and international vaccine rollout. UPDATE: This tool was featured in the listener questions section of <a
              href="https://www.bbc.co.uk/sounds/play/m000rty5"
              target="_black"
              rel="noreferrer noopener"
            >this episode of How to Vaccinate the world</a>.{" "}
          </p>
          <p>
            This was built by{" "}
            <a
              href="https://twitter.com/_superted"
              target="_black"
              rel="noreferrer noopener"
            >
              Ted Littledale
            </a>{" "} in January 2021.
             Please check out some of{" "}
            <a
              href="https://tedspace.me/#dataviz"
              target="_black"
              rel="noreferrer noopener"
            >
              my other data visualisations
            </a>
            .
          </p>
        </div>
      </Wrapper>
    </>
  );
};

export default compose(withPaths(["countdownModel"]), observer)(Breakdown);
