import { Skeleton } from "antd";
import React from "react";

const ShimmerLoader = ({ rows = 10, columns = 8 }) => {
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              {Array.from({ length: columns }).map((_, index) => (
                <th
                  key={index}
                  className="px-1 py-1 text-left text-xs font-medium uppercase tracking-wider text-gray-500 first:pl-2 last:pr-2"
                >
                  <Skeleton.Input
                    style={{ width: "100%", height: 35 }}
                    className="!block bg-gray-800"
                    active
                    size="small"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td
                    key={colIndex}
                    className="whitespace-nowrap px-1 py-1 first:pl-2 last:pr-2"
                  >
                    <Skeleton.Input
                      style={{ width: "100%", height: 35 }}
                      className="!block bg-gray-600"
                      active
                      size="small"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShimmerLoader;

// OLD VERSION

// function OldVersion() {
//   return (
//     <>
//       <div className={"flex items-center justify-between px-5 py-3"}>
//         <div className={"flex flex-row space-x-2"}>
//           <div
//             className={"h-8 w-[178px] animate-pulse rounded-lg bg-gray-700"}
//           ></div>
//           <div
//             className={"h-8 w-[178px] animate-pulse rounded-lg bg-gray-700"}
//           ></div>
//         </div>
//         <div>
//           <div
//             className={"h-8 w-24 animate-pulse rounded-lg bg-gray-700"}
//           ></div>
//         </div>
//       </div>
//       <Skeleton loading active></Skeleton>
//       <div
//         className="space-y-0"
//         style={{ borderCollapse: "collapse", borderSpacing: 0 }}
//       >
//         {Array.from({ length: rows }).map((_, rowIndex) => (
//           <div key={rowIndex} className="flex animate-pulse items-center">
//             {Array.from({ length: columns }).map((_, colIndex) => (
//               <div
//                 key={colIndex}
//                 style={{ width: columnWidth }}
//                 className="h-10 border border-gray-600 bg-gray-700"
//               ></div>
//             ))}
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }
