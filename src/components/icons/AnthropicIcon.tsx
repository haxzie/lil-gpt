import { memo } from "react";

function AnthropicIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-3.654 0H6.57L0 20h3.603l1.357-3.415h6.43l1.357 3.415h3.603L10.173 3.52zm-1.81 9.927 2.004-5.05 2.005 5.05H8.363z" />
    </svg>
  );
}

export default memo(AnthropicIcon);
