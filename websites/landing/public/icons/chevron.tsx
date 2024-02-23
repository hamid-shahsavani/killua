import { twMerge } from "tailwind-merge";

interface Props {
  className: string;
}

export default function IconChevron(props: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      viewBox="0 0 24 24"
      className={twMerge(props.className)}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        strokeWidth="1.5"
        d="M15 19.92L8.48 13.4c-.77-.77-.77-2.03 0-2.8L15 4.08"
      ></path>
    </svg>
  );
}
