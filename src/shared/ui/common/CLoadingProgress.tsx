import React, { useEffect, useState } from "react";
import { Progress } from "antd";

export const CLoadingProgress = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 50;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <Progress
      rootClassName={
        "[&_.ant-progress-outer]:!p-0 [&_.ant-progress-bg]:!h-[3px] [&_.ant-progress-bg]:!shadow-lg [&_.ant-progress-bg]:!bg-primary [&_.ant-progress-outer]:!absolute [&_.ant-progress-outer]:!top-0 [&_.ant-progress-outer]:!left-0"
      }
      className={"absolute left-0 top-0 z-10 !rounded-lg"}
      showInfo={false}
      strokeLinecap="butt"
      size="small"
      status={"normal"}
      percent={percent}
    />
  );
};
