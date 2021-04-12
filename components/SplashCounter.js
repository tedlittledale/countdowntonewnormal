import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { withProp } from "styled-tools";
import { compose, path } from "ramda";
import { observer } from "mobx-react-lite";
import { withPaths } from "../utils/store";
import { media } from "../utils/media";

const SplashWrapper = styled("div")`
  height: 100%;
  position: relative;
  display: grid;
  grid: 3fr 1fr 1fr / 1fr;
  ${media.phablet`
    grid: 1fr auto auto / 1fr;
  `}
  align-items: center;
  justify-items: center;
  > * {
    width: 90%;
  }
  h1 {
    font-size: 50px;
    font-style: italic;
    font-weight: 800;
    display: grid;
    grid: auto 1fr / 1fr;
    display: grid;
    justify-content: center;
    text-align: center;
    > span {
      font-size: 120px;
      color: var(--color-highlight);
      display: grid;
      align-items: center;
      justify-items: right;
      grid: 1fr / 5fr 3fr;
      ${media.phablet`
        font-size: 90px;
        grid: 3fr 2fr / 1fr;
        justify-items: center;
        height: 180px;
      `}
      > span {
        display: grid;
        align-items: center;
        justify-items: right;
        grid: 3fr 2fr / 1fr;
        ${media.phablet`
          display: block;
        `}
      }
    }
  }

  .date {
    opacity: 1;
    font-size: 40px;

    white-space: nowrap;
    justify-items: left;
    display: grid;
    grid: 1fr / 1fr;
    align-items: center;
    justify-self: start;
    padding-left: 30px;
    ${media.phablet`
    display: block;
    font-size: 30px;
    padding-left: 0px;
    justify-self: center;
  `}
    opacity: 0;
    transition: opacity 500ms ease-in-out;
    &.visible {
      opacity: 1;
    }
  }
  p {
    font-size: 25px;
    text-align: center;
    font-family: var(--font-heading-stack);
  }
  ${media.phablet`
  h1 {
    font-size: 40px;
  }
  p {
    font-size: 20px;
    margin-bottom: 10px;
  }
  `}
`;

const SplashCounter = ({
  daysToHerd,
  sevenDayAverage,
  fourteenDayAverage,
  herdDate
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [dateVisible, setDateVisible] = useState(false);
  useEffect(() => {
    // exit early when we reach 0
    if (timeLeft === daysToHerd) {
      setDateVisible(true);
      return;
    }

    // save intervalId to clear the interval when the
    // component re-renders

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft + 1);
    }, 10);

    // clear interval on re-render to avoid memory leaks
    return () => clearInterval(intervalId);
  }, [timeLeft]);
  return (
    <>
      <SplashWrapper>
        <h1>
          Days* 'til freedom**:{" "}
          <span>
            {timeLeft}
            <span className={`date ${dateVisible && "visible"}`}>
              ({herdDate})
            </span>
          </span>
        </h1>
        <p>
          *Based on current 14 day average of {fourteenDayAverage} daily
          vaccinations and many assumptions
        </p>
        <p>**Freedom not guaranteed</p>
      </SplashWrapper>
    </>
  );
};

export default SplashCounter;
