import { memo } from "react";

function StopIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <rect fill="currentColor" x="6" y="6" width="12" height="12" rx="2" />
    </svg>
  );
}

export default memo(StopIcon);
