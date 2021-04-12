import React, { useRef } from "react";
import styled from "styled-components";
import { withProp } from "styled-tools";
import { compose, path } from "ramda";
import { observer } from "mobx-react-lite";
import { withPaths } from "../utils/store";
import { media } from "../utils/media";
import SplashCounter from "./SplashCounter";
import ScrollDownIcon from "./ScrollDownIcon";

const Wrapper = styled("header")`
  height: 100vh;
  ${withProp(["pageHeight"], (pageHeight) =>
    pageHeight ? `height: ${pageHeight}px;` : ""
  )};
  width: 100%;
  display: grid;
  grid: 1fr/ 1fr;
  align-items: center;
  justify-items: center;
  border-bottom: 1px solid var(--color-faint);
  > div {
    width: 95%;
    height: 100vh;
    ${withProp(["pageHeight"], (pageHeight) =>
      pageHeight ? `height: ${pageHeight}px;` : ""
    )};
    display: grid;
    align-items: center;
    justify-items: center;
    overflow: hidden;
  }
`;

const Header = ({
  countdownModel: { daysToHerd, sevenDayAverage, fourteenDayAverage, herdDate },
  countdownModel,
  pageHeight
}) => {
  console.log({ daysToHerd });
  return (
    <>
      <Wrapper pageHeight={pageHeight} className="wrapper">
        <div>
          <SplashCounter
            daysToHerd={daysToHerd}
            fourteenDayAverage={fourteenDayAverage}
            sevenDayAverage={sevenDayAverage}
            herdDate={herdDate}
          />
          <ScrollDownIcon
            onClickHandler={(e) => {
              console.log(e);
              countdownModel.updatePage(1);
            }}
          />
        </div>
      </Wrapper>
    </>
  );
};

export default compose(withPaths(["countdownModel"]), observer)(Header);
