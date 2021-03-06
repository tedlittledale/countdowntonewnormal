import React, { useRef } from "react";
import styled from "styled-components";
import { withProp } from "styled-tools";
import { compose, path } from "ramda";
import { observer } from "mobx-react-lite";
import { withPaths } from "../utils/store";
import { media } from "../utils/media";
import ScrollDownIcon from "./ScrollDownIcon";

const TimelineWrapper = styled("div")`
  width: 100%;
  height: 100vh;
  ${withProp(["pageHeight"], (pageHeight) =>
    pageHeight ? `height: ${pageHeight}px;` : ""
  )};
  margin-top: 0;
  padding-top: 0vh;

  > div {
    padding-top: 10vh;
    width: 100%;

    ${withProp(["pageHeight"], (pageHeight) =>
      pageHeight ? `height: ${0.9 * pageHeight}px;` : ""
    )};
    display: grid;
    grid: 1fr / 1fr;
    align-items: start;
    justify-items: center;
    ${media.phablet`padding-top: 0;
    ${withProp(["pageHeight"], (pageHeight) =>
      pageHeight ? `height: ${pageHeight}px;` : ""
    )};
    `}
  }
`;

const TimelineScrollDownIcon = styled(ScrollDownIcon)`
  ${media.phablet`display:none;`}
`;

const Bar = styled("div")`
  width: 90%;
  padding: 0 0 0 0;
  /* ${media.phablet`width: 80%;`}
  ${media.phone`width: 80%;`} */
  height: 10px;

  background: var(--color-pagecontent);
  display: grid;
  grid: 1fr / repeat(12, 1fr);
  align-content: center;
  justify-items: start;
  position: relative;
  margin-top: 134px;
  ${media.phablet`
    justify-self:start;
    margin-left: 130px;
    grid: repeat(12, 1fr) / 1fr; 
    width: 10px;
    height: 95%;
    margin-top:5%;
    align-content: start;
    justify-items: center;
    position: relative;
  `}
  * {
    white-space: nowrap;
    font-weight: 800;
    font-style: italic;
  }
`;

const MonthMarker = styled("div")`
  font-weight: 800;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: var(--color-pagecontent);
  z-index: 10;
  position: relative;
  ${media.phablet`
    margin-top:-15px;
    margin-left:-10px;
  `}
  h4 {
    transform: rotate(-45deg);
    margin-top: -30px;
    background: var(--color-selectionbackground);
    ${media.phablet`
        transform: rotate(0deg);
        height:30px;
        width: 30px;
        text-align:center;
        margin-top: 0;
        font-size: 12px;
        color: var(--color-selectionbackground);
        margin-left: 0px;
        background: none;
        display:grid;
        align-content:center;
  `}
  }
`;

const Marker = styled("div")`
  position: absolute;
  left: ${withProp("percentOfYear", (percentOfYear) => percentOfYear * 100)}%;

  z-index: 0;
  width: 5px;
  height: 80px;
  top: -50px;
  background: ${withProp("isHerd", (isHerd) =>
    isHerd ? `var(--color-highlight)` : `var(--color-pagecontent)`
  )};
  ${media.phablet`
    left:-30px;
    top: ${withProp("percentOfYear", (percentOfYear) => percentOfYear * 100)}%;
    width: 70px;
    height:5px;
  `}
  h4 {
    font-size: 16px;
    transform: rotate(60deg);
    margin-top: 80px;
    color: ${withProp("isHerd", (isHerd) =>
      isHerd ? `var(--color-highlight)` : `var(--color-pagecontent)`
    )};
    ${media.phablet`
        margin-top: -10px;
        margin-left: 80px;  
    `}
  }
  p {
    transform: rotate(-45deg);
    margin-top: -130px;
    font-size: 14px;
    color: ${withProp("isHerd", (isHerd) =>
      isHerd ? `var(--color-highlight)` : `var(--color-pagecontent)`
    )};
    ${media.phablet`
        margin-top: -21px;
        margin-left: -95px;
        transform: rotate(0deg);
    `}
  }
`;

const Timeline = ({
  countdownModel: { markers },
  countdownModel,
  pageHeight
}) => {
  console.log({ markers });
  return (
    <>
      <TimelineWrapper pageHeight={pageHeight}>
        <div>
          <Bar>
            <MonthMarker>
              <h4>
                <span>Jan</span>
              </h4>
            </MonthMarker>
            <MonthMarker>
              <h4>
                <span>Feb</span>
              </h4>
            </MonthMarker>
            <MonthMarker>
              <h4>
                <span>Mar</span>
              </h4>
            </MonthMarker>
            <MonthMarker>
              <h4>
                <span>Apr</span>
              </h4>
            </MonthMarker>
            <MonthMarker>
              <h4>
                <span>May</span>
              </h4>
            </MonthMarker>
            <MonthMarker>
              <h4>
                <span>Jun</span>
              </h4>
            </MonthMarker>
            <MonthMarker>
              <h4>
                <span>Jul</span>
              </h4>
            </MonthMarker>
            <MonthMarker>
              <h4>
                <span>Aug</span>
              </h4>
            </MonthMarker>
            <MonthMarker>
              <h4>
                <span>Sep</span>
              </h4>
            </MonthMarker>
            <MonthMarker>
              <h4>
                <span>Oct</span>
              </h4>
            </MonthMarker>
            <MonthMarker>
              <h4>
                <span>Nov</span>
              </h4>
            </MonthMarker>
            <MonthMarker>
              <h4>
                <span>Dec</span>
              </h4>
            </MonthMarker>
            {markers.map(({ percentOfYear, label, date, isHerd }) => (
              <Marker percentOfYear={percentOfYear} isHerd={isHerd}>
                <h4>{label}</h4>
                <p>{date}</p>
              </Marker>
            ))}
          </Bar>
          <TimelineScrollDownIcon
            onClickHandler={(e) => {
              console.log(e);
              countdownModel.updatePage(1);
            }}
          />
        </div>
      </TimelineWrapper>
    </>
  );
};

export default compose(withPaths(["countdownModel"]), observer)(Timeline);
