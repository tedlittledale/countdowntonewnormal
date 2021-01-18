import React, { useEffect, useRef, useContext } from "react";
import styled from "styled-components";
import { withProp } from "styled-tools";
import { compose } from "ramda";
import { observer, useObservable, useObserver } from "mobx-react-lite";
import { injectPick, withPaths } from "../utils/store";
import Axes from "./Axes";
import Legend from "./Legend";
import GhostPoints from "./GhostPoints";
import AnimatedPoints from "./AnimatedPoints";
import { media } from "../utils/media";

const ChartWrap = styled("div")`
  width: 100%;
  padding-top: 50px;
  ${media.phablet` padding-top: 50px;`}
  ${media.phone` padding-top: 50px;`}
  position: relative;
  text-align: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  background: var(--color-selection-background);
  > div {
    max-width: 960px;
    ${media.phablet`width: 100%;`}
    ${media.phone`width: 100%;`}
    ${withProp(
      "chartHeight",
      (chartHeight) => `height: ${chartHeight ? chartHeight : 0}px;`
    )}
    border-radius: 5px;
    box-sizing: border-box;
    margin: 0 auto;
    > div {
      position: relative;
    }
  }
`;

const Credit = styled.div`
  padding: 20px;
  text-align: left;
  a {
    text-decoration: underline;
    color: hsl(205, 82%, 33%);
  }
  margin-bottom: 30px;
`;

const CovidChart = ({ currentChart, currentDate, timelineModel }) => {
  const keyCharts = timelineModel.getKeyChart();
  const targetRef = useRef();
  const updateScales = () => {
    const { width } = targetRef.current.getBoundingClientRect();

    const height = window.innerHeight;
    currentChart && currentChart.setUpScales({ width, height });
  };
  useEffect(() => {
    updateScales();
    window.addEventListener("resize", updateScales);
    return () => {
      window.removeEventListener("resize", updateScales);
    };
  }, []);

  const currentPoints =
    currentChart.state === "ready" ? currentChart.points() : [];
  return (
    <>
      <ChartWrap chartHeight={currentChart.height}>
        <div ref={targetRef}>
          {currentChart && currentChart.state === "ready" ? (
            <div>
              <Axes
                yTicks={currentChart.yAxis()}
                xTicks={currentChart.xAxis()}
                xLabel="Rank of case rate"
                yLabel="New cases (7 day rolling average)"
                height={currentChart.height}
                isMobile={currentChart.isMobile}
              ></Axes>
              <Legend
                tiers={currentChart.tiers.toJSON()}
                keyDateLegend={timelineModel.getKeyChartLegend()}
                width={currentChart.width}
                height={currentChart.height}
                isMobile={currentChart.isMobile}
              />
              {keyCharts && (
                <GhostPoints
                  date={timelineModel.currentDate}
                  currentPoints={currentPoints}
                  isMobile={currentChart.isMobile}
                  keyCharts={keyCharts.map((keyChart) =>
                    currentChart.getGhostPoints(keyChart)
                  )}
                ></GhostPoints>
              )}
              <AnimatedPoints
                date={timelineModel.currentDate}
                total={currentChart.englandTotal}
                isMobile={currentChart.isMobile}
                points={currentPoints}
              ></AnimatedPoints>
            </div>
          ) : (
            <p>Loading</p>
          )}
        </div>
      </ChartWrap>
    </>
  );
};

export default compose(
  withPaths(["timelineModel.currentChart", "timelineModel"]),
  observer
)(CovidChart);
