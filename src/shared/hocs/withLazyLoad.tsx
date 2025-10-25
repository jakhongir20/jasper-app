import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { ComponentType, lazy, Suspense } from "react";

export const withLazyLoad = (
  importFunc: () => Promise<{ default: ComponentType<unknown> }>,
) => {
  const LazyComponent = lazy(importFunc);

  return (
    <Suspense
      fallback={
        <div className="absolute left-0 top-[50px] flex h-full w-full items-center justify-center">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      }
    >
      <LazyComponent />
    </Suspense>
  );
};
