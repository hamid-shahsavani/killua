import { twMerge } from "tailwind-merge";

interface Props {
  className?: string;
}

export default function IconCopy(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      fill="none"
      viewBox="0 0 24 24"
      className={twMerge(props.className)}
    >
      <path
        fill="#fff"
        d="M16 12.9v4.2c0 3.5-1.4 4.9-4.9 4.9H6.9C3.4 22 2 20.6 2 17.1v-4.2C2 9.4 3.4 8 6.9 8h4.2c3.5 0 4.9 1.4 4.9 4.9z"
      ></path>
      <path
        fill="#fff"
        d="M17.1 2h-4.2C9.817 2 8.371 3.094 8.07 5.739c-.063.553.395 1.011.952 1.011H11.1c4.2 0 6.15 1.95 6.15 6.15v2.078c0 .557.458 1.015 1.011.952C20.906 15.63 22 14.183 22 11.1V6.9C22 3.4 20.6 2 17.1 2z"
      ></path>
    </svg>
  );
}
