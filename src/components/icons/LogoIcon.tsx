import { memo } from "react";

function LogoIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 129 129"
      fill="none"
    >
      <path
        d="M56.3759 8.08251C56.3759 3.89481 59.7707 0.5 63.9584 0.5C68.1461 0.5 71.5409 3.89481 71.5409 8.08251V120.918C71.5409 125.105 68.1461 128.5 63.9584 128.5C59.7707 128.5 56.3759 125.105 56.3759 120.918V8.08251Z"
        fill="url(#paint0_linear_5_53)"
      />
      <path
        d="M94.2155 19.7097C97.1767 16.7486 101.978 16.7486 104.939 19.7097C107.9 22.6709 107.9 27.4718 104.939 30.433L33.7117 101.66C30.7506 104.621 25.9496 104.621 22.9884 101.66C20.0273 98.6989 20.0273 93.8979 22.9884 90.9368L94.2155 19.7097Z"
        fill="url(#paint1_linear_5_53)"
      />
      <path
        d="M120.917 53.036C125.105 53.036 128.5 56.4308 128.5 60.6185C128.5 64.8062 125.105 68.201 120.917 68.201H8.08251C3.89481 68.201 0.5 64.8062 0.5 60.6185C0.5 56.4308 3.89481 53.036 8.08251 53.036H120.917Z"
        fill="url(#paint2_linear_5_53)"
      />
      <path
        d="M104.92 90.7481C107.881 93.7093 107.881 98.5103 104.92 101.471C101.959 104.433 97.158 104.433 94.1969 101.471L23.2248 30.4994C20.2637 27.5382 20.2637 22.7372 23.2248 19.7761C26.186 16.8149 30.987 16.8149 33.9481 19.7761L104.92 90.7481Z"
        fill="url(#paint3_linear_5_53)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_5_53"
          x1="33.7186"
          y1="9.70734"
          x2="99.5239"
          y2="121.82"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E911CC" />
          <stop offset="1" stopColor="#E2FF05" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_5_53"
          x1="33.7186"
          y1="9.70734"
          x2="99.5239"
          y2="121.82"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E911CC" />
          <stop offset="1" stopColor="#E2FF05" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_5_53"
          x1="33.7186"
          y1="9.70734"
          x2="99.5239"
          y2="121.82"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E911CC" />
          <stop offset="1" stopColor="#E2FF05" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_5_53"
          x1="33.7186"
          y1="9.70734"
          x2="99.5239"
          y2="121.82"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#E911CC" />
          <stop offset="1" stopColor="#E2FF05" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default memo(LogoIcon);
