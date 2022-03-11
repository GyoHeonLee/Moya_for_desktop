import React, { useRef, useEffect } from "react";
import { select, sum, treemap, hierarchy } from "d3";
import randomColor from "randomcolor";
import isBright from "@utils/isBright";
import { ChartWrapper } from "./style";
import getTextWidth from "@utils/getTextWidth";
import useResizeObserver from "@utils/useResizeObserver";

const CategoryChart = ({
  data,
  width = 500,
  height = 300,
  marginTop = 40,
  marginBottom = 40,
  marginLeft = 40,
  marginRight = 40,
  padding = 0,
  darkTextColor = "black",

  brightTextColor = "white",
}) => {
  const svgRef = useRef(null);
  const categoryChartRef = useRef();
  const dimensions = useResizeObserver(categoryChartRef);
  useEffect(() => {
    const svg = select(svgRef.current);

    if (!dimensions) return;
    svg.selectAll(".block").remove();

    const { width, height } = dimensions;

    svg.attr("width", width).attr("height", height);

    const entireValue = sum(data, (data) => data.value);
    if (!data[0].color) {
      const colorArray = randomColor({
        hue: "green",
        luminosity: "light",
        alpha: 0.1,
        count: data.length,
      });

      data.map((ele, idx) => {
        ele.percentage = ((ele.value * 100) / entireValue).toFixed(2);
        ele.color = colorArray[idx];
      });
    }

    const createTree = treemap().size([width, height]);

    const mapData = hierarchy(data, (node) => node).sum((node) => node.value);

    const tree = createTree(mapData);

    svg
      .selectAll(".block")
      .data(tree.leaves())
      .join((enter) => {
        const block = enter
          .append("g")
          .classed("block", true)
          .attr(
            "transform",
            (node) => `translate(${node["x0"]},${node["y0"]})`,
          );

        block
          .append("rect")
          .classed("blockrect", true)
          .attr("width", (node) => {
            return node["x1"] - node["x0"];
          })
          .attr("height", (node) => {
            return node["y1"] - node["y0"];
          })
          .attr("fill", (node) => node["data"]["color"]);

        block
          .append("text")
          .attr("fill", (node) => {
            return isBright(node["data"]["color"]) ? "black" : "white";
          })
          .text((node) => node["data"]["percentage"] + "%")
          .attr("x", function () {
            const parentData = select(this.parentNode).datum();
            return (parentData.x1 - parentData.x0) / 2;
          })
          .attr("y", function () {
            const parentData = select(this.parentNode).datum();
            return (parentData.y1 - parentData.y0) / 2 + 7;
          });

        block
          .append("text")
          .attr("fill", (node) => {
            return isBright(node["data"]["color"])
              ? darkTextColor
              : brightTextColor;
          })
          .text(function (node) {
            const parentData = select(this.parentNode).datum();
            const parentWidth = parentData.x1 - parentData.x0;
            const textWidth = getTextWidth(node["data"]["title"]);
            const textLength = node["data"]["title"].length;
            console.log(parentWidth, textWidth);
            if (parentWidth < textWidth) {
            }
            return node["data"]["title"];
          })
          .attr("x", function () {
            const parentData = select(this.parentNode).datum();
            return (parentData.x1 - parentData.x0) / 2;
          })
          .attr("y", function () {
            const parentData = select(this.parentNode).datum();
            return (parentData.y1 - parentData.y0) / 2 - 7;
          });
      });
  }, [data, dimensions]);
  return (
    <ChartWrapper ref={categoryChartRef}>
      <svg ref={svgRef} />
    </ChartWrapper>
  );
};

export default CategoryChart;
