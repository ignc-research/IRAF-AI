import React, { useContext, useEffect, useRef, useState } from "react";
import { ConfigHelper } from "../ConfigHelper";
import { MultiViewContext } from "../MultiViewContext";
import Dialog from "../shared/Dialog";
import { TabContext } from "../TabContext";
import zoomPlugin from 'chartjs-plugin-zoom';
import {
  Bar,
  getDatasetAtEvent,
  getElementAtEvent,
  getElementsAtEvent,
} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
  );

export const overviewOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Overview',
      },
    },
    scales: {
        yError: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Avg Relative Error (%)'
          }
        },
        yDuration: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Prediction duration (s)'
          },
          grid: {
            drawOnChartArea: false,
          }
        },
    }
  }

  export const poseOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Pose error',
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x'
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true
          },
          mode: 'x',
        }
      }
    }
  }

export default function EvalDialog(props) {
    const tabContext = useContext(TabContext);
    const evalStats = ConfigHelper.getEval(tabContext.welds, tabContext.configs);
    const chartRef = useRef(null);

    const overviewData = {
        labels: evalStats.map(x => x.config.layerName),
        datasets: [
            {
                label: "Avg Relative error",
                data: evalStats.map(x => x.errors.reduce((a, b) => a + b, 0) / x.errors.length),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                yAxisID: 'yError'
            },
            {
                label: "Prediction duration",
                data: evalStats.map(x => x.duration / 1000),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                yAxisID: 'yDuration'
            }
        ]
    }

    const poseData = {
      labels: tabContext.welds.map(x => x.points.map((y, i) => `${x.name}_${i}`)).flat(),
      datasets: evalStats.filter(x => x.config.type != "GroundTruth").map(x => {
        return {
        label: x.config.layerName,
        data: x.errors
        }
      })
  }

  const onPoseChartClick = (event) => {
    const { current: chart } = chartRef;

    if (!chart) {
      return;
    }
    const el = getElementAtEvent(chart, event)[0];
    if (!el) {
      return;
    }
    const ds = poseData.datasets[el.datasetIndex];
    const label = poseData.labels[el.index];
    const poseName = label.substring(0, label.lastIndexOf("_"));
    const point = label.substring(label.lastIndexOf("_") + 1);
    
    tabContext.setPlayingWeld(tabContext.welds.find(x => x.name === poseName));
    tabContext.setSelectedPoint({ idx: point });
    tabContext.setPaused(true);
    console.log(label, poseName, point)
    console.log(ds.label, ds.data[el.index])
  };

    return (
        <>
            <Dialog className="modal-xl" isOpen={props.isOpen} setIsOpen={props.setIsOpen} title="Evaluation">
               <Bar options={overviewOptions} data={overviewData} />
               <Bar ref={chartRef} onClick={onPoseChartClick} options={poseOptions} data={poseData} />
            </Dialog>
        </>
    );
}